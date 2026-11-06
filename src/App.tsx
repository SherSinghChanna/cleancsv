import React, { useState } from 'react';
import { NavView, Language, CustomerProfileData, Sale, AppUser, CleanedFile } from './types';
import { translations } from './translations';
import { Navbar } from './components/Navbar';
import { HomeCleaner } from './components/HomeCleaner';
import { CustomerProfile } from './components/CustomerProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthSplitScreen } from './components/AuthSplitScreen';
import { LanguageModal } from './components/LanguageModal';
import { SupportModal } from './components/SupportModal';

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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); 
  
  const [profile, setProfile] = useState<CustomerProfileData>(INITIAL_PROFILE);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [cleanedFilesHistory, setCleanedFilesHistory] = useState<CleanedFile[]>([]);

  const t = translations[currentLanguage];

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

  const handlePlanPurchased = (planName: any, price: number) => {
    const isProPlan = planName !== 'BASIC';
    const newSale: Sale = {
      id: `s_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      fileName: `${planName} Subscription ($${price})`,
      salesType: isProPlan ? 'Premium' : 'Basic',
      price: price,
      user: profile.email || 'customer@example.com',
    };
    setSales((prev) => [newSale, ...prev]);

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
    }
  };

  const handleAddLiveSale = (newSale: Sale) => {
    setSales((prev) => [newSale, ...prev]);
  };

  const handleUpdateProfile = (updated: Partial<CustomerProfileData>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // ✅ जब कस्टमर लॉगिन करेगा: हमेशा होम/क्लीनर पेज पर ही रहेगा, एडमिन ऑटो-ओपन नहीं होगा
  const handleLoginSuccess = (name: string, email: string) => {
    setIsLoggedIn(true);
    setIsAdminLoggedIn(false); // एडमिन तब तक लॉक रहेगा जब तक पासवर्ड न डाला जाए
    
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
    
    // ✅ लॉगिन होते ही सीधा क्लीनर (home) पेज खुलेगा
    setCurrentView('home'); 
  };

  // जब लॉगिन स्क्रीन के नीचे "Admin portal?" पर क्लिक करके लॉगिन करें
  const handleAdminDirectLogin = () => {
    setIsLoggedIn(true);
    setIsAdminLoggedIn(false); // पहले पासवर्ड बॉक्स आएगा
    setProfile((prev) => ({
      ...prev,
      name: 'Sher Singh',
      email: 'shersinghchanna0@gmail.com',
      role: 'Admin',
      plan: 'PRO',
    }));
    setCurrentView('admin');
  };

  // जब नेवबार/प्रोफ़ाइल ड्रॉपडाउन से "Admin" चुना जाए
  const handleNavigateToAdminView = () => {
    // अगर पहले से पासवर्ड डालकर अनलॉक नहीं किया है, तो पासवर्ड स्क्रीन दिखेगी
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminLoggedIn(false);
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
            handleNavigateToAdminView();
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
        onLogoutAdmin={() => setIsAdminLoggedIn(false)}
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
            onNavigateToAdmin={() => handleNavigateToAdminView()}
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
            onNavigate={(view) => {
              if (view === 'admin') {
                handleNavigateToAdminView();
              } else {
                setCurrentView(view);
              }
            }}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            t={t}
            isAdminLoggedIn={isAdminLoggedIn}
            onLoginAdmin={() => setIsAdminLoggedIn(true)}
            onLogoutAdmin={() => {
              setIsAdminLoggedIn(false);
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