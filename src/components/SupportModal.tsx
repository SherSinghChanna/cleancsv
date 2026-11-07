import React, { useState } from 'react';
import { X, Send, HelpCircle, Mail, ShieldCheck } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  t?: any;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, t }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Submit logic or mailto
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  // Translations with fallbacks based on selected language
  const title = t?.supportTitle || "CleanCSV Help & Support";
  const subtitle = t?.supportSubtitle || "24/7 technical assistance for file cleaning and account inquiries";
  const emailSupportText = t?.emailSupport || "Email Support";
  const privacyGuaranteeText = t?.privacyGuarantee || "Privacy Guarantee";
  const privacySubtext = t?.privacySubtext || "100% Zero-Storage. Files deleted right after clean";
  const nameLabel = t?.nameLabel || "Your Name";
  const emailLabel = t?.emailLabel || "Your Email";
  const messageLabel = t?.messageLabel || "How can we help?";
  const messagePlaceholder = t?.messagePlaceholder || "Describe your issue or CSV question...";
  const cancelButton = t?.cancel || "Cancel";
  const sendButton = t?.sendMessage || "Send Message";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border border-slate-100 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-2 text-indigo-600 mb-1">
              <Mail className="w-4 h-4" />
              <span className="text-xs font-semibold">{emailSupportText}</span>
            </div>
            <p className="text-xs font-medium text-slate-700 truncate">support@cleancsv.online</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Average reply: &lt; 15 mins</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-2 text-emerald-600 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold">{privacyGuaranteeText}</span>
            </div>
            <p className="text-xs font-medium text-slate-700">100% Zero-Storage</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{privacySubtext}</p>
          </div>
        </div>

        {/* Form */}
        {isSent ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              ✓
            </div>
            <h4 className="text-lg font-bold text-slate-800">Message Sent!</h4>
            <p className="text-xs text-slate-500">We'll get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {nameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {emailLabel}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {messageLabel}
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={messagePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {cancelButton}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : sendButton}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};