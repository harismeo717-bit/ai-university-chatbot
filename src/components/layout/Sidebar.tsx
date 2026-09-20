/**
 * UniAssist AI — Main Navigation Sidebar & Conversation Drawer
 * University branding, new chat trigger, conversation history management, and role-aware navigation.
 */

import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  BookOpen,
  Bell,
  Users,
  Settings,
  Pin,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  School,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';
import { Conversation, RoleType } from '../../types/index.ts';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onTogglePinConversation: (id: string, isPinned: boolean) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  userRole: RoleType;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onTogglePinConversation,
  onRenameConversation,
  userRole,
  isOpen,
  onCloseMobile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned);
  const recentConversations = filteredConversations.filter((c) => !c.isPinned);

  const handleStartEdit = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* University Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/90 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white">
                  UniAssist AI
                </span>
                <span className="text-[10px] uppercase font-semibold bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded border border-blue-500/30">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official University Assistant
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3">
          <button
            id="btn-new-chat-sidebar"
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Academic Chat</span>
          </button>
        </div>

        {/* Primary View Navigation */}
        <div className="px-3 py-1 space-y-1">
          <button
            id="nav-chat-tab"
            onClick={() => {
              onNavigate('chat');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'chat'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>AI Assistant</span>
          </button>

          <button
            id="nav-knowledge-tab"
            onClick={() => {
              onNavigate('knowledge');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'knowledge'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Knowledge Base & Handbooks</span>
          </button>

          <button
            id="nav-announcements-tab"
            onClick={() => {
              onNavigate('announcements');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'announcements'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Official Bulletins</span>
          </button>

          <button
            id="nav-directory-tab"
            onClick={() => {
              onNavigate('directory');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'directory'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Campus Directory</span>
          </button>

          <button
            id="nav-admin-tab"
            onClick={() => {
              onNavigate('admin');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'admin'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>Admin Center</span>
            </div>
            <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
              RAG Studio
            </span>
          </button>
        </div>

        {/* Conversation History Section */}
        <div className="mt-3 flex-1 flex flex-col min-h-0 border-t border-slate-800/80 pt-3">
          {/* Search conversations input */}
          <div className="px-3 mb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                id="input-search-conversations"
                type="text"
                placeholder="Filter conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-850 text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-750 focus:border-blue-500 focus:outline-none placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-4">
            {/* Pinned section */}
            {pinnedConversations.length > 0 && (
              <div>
                <div className="px-2 mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <Pin className="w-3 h-3 text-amber-400" />
                  <span>Pinned</span>
                </div>
                <div className="space-y-0.5">
                  {pinnedConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isActive={activeConversationId === conv.id}
                      isEditing={editingId === conv.id}
                      editTitle={editTitle}
                      onSelect={() => {
                        onSelectConversation(conv.id);
                        onCloseMobile();
                      }}
                      onStartEdit={(e) => handleStartEdit(e, conv)}
                      onSaveEdit={(e) => handleSaveEdit(e, conv.id)}
                      onCancelEdit={handleCancelEdit}
                      onEditChange={(e) => setEditTitle(e.target.value)}
                      onTogglePin={(e) => {
                        e.stopPropagation();
                        onTogglePinConversation(conv.id, !conv.isPinned);
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent section */}
            <div>
              <div className="px-2 mb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Recent Chats
              </div>
              <div className="space-y-0.5">
                {recentConversations.length === 0 && pinnedConversations.length === 0 ? (
                  <div className="px-2 py-4 text-center text-xs text-slate-500">
                    No conversations yet. Ask UniAssist a question to begin.
                  </div>
                ) : (
                  recentConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isActive={activeConversationId === conv.id}
                      isEditing={editingId === conv.id}
                      editTitle={editTitle}
                      onSelect={() => {
                        onSelectConversation(conv.id);
                        onCloseMobile();
                      }}
                      onStartEdit={(e) => handleStartEdit(e, conv)}
                      onSaveEdit={(e) => handleSaveEdit(e, conv.id)}
                      onCancelEdit={handleCancelEdit}
                      onEditChange={(e) => setEditTitle(e.target.value)}
                      onTogglePin={(e) => {
                        e.stopPropagation();
                        onTogglePinConversation(conv.id, !conv.isPinned);
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Card & Role Indicator */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {userRole === 'STUDENT' ? 'ST' : userRole === 'FACULTY' ? 'FC' : 'AD'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {userRole === 'STUDENT'
                  ? 'Alex Morgan'
                  : userRole === 'FACULTY'
                  ? 'Dr. Sarah Chen'
                  : 'System Administrator'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {userRole === 'STUDENT'
                  ? 'STU-2026-0842 (CS)'
                  : userRole === 'FACULTY'
                  ? 'Chairperson CS Dept'
                  : 'Institutional Super Admin'}
              </p>
            </div>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </aside>
    </>
  );
};

interface ConversationItemProps {
  conv: Conversation;
  isActive: boolean;
  isEditing: boolean;
  editTitle: string;
  onSelect: () => void;
  onStartEdit: (e: React.MouseEvent) => void;
  onSaveEdit: (e: React.MouseEvent) => void;
  onCancelEdit: (e: React.MouseEvent) => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conv,
  isActive,
  isEditing,
  editTitle,
  onSelect,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditChange,
  onTogglePin,
  onDelete,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
        isActive
          ? 'bg-slate-800 text-white font-medium'
          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
        <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={onEditChange}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-slate-700 text-white px-1.5 py-0.5 rounded text-xs focus:outline-none"
          />
        ) : (
          <span className="truncate">{conv.title}</span>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <button
              onClick={onSaveEdit}
              className="p-1 hover:text-emerald-400"
              title="Save"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={onCancelEdit}
              className="p-1 hover:text-rose-400"
              title="Cancel"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onTogglePin}
              className={`p-1 hover:text-amber-400 ${conv.isPinned ? 'text-amber-400' : 'text-slate-500'}`}
              title={conv.isPinned ? 'Unpin' : 'Pin'}
            >
              <Pin className="w-3 h-3" />
            </button>
            <button
              onClick={onStartEdit}
              className="p-1 text-slate-500 hover:text-blue-400"
              title="Rename"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-slate-500 hover:text-rose-400"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
