import React, { useEffect } from 'react';
import { SUPPORTED_LANGUAGES, TranslationStrings } from '../translations';
import { Language } from '../types';
import { Check, X, Globe } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  t: TranslationStrings;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  t,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLanguageClick = (langCode: Language) => {
    onSelectLanguage(langCode);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Title and Close X Button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">Select Language / भाषा चुनें</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            title="Close"
            aria-label="Close language selector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Options List */}
        <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isCurrent = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageClick(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-50 text-indigo-950 ring-1 ring-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl shrink-0 leading-none" role="img" aria-label={lang.label}>
                    {lang.flag}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{lang.label}</span>
                    <span className="text-xs text-slate-500">{lang.nativeLabel}</span>
                  </div>
                </div>

                {isCurrent && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info & close button */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center mb-2.5">
            {t.otherLanguagesNotice}
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
