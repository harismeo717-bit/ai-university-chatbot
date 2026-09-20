/**
 * UniAssist AI — Main Chat Interface & Grounded Streaming Container
 * Features real-time SSE streaming, authoritative citation chips, anti-hallucination indicators,
 * prompt suggestions, and feedback tools.
 */

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Square,
  Sparkles,
  BookOpen,
  DollarSign,
  Award,
  GraduationCap,
  Building,
  Users,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Share2,
  ShieldCheck,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { ChatMessage, Citation, RoleType } from '../../types/index.ts';
import { CitationModal } from './CitationModal.tsx';
import { ReportModal } from './ReportModal.tsx';
import { ShareModal } from './ShareModal.tsx';
import { api } from '../../lib/api.ts';

interface ChatContainerProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  streamingContent: string;
  userRole: RoleType;
  conversationTitle: string;
  activeConversationId: string | null;
  onViewInKnowledgeBase?: (docId: string) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  isStreaming,
  onStopStreaming,
  streamingContent,
  userRole,
  conversationTitle,
  activeConversationId,
  onViewInKnowledgeBase,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'HELPFUL' | 'UNHELPFUL'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim() || isStreaming) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = async (messageId: string, type: 'HELPFUL' | 'UNHELPFUL') => {
    try {
      await api.submitFeedback(messageId, type);
      setFeedbackGiven((prev) => ({ ...prev, [messageId]: type }));
    } catch (err) {
      console.error(err);
    }
  };

  // Quick suggestion prompts
  const suggestions = [
    {
      category: 'Admissions',
      icon: GraduationCap,
      query: 'What are the admission requirements for BS Computer Science?',
      desc: 'Eligibility, entry test weightage & high school marks',
    },
    {
      category: 'Fee Structure',
      icon: DollarSign,
      query: 'Show me the tuition fee structure for BSCS.',
      desc: 'Credit hour rates, semester totals & refund policies',
    },
    {
      category: 'Examinations',
      icon: BookOpen,
      query: 'What is the attendance requirement and grading scale for exams?',
      desc: 'Mandatory 75% attendance rule & 4.00 CGPA scale',
    },
    {
      category: 'Scholarships',
      icon: Award,
      query: 'What academic merit and need-based scholarships are available?',
      desc: 'Top batch position waivers and HEC financial aid',
    },
    {
      category: 'Faculty & HOD',
      icon: Users,
      query: 'Who is the Head of the Computer Science Department?',
      desc: 'Dr. Sarah Chen, office location, email & hours',
    },
    {
      category: 'Hostel Life',
      icon: Building,
      query: 'What are the hostel curfew timings and room charges?',
      desc: '10:00 PM gate closure, biometric logs & mess fees',
    },
  ];

  // Dynamic follow-up chips based on last message
  const getFollowUpSuggestions = (): string[] => {
    if (messages.length === 0) return [];
    const lastMsg = messages[messages.length - 1];
    const text = (lastMsg.content || '').toLowerCase();

    if (text.includes('admission') || text.includes('bscs')) {
      return [
        'What is the tuition fee for BSCS?',
        'When is the admission deadline for Fall 2026?',
        'Who is the Head of the Computer Science Department?',
      ];
    }
    if (text.includes('fee') || text.includes('tuition')) {
      return [
        'Can I pay fees in installments?',
        'What is the refund policy if I withdraw?',
        'Are there any scholarships available?',
      ];
    }
    if (text.includes('exam') || text.includes('attendance') || text.includes('grading')) {
      return [
        'What happens if my attendance is below 75%?',
        'What is the academic probation policy for low CGPA?',
        'When does the Fall 2026 final exam period begin?',
      ];
    }
    return [
      'What are the library opening hours?',
      'How do I get a campus shuttle transportation pass?',
      'Who is the academic advisor for undergraduate computing?',
    ];
  };

  const followUps = getFollowUpSuggestions();

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 min-w-0 relative">
      {/* Top Conversation Header Banner */}
      <div className="px-4 py-2.5 bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between backdrop-blur-xs text-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
            {conversationTitle || 'Academic Advising & Policy Consultation'}
          </span>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            {messages.length} messages
          </span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export / Share</span>
          </button>
        )}
      </div>

      {/* Main Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 && !isStreaming ? (
          /* Welcome State with verified badges & quick prompts */
          <div className="max-w-3xl mx-auto py-6 space-y-8 animate-in fade-in duration-200">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-1">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                UniAssist AI Academic Assistant
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                Your intelligent university companion for admissions, fee structures, examination regulations, degree roadmaps, scholarships, and campus services.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4" />
                <span>Strict Anti-Hallucination Grounding • 2026-2027 Handbooks</span>
              </div>
            </div>

            {/* Quick Explore Categories Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {suggestions.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(item.query)}
                    className="p-4 rounded-xl text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {item.query}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Render Messages */
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Assistant Avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed transition-all shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                  }`}
                >
                  {/* User message is simple text */}
                  {msg.role === 'user' ? (
                    <div className="font-medium whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    /* Assistant Message with Markdown & Citations */
                    <div className="space-y-3">
                      {/* Grounding Status Pill */}
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2 mb-2 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          {msg.isGrounded ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{Math.round((msg.confidence || 0.95) * 100)}% Verified Grounded</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/60">
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>Knowledge Boundary Note</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Markdown Formatted Body */}
                      <div className="prose-custom dark:text-slate-200">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      {/* Authoritative Citations Badges */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                            <BookOpen className="w-3 h-3 text-blue-500" />
                            <span>Verified Sources ({msg.citations.length})</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {msg.citations.map((cite) => (
                              <button
                                key={cite.id}
                                onClick={() => setSelectedCitation(cite)}
                                className="inline-flex items-center gap-1 text-[11px] bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 px-2.5 py-1 rounded-lg transition-all text-left cursor-pointer"
                              >
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                  {cite.category}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="truncate max-w-[170px]">{cite.section}</span>
                                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 ml-0.5">
                                  p.{cite.pageNumber}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Bar (Copy, Like, Dislike, Report) */}
                      <div className="pt-2 flex items-center justify-between text-slate-400 text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="p-1.5 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleFeedback(msg.id, 'HELPFUL')}
                            className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                              feedbackGiven[msg.id] === 'HELPFUL'
                                ? 'text-blue-600 dark:text-blue-400 font-bold'
                                : 'hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                            title="Helpful response"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleFeedback(msg.id, 'UNHELPFUL')}
                            className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                              feedbackGiven[msg.id] === 'UNHELPFUL'
                                ? 'text-rose-600 dark:text-rose-400 font-bold'
                                : 'hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setReportingMessageId(msg.id)}
                            className="p-1.5 hover:text-amber-600 dark:hover:text-amber-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Report inaccurate policy or deadline"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[10px] text-slate-400">
                          UniAssist Grounded v2.1
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs mt-1">
                    {userRole === 'STUDENT' ? 'ST' : userRole === 'FACULTY' ? 'FC' : 'AD'}
                  </div>
                )}
              </div>
            ))}

            {/* Live Streaming Message Display */}
            {isStreaming && (
              <div className="flex gap-3.5 justify-start animate-in fade-in duration-100">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20 mt-1 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="max-w-[88%] sm:max-w-[82%] rounded-2xl rounded-bl-xs p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-relaxed shadow-xs">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-xs mb-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span>Verifying institutional regulations & synthesizing answer...</span>
                  </div>
                  <div className="prose-custom dark:text-slate-200">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {streamingContent}
                    </ReactMarkdown>
                  </div>
                  <div className="inline-block w-2 h-4 bg-blue-600 dark:bg-blue-400 animate-pulse ml-0.5 align-middle" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Dynamic Suggested Follow-ups Chips */}
      {messages.length > 0 && !isStreaming && followUps.length > 0 && (
        <div className="px-4 py-1.5 max-w-3xl mx-auto w-full flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
            Suggested:
          </span>
          {followUps.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(chip)}
              className="text-xs whitespace-nowrap bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <span>{chip}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      )}

      {/* Bottom Input Form Bar */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-slate-100/90 dark:bg-slate-850/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-inner">
            <textarea
              id="input-chat-message"
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about admissions, BSCS requirements, fees, exams, faculty, or campus rules..."
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 text-xs sm:text-sm px-3 py-2.5 resize-none focus:outline-none placeholder-slate-400 min-h-[42px] max-h-[160px] leading-relaxed"
            />

            {isStreaming ? (
              <button
                id="btn-stop-streaming"
                onClick={onStopStreaming}
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex-shrink-0 transition-colors shadow-md shadow-rose-600/20 cursor-pointer"
                title="Stop response"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                id="btn-send-message"
                onClick={handleSubmit}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-30 text-white flex-shrink-0 transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:cursor-not-allowed"
                title="Send inquiry"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Anti-Hallucination active • Unverified policies will never be fabricated</span>
            </div>
            <span className="hidden sm:inline">Press Enter to send, Shift+Enter for newline</span>
          </div>
        </div>
      </div>

      {/* Citation Detail Modal */}
      {selectedCitation && (
        <CitationModal
          citation={selectedCitation}
          onClose={() => setSelectedCitation(null)}
          onViewInKnowledgeBase={onViewInKnowledgeBase}
        />
      )}

      {/* Report Incorrect Policy Modal */}
      {reportingMessageId && (
        <ReportModal
          messageId={reportingMessageId}
          onClose={() => setReportingMessageId(null)}
          onSuccess={() => setReportingMessageId(null)}
        />
      )}

      {/* Share Transcript Modal */}
      {isShareOpen && (
        <ShareModal
          conversation={{
            id: activeConversationId || 'conv-current',
            userId: 'student-demo',
            title: conversationTitle || 'Academic Consultation',
            isPinned: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messageCount: messages.length,
          }}
          messages={messages}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </div>
  );
};
