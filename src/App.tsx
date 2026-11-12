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
  name: 'User',
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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('cleancsv_admin_logged_in') === 'true';
  });

  const [currentView, setCurrentView] = useState<NavView>(() => {
    const savedAdmin = localStorage.getItem('cleancsv_admin_logged_in') === 'true';
    const savedView = localStorage.getItem('cleancsv_current_view') as NavView;
    if (savedAdmin && savedView === 'admin') return 'admin';
    return savedView || 'home';
  });

  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const [freeFilesUsed, setFreeFilesUsed] = useState(() => {
    const saved = localStorage.getItem('cleancsv_freeFilesUsed');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedAdmin = localStorage.getItem('cleancsv_admin_logged_in') === 'true';
    const savedUser = localStorage.getItem('cleancsv_user_session');
    return savedAdmin || Boolean(savedUser);
  }); 

  const [profile, setProfile] = useState<CustomerProfileData>(() => {
    const savedProfile = localStorage.getItem('cleancsv_user_profile');
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_PROFILE;
  });

  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [cleanedFilesHistory, setCleanedFilesHistory] = useState<CleanedFile[]>([]);
  const [globalCleanedCount, setGlobalCleanedCount] = useState<number>(0);

  const t = translations[currentLanguage];

  const handleNavigateView = (view: any) => {
    const targetView = (view === 'cleaner' || view === 'home') ? 'home' : view;
    setCurrentView(targetView);
    localStorage.setItem('cleancsv_current_view', targetView);
  };

  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
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

        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesData && profilesData.length > 0) {
          const mappedUsers: AppUser[] = profilesData.map((p: any) => ({
            id: p.id,
            name: p.name || (p.email ? p.email.split('@')[0] : 'User'),
            email: p.email,
            userType: p.role === 'Admin' ? 'Admin' : (p.plan === 'PRO' ? 'Premium' : 'Basic'),
            signUpDate: new Date(p.created_at).toISOString().split('T')[0],
            status: 'Active',
          }));
          setUsers(mappedUsers);

          const totalFiles = profilesData.reduce((acc: number, cur: any) => acc + (Number(cur.cleaned_count) || 0), 0);
          setGlobalCleanedCount(totalFiles > 0 ? totalFiles : 3);
        }
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  // 🟢 असली एडमिन चेक (सिर्फ तभी जब ईमेल सच में एडमिन का हो)
  const isActualAdmin = Boolean(
    isAdminLoggedIn || 
    profile.email.toLowerCase() === 'shersinghchanna0@gmail.com' ||
    profile.email.toLowerCase() === 'support@cleancsv.online'
  );

  const isUserPro = Boolean(
    isActualAdmin ||
    profile.plan === 'PRO' ||
    profile.role === 'Admin' ||
    profile.subscription_plan === 'PRO'
  );

  const currentUserData = {
    ...profile,
    userType: isUserPro ? 'Premium' : 'Basic',
    is_pro: isUserPro,
    subscription_plan: isUserPro ? 'PRO' : 'BASIC',
    plan: isUserPro ? 'PRO' : profile.plan,
  };

  const handleIncrementUsage = () => {
    if (isUserPro) {
      return;
    }

    if (!isLoggedIn && freeFilesUsed >= 1) {
      handleNavigateView('auth');
      return;
    }

    setFreeFilesUsed((prev) => {
      const newCount = prev + 1;
      localStorage.setItem('cleancsv_freeFilesUsed', newCount.toString());
      return newCount;
    });
  };

  const handleFileCleaned = async (file: CleanedFile) => {
    setCleanedFilesHistory((prev) => [file, ...prev]);
    setGlobalCleanedCount((prev) => prev + 1);

    setProfile((prev) => {
      const updatedCount = prev.totalCleanedFiles + 1;
      const updatedMonthly = prev.monthlyStats.map((item) =>
        item.month === 'Nov' || item.month === 'Oct'
          ? { ...item, count: item.count + 1 }
          : item
      );
      const updated = {
        ...prev,
        totalCleanedFiles: updatedCount,
        monthlyStats: updatedMonthly,
      };
      localStorage.setItem('cleancsv_user_profile', JSON.stringify(updated));
      return updated;
    });
  };

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

    if (isProPlan) {
      setProfile((prev) => {
        const updated = { ...prev, plan: 'PRO' as const };
        localStorage.setItem('cleancsv_user_profile', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleAddLiveSale = async (newSale: Sale) => {
    setSales((prev) => [newSale, ...prev]);
  };

  const handleUpdateProfile = (updated: Partial<CustomerProfileData>) => {
    setProfile((prev) => {
      const full = { ...prev, ...updated };
      localStorage.setItem('cleancsv_user_profile', JSON.stringify(full));
      return full;
    });
  };

  const handleLoginSuccess = (name: string, email: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('cleancsv_user_session', 'true');
    
    const cleanEmail = email.trim().toLowerCase();
    const isOwner = cleanEmail === 'support@cleancsv.online' || cleanEmail === 'shersinghchanna0@gmail.com';

    const newProfile: CustomerProfileData = {
      ...profile,
      name: name || (isOwner ? 'Sher Singh' : 'User'),
      email: email,
      role: isOwner ? 'Admin' : 'Customer',
      plan: isOwner ? 'PRO' : 'BASIC',
    };

    setProfile(newProfile);
    localStorage.setItem('cleancsv_user_profile', JSON.stringify(newProfile));

    if (isOwner) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('cleancsv_admin_logged_in', 'true');
    }
    
    handleNavigateView('home'); 
  };

  const handleAdminDirectLogin = () => {
    setIsLoggedIn(true);
    setIsAdminLoggedIn(true);
    localStorage.setItem('cleancsv_admin_logged_in', 'true');
    const adminProf: CustomerProfileData = {
      ...profile,
      name: 'Sher Singh',
      email: 'shersinghchanna0@gmail.com',
      role: 'Admin',
      plan: 'PRO',
    };
    setProfile(adminProf);
    localStorage.setItem('cleancsv_user_profile', JSON.stringify(adminProf));
    handleNavigateView('admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('cleancsv_admin_logged_in');
    localStorage.removeItem('cleancsv_user_session');
    localStorage.removeItem('cleancsv_user_profile');
    localStorage.removeItem('cleancsv_current_view');
    localStorage.removeItem('cleancsv_freeFilesUsed');
    setProfile(INITIAL_PROFILE); 
    setFreeFilesUsed(0);
    handleNavigateView('home');
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#f5f7fb] text-slate-900 font-sans selection:bg-emerald-500 selection:text-white"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar
        currentView={currentView}
        onNavigate={(view) => handleNavigateView(view)}
        currentLanguage={currentLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
        isLoggedIn={isLoggedIn}
        onToggleLogin={handleLogout}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={() => {
          setIsAdminLoggedIn(false);
          localStorage.removeItem('cleancsv_admin_logged_in');
          handleNavigateView('home');
        }}
        userName={profile.name}
        userEmail={profile.email}
        userAvatar={profile.avatar}
        isPro={isUserPro}
        t={t}
      />

      <div className="flex-1">
        {currentView === 'profile' && isLoggedIn ? (
          <CustomerProfile
            t={t}
            profile={currentUserData}
            onUpdateProfile={handleUpdateProfile}
            onPlanPurchased={handlePlanPurchased}
            onLogout={handleLogout}
            onNavigate={(view) => handleNavigateView(view)}
            onNavigateToCleaner={() => handleNavigateView('home')}
          />
        ) : currentView === 'admin' ? (
          <AdminDashboard
            t={t}
            isAdminLoggedIn={isAdminLoggedIn}
            onLoginAdmin={() => {
              setIsAdminLoggedIn(true);
              localStorage.setItem('cleancsv_admin_logged_in', 'true');
            }}
            onLogoutAdmin={() => {
              setIsAdminLoggedIn(false);
              localStorage.removeItem('cleancsv_admin_logged_in');
              handleNavigateView('home');
            }}
            onReturnToHome={() => handleNavigateView('home')}
            sales={sales}
            onAddSale={handleAddLiveSale}
            users={users}
            onUpdateUsers={setUsers}
            cleanedFilesHistory={cleanedFilesHistory}
            totalCleanedFiles={Math.max(globalCleanedCount, profile.totalCleanedFiles)}
          />
        ) : currentView === 'auth' ? (
          <AuthSplitScreen
            t={t}
            onLoginSuccess={handleLoginSuccess}
            onAdminLoginSuccess={handleAdminDirectLogin}
          />
        ) : (
          <HomeCleaner
            t={t}
            freeFilesUsed={freeFilesUsed}
            onIncrementUsage={handleIncrementUsage}
            onFileCleaned={handleFileCleaned}
            onNavigateToPricing={() => handleNavigateView(isLoggedIn ? 'profile' : 'auth')}
            onNavigateToAdmin={() => handleNavigateView('admin')}
            onOpenSupportModal={() => setIsSupportModalOpen(true)}
            onSelectLanguage={setCurrentLanguage}
            currentUser={currentUserData}
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