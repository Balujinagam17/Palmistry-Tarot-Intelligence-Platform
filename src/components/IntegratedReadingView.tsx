import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  IntegratedReadingReport,
  PalmAnalysisResult,
  TarotSpreadResult,
  UserProfile,
} from "../types";
import { generateIntegratedReadingReport } from "../utils/aiInterpretationEngine";
import { exportReportToPDF, exportReportToJSON } from "../utils/pdfExporter";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Sparkles,
  Download,
  FileJson,
  BrainCircuit,
  Award,
  Briefcase,
  Heart,
  Coins,
  Activity,
  Compass,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface IntegratedReadingViewProps {
  user: UserProfile;
  palmAnalysis?: PalmAnalysisResult;
  tarotSpread?: TarotSpreadResult;
  onSaveReport?: (report: IntegratedReadingReport) => void;
}

export const IntegratedReadingView: React.FC<IntegratedReadingViewProps> = ({
  user,
  palmAnalysis,
  tarotSpread,
  onSaveReport,
}) => {
  const [report, setReport] = useState<IntegratedReadingReport>(() => {
    const dummyPalm: PalmAnalysisResult = palmAnalysis || {
      handLandmarks: {
        landmarks: [],
        palmCenter: { x: 0.5, y: 0.5 },
        handOrientation: "Right",
        palmShape: "Air",
        fingerRatios: {
          thumb: 0.7,
          index: 0.88,
          middle: 1.0,
          ring: 0.92,
          pinky: 0.72,
        },
        overallConfidence: 94,
      },
      lines: [],
      palmClass: "Air",
      featureScores: {
        vitality: 90,
        logic: 92,
        creativity: 94,
        empathy: 88,
        ambition: 91,
        intuition: 89,
      },
      timestamp: new Date().toISOString(),
    };

    const dummyTarot: TarotSpreadResult = tarotSpread || {
      spreadName: "3-Card Temporal Spread",
      cards: [],
      overallEnergy: "High Cosmic Resonance",
      elementalBalance: { Air: 2, Fire: 1, Water: 0, Earth: 0 },
      timestamp: new Date().toISOString(),
    };

    return generateIntegratedReadingReport(user, dummyPalm, dummyTarot);
  });

  const [activeDomainTab, setActiveDomainTab] = useState<
    "career" | "relationships" | "finance" | "health" | "personalGrowth"
  >("career");

  const [isExporting, setIsExporting] = useState(false);

  // Save only after the component has rendered.
  // Calling onSaveReport() inside the useState initializer causes
  // the React warning:
  // "Cannot update a component while rendering a different component."
  useEffect(() => {
    if (onSaveReport) {
      onSaveReport(report);
    }
  }, [report]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportReportToPDF(
        "reading-report-container",
        `${user.name}_Spiritual_Report.pdf`,
      );
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert(
        "Could not export PDF automatically. Please check browser print settings.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    exportReportToJSON(report, `${user.name}_reading_data.json`);
  };

  const radarData = [
    { subject: "Intuition", A: report.radarMetrics.intuition, fullMark: 100 },
    { subject: "Ambition", A: report.radarMetrics.ambition, fullMark: 100 },
    { subject: "Empathy", A: report.radarMetrics.empathy, fullMark: 100 },
    { subject: "Logic", A: report.radarMetrics.logic, fullMark: 100 },
    { subject: "Resilience", A: report.radarMetrics.resilience, fullMark: 100 },
    { subject: "Creativity", A: report.radarMetrics.creativity, fullMark: 100 },
  ];

  const domainTabs = [
    {
      id: "career",
      label: "Career & Ambition",
      icon: Briefcase,
      color: "text-amber-400",
    },
    {
      id: "relationships",
      label: "Relationships & Love",
      icon: Heart,
      color: "text-pink-400",
    },
    {
      id: "finance",
      label: "Financial Wealth",
      icon: Coins,
      color: "text-cyan-400",
    },
    {
      id: "health",
      label: "Health & Wellness",
      icon: Activity,
      color: "text-emerald-400",
    },
    {
      id: "personalGrowth",
      label: "Personal Growth",
      icon: Compass,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-8 pb-12 text-slate-100">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AETHERIA LIFE GUIDANCE SYNTHESIS</span>
          </div>
          <h1 className="text-2xl lg:text-4xl font-black text-white">
            Personal Life Path & Guidance Report
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Fusing palm lines, elemental balance, and sacred Tarot spread
            guidance into a unified report.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileJson className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono shadow-xl transition-all flex items-center gap-2 cursor-pointer uppercase"
          >
            <Download className="w-4 h-4" />
            <span>
              {isExporting ? "Generating PDF..." : "Download PDF Report"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Downloadable Report Container */}
      <div
        id="reading-report-container"
        className="rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 lg:p-10 shadow-2xl space-y-10 relative overflow-hidden"
      >
        {/* Report Cover Header */}
        <div className="p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              PERSONALIZED LIFE PATH GUIDANCE REPORT
            </span>
            <h2 className="text-2xl lg:text-3xl font-black text-white">
              {report.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Profile ID: {report.userId} • Date Generated:{" "}
              {new Date(report.timestamp).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-center">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                LIFE RESONANCE
              </span>
              <div className="text-3xl font-black text-white">
                {report.spiritualGuidanceScore}%
              </div>
            </div>
            <div className="w-[1px] h-10 bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                INSIGHT CLARITY
              </span>
              <div className="text-3xl font-black text-emerald-400">
                {report.confidenceScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Archetype & Radar Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Archetype Summary */}
          <div className="lg:col-span-6 space-y-4 rounded-2xl border border-amber-500/30 bg-slate-900/60 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
              <Award className="w-4 h-4" />
              <span>DOMINANT SPIRITUAL ARCHETYPE</span>
            </div>
            <h3 className="text-2xl font-black text-white">
              {report.archetype.title}
            </h3>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              {report.archetype.element}
            </span>
            <p className="text-slate-300 text-sm leading-relaxed">
              {report.archetype.description}
            </p>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400">
                Key Strengths:
              </span>
              <p className="text-xs text-amber-200 mt-1 font-semibold">
                {report.archetype.traits}
              </p>
            </div>
          </div>

          {/* Recharts Radar Matrix Chart */}
          <div className="lg:col-span-6 rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col items-center justify-center">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase mb-2">
              6-AXIS PERSONALITY RADAR
            </span>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={radarData}
                >
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis
                    dataKey="subject"
                    stroke="#94a3b8"
                    tick={{ fill: "#06b6d4", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    stroke="#475569"
                  />
                  <Radar
                    name="Resonance"
                    dataKey="A"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Section 2: Life Trends Timeline */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-400" />
              <span>Life Trajectory & Temporal Momentum</span>
            </h3>
            <span className="text-xs font-mono text-purple-300">
              Present Momentum: {report.lifeTrends.presentMomentum}%
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report.lifeTrends.timeline}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="period"
                  stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <YAxis
                  domain={[50, 100]}
                  stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#a855f7",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#a855f7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 3: Multi-Domain Detailed Guidance */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">
            Multi-Domain Guidance Matrix
          </h3>

          {/* Domain Tabs Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
            {domainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDomainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDomainTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-800 text-white border border-cyan-500/50 shadow-lg"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Domain Guidance Content Box */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <p className="text-slate-200 text-sm leading-relaxed">
              {report.domainGuidance[activeDomainTab].text}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                STRATEGIC ACTION POINTS
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {report.domainGuidance[activeDomainTab].actionPoints.map(
                  (pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Risk Indicators & Actionable Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Alerts */}
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
            <h4 className="font-bold text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Identified Risk Indicators & Vulnerabilities</span>
            </h4>
            <ul className="space-y-2 text-xs text-red-200/90">
              {report.riskIndicators.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Recommendations */}
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Prioritized Growth Recommendations</span>
            </h4>
            <div className="space-y-3 text-xs">
              {report.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800"
                >
                  <div className="flex items-center justify-between font-bold text-white mb-1">
                    <span>{rec.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {rec.impact} Impact
                    </span>
                  </div>
                  <p className="text-slate-300">{rec.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
