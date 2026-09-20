/**
 * UniAssist AI — Global Spotlight Search Modal (Cmd+K)
 * Fast cross-entity query over handbooks, course codes, faculty profiles, and announcements.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, GraduationCap, Users, Bell, ArrowRight } from 'lucide-react';
import { GlobalSearchResult } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: GlobalSearchResult) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.searchGlobal(query.trim());
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'COURSE':
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      case 'FACULTY':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'ANNOUNCEMENT':
        return <Bell className="w-4 h-4 text-amber-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 ml-1 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a policy, course code, professor name, or topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none placeholder-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Searching university knowledge base...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                  className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850 mt-0.5 group-hover:scale-105 transition-transform">
                      {getIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.snippet}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No university documents, courses, or faculty found matching "{query}".
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 space-y-2">
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Quick University Search
              </p>
              <p className="text-[11px] text-slate-400">
                Try searching for: <code className="text-blue-500">BSCS</code>, <code className="text-blue-500">Sarah Chen</code>, <code className="text-blue-500">attendance</code>, <code className="text-blue-500">fee</code>, or <code className="text-blue-500">CS-101</code>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
