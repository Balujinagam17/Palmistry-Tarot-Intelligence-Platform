import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Hand,
  Layers,
  ArrowRight,
  Shield,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Heart,
  Briefcase,
  Coins,
  Activity,
  Award,
  Zap,
} from 'lucide-react';

interface LandingPageViewProps {
  onStartAnalysis: () => void;
  onOpenTarot: () => void;
  onOpenPricing: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onStartAnalysis,
  onOpenTarot,
  onOpenPricing,
  onOpenAuth, }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const testimonials = [
    {
      name: 'Elena Rostova',
      role: 'Creative Director',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      comment:
        'Aetheria gave me absolute clarity during a major career transition. The alignment between my palm major lines and tarot spread was shockingly accurate.',
    },
    {
      name: 'Marcus Vance',
      role: 'Tech Founder & Investor',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      comment:
        'The depth of the integrated life guidance report is unlike anything else. It feels like having a personal spiritual advisor in my pocket.',
    },
    {
      name: 'Sophia Chen',
      role: 'Holistic Practitioner',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      comment:
        'Beautiful interface, incredibly fast results, and the monthly timeline trajectory maps out my energy shifts with total precision.',
    },
  ];

  const faqs = [
    {
      q: 'How does Aetheria analyze my palm image?',
      a: 'Simply upload or snap a photo of your hand. Aetheria evaluates your palm contours, major line formations (Life, Head, Heart, Fate), and hand geometry to produce a personalized elemental profile.',
    },
    {
      q: 'Is my palm photo and reading data kept private?',
      a: 'Yes, absolutely. Your privacy and spiritual data security are paramount. All uploaded images and reports are encrypted and strictly confidential to your account.',
    },
    {
      q: 'What is the difference between Palmistry and Tarot readings on Aetheria?',
      a: 'Palmistry reveals your core innate blueprint and personality traits carved into your hand. Tarot draws capture your active energy momentum and present choices. Combining both produces a unified, high-accuracy Life Path report.',
    },
    {
      q: 'Can I export my reports to PDF or share them?',
      a: 'Yes! All Pro and Elite members can download high-resolution PDF copies of their Integrated Reports at any time to track their spiritual evolution.',
    },
  ];

  return (
    <div className="space-y-20 pb-20 text-slate-100">
      {/* Hero Section */}
      <section className="relative rounded-3xl border border-cyan-500/30 p-8 lg:p-16 bg-gradient-to-b from-slate-950 via-purple-950/40 to-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.15)] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI PALMISTRY & TAROT SANCTUARY</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Unveil Your True Destiny Through{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300">
              Sacred AI Intelligence
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
            Fuse palmistry contours with 78 sacred Tarot Arcana. Receive instant multi-domain life reports, personal growth trajectories, and daily spiritual guidance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartAnalysis}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-1 cursor-pointer flex items-center gap-3"
            >
              <Hand className="w-5 h-5" />
              <span>Start Palm Reading</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenTarot}
              className="px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 font-bold text-sm tracking-wider uppercase border border-cyan-500/40 shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex items-center gap-3"
            >
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Draw Tarot Spread</span>
            </button>
          </div>

          {/* Key Trust Stats */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-slate-800/80 max-w-3xl mx-auto">
            <div>
              <div className="text-2xl lg:text-3xl font-black text-white">50,000+</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Readings Generated</div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-black text-cyan-400">98.5%</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Accuracy Resonance</div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-black text-amber-400">78 Arcana</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Complete Deck</div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-black text-purple-400">4.9 ★</div>
              <div className="text-xs text-slate-400 font-mono mt-1">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            SIMPLE 3-STEP JOURNEY
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-white">
            How Aetheria Transforms Your Life
          </h2>
          <p className="text-slate-400 text-sm">
            Experience real-time spiritual synthesis in three seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/60 p-8 space-y-4 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-black text-xl flex items-center justify-center">
              01
            </div>
            <h3 className="text-xl font-bold text-white">Upload Your Palm</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Snap a clear photo of your dominant palm or choose from our sample library. Aetheria detects major lines and elemental energy markers instantly.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl border border-purple-500/30 bg-slate-900/60 p-8 space-y-4 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-500/40 text-purple-400 font-black text-xl flex items-center justify-center">
              02
            </div>
            <h3 className="text-xl font-bold text-white">Select Sacred Tarot</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Shuffle our 78 Major & Minor Arcana deck. Choose single cards or complete 3-Card, 5-Card, or Celtic spreads tailored to your present focus.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl border border-amber-500/30 bg-slate-900/60 p-8 space-y-4 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-500/40 text-amber-400 font-black text-xl flex items-center justify-center">
              03
            </div>
            <h3 className="text-xl font-bold text-white">Receive Unified Life Report</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Get an integrated multi-domain analysis spanning Career, Love, Wealth, Health, and Personal Growth with downloadable PDF reports.
            </p>
          </div>
        </div>
      </section>

      {/* Domain Guidance Preview Section */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950 p-8 lg:p-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
              MULTI-DIMENSIONAL INSIGHTS
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-white mt-1">
              Coverage Across Every Area of Life
            </h2>
          </div>
          <button
            onClick={onStartAnalysis}
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer"
          >
            <span>EXPLORE FULL REPORT FORMAT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-white text-lg">Career & Leadership</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Discover optimal career timings, leadership breakthroughs, and strategic negotiation opportunities mapped to your Head Line and Fate Line.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-950/80 border border-pink-500/40 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="font-bold text-white text-lg">Relationships & Love</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gain deep clarity on soul connections, emotional boundaries, and partner compatibility guided by your Heart Line curvature.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center">
              <Coins className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-bold text-white text-lg">Wealth & Prosperity</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Identify financial abundance channels, asset accumulation cycles, and risk avoidance markers across major life phases.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-lg">Health & Vitality</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Monitor physical energy reserves, nervous system balance, and somatic stress markers reflected in your Life Line arch.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center">
              <Compass className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-white text-lg">Personal Growth</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Track intuitive awakening, spiritual archetypes, and monthly personal trajectory evolution with interactive timeline charts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-white text-lg">PDF & Export Reports</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Download elegant, print-ready PDF reports formatted with modern charts, archetypes, and actionable advice.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            FLEXIBLE MEMBERSHIP PLANS
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-white">
            Choose Your Spiritual Mastery Plan
          </h2>
          <p className="text-slate-400 text-sm">
            Start free or upgrade to unlock unlimited Tarot spreads and PDF exports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">FREE SEEKER</span>
              <div className="text-4xl font-black text-white">$0 <span className="text-xs text-slate-400 font-normal">/ forever</span></div>
              <p className="text-xs text-slate-400">Essential palm readings and basic Tarot card draws.</p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>3 Palm Scans per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Single-Card Tarot draws</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-slate-600 w-4 h-4" />
                  <span className="text-slate-500">Integrated Life Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-slate-600 w-4 h-4" />
                  <span className="text-slate-500">PDF Report Exports</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono transition-all"
            >
              Get Started Free
            </button>
          </div>

          {/* Mystic Pro Tier */}
          <div className="rounded-3xl border border-cyan-500/50 bg-gradient-to-b from-slate-900 via-purple-950/40 to-slate-950 p-8 space-y-6 flex flex-col justify-between relative shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider">
              MOST POPULAR
            </div>
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">MYSTIC PRO</span>
              <div className="text-4xl font-black text-white">$19 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
              <p className="text-xs text-slate-300">Complete spiritual guidance for personal growth seekers.</p>
              <ul className="space-y-2.5 text-xs text-slate-200 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Unlimited Palm Vision Scans</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>All 78 Tarot Spreads (3 & 5 Card)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Full Integrated Life Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Unlimited PDF Exports</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenPricing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono shadow-lg transition-all"
            >
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Celestial Elite Tier */}
          <div className="rounded-3xl border border-amber-500/40 bg-slate-900/60 p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">CELESTIAL ELITE</span>
              <div className="text-4xl font-black text-white">$39 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
              <p className="text-xs text-slate-400">Advanced trajectory tracking, priority updates & personalized audio summaries.</p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Everything in Mystic Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Celtic Cross & Horoscope Spreads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>12-Month Personal Trajectory</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Priority 24/7 Spiritual Support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenPricing}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs font-mono transition-all border border-amber-500/30"
            >
              Join Celestial Elite
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            TESTIMONIALS & REVIEWS
          </span>
          <h2 className="text-3xl font-black text-white">Loved by Seekers Worldwide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                <div>
                  <h4 className="font-bold text-white text-xs">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl font-black text-white">Got Questions? We Have Answers.</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Callout */}
      <footer className="pt-12 border-t border-slate-800/80 text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300">
            AETHERIA SANCTUARY
          </span>
        </div>

        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Providing personal growth insights, palm contour evaluation, and sacred tarot arcana guidance.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <button onClick={onStartAnalysis} className="hover:text-cyan-300 cursor-pointer">Palm Reading</button>
          <button onClick={onOpenTarot} className="hover:text-cyan-300 cursor-pointer">Tarot Arcana</button>
          <button onClick={onOpenPricing} className="hover:text-cyan-300 cursor-pointer">Pricing</button>
        </div>

        <div className="text-[11px] text-slate-600 font-mono">
          © {new Date().getFullYear()} Aetheria Inc. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};
