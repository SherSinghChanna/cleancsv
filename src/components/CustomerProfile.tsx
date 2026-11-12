import React, { useState } from 'react';
import { CustomerProfileData, TranslationStrings } from '../types';
import { Crown, LogOut, CheckCircle2, ArrowLeft, Building2, Sparkles } from 'lucide-react';
import { PayPalCheckoutModal } from './PayPalCheckoutModal';

interface CustomerProfileProps {
  t: TranslationStrings;
  profile: CustomerProfileData;
  userEmail?: string;
  userName?: string;
  onUpdateProfile: (updated: Partial<CustomerProfileData>) => void;
  onPlanPurchased: (planName: string, price: number) => void;
  onLogout: () => void;
  onNavigate: (view: any) => void;
  onNavigateToCleaner: () => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({
  profile,
  userEmail,
  userName,
  onPlanPurchased,
  onLogout,
  onNavigateToCleaner,
}) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number }>({ name: 'PRO', price: 1.99 });

  const activeEmail = userEmail || profile.email || 'sher13101993@gmail.com';
  const activeName = userName || profile.name || 'Sher Singh';
  const isProUser = profile.plan === 'PRO' || profile.subscription_plan === 'PRO' || profile.plan === 'BUSINESS' || profile.plan === 'YEARLY_PRO';

  const handleOpenCheckout = (planName: string, price: number) => {
    setSelectedPlan({ name: planName, price: price });
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (planName: string) => {
    onPlanPurchased(planName, selectedPlan.price);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Bar / Back button */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={onNavigateToCleaner}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cleaner</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-200 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md shrink-0">
            {activeName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{activeName}</h1>
              {isProUser && <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-mono mt-0.5">{activeEmail}</p>
            <div className="inline-block mt-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
              {isProUser ? `${profile.plan} · Unlimited Access` : 'BASIC · Free Unlimited Access'}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center sm:text-right w-full sm:w-auto">
          <div className="text-xs text-slate-500">Total Cleaned Files</div>
          <div className="text-2xl font-extrabold text-indigo-600 font-mono mt-1">
            {profile.totalCleanedFiles || 0}
          </div>
        </div>
      </div>

      {/* 4 Professional Pricing Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        
        {/* 1. Free Basic */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Starter</div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">Free Basic</h3>
            <p className="text-xs text-slate-500 mb-4">Essential in-browser CSV cleaning.</p>
            <div className="text-3xl font-extrabold text-slate-900 mb-6">$0 <span className="text-xs text-slate-400 font-normal">/ forever</span></div>
            
            <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited CSV Cleaning</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Deduplicate & Trim Spaces</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Standard CSV & JSON Export</li>
            </ul>
          </div>
          <div className="w-full py-2.5 rounded-xl font-bold text-xs text-center text-slate-600 bg-slate-100">
            Active Plan
          </div>
        </div>

        {/* 2. Pro Monthly */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-indigo-500 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-indigo-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            Popular
          </div>
          <div>
            <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-2">Pro Monthly</div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">Unlimited Pro</h3>
            <p className="text-xs text-slate-500 mb-4">Advanced multi-format exports & speed.</p>
            <div className="text-3xl font-extrabold text-slate-900 mb-6">$1.99 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
            
            <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited Files (50MB+)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Direct Excel (.xlsx) Export</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Priority 24/7 Support</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => handleOpenCheckout('PRO', 1.99)}
            className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md text-xs cursor-pointer"
          >
            Upgrade Monthly ($1.99)
          </button>
        </div>

        {/* 3. Yearly Pro */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-amber-500 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            Save 37%
          </div>
          <div>
            <div className="text-xs font-extrabold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Annual Value
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">Yearly Pro</h3>
            <p className="text-xs text-slate-500 mb-4">Full year access at discounted pricing.</p>
            <div className="text-3xl font-extrabold text-slate-900 mb-6">$15 <span className="text-xs text-slate-400 font-normal">/ year</span></div>
            
            <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> All Unlimited Pro Features</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 12 Months Full Access</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Excel & JSON Multi-Export</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => handleOpenCheckout('YEARLY_PRO', 15)}
            className="w-full py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 transition-all shadow-md text-xs cursor-pointer"
          >
            Get Yearly Pro ($15)
          </button>
        </div>

        {/* 4. Business Team Plan */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-indigo-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-emerald-400 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            For Teams
          </div>
          <div>
            <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Enterprise B2B
            </div>
            <h3 className="text-lg font-extrabold text-white mb-1">Business Team</h3>
            <p className="text-xs text-slate-300 mb-4">Built for agencies and growing companies.</p>
            <div className="text-3xl font-extrabold text-white mb-6">$19 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
            
            <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
              <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Up to 10 Team Seats</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Bulk File Processing (100MB+)</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Dedicated VIP Support</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => handleOpenCheckout('BUSINESS', 19)}
            className="w-full py-3 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md text-xs cursor-pointer"
          >
            Get Business Team ($19)
          </button>
        </div>

      </div>

      {/* Checkout Modal */}
      <PayPalCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName={selectedPlan.name}
        price={selectedPlan.price}
        onSuccess={handlePaymentSuccess}
      />

    </div>
  );
};