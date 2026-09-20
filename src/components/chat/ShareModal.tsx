/**
 * UniAssist AI — Share Conversation Modal
 * Export conversation transcript to Markdown or copyable link.
 */

import React, { useState } from 'react';
import { X, Copy, Check, Share2, Download } from 'lucide-react';
import { ChatMessage, Conversation } from '../../types/index.ts';

interface ShareModalProps {
  conversation: Conversation | null;
  messages: ChatMessage[];
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  conversation,
  messages,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  if (!conversation) return null;

  const shareUrl = `${window.location.origin}/chat/${conversation.id}`;

  const formatMarkdown = () => {
    let md = `# UniAssist AI — ${conversation.title}\n`;
    md += `*Academic Year 2026-2027 • Generated on ${new Date().toLocaleDateString()}*\n\n---\n\n`;

    messages.forEach((m) => {
      const speaker = m.role === 'user' ? '### 👤 Student Inquiry' : '### 🎓 UniAssist AI Assistant';
      md += `${speaker}\n\n${m.content}\n\n`;
      if (m.citations && m.citations.length > 0) {
        md += `**Authoritative Citations:**\n`;
        m.citations.forEach((c) => {
          md += `- *${c.documentTitle}* (Page ${c.pageNumber}, ${c.section})\n`;
        });
        md += '\n';
      }
      md += '---\n\n';
    });

    return md;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(formatMarkdown());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([formatMarkdown()], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Share2 className="w-5 h-5" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              Share & Export Conversation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Academic Share Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg font-medium"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg font-medium border border-slate-200 dark:border-slate-700"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? 'Markdown Copied' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg font-medium border border-slate-200 dark:border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
