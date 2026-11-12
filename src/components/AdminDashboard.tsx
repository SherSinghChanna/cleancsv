import React, { useState, useEffect } from 'react';
import { TranslationStrings } from '../translations';
import { Sale, AppUser, CleanedFile } from '../types';
import { supabase } from '../lib/supabase';
import { 
  Lock, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Search, 
  LogOut, 
  Plus, 
  CheckCircle2, 
  ArrowUpRight, 
  Download, 
  ArrowLeft,
  FileSpreadsheet,
  Activity,
  ShieldCheck,
  Crown
} from 'lucide-react';

const SOLE_ADMIN_EMAIL = 'shersinghchanna0@gmail.com';

interface AdminDashboardProps {
  t: TranslationStrings;
  isAdminLoggedIn: boolean;
  onLoginAdmin: () => void;
  onLogoutAdmin: () => void;
  onReturnToHome?: () => void;
  sales: Sale[];
  onAddSale: (sale: Sale) => void;
  users: AppUser[];
  onUpdateUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  cleanedFilesHistory: CleanedFile[];
  totalCleanedFiles: number;
  onAdminUpgradeEmail?: (targetEmail: string, targetPlan: 'BASIC' | 'PRO' | 'YEARLY_PRO' | 'BUSINESS') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  t,
  isAdminLoggedIn,
  onLoginAdmin,
  onLogoutAdmin,
  onReturnToHome,
  sales,
  onAddSale,
  users,
  onUpdateUsers,
  cleanedFilesHistory,
  totalCleanedFiles,
  onAdminUpgradeEmail,
}) => {
  const [adminUsername, setAdminUsername] = useState(SOLE_ADMIN_EMAIL);
  const [adminPassword, setAdminPassword] = useState('QwertyuiopSarbSher@1310');
  const [loginError, setLoginError] = useState('');

  // किसी भी ईमेल या खुद को तुरंत अपग्रेड करने के लिए स्टेट
  const [quickUpgradeEmail, setQuickUpgradeEmail] = useState('');
  const [quickUpgradePlan, setQuickUpgradePlan] = useState<'BASIC' | 'PRO' | 'YEARLY_PRO' | 'BUSINESS'>('PRO');

  const [liveClock, setLiveClock] = useState<string>(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedAdminSession = localStorage.getItem('cleancsv_admin_logged_in');
    if (savedAdminSession === 'true' && !isAdminLoggedIn) {
      onLoginAdmin();
    }
  }, [isAdminLoggedIn, onLoginAdmin]);

  const [activeTab, setActiveTab] = useState<'sales' | 'operations'>('sales');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserType, setNewUserType] = useState<'Basic' | 'Premium'>('Premium');

  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [newSalePlan, setNewSalePlan] = useState<'PRO' | 'YEARLY_PRO' | 'BUSINESS'>('PRO');
  const [newSaleUser, setNewSaleUser] = useState('');
  const [newSaleFileName, setNewSaleFileName] = useState('');
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = adminUsername.trim().toLowerCase();
    const enteredPass = adminPassword.trim();
    const validPassword = (import.meta.env.VITE_ADMIN_PASSWORD || 'QwertyuiopSarbSher@1310').trim();

    if (cleanUser === SOLE_ADMIN_EMAIL && enteredPass === validPassword) {
      setLoginError('');
      localStorage.setItem('cleancsv_admin_logged_in', 'true');
      onLoginAdmin();
    } else {
      setLoginError('Access Denied: Only shersinghchanna0@gmail.com is authorized as Admin.');
    }
  };

  const handleLogoutWithStorage = () => {
    localStorage.removeItem('cleancsv_admin_logged_in');
    onLogoutAdmin();
  };

  const handleToggleUserStatus = (userId: string) => {
    onUpdateUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    }));
  };

  // किसी भी यूज़र या खुद का प्लान बदलने का मास्टर फ़ंक्शन (Local + Supabase दोनों में)
  const applyPlanToUserEmail = async (emailInput: string, planId: 'BASIC' | 'PRO' | 'YEARLY_PRO' | 'BUSINESS') => {
    const cleanTarget = emailInput.trim().toLowerCase();
    if (!cleanTarget) return;

    const mappedUserType: 'Basic' | 'Premium' = planId === 'BASIC' ? 'Basic' : 'Premium';

    // 1. Users लिस्ट में अपडेट करें (अगर यूज़र लिस्ट में नहीं है तो जोड़ दें)
    onUpdateUsers((prev) => {
      const exists = prev.some((u) => u.email.trim().toLowerCase() === cleanTarget);
      if (exists) {
        return prev.map((u) =>
          u.email.trim().toLowerCase() === cleanTarget
            ? { ...u, userType: cleanTarget === SOLE_ADMIN_EMAIL ? 'Admin' : mappedUserType }
            : u
        );
      }
      const newEntry: AppUser = {
        id: `u_${Date.now()}`,
        name: cleanTarget.split('@')[0],
        email: cleanTarget,
        userType: cleanTarget === SOLE_ADMIN_EMAIL ? 'Admin' : mappedUserType,
        signUpDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      };
      return [newEntry, ...prev];
    });

    // 2. App.tsx और LocalStorage के ज़रिए उस ईमेल के लिए प्लान सेव करें
    if (onAdminUpgradeEmail) {
      onAdminUpgradeEmail(cleanTarget, planId);
    }

    // 3. Supabase के profiles टेबल में भी अपडेट करने की कोशिश करें
    try {
      await supabase
        .from('profiles')
        .update({ plan: planId })
        .ilike('email', cleanTarget);
    } catch {
      // ignore if offline
    }

    setActionSuccessNotice(`Upgraded ${cleanTarget} to ${planId} plan immediately!`);
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const handleChangeUserPlan = (user: AppUser, selectedPlanId: 'BASIC' | 'PRO' | 'YEARLY_PRO' | 'BUSINESS') => {
    applyPlanToUserEmail(user.email, selectedPlanId);
  };

  const handleQuickUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUpgradeEmail.trim()) return;
    applyPlanToUserEmail(quickUpgradeEmail, quickUpgradePlan);
    setQuickUpgradeEmail('');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const cleanMail = newUserEmail.trim().toLowerCase();
    const newUser: AppUser = {
      id: `u_${Date.now()}`,
      name: newUserName.trim(),
      email: cleanMail,
      userType: cleanMail === SOLE_ADMIN_EMAIL ? 'Admin' : newUserType,
      signUpDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    onUpdateUsers(prev => [newUser, ...prev]);
    if (onAdminUpgradeEmail) {
      onAdminUpgradeEmail(cleanMail, newUserType === 'Premium' ? 'PRO' : 'BASIC');
    }
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
    setActionSuccessNotice(`Customer ${newUser.name} (${newUser.email}) added with ${newUserType} access!`);
    setTimeout(() => setActionSuccessNotice(null), 3000);
  };

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    const price = newSalePlan === 'PRO' ? 1.99 : newSalePlan === 'YEARLY_PRO' ? 15 : 19;
    const userEmail = newSaleUser.trim() || 'customer@cleancsv.online';
    const fileName = newSaleFileName.trim() || `${newSalePlan} Subscription ($${price})`;

    const newSaleItem: Sale = {
      id: `sale_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      fileName,
      salesType: 'Premium',
      price,
      user: userEmail,
    };

    onAddSale(newSaleItem);
    applyPlanToUserEmail(userEmail, newSalePlan);
    setShowAddSaleModal(false);
    setNewSaleUser('');
    setNewSaleFileName('');
  };

  const filteredUsers = users.filter(user => {
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.userType.toLowerCase().includes(q)
    );
  });

  const totalEarnings = sales.reduce((acc, curr) => acc + curr.price, 0);
  const totalSales = sales.length;
  const totalCustomers = users.length;

  // चेक करें कि किसी ईमेल का कौन-सा सटीक प्लान सेव है
  const getSavedPlanForEmail = (email: string, fallbackType: string): 'BASIC' | 'PRO' | 'YEARLY_PRO' | 'BUSINESS' => {
    try {
      const mapRaw = localStorage.getItem('cleancsv_admin_plan_overrides');
      if (mapRaw) {
        const map = JSON.parse(mapRaw);
        const found = map[email.trim().toLowerCase()];
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return fallbackType === 'Premium' || fallbackType === 'Admin' ? 'PRO' : 'BASIC';
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          
          <div className="relative inline-block mb-3">
            <img
              src="/assets/aistudio/sher-singh.jpg_ff06f769.jpg"
              alt="Sher Singh"
              className="w-20 h-20 rounded-full object-cover mx-auto border-3 border-indigo-600 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 rounded-full p-1 shadow-xs border border-white">
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-[10px] font-extrabold tracking-wider uppercase mb-2">
            👑 SOLE OWNER & ADMIN
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-1">
            Sher Singh · Admin Portal
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Authorized exclusively for {SOLE_ADMIN_EMAIL}
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5 text-xs text-left">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Authorized Admin Email
              </label>
              <input
                type="email"
                placeholder="shersinghchanna0@gmail.com"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Admin Security Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer text-xs"
            >
              Sign In as Sher Singh (Admin)
            </button>
          </form>

          {onReturnToHome && (
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onReturnToHome}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to CSV Cleaner</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6fb] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/sher-singh.jpg_ff06f769.jpg"
              alt="Sher Singh"
              className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Sher Singh's Master Admin Console
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase border border-amber-300">
                  👑 SOLE OWNER ({SOLE_ADMIN_EMAIL})
                </span>
                
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE · {liveClock}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Full Plan & User Upgrade Control (Self & Any Customer)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {onReturnToHome && (
              <button
                onClick={onReturnToHome}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Return to CSV Cleaner</span>
              </button>
            )}

            <button
              onClick={() => setShowAddSaleModal(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Live Sale</span>
            </button>

            <button
              onClick={() => {
                const csvData = "Date,User,SalesType,Amount,FileOrPlan\n" + sales.map(s => `"${s.date}","${s.user}","${s.salesType}",$${s.price.toFixed(2)},"${s.fileName}"`).join('\n');
                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cleancsv_sales_ledger_${Date.now()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Ledger</span>
            </button>

            <button
              onClick={handleLogoutWithStorage}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>

        {/* Action Notice */}
        {actionSuccessNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessNotice}</span>
          </div>
        )}

        {/* 🟢 NEW: Instant Upgrade Any User or Self Bar */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md border border-indigo-500/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold">
                  Instant Plan Upgrade (Self or Any Customer Email)
                </h3>
                <p className="text-xs text-slate-300">
                  Enter any user email (e.g. sher13101993@gmail.com) or click &quot;Upgrade My Admin Account&quot; to assign any of the 4 plans for free.
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickUpgradeSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="email"
                placeholder="Enter user email (e.g. sher13101993@gmail.com)"
                value={quickUpgradeEmail}
                onChange={(e) => setQuickUpgradeEmail(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs font-mono focus:outline-hidden focus:border-emerald-400 min-w-[240px]"
              />
              <select
                value={quickUpgradePlan}
                onChange={(e) => setQuickUpgradePlan(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-white/20 text-white text-xs font-bold cursor-pointer"
              >
                <option value="BASIC">Free Basic ($0)</option>
                <option value="PRO">Unlimited Pro ($1.99/mo)</option>
                <option value="YEARLY_PRO">Yearly Pro ($15/yr)</option>
                <option value="BUSINESS">Business Team ($19/mo)</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap"
              >
                Upgrade User Now
              </button>
              <button
                type="button"
                onClick={() => applyPlanToUserEmail(SOLE_ADMIN_EMAIL, quickUpgradePlan)}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap"
              >
                Apply to Self
              </button>
            </form>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">{t.totalEarnings}:</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                ${totalEarnings.toFixed(2)}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live revenue sum ({sales.length} orders)</span>
              </div>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">{t.totalSales}:</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {totalSales}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Real orders processed</span>
              </div>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">{t.totalCustomers}:</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {totalCustomers}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                <Users className="w-3.5 h-3.5" />
                <span>Active registered accounts</span>
              </div>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Live Files Cleaned:</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {totalCleanedFiles}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-600">
                <Activity className="w-3.5 h-3.5" />
                <span>{cleanedFilesHistory.length} files in session log</span>
              </div>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ALL USERS LIST */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                {t.allUsersList} ({filteredUsers.length})
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Select any plan from the dropdown to immediately upgrade or change any user&apos;s plan
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.searchUsers}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-52 sm:w-64"
                />
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-3.5">{t.userName}</th>
                  <th className="py-3 px-3.5">{t.email}</th>
                  <th className="py-3 px-3.5">Assign Plan (4 Tiers)</th>
                  <th className="py-3 px-3.5">{t.signUpDate}</th>
                  <th className="py-3 px-3.5">{t.accountStatus}</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const isRowAdmin = user.email.trim().toLowerCase() === SOLE_ADMIN_EMAIL;
                  const currentSavedPlan = getSavedPlanForEmail(user.email, user.userType);

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {isRowAdmin && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900">
                            👑 Admin
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <select
                          value={currentSavedPlan}
                          onChange={(e) => handleChangeUserPlan(user, e.target.value as any)}
                          className="px-2.5 py-1 text-[11px] rounded-lg border border-slate-300 bg-white font-bold text-slate-800 cursor-pointer focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="BASIC">Free Basic ($0)</option>
                          <option value="PRO">Unlimited Pro ($1.99/mo)</option>
                          <option value="YEARLY_PRO">Yearly Pro ($15/yr)</option>
                          <option value="BUSINESS">Business Team ($19/mo)</option>
                        </select>
                      </td>
                      <td className="py-3 px-3.5 text-slate-500 font-mono tabular-nums whitespace-nowrap">
                        {user.signUpDate}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        {!isRowAdmin && (
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`text-[11px] font-semibold underline cursor-pointer ${
                              user.status === 'Active' ? 'text-slate-500 hover:text-rose-600' : 'text-emerald-600 hover:text-emerald-700'
                            }`}
                          >
                            {user.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Record Live Sale Modal (Updated with your 4 Plans) */}
      {showAddSaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Record Live Sale & Upgrade User</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select a plan to record revenue and automatically upgrade that customer&apos;s email.
            </p>

            <form onSubmit={handleCreateSale} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSalePlan('PRO')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      newSalePlan === 'PRO' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div>UNLIMITED PRO</div>
                    <div className="text-[11px] text-emerald-600">$1.99 / mo</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSalePlan('YEARLY_PRO')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      newSalePlan === 'YEARLY_PRO' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div>YEARLY PRO</div>
                    <div className="text-[11px] text-emerald-600">$15 / yr</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSalePlan('BUSINESS')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      newSalePlan === 'BUSINESS' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div>BUSINESS</div>
                    <div className="text-[11px] text-emerald-600">$19 / mo</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  value={newSaleUser}
                  onChange={(e) => setNewSaleUser(e.target.value)}
                  placeholder="client@company.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference / Note</label>
                <input
                  type="text"
                  value={newSaleFileName}
                  onChange={(e) => setNewSaleFileName(e.target.value)}
                  placeholder="e.g. PayPal Payment"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Live Amount to Add:</span>
                <span className="font-extrabold text-emerald-600 text-sm font-mono">
                  {newSalePlan === 'PRO' ? '$1.99' : newSalePlan === 'YEARLY_PRO' ? '$15.00' : '$19.00'}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSaleModal(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  Record & Upgrade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add New Customer</h3>
            
            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">User Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="maya.chen@enterprise.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Tier</label>
                <select
                  value={newUserType}
                  onChange={(e) => setNewUserType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  <option value="Basic">Free Basic ($0 - Unlimited CSV)</option>
                  <option value="Premium">Unlimited Pro / Business</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};