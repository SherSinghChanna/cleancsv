import React, { useState, useEffect } from 'react';
import { NavView, Language, CustomerProfileData, Sale, AppUser, CleanedFile } from './types';
import { translations } from './translations';
import { Navbar } from './components/Navbar';
import { HomeCleaner } from './components/HomeCleaner';
import { CustomerProfile } from './components/CustomerProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthSplitScreen } from './components/AuthSplitScreen';
import { LanguageModal } from './components/LanguageModal';
import { SupportModal } from './components/SupportModal';
import { supabase } from './lib/supabase';

const INITIAL_PROFILE: CustomerProfileData = {
  name: '',
  email: '',
  avatar: '', 
  role: 'Customer',
  plan: 'BASIC',
  expiryDate: 'N/A',
  autoRenewal: false,
  totalCleanedFiles: 0,
  paymentMethod: {
    brand: '',
    last4: '',
    exp: '',
  },
  monthlyStats: [
    { month: 'Jan', count: 0 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 0 },
    { month: 'Apr', count: 0 },
    { month: 'May', count: 0 },
    { month: 'Jun', count: 0 },
    { month: 'Jul', count: 0 },
    { month: 'Aug', count: 0 },
    { month: 'Sep', count: 0 },
    { month: 'Oct', count: 0 },
  ],
};

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Free files used counter
  const [freeFilesUsed, setFreeFilesUsed] = useState(() => {
    const saved = localStorage.getItem('cleancsv_freeFilesUsed');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('cleancsv_admin_auth') === 'true';
  }); 
  
  const [profile, setProfile] = useState<CustomerProfileData>(INITIAL_PROFILE);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [cleanedFilesHistory, setCleanedFilesHistory] = useState<CleanedFile[]>([]);

  const t = translations[currentLanguage];

  // 1. Supabase se Sales aur Users load karein
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        // Sales Ledger load karein
        const { data: salesData } = await supabase
          .from('sales_ledger')
          .select('*')
          .order('created_at', { ascending: false });

        if (salesData && salesData.length > 0) {
          const mappedSales: Sale[] = salesData.map((s: any) => ({
            id: s.id,
            date: new Date(s.created_at).toISOString().split('T')[0],
            fileName: s.plan_name,
            salesType: s.sales_type || 'Basic',
            price: Number(s.amount) || 0,
            user: s.user_email,
          }));
          setSales(mappedSales);
        }

        // Profiles / Users load karein
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesData && profilesData.length > 0) {
          const mappedUsers: AppUser[] = profilesData.map((p: any) => ({
            id: p.id,
            name: p.name || 'User',
            email: p.email,
            userType: p.role === 'Admin' ? 'Admin' : (p.plan === 'PRO' ? 'Premium' : 'Basic'),
            signUpDate: new Date(p.created_at).toISOString().split('T')[0],
            status: 'Active',
          }));
          setUsers(mappedUsers);
        }
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  // Active Logged In User & Admin Sync
  const loggedInAppUser = users.find(u => u.email.toLowerCase() === profile.email.toLowerCase());
  const isUserPro = Boolean(
    profile.plan === 'PRO' ||
    profile.role === 'Admin' ||
    loggedInAppUser?.userType === 'Premium' ||
    loggedInAppUser?.userType === 'Admin' ||
    profile.email.toLowerCase() === 'shersinghchanna0@gmail.com' ||
    profile.email.toLowerCase() === 'cleancsvglobal@gmail.com'
  );

  const currentUserData = {
    ...profile,
    userType: isUserPro ? 'Premium' : (loggedInAppUser?.userType || 'Basic'),
    is_pro: isUserPro,
    subscription_plan: isUserPro ? 'PRO' : 'BASIC',
    plan: isUserPro ? 'PRO' : profile.plan,
  };

  const handleIncrementUsage = () => {
    if (isUserPro) {
      return;
    }

    if (!isLoggedIn && freeFilesUsed >= 3) {
      setCurrentView('auth');
      return;
    }

    setFreeFilesUsed((prev) => {
      const newCount = prev + 1;
      localStorage.setItem('cleancsv_freeFilesUsed', newCount.toString());
      return newCount;
    });
  };

  const handleFileCleaned = (file: CleanedFile) => {
    setCleanedFilesHistory((prev) => [file, ...prev]);
    setProfile((prev) => {
      const updatedCount = prev.totalCleanedFiles + 1;
      const updatedMonthly = prev.monthlyStats.map((item) =>
        item.month === 'Oct' || item.month === 'Sep'
          ? { ...item, count: item.count + 1 }
          : item
      );
      return {
        ...prev,
        totalCleanedFiles: updatedCount,
        monthlyStats: updatedMonthly,
      };
    });
  };

  // ✅ Customer Purchase: Supabase me permanent insert
  const handlePlanPurchased = async (planName: any, price: number) => {
    const isProPlan = planName !== 'BASIC';
    const userEmail = profile.email || 'customer@example.com';
    const salesType = isProPlan ? 'Premium' : 'Basic';
    const fileName = `${planName} Subscription ($${price})`;

    const newSale: Sale = {
      id: `s_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      fileName,
      salesType,
      price,
      user: userEmail,
    };
    setSales((prev) => [newSale, ...prev]);

    // Supabase DB me save
    try {
      await supabase.from('sales_ledger').insert([{
        user_email: userEmail,
        plan_name: fileName,
        amount: price,
        sales_type: salesType
      }]);
    } catch (e) {
      console.error('Supabase sales insert error:', e);
    }

    if (isProPlan) {
      setProfile((prev) => ({
        ...prev,
        plan: 'PRO',
      }));
      setUsers((prev) => prev.map(u => {
        if (u.email.toLowerCase() === profile.email.toLowerCase()) {
          return { ...u, userType: 'Premium' };
        }
        return u;
      }));

      // Supabase profiles update
      try {
        await supabase
          .from('profiles')
          .update({ plan: 'PRO' })
          .eq('email', userEmail.toLowerCase());
      } catch (e) {
        console.error('Supabase profile update error:', e);
      }
    }
  };

  // ✅ Admin Dashboard se Live Sale Record: Supabase me insert
  const handleAddLiveSale = async (newSale: Sale) => {
    setSales((prev) => [newSale, ...prev]);

    try {
      await supabase.from('sales_ledger').insert([{
        user_email: newSale.user,
        plan_name: newSale.fileName,
        amount: newSale.price,
        sales_type: newSale.salesType
      }]);
    } catch (e) {
      console.error('Supabase live sale insert error:', e);
    }
  };

  const handleUpdateProfile = (updated: Partial<CustomerProfileData>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Login handler
  const handleLoginSuccess = (name: string, email: string) => {
    setIsLoggedIn(true);
    
    const cleanEmail = email.trim().toLowerCase();
    const isOwner = cleanEmail === 'cleancsvglobal@gmail.com' || cleanEmail === 'shersinghchanna0@gmail.com';

    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    const existingPlan = (isOwner || existing?.userType === 'Premium') ? 'PRO' : 'BASIC';

    setProfile((prev) => ({
      ...prev,
      name: name || (isOwner ? 'Sher Singh' : 'Customer'),
      email: email,
      role: isOwner ? 'Admin' : 'Customer',
      plan: existingPlan,
    }));

    setUsers((prev) => {
      if (prev.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return prev;
      }
      return [
        {
          id: `u_${Date.now()}`,
          name: name || (isOwner ? 'Sher Singh' : 'Customer'),
          email,
          userType: isOwner ? 'Premium' : 'Basic',
          signUpDate: new Date().toISOString().split('T')[0],
          status: 'Active',
        },
        ...prev,
      ];
    });
    
    setCurrentView('home'); 
  };

  const handleAdminDirectLogin = () => {
    setIsLoggedIn(true);
    setProfile((prev) => ({
      ...prev,
      name: 'Sher Singh',
      email: 'shersinghchanna0@gmail.com',
      role: 'Admin',
      plan: 'PRO',
    }));
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('cleancsv_admin_auth');
    setProfile(INITIAL_PROFILE); 
    setFreeFilesUsed(0);
    localStorage.removeItem('cleancsv_freeFilesUsed');
    setCurrentView('home');
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#f5f7fb] text-slate-900 font-sans selection:bg-emerald-500 selection:text-white"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'admin') {
            setCurrentView('admin');
          } else {
            setCurrentView(view);
          }
        }}
        currentLanguage={currentLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
        isLoggedIn={isLoggedIn}
        onToggleLogin={handleLogout}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={() => {
          setIsAdminLoggedIn(false);
          sessionStorage.removeItem('cleancsv_admin_auth');
        }}
        userName={profile.name}
        userAvatar={profile.avatar}
        t={t}
      />

      <div className="flex-1">
        {currentView === 'home' && (
          <HomeCleaner
            t={t}
            freeFilesUsed={freeFilesUsed}
            onIncrementUsage={handleIncrementUsage}
            onFileCleaned={handleFileCleaned}
            onNavigateToPricing={() => setCurrentView(isLoggedIn ? 'profile' : 'auth')}
            onNavigateToAdmin={() => setCurrentView('admin')}
            onOpenSupportModal={() => setIsSupportModalOpen(true)}
            onSelectLanguage={setCurrentLanguage}
            currentUser={currentUserData}
          />
        )}

        {currentView === 'profile' && isLoggedIn && (
          <CustomerProfile
            t={t}
            profile={currentUserData}
            onUpdateProfile={handleUpdateProfile}
            onPlanPurchased={handlePlanPurchased}
            onLogout={handleLogout}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            t={t}
            isAdminLoggedIn={isAdminLoggedIn}
            onLoginAdmin={() => {
              setIsAdminLoggedIn(true);
              sessionStorage.setItem('cleancsv_admin_auth', 'true');
            }}
            onLogoutAdmin={() => {
              setIsAdminLoggedIn(false);
              sessionStorage.removeItem('cleancsv_admin_auth');
              setCurrentView('home');
            }}
            onReturnToHome={() => setCurrentView('home')}
            sales={sales}
            onAddSale={handleAddLiveSale}
            users={users}
            onUpdateUsers={setUsers}
            cleanedFilesHistory={cleanedFilesHistory}
            totalCleanedFiles={profile.totalCleanedFiles}
          />
        )}

        {currentView === 'auth' && (
          <AuthSplitScreen
            t={t}
            onLoginSuccess={handleLoginSuccess}
            onAdminLoginSuccess={handleAdminDirectLogin}
          />
        )}
      </div>

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        t={t}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        t={t}
      />
    </div>
  );
}