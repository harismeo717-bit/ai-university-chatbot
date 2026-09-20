/**
 * UniAssist AI — Enterprise University AI Chatbot Platform
 * Main application container orchestrating state, SSE streaming, role-based views,
 * knowledge base exploration, and spotlight search.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { Header } from './components/layout/Header.tsx';
import { ChatContainer } from './components/chat/ChatContainer.tsx';
import { KnowledgeView } from './components/knowledge/KnowledgeView.tsx';
import { AnnouncementsView } from './components/announcements/AnnouncementsView.tsx';
import { DirectoryView } from './components/directory/DirectoryView.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal.tsx';
import { api } from './lib/api.ts';
import {
  Conversation,
  ChatMessage,
  UniversityDocument,
  Announcement,
  SystemNotification,
  RoleType,
  Department,
  Program,
  Course,
  FacultyMember,
  GlobalSearchResult,
} from './types/index.ts';

export default function App() {
  // Navigation & Theme state
  const [currentView, setCurrentView] = useState<'chat' | 'knowledge' | 'announcements' | 'directory' | 'admin'>('chat');
  const [userRole, setUserRole] = useState<RoleType>('STUDENT');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('uniassist_theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Conversations & Chat State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Entities state
  const [documents, setDocuments] = useState<UniversityDocument[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [directoryData, setDirectoryData] = useState<{
    departments: Department[];
    programs: Program[];
    courses: Course[];
    faculty: FacultyMember[];
  }>({
    departments: [],
    programs: [],
    courses: [],
    faculty: [],
  });
  const [selectedKnowledgeDocId, setSelectedKnowledgeDocId] = useState<string | null>(null);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('uniassist_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('uniassist_theme', 'light');
    }
  }, [isDark]);

  // Global Keyboard Shortcuts (Cmd+K for search, Cmd+N for new chat)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial Data Fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [convs, docs, anns, notifs, dir] = await Promise.all([
        api.getConversations('student-demo'),
        api.getDocuments(),
        api.getAnnouncements(),
        api.getNotifications(),
        api.getDirectory(),
      ]);

      setConversations(convs);
      setDocuments(docs);
      setAnnouncements(anns);
      setNotifications(notifs);
      setDirectoryData(dir);

      // Auto-select first conversation if exists
      if (convs.length > 0) {
        handleSelectConversation(convs[0].id);
      }
    } catch (err) {
      console.error('Failed to load initial university portal data:', err);
    }
  };

  const handleSelectConversation = async (convId: string) => {
    if (isStreaming) {
      handleStopStreaming();
    }
    setActiveConversationId(convId);
    setCurrentView('chat');
    try {
      const fullConv = await api.getConversation(convId);
      setMessages(fullConv.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewChat = () => {
    if (isStreaming) {
      handleStopStreaming();
    }
    setActiveConversationId(null);
    setMessages([]);
    setStreamingContent('');
    setCurrentView('chat');
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    // Optimistically render user message
    const tempUserMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      conversationId: activeConversationId || 'new',
      role: 'user',
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsStreaming(true);
    setStreamingContent('');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let currentConvId = activeConversationId;

    await api.streamChat(
      currentConvId,
      text,
      userRole,
      {
        onInit: (convId, userMsg) => {
          if (!currentConvId) {
            currentConvId = convId;
            setActiveConversationId(convId);
            // Refresh conversation list in sidebar
            api.getConversations('student-demo').then(setConversations);
          }
        },
        onToken: (token) => {
          setStreamingContent((prev) => prev + token);
        },
        onDone: (assistantMsg) => {
          setIsStreaming(false);
          setStreamingContent('');
          setMessages((prev) => [...prev, assistantMsg]);
          api.getConversations('student-demo').then(setConversations);
        },
        onError: (err) => {
          setIsStreaming(false);
          setStreamingContent('');
          console.error('Stream error:', err);
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              conversationId: currentConvId || 'conv-err',
              role: 'assistant',
              content: `⚠️ Communication Notice: An unexpected error occurred while communicating with the university service (${err}). Please retry your inquiry.`,
              createdAt: new Date().toISOString(),
              isGrounded: false,
            },
          ]);
        },
      },
      controller.signal
    );
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    if (streamingContent) {
      setMessages((prev) => [
        ...prev,
        {
          id: `stopped-${Date.now()}`,
          conversationId: activeConversationId || 'temp',
          role: 'assistant',
          content: streamingContent + ' *[Generation stopped by user]*',
          createdAt: new Date().toISOString(),
          isGrounded: true,
        },
      ]);
      setStreamingContent('');
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await api.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        handleNewChat();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePinConversation = async (id: string, isPinned: boolean) => {
    try {
      await api.updateConversation(id, { isPinned });
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isPinned } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameConversation = async (id: string, title: string) => {
    try {
      await api.updateConversation(id, { title });
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAskAboutDirectoryItem = (prompt: string) => {
    setCurrentView('chat');
    handleSendMessage(prompt);
  };

  const handleViewInKnowledgeBase = (docId: string) => {
    setSelectedKnowledgeDocId(docId);
    setCurrentView('knowledge');
  };

  const handleSelectSearchResult = (result: GlobalSearchResult) => {
    if (result.type === 'DOCUMENT') {
      setSelectedKnowledgeDocId(result.id);
      setCurrentView('knowledge');
    } else if (result.type === 'COURSE' || result.type === 'FACULTY') {
      setCurrentView('directory');
    } else if (result.type === 'ANNOUNCEMENT') {
      setCurrentView('announcements');
    }
  };

  const currentConv = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation & History */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as any)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onTogglePinConversation={handleTogglePinConversation}
        onRenameConversation={handleRenameConversation}
        userRole={userRole}
        isOpen={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          currentView={currentView}
          userRole={userRole}
          onRoleChange={setUserRole}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleSidebar={() => setIsSidebarMobileOpen((prev) => !prev)}
          isDark={isDark}
          onToggleDark={() => setIsDark((prev) => !prev)}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
        />

        {/* View Routing */}
        <main className="flex-1 flex overflow-hidden">
          {currentView === 'chat' && (
            <ChatContainer
              messages={messages}
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
              onStopStreaming={handleStopStreaming}
              streamingContent={streamingContent}
              userRole={userRole}
              conversationTitle={currentConv?.title || 'Academic Advising'}
              activeConversationId={activeConversationId}
              onViewInKnowledgeBase={handleViewInKnowledgeBase}
            />
          )}

          {currentView === 'knowledge' && (
            <KnowledgeView
              documents={documents}
              onRefreshDocuments={() => api.getDocuments().then(setDocuments)}
              userRole={userRole}
              selectedDocId={selectedKnowledgeDocId}
            />
          )}

          {currentView === 'announcements' && (
            <AnnouncementsView
              announcements={announcements}
              onRefresh={() => api.getAnnouncements().then(setAnnouncements)}
              userRole={userRole}
            />
          )}

          {currentView === 'directory' && (
            <DirectoryView
              departments={directoryData.departments}
              programs={directoryData.programs}
              courses={directoryData.courses}
              faculty={directoryData.faculty}
              onAskAboutItem={handleAskAboutDirectoryItem}
            />
          )}

          {currentView === 'admin' && (
            <AdminDashboard
              documents={documents}
              onRefreshDocuments={() => api.getDocuments().then(setDocuments)}
            />
          )}
        </main>
      </div>

      {/* Global Spotlight Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />
    </div>
  );
}
