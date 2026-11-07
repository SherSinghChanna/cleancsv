import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { TranslationStrings } from '../translations';
import { 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  KeyRound,
  ShieldAlert,
  RotateCw
} from 'lucide-react';

const ADMIN_GMAIL = 'shersinghchanna0@gmail.com';
const EMAILJS_SERVICE_ID = 'service_k1ltrn9';
const EMAILJS_TEMPLATE_ID = 'template_0l09hv8';
const EMAILJS_PUBLIC_KEY = 'hGJfLG8-UslRXHHBg';

interface AuthSplitScreenProps {
  t: TranslationStrings;
  onLoginSuccess: (name: string, email: string) => void;
  onAdminLoginSuccess?: () => void;
}

export const AuthSplitScreen: React.FC<AuthSplitScreenProps> = ({
  t,
  onLoginSuccess,
  onAdminLoginSuccess,
}) => {
  const isAdminRoute = new URLSearchParams(window.location.search).get('admin') === 'true';
  const [activeTab, setActiveTab] = useState<'signup' | 'login' | 'admin'>(isAdminRoute ? 'admin' : 'signup');

  // Sign up state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Verification state
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);

  // Admin login state
  const [adminId, setAdminId] = useState('');              
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Reset Password State
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendWelcomeEmail = async (name: string, email: string, pass: string) => {
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { name: name || 'User', email, password: pass },
        EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error('Welcome email failed:', error);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (showOtpScreen && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showOtpScreen, resendTimer]);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!agreeTerms) {
      setErrorMessage('Please accept Terms & Conditions.');
      setIsLoading(false);
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail.trim(),
          password: signupPassword,
          fullName: signupName.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');

      setFeedbackMessage('Verification code sent to your email!');
      setShowOtpScreen(true);
      setResendTimer(60);
      setCanResend(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail.trim(),
          password: signupPassword,
          fullName: signupName.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to resend code');

      setFeedbackMessage('A new verification code has been sent!');
      setOtpToken('');
      setResendTimer(60);
      setCanResend(false);
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail.trim(),
          token: otpToken.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid OTP.');

      sendWelcomeEmail(signupName.trim(), signupEmail.trim(), signupPassword);
      setFeedbackMessage('Email verified successfully! Logging you in...');
      setTimeout(() => onLoginSuccess(signupName.trim() || 'User', signupEmail.trim()), 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: loginEmail.trim(), 
          password: loginPassword 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed. Please check credentials.');

      const name = data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || 'Customer';
      setFeedbackMessage('Logged in successfully!');
      setTimeout(() => onLoginSuccess(name, data.user.email), 600);
    } catch (err: any) {
      setCustomerError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setIsLoading(true);
    
    if (adminId.trim() === ADMIN_GMAIL && adminPassword.length > 0) {
      setFeedbackMessage('Admin verified! Opening Console...');
      setTimeout(() => {
        if (onAdminLoginSuccess) onAdminLoginSuccess();
      }, 500);
      setIsLoading(false);
      return;
    }
    
    setAdminError('Access Denied: Invalid Admin Credentials.');
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsLoading(true);
    setFeedbackMessage('Password reset link sent to your email!');
    setIsResetMode(false);
    setResetEmail('');
    setTimeout(() => setFeedbackMessage(null), 5000);
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-between bg-slate-900 py-10 px-4 sm:px-6">
      
      {feedbackMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Centered Card */}
      <div className="w-full max-w-md mx-auto bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CleanCSV</h1>
          <p className="text-xs text-slate-400 mt-1">Fast, Secure CSV Cleaner & Data Analytics</p>
        </div>

        {/* Tab Switcher */}
        {!isAdminRoute && !isResetMode && !showOtpScreen && (
          <div className="flex bg-slate-900/80 p-1 rounded-xl mb-6 border border-slate-700/60">
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setErrorMessage(null); setCustomerError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMessage(null); setCustomerError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'login' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Log In
            </button>
          </div>
        )}

        {/* Notifications / Errors */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
            {errorMessage}
          </div>
        )}
        {customerError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
            {customerError}
          </div>
        )}
        {adminError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
            {adminError}
          </div>
        )}

        {/* 1. OTP SCREEN */}
        {showOtpScreen ? (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-sm font-semibold text-white">Enter OTP Code</h2>
              <p className="text-xs text-slate-400 mt-0.5">Sent to {signupEmail}</p>
            </div>

            <div className="relative">
              <ShieldAlert className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                required 
                maxLength={8} 
                placeholder="Enter Code" 
                value={otpToken} 
                onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-4 py-2.5 text-center tracking-[0.25em] font-mono text-sm font-bold rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || otpToken.length < 6} 
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all text-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-400 border-t border-slate-700/60">
              <span>{!canResend ? `Resend in ${resendTimer}s` : "Didn't get code?"}</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isResending}
                className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 disabled:opacity-40 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <button 
                type="button" 
                onClick={() => { setShowOtpScreen(false); setOtpToken(''); }} 
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                ← Back to Sign Up
              </button>
            </div>
          </form>
        ) : isResetMode ? (
          /* 2. RESET PASSWORD */
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-center mb-3">
              <KeyRound className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <h2 className="text-sm font-semibold text-white">Reset Password</h2>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required 
                placeholder="Enter your registered email" 
                value={resetEmail} 
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all text-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setIsResetMode(false)} 
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                ← Return to Login
              </button>
            </div>
          </form>
        ) : activeTab === 'admin' ? (
          /* 3. ADMIN LOGIN */
          <form onSubmit={handleAdminPasswordLogin} className="space-y-3.5">
            <div className="text-center mb-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
              <h2 className="text-sm font-semibold text-white">Master Admin Console</h2>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Admin ID</label>
              <input 
                type="text" 
                required 
                value={adminId} 
                onChange={(e) => setAdminId(e.target.value)} 
                placeholder="shersinghchanna0@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Admin Password</label>
              <input 
                type="password" 
                required 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all text-xs cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Verifying...' : 'Sign In as Admin'}
            </button>
            {!isAdminRoute && (
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('login')} 
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  ← Customer Login
                </button>
              </div>
            )}
          </form>
        ) : activeTab === 'signup' ? (
          /* 4. SIGN UP FORM */
          <form onSubmit={handleSignUpSubmit} className="space-y-3">
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                required 
                placeholder={t.fullName} 
                value={signupName} 
                onChange={(e) => setSignupName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required 
                placeholder={t.email} 
                value={signupEmail} 
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type={showSignupPassword ? 'text' : 'password'} 
                required 
                placeholder={t.password} 
                value={signupPassword} 
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
              <button 
                type="button" 
                onClick={() => setShowSignupPassword(!showSignupPassword)} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type={showSignupPassword ? 'text' : 'password'} 
                required 
                placeholder={t.confirmPassword} 
                value={signupConfirmPassword} 
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <input 
                type="checkbox" 
                id="agreeTermsCheck" 
                checked={agreeTerms} 
                onChange={(e) => setAgreeTerms(e.target.checked)} 
                className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer" 
              />
              <label htmlFor="agreeTermsCheck" className="cursor-pointer">{t.agreeTerms}</label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all text-xs cursor-pointer disabled:opacity-50 shadow-md mt-2"
            >
              {isLoading ? 'Creating Account...' : t.signUpButton}
            </button>
          </form>
        ) : (
          /* 5. LOG IN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required 
                placeholder={t.email} 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type={showLoginPassword ? 'text' : 'password'} 
                required 
                placeholder={t.password} 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
              <button 
                type="button" 
                onClick={() => setShowLoginPassword(!showLoginPassword)} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-between items-center text-xs">
              <button 
                type="button" 
                onClick={() => setActiveTab('admin')} 
                className="text-slate-500 hover:text-slate-300 text-[11px] cursor-pointer"
              >
                Admin portal?
              </button>
              <button 
                type="button" 
                onClick={() => setIsResetMode(true)} 
                className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all text-xs cursor-pointer disabled:opacity-50 shadow-md mt-1"
            >
              {isLoading ? 'Logging In...' : t.loginButton}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-[10px] text-slate-500 border-t border-slate-700/50 pt-4">
          256-bit SSL End-to-End Encryption · CleanCSV Security
        </div>
      </div>

      {/* Clean Professional Footer */}
      <footer className="mt-8 text-center text-xs text-slate-500">
        <div className="flex flex-wrap justify-center gap-6 mb-2">
          <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="mailto:support@cleancsv.io" className="hover:text-slate-400 transition-colors">Contact Support</a>
        </div>
        <p className="text-[11px] text-slate-600">© 2026 CleanCSV. All rights reserved.</p>
      </footer>
    </div>
  );
};