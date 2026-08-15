import React from 'react';
import { Shield, Lock, FileText, Sparkles } from 'lucide-react';

interface LegalPagesViewProps {
  page: 'privacy' | 'terms';
  onBack: () => void;
}

export const LegalPagesView: React.FC<LegalPagesViewProps> = ({ page, onBack }) => {
  return (
    <div className="space-y-8 pb-12 text-slate-100 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-1">
            <Shield className="w-4 h-4" />
            <span>AETHERIA LEGAL & PRIVACY</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            {page === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Last Updated: July 2026 • Effective Immediately
          </p>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-mono font-bold border border-slate-800 transition-all cursor-pointer"
        >
          ← Return
        </button>
      </div>

      {page === 'privacy' ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 space-y-6 leading-relaxed text-sm text-slate-300 backdrop-blur-xl">
          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              1. Information Collection & Encryption
            </h3>
            <p>
              Aetheria collects minimal personal information necessary to deliver personalized spiritual reports, including name, zodiac sign, birth date, and uploaded palm images. All data transmissions are encrypted using standard TLS protocols.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              2. Palm Photo Processing & Storage
            </h3>
            <p>
              Uploaded palm photos are processed securely and strictly utilized to evaluate hand contour landmarks and major lines. Photos are never shared, sold, or rented to third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              3. User Data Rights & Erasure
            </h3>
            <p>
              You maintain full control over your personal reading history. You may delete your saved reading reports or request full account data deletion at any time in your Account Settings.
            </p>
          </section>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 space-y-6 leading-relaxed text-sm text-slate-300 backdrop-blur-xl">
          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">1. Acceptance of Terms</h3>
            <p>
              By accessing or using the Aetheria platform, you agree to be bound by these Terms & Conditions and our Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">2. Spiritual Guidance Disclaimer</h3>
            <p>
              Aetheria provides personal development insights, palm feature evaluation, and tarot guidance for entertainment and self-reflection purposes. Readings do not constitute formal medical, financial, or legal advice.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">3. Subscription & Billing</h3>
            <p>
              Pro and Elite tier memberships renew automatically on a monthly basis unless cancelled prior to the renewal date via Account Settings.
            </p>
          </section>
        </div>
      )}
    </div>
  );
};
