import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, IntegratedReadingReport } from '../types';
import {
  Sparkles,
  Hand,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  BrainCircuit,
  Compass,
  Calendar,
  CheckCircle2,
  FileText,
  Zap,
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  setActiveTab: (tab: string) => void;
  recentReport?: IntegratedReadingReport;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  setActiveTab,
  recentReport,
}) => {
  return (
    <div className="space-y-8 pb-12 text-slate-100">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl border border-cyan-500/30 p-6 lg:p-10 bg-gradient-to-r from-slate-950 via-purple-950/60 to-slate-950 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AETHERIA SANCTUARY DASHBOARD</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300">{user.name || 'Alex'}</span>
            </h1>
            <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
              Your personalized palmistry vision and sacred tarot sanctuary stand ready. Explore your daily energy alignment, draw new spreads, and view synthesized life reports.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('palm_scanner')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Hand className="w-5 h-5" />
              <span>New Palm Scan</span>
            </button>
            <button
              onClick={() => setActiveTab('tarot_sanctuary')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-sm tracking-wide border border-cyan-500/40 shadow-lg transition-all cursor-pointer"
            >
              <Layers className="w-5 h-5" />
              <span>Tarot Sanctuary</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Spiritual Score */}
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">LIFE RESONANCE SCORE</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white">
              {recentReport ? `${recentReport.spiritualGuidanceScore}%` : '94%'}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-emerald-400 font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+6.2% trajectory growth</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Insight Clarity */}
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-purple-500/30 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">INSIGHT CLARITY</span>
            <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white">
              {recentReport ? `${recentReport.confidenceScore}%` : '97.2%'}
            </div>
            <div className="text-xs text-purple-300 font-mono mt-1">
              Multi-Dimensional Alignment
            </div>
          </div>
        </motion.div>

        {/* Card 3: Dominant Archetype */}
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">DOMINANT ARCHETYPE</span>
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl font-black text-white truncate">
              {recentReport ? recentReport.archetype.title : 'Luminary Visionary'}
            </div>
            <div className="text-xs text-amber-300/80 font-mono mt-1">
              Fire / Air Synthesis
            </div>
          </div>
        </motion.div>

        {/* Card 4: Daily Energy Alignment */}
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">DAILY ALIGNMENT</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white">Optimal</div>
            <div className="text-xs text-emerald-400 font-mono mt-1">
              High Creative Momentum
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Palm Analysis Card */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setActiveTab('palm_scanner')}
          className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 lg:p-8 cursor-pointer group shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 text-cyan-500/10 group-hover:text-cyan-500/20 transition-all">
            <Hand className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Hand className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
              Palm Vision Analysis
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Upload your palm image or capture a live photo to analyze your Life, Head, Heart, and Fate lines with elemental hand shape classification.
            </p>
            <div className="pt-2 flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <span>Start Palm Scan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Tarot Arcana Card */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setActiveTab('tarot_sanctuary')}
          className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 lg:p-8 cursor-pointer group shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 text-purple-500/10 group-hover:text-purple-500/20 transition-all">
            <Layers className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Layers className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
              Sacred Tarot Arcana
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Shuffle our 78 Major & Minor Arcana deck. Select custom spreads (Single Card, 3-Card Timeline, 5-Card Elemental) to gain active energy guidance.
            </p>
            <div className="pt-2 flex items-center gap-2 text-purple-400 font-bold text-sm">
              <span>Enter Sanctuary</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Integrated Intelligence Card */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setActiveTab('integrated_reading')}
          className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 lg:p-8 cursor-pointer group shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 text-amber-500/10 group-hover:text-amber-500/20 transition-all">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
              Unified Life Guidance Report
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Fuses Palm lines and Tarot draws into a single multi-domain guidance report covering Career, Relationships, Wealth, and Personal Growth.
            </p>
            <div className="pt-2 flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span>View Full Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Daily Guidance & Personal Trajectory Panel */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Daily Spiritual Insights & Recommendations</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Personalized action steps based on your recent palm & tarot readings.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('history_analytics')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold font-mono transition-all border border-cyan-500/30 cursor-pointer"
          >
            View History & Trends
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>CAREER FOCUS</span>
            </div>
            <h4 className="text-sm font-bold text-white">Strategic Autonomy</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your prominent Head Line indicates high cognitive clarity today. Initiate key negotiations or project planning.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>EMOTIONAL HARMONY</span>
            </div>
            <h4 className="text-sm font-bold text-white">Authentic Connection</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Heart Line curvature favors open dialogue. Express appreciation to partners and close collaborators.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>VITALITY PRACTICE</span>
            </div>
            <h4 className="text-sm font-bold text-white">Grounding & Breathwork</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Integrate 10 minutes of somatic deep breathing to harmonize high mental drive with physical reserves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
