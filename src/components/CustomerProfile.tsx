import React, { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  LogOut, 
  FileSpreadsheet, 
  TrendingUp, 
  ShieldCheck,
  Sparkles,
  Clock,
  Check
} from 'lucide-react';
import { PayPalCheckoutModal } from './PayPalCheckoutModal';
import { supabase } from '../lib/supabaseClient';

interface CustomerProfileProps {
  t?: any;
  profile?: any;
  onUpdateProfile?: (updated: any) => void;
  onPlanPurchased?: (planName: any, price: number) => void;
  onLogout?: () => void;
  onNavigate?: (view: any) => void;
  onNavigateToCleaner?: () => void;
  userEmail?: string;
  userName?: string;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({
  t,
  profile,
  onUpdateProfile,
  onPlanPurchased,
  onLogout,
  onNavigate,
  onNavigateToCleaner,
  userEmail,
  userName,
}) => {
  const displayEmail = profile?.email || userEmail || 'support@cleancsv.online';
  const displayName = profile?.name || userName || 'Customer';

  const isPro = Boolean(
    profile?.is_pro === true ||
    profile?.subscription_plan === 'PRO' ||
    profile?.plan === 'PRO' ||
    profile?.userType === 'Premium' ||
    profile?.userType === 'Admin'
  );

  const currentPlan = isPro ? 'PRO UNLIMITED' : (profile?.plan || 'BASIC');

  const [feedback, setFeedback] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number }>({
    name: 'Monthly Pro',
    price: 1.99,
  });

  const handlePlanSelect = (planName: any, price: number) => {
    setSelectedPlan({ name: planName, price });
    setIsModalOpen(true);
  };

  const handleGoToCleaner = () => {
    if (onNavigateToCleaner) {
      onNavigateToCleaner();
    } else if (onNavigate) {
      onNavigate('home');
      onNavigate('cleaner');
    } else {
      window.location.href = '/';
    }
  };

  const handlePaymentSuccess = async (planName: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: 'PRO',
          is_pro: true,
          plan: 'PRO'
        })
        .eq('email', displayEmail);

      if (error) {
        console.error("Database upgrade error:", error);
      }
    } catch (err) {
      console.error("Payment sync failed:", err);
    }

    if (onPlanPurchased) {
      onPlanPurchased(planName, selectedPlan.price);
    }

    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        plan: 'PRO',
        is_pro: true,
        subscription_plan: 'PRO'
      });
    }

    setFeedback(`🎉 Payment Successful! Your "${planName}" is now active with unlimited cleanings.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {feedback && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      <PayPalCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={selectedPlan.name}
        price={selectedPlan.price}
        onSuccess={handlePaymentSuccess}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isPro 
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {currentPlan}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{displayEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleGoToCleaner}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Open Cleaner</span>
            </button>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Subscription Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Current Period</div>
                  <div className="text-xs font-bold text-slate-700 mt-0.5">
                    {isPro ? 'Active (PRO - Unlimited Access)' : 'Active (BASIC - 3 Free Files)'}
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-indigo-500" />
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Payment Method</div>
                  <div className="text-xs font-bold text-slate-700 mt-0.5">PayPal / UPI Available</div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              {!isPro ? (
                <button
                  type="button"
                  onClick={() => handlePlanSelect('Monthly Pro', 1.99)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Upgrade to Unlimited Pro ($1.99/mo)
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>Unlimited Cleanings Active on Account</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Cleaned Files</span>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3 mr-1" /> Active
                </span>
              </div>
              <div className="text-4xl font-extrabold text-slate-900 mt-1">0</div>
              <p className="text-[11px] text-slate-400 mt-1">Files securely processed with zero retention</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Instant encrypted processing</span>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
};