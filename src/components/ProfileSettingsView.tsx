import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import {
  User,
  Crown,
  Bell,
  ShieldCheck,
  Key,
  Save,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Check,
} from 'lucide-react';

interface ProfileSettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenPricing: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  user,
  onUpdateUser,
  onOpenPricing,
}) => {
  const [name, setName] = useState(user.name || 'Alex Morgan');
  const [email, setEmail] = useState(user.email || 'alex@example.com');
  const [birthDate, setBirthDate] = useState(user.birthDate || '1995-08-14');
  const [zodiacSign, setZodiacSign] = useState(user.zodiacSign || 'Leo');
  const [dominantHand, setDominantHand] = useState(user.dominantHand || 'Right');
  const [primaryIntention, setPrimaryIntention] = useState(
    user.primaryIntention || 'Career & Personal Leadership Growth'
  );

  // Notification Toggles
  const [dailyHoroscope, setDailyHoroscope] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [readingReminders, setReadingReminders] = useState(false);

  // Success Feedback Toast
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      birthDate,
      zodiacSign,
      dominantHand,
      primaryIntention,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12 text-slate-100 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-1">
            <User className="w-4 h-4" />
            <span>ACCOUNT & SANCTUARY PREFERENCES</span>
          </div>
          <h1 className="text-2xl lg:text-4xl font-black text-white">
            Profile & Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your personal profile details, spiritual intentions, subscription status, and notification alerts.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile Preferences Saved!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Personal Info Form */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSaveProfile} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 lg:p-8 space-y-6 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-5 h-5 text-cyan-400" />
              <span>Personal Profile Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Birth Date</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Zodiac Sun Sign</label>
                <select
                  value={zodiacSign}
                  onChange={(e) => setZodiacSign(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Dominant Hand</label>
                <select
                  value={dominantHand}
                  onChange={(e) => setDominantHand(e.target.value as 'Right' | 'Left')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="Right">Right Hand</option>
                  <option value="Left">Left Hand</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Primary Focus / Intention</label>
                <input
                  type="text"
                  value={primaryIntention}
                  onChange={(e) => setPrimaryIntention(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          {/* Notifications Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 lg:p-8 space-y-4 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Bell className="w-5 h-5 text-purple-400" />
              <span>Spiritual Digest & Notification Alerts</span>
            </h3>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-sm font-bold text-white">Daily Horoscope & Tarot Digest</div>
                  <div className="text-xs text-slate-400">Receive a daily card drop and planetary energy summary in your inbox.</div>
                </div>
                <input
                  type="checkbox"
                  checked={dailyHoroscope}
                  onChange={(e) => setDailyHoroscope(e.target.checked)}
                  className="w-5 h-5 accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-sm font-bold text-white">Weekly Life Trajectory Report</div>
                  <div className="text-xs text-slate-400">Comprehensive summary of your energy shifts and progress metrics.</div>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="w-5 h-5 accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-sm font-bold text-white">Reading History Reminders</div>
                  <div className="text-xs text-slate-400">Bi-weekly prompts to perform a updated palm scan or card draw.</div>
                </div>
                <input
                  type="checkbox"
                  checked={readingReminders}
                  onChange={(e) => setReadingReminders(e.target.checked)}
                  className="w-5 h-5 accent-cyan-500 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Subscription & Account Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Subscription Tier Card */}
          <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900 via-purple-950/40 to-slate-950 p-6 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>MEMBERSHIP PLAN</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/40 uppercase">
                {user.tier || 'Mystic Pro'}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-white">Mystic Pro Plan</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlimited palm vision analysis, 78 tarot spreads, and multi-page PDF report downloads.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Renews On:</span>
                <span className="text-slate-200">August 28, 2026</span>
              </div>
            </div>

            <button
              onClick={onOpenPricing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Upgrade / Manage Plan</span>
            </button>
          </div>

          {/* Account Security Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 backdrop-blur-xl">
            <h4 className="text-sm font-mono font-bold text-slate-300 uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security & Encryption</span>
            </h4>

            <p className="text-xs text-slate-400 leading-relaxed">
              Your profile data is protected by industry standard SSL encryption.
            </p>

            <button
              onClick={() => alert('Password reset link sent to your registered email.')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Request Password Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
