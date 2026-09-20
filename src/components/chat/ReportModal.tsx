/**
 * UniAssist AI — Report Incorrect Answer Modal
 * Submits audit flagging for human review by university administrators.
 */

import React, { useState } from 'react';
import { X, AlertTriangle, Send, Check } from 'lucide-react';
import { api } from '../../lib/api.ts';

interface ReportModalProps {
  messageId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  messageId,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('Outdated Policy or Rules');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!messageId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitFeedback(messageId, 'UNHELPFUL', `[REPORT: ${reason}] ${details}`);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              Report Inaccuracy or Outdated Policy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Report Submitted for Review
            </h4>
            <p className="text-xs text-slate-500">
              Thank you for keeping our university knowledge base accurate. The registrar office has been notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Issue Category
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Outdated Policy or Rules">Outdated Policy or Rules</option>
                <option value="Incorrect Fee Amount">Incorrect Fee or Payment Schedule</option>
                <option value="Wrong Deadline or Date">Wrong Deadline or Exam Date</option>
                <option value="Unsupported Speculation">Unsupported Claim / Possible Hallucination</option>
                <option value="Other Discrepancy">Other Discrepancy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Correction Details / Additional Context
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Specify the correct rule or document reference..."
                rows={4}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs px-3.5 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !details.trim()}
                className="flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
