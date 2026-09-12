import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User } from '../../types';
import { DEFAULT_USER } from '../../utils/storage';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('demo@webforge.io');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Vance');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const user: User = {
      id: `user_${Math.random().toString(36).substring(2, 8)}`,
      email,
      name: isSignUp ? name : email.split('@')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };

    onLoginSuccess(user);
  };

  const handleDemoLogin = () => {
    onLoginSuccess(DEFAULT_USER);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Editorial Decorative Background Elements */}
      <div className="absolute top-12 left-12 text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A]/40 font-mono hidden md:block">
        STUDIO_LUMEN // ATELIER V2.4
      </div>
      <div className="absolute bottom-12 right-12 text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A]/40 font-mono hidden md:block">
        DESIGNED FOR CREATIVES
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full border border-[#1A1A1A] bg-[#1A1A1A] flex items-center justify-center text-[#F9F7F2] overflow-hidden shadow-sm">
            <img src="/favicon.svg" alt="Studio Lumen Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <span className="text-2xl font-bold tracking-tight uppercase tracking-[0.15em] font-sans">
            STUDIO_LUMEN
          </span>
        </div>
        <h2 className="text-center text-3xl font-serif italic text-[#1A1A1A] mb-1">
          {isSignUp ? 'Join the Atelier' : 'Welcome to the Atelier'}
        </h2>
        <p className="text-center text-xs uppercase tracking-widest text-[#1A1A1A]/60 mb-6">
          {isSignUp ? 'Create your platform account' : 'Sign in to access your digital workspace'}
        </p>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-[#E5E2D9] border border-[#1A1A1A]/10 py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          {/* Top Quick Demo Login Banner */}
          <div className="mb-6 bg-[#F9F7F2] border border-[#1A1A1A]/10 rounded-xl p-3 text-xs text-[#1A1A1A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1A1A1A]/70 shrink-0" />
              <span className="font-medium">Test atelier active</span>
            </div>
            <button
              onClick={handleDemoLogin}
              type="button"
              className="px-3 py-1 bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F7F2] rounded-full text-[11px] font-medium tracking-wide transition-colors flex items-center gap-1"
            >
              Demo Access <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Form Tabs */}
          <div className="flex rounded-full bg-[#F9F7F2] p-1 mb-6 border border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wider transition-all ${
                !isSignUp ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-sm' : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wider transition-all ${
                isSignUp ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-sm' : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              Register
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-100/80 border border-rose-300 text-rose-900 text-xs p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Vance"
                  className="w-full bg-[#F9F7F2] border border-[#1A1A1A]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/70 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.vance@webforge.io"
                className="w-full bg-[#F9F7F2] border border-[#1A1A1A]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/70">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModal(true);
                      setResetSent(false);
                    }}
                    className="text-[11px] text-[#1A1A1A]/70 hover:text-[#1A1A1A] underline underline-offset-2"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F9F7F2] border border-[#1A1A1A]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1A1A1A]/20 text-[#1A1A1A] focus:ring-0"
                />
                <span className="text-xs text-[#1A1A1A]/70">Keep atelier session active</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F7F2] font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em] mt-2"
            >
              {isSignUp ? 'Create Atelier Account' : 'Enter Workspace'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#F9F7F2] border border-[#1A1A1A]/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-serif italic text-[#1A1A1A] mb-2">Reset Password</h3>
            {resetSent ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#1A1A1A] mx-auto" />
                <p className="text-xs text-[#1A1A1A]/80">
                  A reset dispatch link was sent to <strong className="text-[#1A1A1A]">{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setForgotModal(false)}
                  className="mt-2 w-full py-2 bg-[#1A1A1A] text-[#F9F7F2] rounded-xl text-xs font-semibold uppercase tracking-wider"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#1A1A1A]/70">
                  Enter your atelier email address to receive password instructions.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModal(false)}
                    className="flex-1 py-2 bg-[#E5E2D9] text-[#1A1A1A] rounded-xl text-xs font-semibold uppercase tracking-wider border border-[#1A1A1A]/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetSent(true)}
                    className="flex-1 py-2 bg-[#1A1A1A] text-[#F9F7F2] rounded-xl text-xs font-semibold uppercase tracking-wider"
                  >
                    Send Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
