/**
 * UniAssist AI — Source Citation Detail Modal
 * Inspects authoritative university handbook excerpt, page, section, and semantic match score.
 */

import React from 'react';
import { X, BookOpen, ExternalLink, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Citation } from '../../types/index.ts';

interface CitationModalProps {
  citation: Citation | null;
  onClose: () => void;
  onViewInKnowledgeBase?: (docId: string) => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({
  citation,
  onClose,
  onViewInKnowledgeBase,
}) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/70 dark:bg-slate-850/50">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                  {citation.category}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-800/60">
                  <CheckCircle2 className="w-3 h-3" />
                  {Math.round(citation.relevanceScore * 100)}% Semantic Match
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                {citation.documentTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Metadata Grid */}
        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Section
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
              {citation.section || 'General'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Page / Clause
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200 block">
              Page {citation.pageNumber || 1}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Academic Term
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200 block">
              {citation.academicYear || '2026-2027'} (v{citation.version || '1.0'})
            </span>
          </div>
        </div>

        {/* Excerpt Body */}
        <div className="p-5 max-h-80 overflow-y-auto">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              Verified Handbook Excerpt
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Official Institutional Source
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap">
            {citation.excerpt}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Document ID: <code className="text-[11px]">{citation.documentId}</code>
          </span>

          <div className="flex items-center gap-2">
            {onViewInKnowledgeBase && (
              <button
                onClick={() => {
                  onViewInKnowledgeBase(citation.documentId);
                  onClose();
                }}
                className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
              >
                <span>View Full Document</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-1.5 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
