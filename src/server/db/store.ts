/**
 * UniAssist AI — Central Server Database Layer & Repository
 * Handles relational storage, querying, indexing, conversations, audit logs, and analytics.
 */

import {
  Department,
  Program,
  Course,
  FacultyMember,
  UniversityDocument,
  DocumentChunk,
  Conversation,
  ChatMessage,
  Announcement,
  SystemNotification,
  AuditLogItem,
  AIConfig,
  FeedbackType,
  RoleType,
  GlobalSearchResult,
  AnalyticsData,
} from '../../types/index.ts';

import {
  INITIAL_DEPARTMENTS,
  INITIAL_PROGRAMS,
  INITIAL_COURSES,
  INITIAL_FACULTY,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AI_CONFIG,
  INITIAL_AUDIT_LOGS,
} from './seed-data.ts';

import { INITIAL_DOCUMENTS } from './documents-data.ts';
import { generateFeatureVector } from '../rag/vector-math.ts';

class UniversityStore {
  private departments: Map<string, Department> = new Map();
  private programs: Map<string, Program> = new Map();
  private courses: Map<string, Course> = new Map();
  private faculty: Map<string, FacultyMember> = new Map();
  private documents: Map<string, UniversityDocument> = new Map();
  private chunks: Map<string, DocumentChunk> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map(); // conversationId -> messages
  private announcements: Map<string, Announcement> = new Map();
  private notifications: Map<string, SystemNotification> = new Map();
  private auditLogs: AuditLogItem[] = [];
  private aiConfig: AIConfig = { ...INITIAL_AI_CONFIG };
  private unansweredQueries: { id: string; question: string; timestamp: string; category: string; resolved: boolean }[] = [];
  private questionCount = 284;
  private positiveFeedbackCount = 142;
  private negativeFeedbackCount = 6;

  constructor() {
    this.seed();
  }

  private seed(): void {
    INITIAL_DEPARTMENTS.forEach((d) => this.departments.set(d.id, d));
    INITIAL_PROGRAMS.forEach((p) => this.programs.set(p.id, p));
    INITIAL_COURSES.forEach((c) => this.courses.set(c.id, c));
    INITIAL_FACULTY.forEach((f) => this.faculty.set(f.id, f));
    INITIAL_ANNOUNCEMENTS.forEach((a) => this.announcements.set(a.id, a));
    INITIAL_NOTIFICATIONS.forEach((n) => this.notifications.set(n.id, n));
    this.auditLogs = [...INITIAL_AUDIT_LOGS];

    // Seed authoritative documents & chunks
    INITIAL_DOCUMENTS.forEach((doc) => {
      this.documents.set(doc.id, doc);
      if (doc.chunks) {
        doc.chunks.forEach((chk) => {
          // Pre-generate feature vector embedding if missing
          if (!chk.embedding || chk.embedding.length === 0) {
            chk.embedding = generateFeatureVector(chk.content);
          }
          this.chunks.set(chk.id, chk);
        });
      }
    });

    // Seed default sample conversation
    const defaultConvId = 'conv-sample-1';
    this.conversations.set(defaultConvId, {
      id: defaultConvId,
      userId: 'student-demo',
      title: 'BSCS Admission & Fee Structure Inquiry',
      isPinned: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      messageCount: 2,
      lastMessageSnippet: 'Here are the admission requirements and fee structure for BSCS...',
    });

    this.messages.set(defaultConvId, [
      {
        id: 'msg-seed-1',
        conversationId: defaultConvId,
        role: 'user',
        content: 'What are the admission requirements and fee structure for BS Computer Science?',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'msg-seed-2',
        conversationId: defaultConvId,
        role: 'assistant',
        content: `### Admission Requirements for BS Computer Science (BSCS)

To apply for the **BS in Computer Science (BSCS)** program for Academic Year 2026–2027, applicants must meet the following official criteria:

1. **Academic Qualification:** Minimum **60% aggregate marks** in Higher Secondary School Certificate (HSSC / FSc Pre-Engineering / ICS) or British A-Levels (with Mathematics).
2. **Pre-Medical Students:** Eligible provided they clear Additional Mathematics in their first academic year.
3. **Merit Formula:**
   - Computing Aptitude Entry Test: **50%**
   - Intermediate / High School: **40%**
   - Matriculation / O-Level: **10%**

---

### Fee Structure (BSCS)

| Charge Head | Amount | Frequency |
| :--- | :--- | :--- |
| **Tuition per Credit Hour** | $180 | Per Credit |
| **Regular Semester Tuition (17 credits)** | $3,060 | Per Semester |
| **Lab & Software Licensing** | $250 | Per Semester |
| **Library & Exam Funds** | $200 | Per Semester |
| **Total Estimated Semester Fee** | **$3,560** | Per Semester |
| **One-Time Admission Registration** | $350 | At Admission (Non-refundable) |
| **Security Deposit** | $200 | 100% Refundable |

*Tuition fees are due within 10 days of class commencement (deadline: September 24, 2026).*`,
        createdAt: new Date(Date.now() - 3500000).toISOString(),
        confidence: 0.96,
        isGrounded: true,
        citations: [
          {
            id: 'cite-seed-1',
            documentId: 'doc-admissions-2026',
            documentTitle: 'Undergraduate & Graduate Admission Regulations Handbook 2026',
            category: 'ADMISSIONS',
            pageNumber: 4,
            section: '1. BS Computer Science (BSCS) & Software Engineering Admission Criteria',
            relevanceScore: 0.96,
            version: '2.1.0',
            academicYear: '2026-2027',
            excerpt: 'Minimum Academic Qualification: Candidates must have passed HSSC with minimum 60% aggregate marks...',
          },
          {
            id: 'cite-seed-2',
            documentId: 'doc-fees-2026',
            documentTitle: 'University Fee Structure & Payment Policies AY 2026-2027',
            category: 'FEES',
            pageNumber: 2,
            section: '1. Undergraduate Tuition & Recurring Semester Fee Breakdown',
            relevanceScore: 0.94,
            version: '1.4.0',
            academicYear: '2026-2027',
            excerpt: 'BS Computer Science tuition is $180 per credit hour. Regular semester total is approximately $3,560...',
          },
        ],
      },
    ]);
  }

