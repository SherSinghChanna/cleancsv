import React, { useState, useEffect } from 'react';
import { TranslationStrings } from '../translations';
import { Sale, AppUser, CleanedFile } from '../types';
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
  ShieldCheck
} from 'lucide-react';

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
}) => {
  const [adminUsername, setAdminUsername] = useState('shersinghchanna0@gmail.com');
  const [adminPassword, setAdminPassword] = useState('QwertyuiopSarbSher@1310');
  const [loginError, setLoginError] = useState('');

  const [liveClock, setLiveClock] = useState<string>(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ऑटो-लॉगिन चेक (पेज रिफ्रेश होने पर लॉगआउट रोकने के लिए)
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
  const [newSalePlan, setNewSalePlan] = useState<'DAY PASS' | 'MONTHLY PRO' | 'YEARLY PASS'>('MONTHLY PRO');
  const [newSaleUser, setNewSaleUser] = useState('');
  const [newSaleFileName, setNewSaleFileName] = useState('');
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = adminUsername.trim().toLowerCase();
    const enteredPass = adminPassword.trim();
    
    const validEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'shersinghchanna0@gmail.com').trim().toLowerCase();
    const validPassword = (import.meta.env.VITE_ADMIN_PASSWORD || 'QwertyuiopSarbSher@1310').trim();

    const isUserValid = (
      cleanUser === validEmail || 
      cleanUser === 'cleancsvglobal@gmail.com' ||
      cleanUser === 'shersinghchanna0@gmail.com' ||
      cleanUser === 'channa' || 
      cleanUser === 'admin'
    );

    if (isUserValid && enteredPass === validPassword) {
      setLoginError('');
      localStorage.setItem('cleancsv_admin_logged_in', 'true');
      onLoginAdmin();
    } else {
      setLoginError('Access Denied: Invalid Admin Identifier or Password.');
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

  const handleChangeUserPlan = (userId: string, newType: 'Basic' | 'Premium') => {
    onUpdateUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, userType: newType };
      }
      return u;
    }));
    setActionSuccessNotice(`User plan updated to ${newType}!`);
    setTimeout(() => setActionSuccessNotice(null), 3000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: AppUser = {
      id: `u_${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      userType: newUserType,
      signUpDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    onUpdateUsers(prev => [newUser, ...prev]);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
    setActionSuccessNotice(`Customer ${newUser.name} added live!`);
    setTimeout(() => setActionSuccessNotice(null), 3000);
  };

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    const price = newSalePlan === 'DAY PASS' ? 0.99 : newSalePlan === 'MONTHLY PRO' ? 1.99 : 9.99;
    const userEmail = newSaleUser.trim() || 'customer@cleancsv.io';
    const fileName = newSaleFileName.trim() || `${newSalePlan} Subscription`;

    const newSaleItem: Sale = {
      id: `sale_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      fileName,
      salesType: newSalePlan === 'DAY PASS' ? 'Basic' : 'Premium',
      price,
      user: userEmail,
    };

    onAddSale(newSaleItem);
    setShowAddSaleModal(false);
    setNewSaleUser('');
    setNewSaleFileName('');
    setActionSuccessNotice(`Live sale recorded: $${price} (${newSalePlan})!`);
    setTimeout(() => setActionSuccessNotice(null), 3500);
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
            Authorized administration console for Sher Singh
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5 text-xs text-left">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Authorized Admin Email / Username
              </label>
              <input
                type="text"
                placeholder="Enter admin ID or email"
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
                  👑 SOLE OWNER & ADMIN
                </span>
                
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE DATA FEED · {liveClock}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Owner: Sher Singh · Real-Time Dynamic Ledger
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

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Platform Traffic Status
                </h3>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Global CDN Active
                </span>
              </div>

              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Paywall Enforcement:</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">3 Free CSVs Allowed</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Free tier customers are automatically redirected to upgrade after 3 files.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">PayPal Gateway:</span>
                    <span className="text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md text-[10px]">Live Production</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Processed via instant client capture ($0.99, $1.99, $9.99).</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Data processed in browser memory (Zero Retention)
              </span>
              <span className="font-mono text-emerald-600 font-medium">{liveClock}</span>
            </div>
          </div>

          {/* Interactive Ledger */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('sales')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'sales' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t.recentSales} ({sales.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('operations')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'operations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Cleaned Files ({cleanedFilesHistory.length})
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {activeTab === 'sales' ? 'Real-time sales feed' : 'CSV engine real-time activity'}
                </span>
              </div>

              {activeTab === 'sales' && (
                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px]">
                        <th className="pb-2.5">Date</th>
                        <th className="pb-2.5">Plan / Order</th>
                        <th className="pb-2.5">Sales Type</th>
                        <th className="pb-2.5">Price</th>
                        <th className="pb-2.5">User</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {sale.date}
                          </td>
                          <td className="py-2.5 font-medium text-slate-900 font-mono text-[11px] whitespace-nowrap">
                            {sale.fileName}
                          </td>
                          <td className="py-2.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              sale.salesType === 'Premium' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {sale.salesType}
                            </span>
                          </td>
                          <td className="py-2.5 font-bold text-slate-900 font-mono tabular-nums whitespace-nowrap">
                            ${sale.price.toFixed(2)}
                          </td>
                          <td className="py-2.5 text-slate-500 text-[11px] whitespace-nowrap">
                            {sale.user}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'operations' && (
                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px]">
                        <th className="pb-2.5">Cleaned Time</th>
                        <th className="pb-2.5">File Name</th>
                        <th className="pb-2.5">Rows</th>
                        <th className="pb-2.5">Duplicates Removed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cleanedFilesHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {item.cleanedAt}
                          </td>
                          <td className="py-2.5 font-medium text-slate-900 font-mono text-[11px] whitespace-nowrap">
                            {item.name}
                          </td>
                          <td className="py-2.5 font-mono text-slate-700 text-[11px] whitespace-nowrap">
                            {item.stats.rowsProcessed.toLocaleString()} rows
                          </td>
                          <td className="py-2.5 font-mono text-emerald-600 font-semibold text-[11px] whitespace-nowrap">
                            -{item.stats.duplicatesRemoved} dupes
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live state linked to CSV engine & user subscriptions
              </span>
              <span className="text-emerald-600 font-semibold">100% Live Sync</span>
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
                Managed accounts and client profiles in CleanCSV
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
                  <th className="py-3 px-3.5">Change Plan Tier</th>
                  <th className="py-3 px-3.5">{t.signUpDate}</th>
                  <th className="py-3 px-3.5">{t.accountStatus}</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="py-3 px-3.5 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {user.userType === 'Admin' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700">
                          Admin
                        </span>
                      ) : (
                        <select
                          value={user.userType}
                          onChange={(e) => handleChangeUserPlan(user.id, e.target.value as any)}
                          className="px-2 py-1 text-[11px] rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 cursor-pointer focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="Basic">Basic (Free / 3 files)</option>
                          <option value="Premium">Premium (Unlimited Pro)</option>
                        </select>
                      )}
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
                      {user.userType !== 'Admin' && (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Record Live Sale Modal */}
      {showAddSaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Record Live Sale / Subscription</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter payment details to instantly update live earnings and sales ledger.
            </p>

            <form onSubmit={handleCreateSale} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSalePlan('DAY PASS')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      newSalePlan === 'DAY PASS' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div>DAY PASS</div>
                    <div className="text-[11px] text-emerald-600">$0.99 / 24h</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSalePlan('MONTHLY PRO')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      newSalePlan === 'MONTHLY PRO' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div>MONTHLY PRO</div>
                    <div className="text-[11px] text-emerald-600">$1.99 / mo</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSalePlan('YEARLY PASS')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      newSalePlan === 'YEARLY PASS' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div>YEARLY PASS</div>
                    <div className="text-[11px] text-emerald-600">$9.99 / yr</div>
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
                  placeholder="e.g. PayPal Payment #4928"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Live Amount to Add:</span>
                <span className="font-extrabold text-emerald-600 text-sm font-mono">
                  {newSalePlan === 'DAY PASS' ? '$0.99' : newSalePlan === 'MONTHLY PRO' ? '$1.99' : '$9.99'}
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
                  Record Live Transaction
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
                  <option value="Basic">Basic (Free / 3 files)</option>
                  <option value="Premium">Premium ($1.99/mo or $9.99/yr)</option>
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