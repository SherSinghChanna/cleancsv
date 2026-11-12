import React, { useState, useRef, useEffect } from 'react';
import { NavView, Language } from '../types';
import { TranslationStrings, SUPPORTED_LANGUAGES } from '../translations';
import { 
  Sparkles, 
  Globe, 
  ChevronDown, 
  HelpCircle, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  FileSpreadsheet, 
  Crown,
  CreditCard,
  Share2
} from 'lucide-react';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  currentLanguage: Language;
  onOpenLanguageModal: () => void;
  onOpenSupportModal: () => void;
  isLoggedIn: boolean;
  onToggleLogin: () => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  isPro?: boolean;
  t: TranslationStrings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentLanguage,
  onOpenLanguageModal,
  onOpenSupportModal,
  isLoggedIn,
  onToggleLogin,
  isAdminLoggedIn,
  onLogoutAdmin,
  userName = 'User',
  userEmail = 'support@cleancsv.online',
  userAvatar,
  isPro = false,
  t,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: NavView) => {
    onNavigate(view);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  // 🟢 असली एडमिन चेक (सिर्फ असली ओनर ईमेल पर ही एडमिन दिखेगा)
  const cleanEmail = (userEmail || '').trim().toLowerCase();
  const isAdmin = Boolean(
    isAdminLoggedIn || 
    cleanEmail === 'shersinghchanna0@gmail.com' || 
    cleanEmail === 'support@cleancsv.online'
  );

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'CleanCSV',
          text: 'Check out CleanCSV - Clean, format, and fix messy CSV datasets directly in your browser with zero data logging.',
          url: 'https://cleancsv.online',
        });
      } else {
        await navigator.clipboard.writeText('https://cleancsv.online');
        alert('Website link copied to clipboard! (https://cleancsv.online)');
      }
    } catch (err) {
      console.log('Share dismissed or failed:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          <div className="flex items-center gap-6 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 group text-left cursor-pointer shrink-0"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-slate-900 to-indigo-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-indigo-950 transition-colors whitespace-nowrap">
                CleanCSV
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  currentView === 'home'
                    ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t.homeTab}
              </button>

              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => handleNavClick('profile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'profile'
                      ? 'text-indigo-700 bg-indigo-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t.pricing}
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            
            <button
              type="button"
              onClick={onOpenLanguageModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer shrink-0"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs">{currentLangObj.flag}</span>
              <span className="hidden lg:inline">{currentLangObj.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer shrink-0"
              title="Share this website"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden lg:inline">Share</span>
            </button>

            {isLoggedIn ? (
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold transition-all border border-slate-200/80 shadow-2xs cursor-pointer"
                >
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={userName}
                      className="w-6 h-6 rounded-full object-cover border border-slate-300 shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-bold max-w-[100px] truncate sm:max-w-none">{userName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        {userAvatar ? (
                          <img 
                            src={userAvatar} 
                            alt={userName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400 shadow-2xs shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold shrink-0">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span className="truncate">{userName}</span>
                            {isPro && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate">
                            {userEmail}
                          </div>
                          <div className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-bold rounded-full uppercase tracking-wider">
                            {isPro ? 'PRO · Active' : 'BASIC · Active'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-1 space-y-0.5 text-xs text-slate-700">
                      <button
                        type="button"
                        onClick={() => handleNavClick('home')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          currentView === 'home' ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50'
                        }`}
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{t.homeTab}</div>
                          <div className="text-[10px] text-slate-400 font-normal">Fast, zero-retention CSV tool</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('profile')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          currentView === 'profile' ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{t.profileTab} & {t.upgradePlans}</div>
                          <div className="text-[10px] text-slate-400 font-normal">Subscription, billing & metrics</div>
                        </div>
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleNavClick('admin')}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                            currentView === 'admin' ? 'bg-indigo-50 font-bold text-indigo-900' : 'hover:bg-slate-50'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900">{t.adminTab}</span>
                              <span className="text-[9px] font-extrabold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">Owner Only</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal">Private revenue & users console</div>
                          </div>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenSupportModal();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{t.support}</div>
                          <div className="text-[10px] text-slate-400 font-normal">24/7 Priority SLA assistance</div>
                        </div>
                      </button>
                    </div>

                    <div className="p-1 pt-1.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onToggleLogin();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>{t.logout}</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleNavClick('auth')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t.login}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('auth')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-all whitespace-nowrap cursor-pointer"
                >
                  {t.getStarted}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};