  // --- Departments, Programs, Faculty, Courses ---
  public getDepartments(): Department[] {
    return Array.from(this.departments.values());
  }

  public getPrograms(): Program[] {
    return Array.from(this.programs.values());
  }

  public getCourses(): Course[] {
    return Array.from(this.courses.values());
  }

  public getFaculty(): FacultyMember[] {
    return Array.from(this.faculty.values());
  }

  // --- Knowledge Documents & Chunks ---
  public getDocuments(): UniversityDocument[] {
    return Array.from(this.documents.values());
  }

  public getDocument(id: string): UniversityDocument | undefined {
    return this.documents.get(id);
  }

  public getAllChunks(): DocumentChunk[] {
    return Array.from(this.chunks.values());
  }

  public addDocument(doc: UniversityDocument, chunks: DocumentChunk[], actor = 'admin'): void {
    this.documents.set(doc.id, doc);
    chunks.forEach((chk) => this.chunks.set(chk.id, chk));
    this.logAudit('UPLOAD_DOCUMENT', actor, 'ADMIN', `Document: ${doc.title}`, `Ingested ${chunks.length} chunks.`);
  }

  public deleteDocument(id: string, actor = 'admin'): boolean {
    const doc = this.documents.get(id);
    if (!doc) return false;

    // Delete chunks
    Array.from(this.chunks.values())
      .filter((c) => c.documentId === id)
      .forEach((c) => this.chunks.delete(c.id));

    this.documents.delete(id);
    this.logAudit('DELETE_DOCUMENT', actor, 'ADMIN', `Document: ${doc.title}`, 'Removed document and associated vector chunks.');
    return true;
  }

  public reindexDocument(id: string, actor = 'admin'): boolean {
    const doc = this.documents.get(id);
    if (!doc) return false;

    doc.status = 'PROCESSING';
    // Re-generate embeddings
    const docChunks = Array.from(this.chunks.values()).filter((c) => c.documentId === id);
    docChunks.forEach((chk) => {
      chk.embedding = generateFeatureVector(chk.content);
    });
    doc.status = 'INDEXED';
    doc.updatedAt = new Date().toISOString();

    this.logAudit('REINDEX_DOCUMENT', actor, 'ADMIN', `Document: ${doc.title}`, `Re-indexed ${docChunks.length} chunks.`);
    return true;
  }

