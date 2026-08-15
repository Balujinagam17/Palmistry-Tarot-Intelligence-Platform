import React from 'react';
import { UserProfile } from '../types';
import {
  Sparkles,
  Hand,
  Layers,
  BarChart3,
  User,
  Activity,
  Home,
  Crown,
  CreditCard,
  LogOut,
  LogIn,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onOpenAuth: (mode: 'login' | 'register') => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  isLoggedIn,
  onLogout,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'palm_scanner', label: 'Palm Analysis', icon: Hand },
    { id: 'tarot_sanctuary', label: 'Tarot Arcana', icon: Layers },
    { id: 'integrated_reading', label: 'AI Life Report', icon: Sparkles },
    { id: 'history_analytics', label: 'History & Trends', icon: Activity },
    { id: 'pricing', label: 'Pricing Plans', icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-cyan-500/20 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-amber-400 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_28px_rgba(168,85,247,0.6)] transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg lg:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300">
                AETHERIA
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
              AI Palmistry & Tarot Sanctuary
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-slate-800 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Account Controls */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-[10px] text-slate-950">
                  {user.name ? user.name[0].toUpperCase() : 'A'}
                </div>
                <span className="font-bold hidden sm:inline">{user.name || 'Alex Morgan'}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                  {user.tier || 'PRO'}
                </span>
              </button>

              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-bold border border-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Responsive Nav Bar */}
      <div className="lg:hidden flex items-center gap-1 mt-2 pt-2 border-t border-slate-800 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
