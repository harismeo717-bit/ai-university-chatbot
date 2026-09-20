/**
 * UniAssist AI — Type Definitions
 * Shared interfaces and enums for Frontend & Backend
 */

export type RoleType = 'STUDENT' | 'FACULTY' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';

export type DocumentStatus = 'PROCESSING' | 'INDEXED' | 'FAILED' | 'OUTDATED' | 'ARCHIVED';

export type DocumentCategory =
  | 'ADMISSIONS'
  | 'ACADEMICS'
  | 'FEES'
  | 'SCHOLARSHIPS'
  | 'EXAMINATIONS'
  | 'POLICIES'
  | 'DEPARTMENTS'
  | 'FACULTY'
  | 'STUDENT_AFFAIRS'
  | 'HOSTEL'
  | 'LIBRARY'
  | 'TRANSPORTATION'
  | 'CAMPUS'
  | 'EVENTS'
  | 'GENERAL';

export type PriorityLevel = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type FeedbackType = 'HELPFUL' | 'UNHELPFUL' | 'INCORRECT_INFORMATION' | 'INAPPROPRIATE';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  studentId?: string;
  department?: string;
  avatarUrl?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  headOfDept: string;
  headOfDepartment?: string;
  hodEmail: string;
  contactEmail?: string;
  building: string;
  contact: string;
  contactPhone?: string;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  level: string;
  durationYears: number;
  totalCredits: number;
  totalCreditHours?: number;
  departmentCode: string;
  description?: string;
  admissionRequirements?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditHours: number;
  credits?: number;
  lectureHours?: number;
  labHours?: number;
  description: string;
  syllabusSummary?: string;
  prerequisites?: string;
  prerequisite?: string;
  departmentCode: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  email: string;
  officeLocation: string;
  officeHours: string;
  researchArea: string;
  departmentCode: string;
  qualification?: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  heading?: string;
  pageNumber?: number;
  category: DocumentCategory;
  tokens: number;
  embedding?: number[];
  relevanceScore?: number;
}

export interface UniversityDocument {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: DocumentCategory;
  accessLevel: RoleType;
  academicYear: string;
  version: string;
  status: DocumentStatus;
  department?: string;
  uploadedBy: string;
  uploadedAt: string;
  updatedAt?: string;
  chunksCount: number;
  chunks?: DocumentChunk[];
}

export interface Citation {
  id: string;
  documentId: string;
  documentTitle: string;
  category: DocumentCategory;
  pageNumber?: number;
  section?: string;
  relevanceScore: number; // 0.0 - 1.0 (e.g. 0.94 -> 94%)
  version: string;
  academicYear: string;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  citations?: Citation[];
  confidence?: number;
  isGrounded?: boolean;
  isStreaming?: boolean;
  feedback?: {
    type: FeedbackType;
    comment?: string;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessageSnippet?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: DocumentCategory;
  priority: PriorityLevel;
  targetAudience: 'ALL' | 'STUDENT' | 'FACULTY' | 'STAFF' | 'CS_DEPT';
  department?: string;
  publishDate: string;
  expiryDate?: string;
  isPinned?: boolean;
  author: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'ANNOUNCEMENT' | 'EXAM' | 'FEE' | 'SYSTEM' | 'SECURITY';
  priority: PriorityLevel;
  link?: string;
  createdAt: string;
  isRead: boolean;
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsersToday: number;
  totalConversations: number;
  questionsAsked: number;
  aiResponses: number;
  unansweredQuestions: number;
  averageResponseTimeMs: number;
  knowledgeBaseHealth: number; // e.g. 98%
  indexedDocumentsCount: number;
  totalChunksCount: number;
  positiveFeedbackRate: number; // e.g. 96.4%
  popularTopics: { topic: string; queryCount: number; percentage: number }[];
  dailyVolume: { date: string; queries: number; unanswered: number }[];
  activeDepartments: { name: string; queryCount: number }[];
  unansweredList: {
    id: string;
    question: string;
    timestamp: string;
    category: string;
    resolved: boolean;
  }[];
}

export interface AIConfig {
  provider: 'gemini' | 'mock';
  model: string;
  temperature: number;
  maxTokens: number;
  topKRetrieval: number;
  similarityThreshold: number; // e.g. 0.60
  strictAntiHallucination: boolean;
  systemPrompt: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  actor: string;
  role: RoleType;
  entity: string;
  details: string;
  timestamp: string;
}

export interface GlobalSearchResult {
  id: string;
  type: 'DOCUMENT' | 'COURSE' | 'FACULTY' | 'ANNOUNCEMENT' | 'FAQ';
  title: string;
  snippet: string;
  category?: string;
  link?: string;
}
