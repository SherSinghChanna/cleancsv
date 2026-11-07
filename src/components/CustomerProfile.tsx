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
  userEmail,
  userName,
}) => {
  const displayName = profile?.name || userName || 'Customer';
  const displayEmail = profile?.email || userEmail || 'customer@cleancsv.io';

  // 1. Pro Status Check (Admin, Supabase Data ya Email)
  const isPro = Boolean(
    profile?.is_pro === true ||
    profile?.subscription_plan === 'PRO' ||
    profile?.plan === 'PRO' ||
    profile?.userType === 'Premium' ||
    profile?.userType === 'Admin' ||
    displayEmail === 'shersinghchanna0@gmail.com'
  );

  const currentPlan = isPro ? 'PRO UNLIMITED' : (profile?.plan || 'BASIC');

  const [feedback, setFeedback] = useState<string | null>(null);

  // PayPal Checkout State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number }>({
    name: 'Monthly Pro',
    price: 1.99,
  });

  const handlePlanSelect = (planName: any, price: number) => {
    setSelectedPlan({ name: planName, price });
    setIsModalOpen(true);
  };

  // 2. ऑटोमैटिक पेमेंट सक्सेस हैंडलर (सीधे Supabase में PRO सेव करेगा)
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

      {/* PayPal Modal */}
      <PayPalCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={selectedPlan.name}
        price={selectedPlan.price}
        onSuccess={handlePaymentSuccess}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Profile Header */}
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
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('cleaner')}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Open Cleaner</span>
              </button>
            )}
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

        {/* Subscription & Usage Grid */}
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
                  <div className="text-xs font-bold text-slate-700 mt-0.5">PayPal / Cards Available</div>
                </div>
              </div>
            </div>

            {/* Dynamic Button / Status */}
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

        {/* Pricing Cards: Pro होने पर छिप जाएँगे */}
        {!isPro && (
          <div className="space-y-6 pt-4">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-extrabold text-slate-900">Upgrade Your Plan</h2>
              <p className="text-xs text-slate-500 mt-1">High-throughput automated CSV data cleaning and instant conversion.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* PLAN 1: 24-HOUR DAY PASS */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-emerald-300 transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 1-Day Access
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">24h Day Pass</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">$0.99</span>
                    <span className="text-xs text-slate-500">/ 24 hours</span>
                  </div>
                  <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2 font-medium text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited cleanings for 24h
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No subscription required
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Standard speed processing
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlanSelect('24h Day Pass', 0.99)}
                  className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Get Day Pass ($0.99)
                </button>
              </div>

              {/* PLAN 2: MONTHLY PRO */}
              <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-indigo-600 relative flex flex-col justify-between">
                <span className="absolute -top-3 left-6 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Most Popular
                </span>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">Monthly Pro</h3>
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">$1.99</span>
                    <span className="text-xs text-slate-500">/ month</span>
                  </div>
                  <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2 font-semibold text-indigo-700">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Unlimited cleanings all month
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Auto-header & date formatting
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Fast priority server
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlanSelect('Monthly Pro', 1.99)}
                  className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                >
                  Subscribe ($1.99/mo)
                </button>
              </div>

              {/* PLAN 3: YEARLY PRO */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-indigo-300 transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Best Value (Save 60%)
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">Yearly Pass</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">$9.99</span>
                    <span className="text-xs text-slate-500">/ year</span>
                  </div>
                  <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2 font-medium text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1 full year unlimited access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Batch CSV processing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority 24/7 email support
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlanSelect('Yearly Pass', 9.99)}
                  className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Get Full Year ($9.99)
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 text-xs text-slate-500 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="font-semibold text-slate-800">CleanCSV</span>
            <a href="#" className="hover:text-slate-800 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-800 transition">Privacy Statement</a>
            <a href="mailto:support@cleancsv.io" className="hover:text-slate-800 transition">support@cleancsv.io</a>
          </div>
          <div className="text-[11px] text-slate-400">
            © 2026 CleanCSV. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};