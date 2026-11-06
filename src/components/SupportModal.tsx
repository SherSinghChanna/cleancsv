import React, { useState } from 'react';
import { TranslationStrings } from '../translations';
import { HelpCircle, Mail, MessageSquare, Send, CheckCircle2, X, ShieldCheck } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationStrings;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  t,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                ShineCSV Help & Support / सहायता
              </h3>
              <p className="text-[11px] text-slate-500">
                24/7 technical assistance for file cleaning and account inquiries
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSent ? (
            <div className="py-8 text-center animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Message Sent Successfully!
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Thank you! Our support team will respond to your registered email shortly.
              </p>
            </div>
          ) : (
            <div>
              {/* Quick Contact Info */}
              <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/70">
                  <div className="flex items-center gap-2 font-bold text-indigo-900 mb-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Email Support</span>
                  </div>
                  <div className="text-[11px] text-indigo-700 font-mono">support@shinecsv.io</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Average reply: &lt; 15 mins</div>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/70">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Privacy Guarantee</span>
                  </div>
                  <div className="text-[11px] text-emerald-700">100% Zero-Storage</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Files deleted right after clean</div>
                </div>
              </div>

              {/* Support Form */}
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Name (नाम)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Email (ईमेल)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    How can we help? (आपकी क्या मदद कर सकते हैं?)
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your issue or CSV question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
