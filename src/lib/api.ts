/**
 * UniAssist AI — Client API Service
 * Strongly typed client interfaces for all backend endpoints including SSE Streaming.
 */

import {
  Conversation,
  ChatMessage,
  UniversityDocument,
  Announcement,
  SystemNotification,
  AuditLogItem,
  AIConfig,
  AnalyticsData,
  Department,
  Program,
  Course,
  FacultyMember,
  GlobalSearchResult,
  FeedbackType,
  RoleType,
} from '../types/index.ts';

export const api = {
  // --- Conversations ---
  async getConversations(userId = 'student-demo'): Promise<Conversation[]> {
    const res = await fetch(`/api/conversations?userId=${encodeURIComponent(userId)}`);
    const json = await res.json();
    return json.data || [];
  },

  async createConversation(userId = 'student-demo', title = 'New Conversation'): Promise<Conversation> {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title }),
    });
    const json = await res.json();
    return json.data;
  },

  async getConversation(id: string): Promise<Conversation & { messages: ChatMessage[] }> {
    const res = await fetch(`/api/conversations/${id}`);
    const json = await res.json();
    return json.data;
  },

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    const res = await fetch(`/api/conversations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    return json.data;
  },

  async deleteConversation(id: string): Promise<boolean> {
    const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
    const json = await res.json();
    return json.success;
  },

  // --- SSE Streaming Chat ---
  async streamChat(
    conversationId: string | null,
    message: string,
    role: RoleType = 'STUDENT',
    callbacks: {
      onInit?: (convId: string, userMsg: ChatMessage) => void;
      onToken?: (token: string) => void;
      onDone?: (assistantMsg: ChatMessage) => void;
      onError?: (error: string) => void;
    },
    abortSignal?: AbortSignal
  ): Promise<void> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message, role }),
        signal: abortSignal,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ error: { message: 'Server error' } }));
        callbacks.onError?.(errJson.error?.message || 'Chat request failed');
        return;
      }

      if (!response.body) {
        callbacks.onError?.('ReadableStream not supported by browser environment.');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          const trimmed = block.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            try {
              const event = JSON.parse(dataStr);
              if (event.type === 'init') {
                callbacks.onInit?.(event.conversationId, event.userMessage);
              } else if (event.type === 'token') {
                callbacks.onToken?.(event.token);
              } else if (event.type === 'done') {
                callbacks.onDone?.(event.message);
              } else if (event.type === 'error') {
                callbacks.onError?.(event.error);
              }
            } catch (e) {
              console.warn('Failed to parse SSE payload:', dataStr);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User deliberately clicked Stop
        return;
      }
      callbacks.onError?.(err.message || 'Stream connection error');
    }
  },

  // --- Knowledge Documents ---
  async getDocuments(): Promise<UniversityDocument[]> {
    const res = await fetch('/api/documents');
    const json = await res.json();
    return json.data || [];
  },

  async uploadDocument(data: {
    title: string;
    description: string;
    category: string;
    rawText: string;
    academicYear?: string;
    version?: string;
    uploadedBy?: string;
  }): Promise<UniversityDocument> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'Upload failed');
    return json.data;
  },

  async deleteDocument(id: string): Promise<boolean> {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    const json = await res.json();
    return json.success;
  },

  async reindexDocument(id: string): Promise<boolean> {
    const res = await fetch(`/api/documents/${id}/reindex`, { method: 'POST' });
    const json = await res.json();
    return json.success;
  },

  // --- Announcements & Notifications ---
  async getAnnouncements(): Promise<Announcement[]> {
    const res = await fetch('/api/announcements');
    const json = await res.json();
    return json.data || [];
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data;
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    const json = await res.json();
    return json.success;
  },

  async getNotifications(): Promise<SystemNotification[]> {
    const res = await fetch('/api/notifications');
    const json = await res.json();
    return json.data || [];
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
  },

  // --- Directory ---
  async getDirectory(): Promise<{
    departments: Department[];
    programs: Program[];
    courses: Course[];
    faculty: FacultyMember[];
  }> {
    const res = await fetch('/api/directory');
    const json = await res.json();
    return json.data;
  },

  // --- Admin Analytics & Config ---
  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch('/api/admin/analytics');
    const json = await res.json();
    return json.data;
  },

  async getAIConfig(): Promise<AIConfig> {
    const res = await fetch('/api/admin/config');
    const json = await res.json();
    return json.data;
  },

  async updateAIConfig(config: Partial<AIConfig>): Promise<AIConfig> {
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    const json = await res.json();
    return json.data;
  },

  async getAuditLogs(): Promise<AuditLogItem[]> {
    const res = await fetch('/api/admin/audit-logs');
    const json = await res.json();
    return json.data || [];
  },

  // --- Feedback & Search ---
  async submitFeedback(messageId: string, type: FeedbackType, comment?: string): Promise<void> {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, type, comment }),
    });
  },

  async searchGlobal(query: string): Promise<GlobalSearchResult[]> {
    if (!query) return [];
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const json = await res.json();
    return json.data || [];
  },
};
