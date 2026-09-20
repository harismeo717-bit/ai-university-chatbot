/**
 * UniAssist AI — Knowledge Base & Document Explorer
 * Inspects all authoritative university handbooks, version history, chunk distributions, and embeddings.
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Layers,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Hash,
  FileCheck,
} from 'lucide-react';
import { DocumentCategory, RoleType, UniversityDocument } from '../../types/index.ts';
import { formatBytes, formatDate } from '../../lib/utils.ts';
import { api } from '../../lib/api.ts';

interface KnowledgeViewProps {
  documents: UniversityDocument[];
  onRefreshDocuments: () => void;
  userRole: RoleType;
  selectedDocId?: string | null;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({
  documents,
  onRefreshDocuments,
  userRole,
  selectedDocId: initialSelectedDocId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingDoc, setInspectingDoc] = useState<UniversityDocument | null>(
    documents.find((d) => d.id === initialSelectedDocId) || null
  );
  const [isReindexing, setIsReindexing] = useState<string | null>(null);

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Admissions', value: 'ADMISSIONS' },
    { label: 'Fees & Accounts', value: 'FEES' },
    { label: 'Examinations & Rules', value: 'EXAMINATIONS' },
    { label: 'Scholarships & Aid', value: 'SCHOLARSHIPS' },
    { label: 'Faculty & Depts', value: 'FACULTY' },
    { label: 'Hostel & Residence', value: 'HOSTEL' },
    { label: 'Library & Transport', value: 'CAMPUS' },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory || (selectedCategory === 'CAMPUS' && (doc.category === 'CAMPUS' || doc.category === 'LIBRARY' || doc.category === 'TRANSPORTATION'));
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReindex = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReindexing(docId);
    try {
      await api.reindexDocument(docId);
      onRefreshDocuments();
    } catch (err) {
      console.error(err);
    } finally {
      setIsReindexing(null);
    }
  };

  const handleDelete = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this document and all its indexed vector chunks?')) {
      return;
    }
    try {
      await api.deleteDocument(docId);
      if (inspectingDoc?.id === docId) {
        setInspectingDoc(null);
      }
      onRefreshDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Document List Column */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 dark:border-slate-800">
        {/* Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>University Knowledge Base</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authoritative institutional policies, academic regulations, and tuition schedules
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {documents.length} Handbooks Indexed
              </span>
            </div>
          </div>

          {/* Search and Category Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search handbooks, policies, or topics..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat.value
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Document Cards Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredDocs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No university documents matched your search criteria.
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isSelected = inspectingDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setInspectingDoc(doc)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-blue-100/60 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                            {doc.category}
                          </span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            {doc.status}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            v{doc.version} ({doc.academicYear})
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {doc.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => handleReindex(doc.id, e)}
                        disabled={isReindexing === doc.id}
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Re-index Vector Embeddings"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isReindexing === doc.id ? 'animate-spin text-blue-600' : ''}`} />
                      </button>

                      {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
                        <button
                          onClick={(e) => handleDelete(doc.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <ChevronRight className="w-4 h-4 text-slate-400 ml-1" />
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {doc.chunksCount} chunks
                      </span>
                      <span>{formatBytes(doc.fileSize)}</span>
                    </div>
                    <span>By {doc.uploadedBy}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chunk Breakdown Detail Column */}
      <div className="hidden lg:flex w-96 xl:w-[420px] flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-hidden">
        {inspectingDoc ? (
          <div className="flex-1 flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Vector Chunks ({inspectingDoc.chunks?.length || 0})
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {inspectingDoc.id}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
                {inspectingDoc.title}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(!inspectingDoc.chunks || inspectingDoc.chunks.length === 0) ? (
                <div className="text-xs text-slate-400 text-center py-8">
                  No individual chunks loaded for this document.
                </div>
              ) : (
                inspectingDoc.chunks.map((chk, idx) => (
                  <div
                    key={chk.id}
                    className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-blue-600 dark:text-blue-400 truncate max-w-[200px]">
                        {chk.heading || `Chunk ${idx + 1}`}
                      </span>
                      <span className="text-slate-400 font-mono">
                        Page {chk.pageNumber} • {chk.tokens} tokens
                      </span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px] leading-relaxed line-clamp-6 whitespace-pre-wrap">
                      {chk.content}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <FileCheck className="w-3 h-3" />
                        Vector Embedding Ready
                      </span>
                      <span>Index #{chk.chunkIndex}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
            <Layers className="w-8 h-8 mb-2 opacity-40 text-blue-500" />
            <p className="font-medium text-slate-600 dark:text-slate-300">
              Select a Handbook to Inspect Chunks
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              View sliding-window chunk partitions, page locations, token weights, and pre-computed vector status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
