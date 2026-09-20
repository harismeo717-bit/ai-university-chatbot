/**
 * UniAssist AI — Top Header Navigation Bar
 * Global search trigger, grounded status indicator, role switcher, notifications, and theme toggle.
 */

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  Menu,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { RoleType, SystemNotification } from '../../types/index.ts';

interface HeaderProps {
  currentView: string;
  userRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  notifications: SystemNotification[];
  onMarkNotificationRead: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  userRole,
  onRoleChange,
  onOpenSearch,
  onToggleSidebar,
  isDark,
  onToggleDark,
  notifications,
  onMarkNotificationRead,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    chat: { title: 'AI Academic Assistant', subtitle: 'Grounded in Fall 2026 University Regulations' },
    knowledge: { title: 'Knowledge Base & Handbooks', subtitle: 'Authoritative University Documents & Vector Chunks' },
    announcements: { title: 'Official Bulletins', subtitle: 'Registrar & Directorate Announcements' },
    directory: { title: 'University Directory', subtitle: 'Departments, Degree Programs, Courses & Faculty' },
    admin: { title: 'Admin Command Center', subtitle: 'RAG Ingestion Studio, Analytics & AI Engine Controls' },
  };

  const currentInfo = viewTitles[currentView] || {
    title: 'University Portal',
    subtitle: 'Fall 2026 Academic Term',
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          id="btn-sidebar-toggle"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
              {currentInfo.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              Verified Grounding
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search, Grounding status, Role switcher, Notifications, Dark mode */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        <button
          id="btn-global-search-header"
          onClick={onOpenSearch}
          className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search handbooks, courses, faculty...</span>
          <span className="sm:hidden">Search</span>
          <kbd className="hidden md:inline-block text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded font-mono shadow-xs">
            ⌘K
          </kbd>
        </button>

        {/* Role Selector Switcher (To test RBAC easily) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-lg p-1 text-xs">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ml-1 hidden sm:inline" />
          <select
            id="select-user-role"
            value={userRole}
            onChange={(e) => onRoleChange(e.target.value as RoleType)}
            className="bg-transparent text-slate-800 dark:text-slate-200 font-medium py-0.5 px-1.5 focus:outline-none cursor-pointer"
            aria-label="Active user role"
          >
            <option value="STUDENT">Role: Student</option>
            <option value="FACULTY">Role: Faculty</option>
            <option value="STAFF">Role: Staff</option>
            <option value="ADMIN">Role: Admin</option>
            <option value="SUPER_ADMIN">Role: Super Admin</option>
          </select>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">
                    Notifications
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {unreadCount} unread
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No active notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 ${
                        notif.isRead ? 'opacity-60' : 'bg-blue-50/40 dark:bg-blue-950/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          id="btn-theme-toggle"
          onClick={onToggleDark}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          aria-label="Toggle Dark/Light theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
