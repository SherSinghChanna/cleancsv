import React, { useState } from 'react';
import { CustomerProfileData } from '../types';
import { TranslationStrings } from '../translations';
import { Crown, LogOut, CheckCircle2, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { PayPalCheckoutModal } from './PayPalCheckoutModal';
import { PLANS_DATA, PricingPlan } from '../plansData';

const ADMIN_EMAIL = 'shersinghchanna0@gmail.com';

interface CustomerProfileProps {
  t: TranslationStrings;
  profile: CustomerProfileData & Record<string, any>;
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
  onUpdateProfile,
  onPlanPurchased,
  onLogout,
  onNavigate,
  onNavigateToCleaner,
}) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number }>({ name: 'PRO', price: 1.99 });
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  const activeEmail = (userEmail || profile.email || 'user@cleancsv.online').trim();
  const isSoleAdmin = activeEmail.toLowerCase() === ADMIN_EMAIL;
  const activeName = userName || profile.name || activeEmail.split('@')[0] || 'Valued User';
  
  const currentPlan = String(profile.plan || profile.subscription_plan || 'BASIC');
  const isProUser = currentPlan === 'PRO' || currentPlan === 'BUSINESS' || currentPlan === 'YEARLY_PRO' || isSoleAdmin;

  const handleOpenCheckout = (planName: string, price: number) => {
    if (isSoleAdmin) {
      onUpdateProfile({ plan: planName as any });
      setAdminNotice(`Admin Instant Switch: Your active plan is now ${planName}!`);
      setTimeout(() => setAdminNotice(null), 3500);
      return;
    }
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

        <div className="flex items-center gap-2.5">
          {isSoleAdmin && (
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Open Admin Console</span>
            </button>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-200 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {adminNotice && (
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md shrink-0">
            {activeName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{activeName}</h1>
              {isProUser && <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />}
              {isSoleAdmin && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold uppercase">
                  👑 SOLE ADMIN
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-mono mt-0.5">{activeEmail}</p>
            <div className="inline-block mt-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
              {isProUser
                ? `${currentPlan} · Unlimited Access Active`
                : 'FREE BASIC · Unlimited CSV Cleaning Active'}
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

      {/* Admin Self Instant Plan Switcher */}
      {isSoleAdmin && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 mb-8 border border-indigo-500/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">Admin 1-Click Self Plan Switcher</h3>
              <p className="text-xs text-slate-300">
                Instantly test or activate any of your 4 plans on your own profile without checkout.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PLANS_DATA.map((p: PricingPlan) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleOpenCheckout(p.id, 0)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  currentPlan === p.id
                    ? 'bg-emerald-400 text-slate-950 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                {p.name} ({p.id})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4 Professional Pricing Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {PLANS_DATA.map((plan: PricingPlan) => {
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
                  {plan.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.id === 'BASIC' ? (
                <button
                  type="button"
                  onClick={() => isSoleAdmin && handleOpenCheckout('BASIC', 0)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-center text-slate-600 bg-slate-100"
                >
                  {isCurrentPlan ? 'Current Plan (Active)' : 'Included Free'}
                </button>
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
                  {isCurrentPlan
                    ? 'Current Plan (Active)'
                    : isSoleAdmin
                    ? `Admin Instant Activate (${plan.name})`
                    : plan.buttonText}
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

export default CustomerProfile;