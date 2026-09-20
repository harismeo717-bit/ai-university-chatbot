/**
 * UniAssist AI — Enterprise Admin Command Center
 * Document Ingestion Studio, AI Parameter Tuning, Unanswered Inquiries Queue, and Real-time Audit Trail.
 */

import React, { useState, useEffect } from 'react';
import {
  Settings,
  BarChart3,
  UploadCloud,
  Sliders,
  AlertCircle,
  ShieldCheck,
  Layers,
  Database,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  FileText,
  Save,
  HelpCircle,
} from 'lucide-react';
import { AIConfig, AnalyticsData, AuditLogItem, UniversityDocument } from '../../types/index.ts';
import { formatBytes, formatDateTime } from '../../lib/utils.ts';
import { api } from '../../lib/api.ts';

interface AdminDashboardProps {
  documents: UniversityDocument[];
  onRefreshDocuments: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  documents,
  onRefreshDocuments,
}) => {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'INGESTION' | 'TUNING' | 'UNANSWERED' | 'AUDIT'>('ANALYTICS');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [aiConfig, setAIConfig] = useState<AIConfig | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  // Ingestion Form State
  const [docTitle, setDocTitle] = useState('');
  const [docDesc, setDocDesc] = useState('');
  const [docCategory, setDocCategory] = useState('ACADEMICS');
  const [docYear, setDocYear] = useState('2026-2027');
  const [docVersion, setDocVersion] = useState('1.0.0');
  const [docText, setDocText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsData, configData, logsData] = await Promise.all([
        api.getAnalytics(),
        api.getAIConfig(),
        api.getAuditLogs(),
      ]);
      setAnalytics(analyticsData);
      setAIConfig(configData);
      setAuditLogs(logsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiConfig) return;
    setSavingConfig(true);
    try {
      const updated = await api.updateAIConfig(aiConfig);
      setAIConfig(updated);
      setConfigSavedToast(true);
      setTimeout(() => setConfigSavedToast(false), 3000);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleIngestDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docText.trim()) return;
    setIsUploading(true);
    try {
      await api.uploadDocument({
        title: docTitle.trim(),
        description: docDesc.trim(),
        category: docCategory,
        rawText: docText.trim(),
        academicYear: docYear,
        version: docVersion,
        uploadedBy: 'Administrator',
      });
      setDocTitle('');
      setDocDesc('');
      setDocText('');
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3500);
      onRefreshDocuments();
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuickSeedRule = () => {
    setDocTitle('University Laboratory Safety & Cybersecurity Policy 2026');
    setDocDesc('Mandatory lab credentials, biometric access, zero tolerance for unauthorized software.');
    setDocCategory('ACADEMICS');
    setDocText(`1. LABORATORY ACCESS & CREDENTIALS
All students utilizing High-Performance Computing (HPC) and AI research labs must register their institutional biometrics at Lovelace Center Room 104.
Guest login without valid student ID is strictly prohibited.

2. SOFTWARE & NETWORK POLICY
Installing unapproved third-party mining, peer-to-peer torrents, or penetration testing software on campus workstations results in immediate suspension of network access for 30 days.

3. CLEAN DESK & TIMINGS
Computing laboratories close at 9:00 PM on weekdays. Personal devices must be logged out prior to departure.`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Admin Command Center Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Admin Command Center</span>
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              Institutional Root
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor RAG health, ingest university policies, adjust AI parameters, and inspect audit logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'ANALYTICS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('INGESTION')}
          className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'INGESTION'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Document Ingestion Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('TUNING')}
          className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'TUNING'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>AI Engine Tuning</span>
        </button>

        <button
          onClick={() => setActiveTab('UNANSWERED')}
          className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'UNANSWERED'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Unanswered Inquiries ({analytics?.unansweredQuestions || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'AUDIT'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* Main Tab View Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {/* TAB 1: ANALYTICS & TELEMETRY */}
        {activeTab === 'ANALYTICS' && analytics && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Questions Answered
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
                  {analytics.questionsAsked}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +18% from last week
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Grounding Accuracy
                </span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {analytics.knowledgeBaseHealth}%
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                  Zero hallucinations tolerated
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Indexed Knowledge
                </span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                  {analytics.indexedDocumentsCount} Docs
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                  {analytics.totalChunksCount} Vector Chunks
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Student Satisfaction
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 block">
                  {analytics.positiveFeedbackRate}%
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                  Based on verified feedback
                </span>
              </div>
            </div>

            {/* Popular Topics & Query Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Most Frequent Student Inquiry Topics</span>
                </h3>
                <div className="space-y-3">
                  {analytics.popularTopics.map((topic, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {topic.topic}
                        </span>
                        <span className="text-slate-400">{topic.queryCount} queries</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${topic.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Weekly Inquiries Volume</span>
                </h3>
                <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
                  {analytics.dailyVolume.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] text-slate-400">{item.queries}</span>
                      <div
                        className="w-full bg-indigo-500/80 hover:bg-indigo-600 rounded-t-md transition-all"
                        style={{ height: `${(item.queries / 90) * 110}px` }}
                      />
                      <span className="text-xs font-semibold text-slate-500">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INGESTION STUDIO */}
        {activeTab === 'INGESTION' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-blue-600" />
                    <span>Upload & Ingest University Document</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automatically segments text into chunks, generates vector embeddings, and links semantic keywords.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleQuickSeedRule}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Load Sample Policy
                </button>
              </div>

              {uploadSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Document ingested, vectorized, and live in the AI knowledge base!</span>
                </div>
              )}

              <form onSubmit={handleIngestDocument} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Examination Rules & Grading Handbook"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                    >
                      <option value="ACADEMICS">Academics</option>
                      <option value="ADMISSIONS">Admissions</option>
                      <option value="FEES">Fees & Tuition</option>
                      <option value="EXAMINATIONS">Examinations & Rules</option>
                      <option value="SCHOLARSHIPS">Scholarships</option>
                      <option value="FACULTY">Faculty</option>
                      <option value="HOSTEL">Hostels</option>
                      <option value="LIBRARY">Library</option>
                      <option value="TRANSPORTATION">Transportation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Summary Description
                    </label>
                    <input
                      type="text"
                      placeholder="Brief synopsis of what this handbook governs..."
                      value={docDesc}
                      onChange={(e) => setDocDesc(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Academic Term
                    </label>
                    <input
                      type="text"
                      value={docYear}
                      onChange={(e) => setDocYear(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Document Content (Raw Policy Text)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      ~{Math.ceil(docText.length / 4)} tokens • ~{Math.ceil(docText.length / 900) || 1} chunks
                    </span>
                  </div>
                  <textarea
                    required
                    rows={8}
                    placeholder="Paste the full text of the university regulations or handbook..."
                    value={docText}
                    onChange={(e) => setDocText(e.target.value)}
                    className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 leading-relaxed text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUploading || !docTitle.trim() || !docText.trim()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isUploading ? 'Chunking & Vectorizing...' : 'Ingest & Index Document'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: AI ENGINE TUNING */}
        {activeTab === 'TUNING' && aiConfig && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-600" />
                    <span>AI Model & RAG Grounding Parameters</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tune temperature, similarity thresholds, and strict anti-hallucination guardrails.
                  </p>
                </div>

                {configSavedToast && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Parameters Saved
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      AI Model Architecture
                    </label>
                    <select
                      value={aiConfig.model}
                      onChange={(e) => setAIConfig({ ...aiConfig, model: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                    >
                      <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Default / Recommended)</option>
                      <option value="gemini-3.1-flash-lite">Google Gemini 3.1 Flash-Lite (Ultra Fast)</option>
                      <option value="fallback">Local Knowledge Synthesizer (Zero-Key Offline)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Top-K Chunks to Retrieve ({aiConfig.topKRetrieval})
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      step={1}
                      value={aiConfig.topKRetrieval}
                      onChange={(e) => setAIConfig({ ...aiConfig, topKRetrieval: parseInt(e.target.value, 10) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>1 chunk</span>
                      <span>4 chunks (balanced)</span>
                      <span>8 chunks</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Similarity Threshold ({aiConfig.similarityThreshold})
                    </label>
                    <input
                      type="range"
                      min={0.4}
                      max={0.85}
                      step={0.05}
                      value={aiConfig.similarityThreshold}
                      onChange={(e) => setAIConfig({ ...aiConfig, similarityThreshold: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>0.40 (Permissive)</span>
                      <span>0.60 (Strict Grounding)</span>
                      <span>0.85 (Ultra-Strict)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Creativity / Temperature ({aiConfig.temperature})
                    </label>
                    <input
                      type="range"
                      min={0.0}
                      max={0.7}
                      step={0.05}
                      value={aiConfig.temperature}
                      onChange={(e) => setAIConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>0.0 (Deterministic / Accurate)</span>
                      <span>0.2 (Recommended)</span>
                      <span>0.7 (Creative)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    System Instruction Directive (Immutable Rules)
                  </label>
                  <textarea
                    rows={4}
                    value={aiConfig.systemPrompt}
                    onChange={(e) => setAIConfig({ ...aiConfig, systemPrompt: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-100 font-mono text-[11px]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingConfig ? 'Saving Parameters...' : 'Save AI Configuration'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: UNANSWERED INQUIRIES */}
        {activeTab === 'UNANSWERED' && analytics && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Unanswered Queries & Knowledge Gaps
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                These student queries scored below the grounding threshold. Use this queue to discover missing policies and create new handbooks.
              </p>

              {analytics.unansweredList.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No unanswered inquiries recorded! Knowledge base is fully covering incoming student queries.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {analytics.unansweredList.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-3">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          "{item.question}"
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDateTime(item.timestamp)} • Category: {item.category}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setDocTitle(`Policy Regarding: ${item.question.slice(0, 30)}`);
                          setDocDesc(`Created to address student inquiry: "${item.question}"`);
                          setActiveTab('INGESTION');
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex-shrink-0"
                      >
                        Create Knowledge Document
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT TRAIL */}
        {activeTab === 'AUDIT' && (
          <div className="space-y-3">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Security & Administrative Audit Logs
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[11px] text-blue-600 dark:text-blue-400">
                          {log.action}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {log.entity}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{log.details}</p>
                    </div>
                    <div className="text-right flex-shrink-0 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-600 dark:text-slate-300 block">
                        {log.actor} ({log.role})
                      </span>
                      <span>{formatDateTime(log.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
