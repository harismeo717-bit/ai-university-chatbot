/**
 * UniAssist AI — Enterprise Server Entry Point
 * Express API with Streaming SSE, RAG Engine, Knowledge Management, RBAC, and Vite Middleware.
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './src/server/db/store.ts';
import { ragEngine } from './src/server/rag/engine.ts';
import { chunkDocument } from './src/server/rag/chunker.ts';
import { DocumentCategory, RoleType, UniversityDocument } from './src/types/index.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  // Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // ---------------------------------------------------------------------------
  // 1. Health Check
  // ---------------------------------------------------------------------------
  app.get('/api/health', (_req, res) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        ragIndexedDocs: dbStore.getDocuments().length,
        ragTotalChunks: dbStore.getAllChunks().length,
      },
      error: null,
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Chat & Streaming RAG API
  // ---------------------------------------------------------------------------
  app.post('/api/chat', async (req, res) => {
    try {
      const { conversationId, message, role = 'STUDENT', userId = 'student-demo' } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          data: null,
          error: { code: 'INVALID_QUERY', message: 'User query cannot be empty.' },
        });
      }

      // Ensure conversation exists or create new one
      let convId = conversationId;
      if (!convId || !dbStore.getConversation(convId)) {
        const newConv = dbStore.createConversation(userId, message.slice(0, 45));
        convId = newConv.id;
      }

      // Record incoming user message
      const userMsg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        conversationId: convId,
        role: 'user' as const,
        content: message.trim(),
        createdAt: new Date().toISOString(),
      };
      dbStore.saveMessage(userMsg);

      // Set up Server-Sent Events (SSE) headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      // Send initial conversation metadata event
      res.write(`data: ${JSON.stringify({ type: 'init', conversationId: convId, userMessage: userMsg })}\n\n`);

      const history = dbStore.getMessages(convId).slice(-6);

      // Run RAG Engine with streaming token callback
      const ragResult = await ragEngine.answerQuery(message, {
        conversationHistory: history,
        userRole: role as RoleType,
        streamingCallback: (token: string) => {
          res.write(`data: ${JSON.stringify({ type: 'token', token })}\n\n`);
        },
      });

      // Create and save assistant message in store
      const assistantMsg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        conversationId: convId,
        role: 'assistant' as const,
        content: ragResult.answer,
        createdAt: new Date().toISOString(),
        confidence: ragResult.confidence,
        isGrounded: ragResult.isGrounded,
        citations: ragResult.citations,
      };
      dbStore.saveMessage(assistantMsg);

      // Send completion event with citations and metadata
      res.write(
        `data: ${JSON.stringify({
          type: 'done',
          message: assistantMsg,
          citations: ragResult.citations,
          confidence: ragResult.confidence,
          isGrounded: ragResult.isGrounded,
        })}\n\n`
      );

      res.end();
    } catch (err: any) {
      console.error('Chat error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          data: null,
          error: { code: 'SERVER_ERROR', message: err.message || 'Internal server error' },
        });
      } else {
        res.write(`data: ${JSON.stringify({ type: 'error', error: err.message || 'Streaming failed' })}\n\n`);
        res.end();
      }
    }
  });

  // ---------------------------------------------------------------------------
  // 3. Conversation Management
  // ---------------------------------------------------------------------------
  app.get('/api/conversations', (req, res) => {
    const userId = (req.query.userId as string) || 'student-demo';
    const convs = dbStore.getConversations(userId);
    res.json({ success: true, data: convs, error: null });
  });

  app.post('/api/conversations', (req, res) => {
    const { userId = 'student-demo', title = 'New Conversation' } = req.body;
    const conv = dbStore.createConversation(userId, title);
    res.json({ success: true, data: conv, error: null });
  });

  app.get('/api/conversations/:id', (req, res) => {
    const conv = dbStore.getConversation(req.params.id);
    if (!conv) {
      return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
    }
    const messages = dbStore.getMessages(req.params.id);
    res.json({ success: true, data: { ...conv, messages }, error: null });
  });

  app.put('/api/conversations/:id', (req, res) => {
    const updated = dbStore.updateConversation(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
    }
    res.json({ success: true, data: updated, error: null });
  });

  app.delete('/api/conversations/:id', (req, res) => {
    const success = dbStore.deleteConversation(req.params.id);
    res.json({ success, data: { deleted: success }, error: null });
  });

  // ---------------------------------------------------------------------------
  // 4. Knowledge Base & Documents API
  // ---------------------------------------------------------------------------
  app.get('/api/documents', (req, res) => {
    const docs = dbStore.getDocuments();
    res.json({ success: true, data: docs, error: null });
  });

  app.post('/api/documents', (req, res) => {
    try {
      const {
        title,
        description = '',
        category = 'GENERAL',
        rawText,
        accessLevel = 'STUDENT',
        academicYear = '2026-2027',
        version = '1.0.0',
        fileName = 'uploaded_document.txt',
        uploadedBy = 'Admin User',
      } = req.body;

      if (!title || !rawText) {
        return res.status(400).json({
          success: false,
          data: null,
          error: { code: 'VALIDATION_ERROR', message: 'Document title and rawText are required.' },
        });
      }

      const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const chunks = chunkDocument(rawText, docId, category as DocumentCategory, { maxTokens: 220, overlapTokens: 30 });

      const newDoc: UniversityDocument = {
        id: docId,
        title,
        description,
        fileName,
        fileSize: Buffer.byteLength(rawText, 'utf8'),
        mimeType: 'text/plain',
        category: category as DocumentCategory,
        accessLevel: accessLevel as RoleType,
        academicYear,
        version,
        status: 'INDEXED',
        uploadedBy,
        uploadedAt: new Date().toISOString(),
        chunksCount: chunks.length,
        chunks,
      };

      dbStore.addDocument(newDoc, chunks, uploadedBy);
      res.json({ success: true, data: newDoc, error: null });
    } catch (err: any) {
      res.status(500).json({ success: false, data: null, error: { code: 'UPLOAD_FAILED', message: err.message } });
    }
  });

  app.delete('/api/documents/:id', (req, res) => {
    const ok = dbStore.deleteDocument(req.params.id);
    res.json({ success: ok, data: { deleted: ok }, error: null });
  });

  app.post('/api/documents/:id/reindex', (req, res) => {
    const ok = dbStore.reindexDocument(req.params.id);
    res.json({ success: ok, data: { reindexed: ok }, error: null });
  });

  // ---------------------------------------------------------------------------
  // 5. Announcements & Notifications API
  // ---------------------------------------------------------------------------
  app.get('/api/announcements', (_req, res) => {
    res.json({ success: true, data: dbStore.getAnnouncements(), error: null });
  });

  app.post('/api/announcements', (req, res) => {
    const { title, content, category, priority = 'NORMAL', targetAudience = 'ALL', author = 'Administration' } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'VALIDATION_ERROR', message: 'Title and content are required' },
      });
    }

    const newAnn = {
      id: `ann-${Date.now()}`,
      title,
      content,
      category,
      priority,
      targetAudience,
      publishDate: new Date().toISOString(),
      author,
    };
    dbStore.createAnnouncement(newAnn, author);
    res.json({ success: true, data: newAnn, error: null });
  });

  app.delete('/api/announcements/:id', (req, res) => {
    const ok = dbStore.deleteAnnouncement(req.params.id);
    res.json({ success: ok, data: { deleted: ok }, error: null });
  });

  app.get('/api/notifications', (_req, res) => {
    res.json({ success: true, data: dbStore.getNotifications(), error: null });
  });

  app.post('/api/notifications/:id/read', (req, res) => {
    dbStore.markNotificationRead(req.params.id);
    res.json({ success: true, data: { ok: true }, error: null });
  });

  // ---------------------------------------------------------------------------
  // 6. University Directory (Departments, Programs, Courses, Faculty)
  // ---------------------------------------------------------------------------
  app.get('/api/directory', (_req, res) => {
    res.json({
      success: true,
      data: {
        departments: dbStore.getDepartments(),
        programs: dbStore.getPrograms(),
        courses: dbStore.getCourses(),
        faculty: dbStore.getFaculty(),
      },
      error: null,
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Admin Analytics, AI Config & Audit Logs
  // ---------------------------------------------------------------------------
  app.get('/api/admin/analytics', (_req, res) => {
    res.json({ success: true, data: dbStore.getAnalytics(), error: null });
  });

  app.get('/api/admin/config', (_req, res) => {
    res.json({ success: true, data: dbStore.getAIConfig(), error: null });
  });

  app.post('/api/admin/config', (req, res) => {
    const updated = dbStore.updateAIConfig(req.body);
    res.json({ success: true, data: updated, error: null });
  });

  app.get('/api/admin/audit-logs', (_req, res) => {
    res.json({ success: true, data: dbStore.getAuditLogs(), error: null });
  });

  // ---------------------------------------------------------------------------
  // 8. Feedback API
  // ---------------------------------------------------------------------------
  app.post('/api/feedback', (req, res) => {
    const { messageId, type, comment } = req.body;
    if (!messageId || !type) {
      return res.status(400).json({ success: false, data: null, error: { code: 'INVALID', message: 'Missing fields' } });
    }
    dbStore.recordFeedback(messageId, type, comment);
    res.json({ success: true, data: { recorded: true }, error: null });
  });

  // ---------------------------------------------------------------------------
  // 9. Global Search API
  // ---------------------------------------------------------------------------
  app.get('/api/search', (req, res) => {
    const q = (req.query.q as string) || '';
    const results = dbStore.globalSearch(q);
    res.json({ success: true, data: results, error: null });
  });

  // ---------------------------------------------------------------------------
  // Vite Middleware & SPA serving
  // ---------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UniAssist AI Server operational on port ${PORT}`);
  });
}

startServer();