  // --- Conversations & Messages ---
  public getConversations(userId: string): Conversation[] {
    return Array.from(this.conversations.values())
      .filter((c) => c.userId === userId || userId === 'all')
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getConversation(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  public getMessages(conversationId: string): ChatMessage[] {
    return this.messages.get(conversationId) || [];
  }

  public createConversation(userId: string, title = 'New Conversation'): Conversation {
    const id = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const conv: Conversation = {
      id,
      userId,
      title,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };
    this.conversations.set(id, conv);
    this.messages.set(id, []);
    return conv;
  }

  public saveMessage(msg: ChatMessage): void {
    const list = this.messages.get(msg.conversationId) || [];
    list.push(msg);
    this.messages.set(msg.conversationId, list);

    // Update conversation metadata
    const conv = this.conversations.get(msg.conversationId);
    if (conv) {
      conv.messageCount = list.length;
      conv.updatedAt = new Date().toISOString();
      if (msg.role === 'user' && conv.title === 'New Conversation') {
        conv.title = msg.content.slice(0, 45) + (msg.content.length > 45 ? '...' : '');
      }
      conv.lastMessageSnippet = msg.content.slice(0, 75) + '...';
    }

    if (msg.role === 'user') {
      this.questionCount++;
    }
  }

  public updateConversation(id: string, updates: Partial<Conversation>): Conversation | null {
    const conv = this.conversations.get(id);
    if (!conv) return null;
    Object.assign(conv, updates, { updatedAt: new Date().toISOString() });
    return conv;
  }

  public deleteConversation(id: string): boolean {
    this.messages.delete(id);
    return this.conversations.delete(id);
  }

  // --- Feedback ---
  public recordFeedback(messageId: string, type: FeedbackType, comment?: string): void {
    if (type === 'HELPFUL') {
      this.positiveFeedbackCount++;
    } else {
      this.negativeFeedbackCount++;
    }
    // Update message feedback
    for (const msgs of this.messages.values()) {
      const msg = msgs.find((m) => m.id === messageId);
      if (msg) {
        msg.feedback = { type, comment };
        break;
      }
    }
  }

  // --- Unanswered Questions ---
  public recordUnanswered(question: string, category = 'GENERAL'): void {
    this.unansweredQueries.unshift({
      id: `unans-${Date.now()}`,
      question,
      timestamp: new Date().toISOString(),
      category,
      resolved: false,
    });
    if (this.unansweredQueries.length > 50) {
      this.unansweredQueries.pop();
    }
  }

  public getUnanswered(): { id: string; question: string; timestamp: string; category: string; resolved: boolean }[] {
    return this.unansweredQueries;
  }

  // --- Announcements & Notifications ---
  public getAnnouncements(): Announcement[] {
    return Array.from(this.announcements.values()).sort(
      (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }

  public createAnnouncement(announcement: Announcement, actor = 'admin'): Announcement {
    this.announcements.set(announcement.id, announcement);
    this.logAudit('CREATE_ANNOUNCEMENT', actor, 'ADMIN', `Announcement: ${announcement.title}`, 'Published new university announcement.');
    return announcement;
  }

  public deleteAnnouncement(id: string): boolean {
    return this.announcements.delete(id);
  }

  public getNotifications(): SystemNotification[] {
    return Array.from(this.notifications.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public markNotificationRead(id: string): void {
    const notif = this.notifications.get(id);
    if (notif) notif.isRead = true;
  }

  // --- AI Config ---
  public getAIConfig(): AIConfig {
    return { ...this.aiConfig };
  }

  public updateAIConfig(newConfig: Partial<AIConfig>, actor = 'admin'): AIConfig {
    this.aiConfig = { ...this.aiConfig, ...newConfig };
    this.logAudit('UPDATE_AI_CONFIG', actor, 'SUPER_ADMIN', 'AI Configuration', `Model: ${this.aiConfig.model}, Temp: ${this.aiConfig.temperature}`);
    return { ...this.aiConfig };
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLogItem[] {
    return [...this.auditLogs];
  }

  public logAudit(action: string, actor: string, role: RoleType, entity: string, details: string): void {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      actor,
      role,
      entity,
      details,
      timestamp: new Date().toISOString(),
    });
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }

  // --- Global Search ---
  public globalSearch(query: string): GlobalSearchResult[] {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    const results: GlobalSearchResult[] = [];

    // Search Documents
    for (const doc of this.documents.values()) {
      if (doc.title.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q)) {
        results.push({
          id: doc.id,
          type: 'DOCUMENT',
          title: doc.title,
          snippet: doc.description,
          category: doc.category,
        });
      }
    }

    // Search Courses
    for (const course of this.courses.values()) {
      if (course.code.toLowerCase().includes(q) || course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q)) {
        results.push({
          id: course.id,
          type: 'COURSE',
          title: `${course.code}: ${course.title}`,
          snippet: course.description,
          category: 'ACADEMICS',
        });
      }
    }

    // Search Faculty
    for (const fac of this.faculty.values()) {
      if (fac.name.toLowerCase().includes(q) || fac.researchArea.toLowerCase().includes(q) || fac.designation.toLowerCase().includes(q)) {
        results.push({
          id: fac.id,
          type: 'FACULTY',
          title: fac.name,
          snippet: `${fac.designation} (${fac.officeLocation}) — ${fac.researchArea}`,
          category: 'FACULTY',
        });
      }
    }

    // Search Announcements
    for (const ann of this.announcements.values()) {
      if (ann.title.toLowerCase().includes(q) || ann.content.toLowerCase().includes(q)) {
        results.push({
          id: ann.id,
          type: 'ANNOUNCEMENT',
          title: ann.title,
          snippet: ann.content.slice(0, 100) + '...',
          category: ann.category,
        });
      }
    }

    return results.slice(0, 15);
  }

  // --- Analytics ---
  public getAnalytics(): AnalyticsData {
    const totalConvs = this.conversations.size;
    const questions = this.questionCount;
    const aiResponses = questions;
    const totalFeedback = this.positiveFeedbackCount + this.negativeFeedbackCount;
    const positiveRate = totalFeedback > 0 ? (this.positiveFeedbackCount / totalFeedback) * 100 : 97.5;

    return {
      totalUsers: 1420,
      activeUsersToday: 318,
      totalConversations: totalConvs,
      questionsAsked: questions,
      aiResponses,
      unansweredQuestions: this.unansweredQueries.length,
      averageResponseTimeMs: 420,
      knowledgeBaseHealth: 98.6,
      indexedDocumentsCount: this.documents.size,
      totalChunksCount: this.chunks.size,
      positiveFeedbackRate: Math.round(positiveRate * 10) / 10,
      popularTopics: [
        { topic: 'BSCS Admission Criteria', queryCount: 84, percentage: 32 },
        { topic: 'Tuition Fees & Credit Hour Rates', queryCount: 62, percentage: 24 },
        { topic: 'Attendance (75% Debarment Rule)', queryCount: 45, percentage: 17 },
        { topic: 'Merit & Need-Based Scholarships', queryCount: 38, percentage: 14 },
        { topic: 'Hostel Curfew & Mess Rules', queryCount: 34, percentage: 13 },
      ],
      dailyVolume: [
        { date: 'Mon', queries: 48, unanswered: 1 },
        { date: 'Tue', queries: 59, unanswered: 2 },
        { date: 'Wed', queries: 72, unanswered: 0 },
        { date: 'Thu', queries: 64, unanswered: 1 },
        { date: 'Fri', queries: 81, unanswered: 0 },
        { date: 'Sat', queries: 35, unanswered: 0 },
        { date: 'Sun', queries: 28, unanswered: 0 },
      ],
      activeDepartments: [
        { name: 'Computer Science', queryCount: 142 },
        { name: 'Software Engineering', queryCount: 68 },
        { name: 'Electrical Engineering', queryCount: 39 },
        { name: 'Business Administration', queryCount: 35 },
      ],
      unansweredList: this.unansweredQueries,
    };
  }
}

export const dbStore = new UniversityStore();
