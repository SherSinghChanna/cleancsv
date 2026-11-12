import React, { useState } from 'react';
import { CustomerProfileData, TranslationStrings } from '../types';
import { Crown, LogOut, CheckCircle2, ArrowLeft, Building2, Sparkles } from 'lucide-react';
import { PayPalCheckoutModal } from './PayPalCheckoutModal';
import { PLANS_DATA } from '../data/plansData';

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

  const activeEmail = userEmail || profile.email || 'user@cleancsv.online';
  const activeName = userName || profile.name || activeEmail.split('@')[0] || 'Valued User';
  
  const currentPlan = profile.plan || profile.subscription_plan || 'BASIC';
  const isProUser = currentPlan === 'PRO' || currentPlan === 'BUSINESS' || currentPlan === 'YEARLY_PRO';

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
              {isProUser ? `${currentPlan} · Unlimited Access` : 'BASIC · Free Tier Active'}
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

      {/* 4 Professional Pricing Plans (Dynamically Rendered) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {PLANS_DATA.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden ${
                plan.popular
                  ? 'bg-white border-2 border-indigo-500'
                  : plan.yearly
                  ? 'bg-white border-2 border-amber-500'
                  : plan.b2b
                  ? 'bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-500/30'
                  : 'bg-white border border-slate-200'
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute top-4 right-4 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    plan.popular
                      ? 'bg-indigo-600 text-white'
                      : plan.yearly
                      ? 'bg-amber-500 text-slate-950'
                      : plan.b2b
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                <div
                  className={`text-xs font-extrabold uppercase tracking-wider mb-2 ${
                    plan.b2b
                      ? 'text-emerald-400'
                      : plan.yearly
                      ? 'text-amber-600'
                      : plan.popular
                      ? 'text-indigo-600'
                      : 'text-slate-400'
                  }`}
                >
                  {plan.tagline}
                </div>
                <h3 className={`text-lg font-extrabold mb-1 ${plan.b2b ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs mb-4 ${plan.b2b ? 'text-slate-300' : 'text-slate-500'}`}>{plan.tagline}</p>

                <div className={`text-3xl font-extrabold mb-6 ${plan.b2b ? 'text-white' : 'text-slate-900'}`}>
                  {plan.price} <span className="text-xs font-normal text-slate-400">{plan.period}</span>
                </div>

                <ul className={`space-y-2.5 text-xs mb-6 ${plan.b2b ? 'text-slate-200' : 'text-slate-700'}`}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.id === 'BASIC' ? (
                <div className="w-full py-2.5 rounded-xl font-bold text-xs text-center text-slate-600 bg-slate-100">
                  {isCurrentPlan ? 'Active Plan' : 'Included'}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    handleOpenCheckout(
                      plan.id,
                      plan.id === 'PRO' ? 1.99 : plan.id === 'YEARLY_PRO' ? 15 : 19
                    )
                  }
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                    plan.b2b
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                      : plan.yearly
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.buttonText}
                </button>
              )}
            </div>
          );
        })}
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