import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  loginUser,
  registerUser,
  clearAuthError,
  switchRoleDemo,
} from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/notificationSlice';
import { UserRole } from '../../types';
import { Lock, Mail, User, Sparkles, Radio, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '../../theme/tokens';

export const SessionAuthModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Marketing');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());
    if (mode === 'login') {
      try {
        await dispatch(loginUser({ email, password })).unwrap();
        dispatch(
          addToast({
            type: 'success',
            title: 'Welcome Back',
            message: 'Authenticated successfully via JWT Access & Refresh Token flow.',
          })
        );
      } catch (err: any) {
        // Error handled in slice
      }
    } else {
      try {
        await dispatch(registerUser({ name, email, password, department })).unwrap();
        dispatch(
          addToast({
            type: 'success',
            title: 'Registration Complete',
            message: 'Your account was created and assigned the default EDITOR role.',
          })
        );
      } catch (err: any) {
        // Error handled in slice
      }
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    dispatch(switchRoleDemo(role));
    dispatch(
      addToast({
        type: 'info',
        title: `Logged In as ${role}`,
        message: `Session initialized with full ${role} authorities.`,
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Brand Header with Playful Pastel Gradient */}
        <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 p-6 text-slate-900 text-center relative border-b border-purple-200/60">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-purple-500/25">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            {BRAND_CONFIG.name}
          </h2>
          <p className="text-xs text-purple-800 font-semibold mt-1">
            {BRAND_CONFIG.tagline}
          </p>
        </div>

        {/* 1-Click Evaluation Demo Logins */}
        <div className="p-4 bg-purple-50/70 border-b border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase text-purple-950 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              1-Click Role Testing Logins:
            </span>
            <span className="text-[10px] text-purple-700 font-mono font-bold">
              Password: Pulse123!
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className="py-1.5 px-2 rounded-xl bg-purple-200/80 hover:bg-purple-300 text-purple-950 text-center transition-all shadow-2xs hover:scale-105 active:scale-95"
            >
              ADMIN
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('MANAGER')}
              className="py-1.5 px-2 rounded-xl bg-sky-200/80 hover:bg-sky-300 text-sky-950 text-center transition-all shadow-2xs hover:scale-105 active:scale-95"
            >
              MANAGER
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('EDITOR')}
              className="py-1.5 px-2 rounded-xl bg-emerald-200/80 hover:bg-emerald-300 text-emerald-950 text-center transition-all shadow-2xs hover:scale-105 active:scale-95"
            >
              EDITOR
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('VIEWER')}
              className="py-1.5 px-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-center transition-all shadow-2xs hover:scale-105 active:scale-95"
            >
              VIEWER
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-purple-100 text-xs font-bold bg-purple-50/30">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              dispatch(clearAuthError());
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              mode === 'login'
                ? 'border-purple-600 text-purple-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In with JWT
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              dispatch(clearAuthError());
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              mode === 'register'
                ? 'border-purple-600 text-purple-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold leading-relaxed">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@postpulse.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>
              {isLoading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="p-3.5 bg-purple-50/50 border-t border-purple-100 text-center text-[11px] text-purple-700 font-medium">
          Secured with PBKDF2/BCrypt hashing and stateless HMAC-SHA256 JWT bearer tokens.
        </div>
      </div>
    </div>
  );
};

export { SessionAuthModal as AuthModal };
