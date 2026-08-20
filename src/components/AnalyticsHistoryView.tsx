import React from "react";
import { motion } from "motion/react";
import { IntegratedReadingReport } from "../types";

import {
  BarChart3,
  Eye,
} from "lucide-react";

interface AnalyticsHistoryViewProps {
  history: IntegratedReadingReport[];
  onSelectReport: (
    report: IntegratedReadingReport
  ) => void;
}

export const AnalyticsHistoryView: React.FC<
  AnalyticsHistoryViewProps
> = ({
  history,
  onSelectReport,
}) => {
  const safeHistory = Array.isArray(history)
    ? history
    : [];

  const averageScore =
    safeHistory.length > 0
      ? Math.round(
          safeHistory.reduce(
            (total, report) =>
              total +
              Number(
                report?.spiritualGuidanceScore ||
                  0
              ),
            0
          ) / safeHistory.length
        )
      : 92;

  return (
    <div className="space-y-8 pb-12 text-slate-100">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">

        <div>

          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-1">

            <BarChart3 className="w-4 h-4" />

            <span>
              PERSONAL READING HISTORY
            </span>

          </div>

          <h1 className="text-2xl lg:text-4xl font-black text-white">
            Historical Trends & Past Readings
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Review past spiritual guidance readings,
            monitor score evolution, and inspect
            personal trajectory trends over time.
          </p>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* TOTAL */}

        <div className="p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur-xl">

          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
            TOTAL READINGS GENERATED
          </span>

          <div className="text-3xl font-black text-white mt-2">
            {safeHistory.length}
          </div>

          <span className="text-xs text-slate-400 font-mono mt-1">
            Saved in Sanctuary Account
          </span>

        </div>

        {/* AVERAGE */}

        <div className="p-5 rounded-2xl border border-purple-500/30 bg-slate-900/80 backdrop-blur-xl">

          <span className="text-xs font-mono font-bold text-purple-400 uppercase">
            AVERAGE LIFE RESONANCE
          </span>

          <div className="text-3xl font-black text-white mt-2">
            {averageScore}%
          </div>

          <span className="text-xs text-purple-300 font-mono mt-1">
            Consistent High Alignment
          </span>

        </div>

        {/* RESONANCE */}

        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-slate-900/80 backdrop-blur-xl">

          <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
            INSIGHT RESONANCE RATE
          </span>

          <div className="text-3xl font-black text-white mt-2">
            98.5%
          </div>

          <span className="text-xs text-emerald-400 font-mono mt-1">
            Private & Encrypted Data
          </span>

        </div>

      </div>

      {/* HISTORY */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">

          <h3 className="font-bold text-white text-lg">
            Reading History Records
          </h3>

          <span className="text-xs font-mono text-slate-400">
            Showing {safeHistory.length}{" "}
            {safeHistory.length === 1
              ? "record"
              : "records"}
          </span>

        </div>

        {/* EMPTY */}

        {safeHistory.length === 0 ? (

          <div className="p-12 text-center text-slate-500 text-sm font-mono">

            No readings generated yet.

            <br />

            Perform a Palm Scan or Tarot Draw
            to save your first reading.

          </div>

        ) : (

          <div className="space-y-3">

            {safeHistory.map(
              (
                item: IntegratedReadingReport,
                index: number
              ) => {

                const itemId =
                  item?.id ||
                  `history-${index}`;

                const archetypeTitle =
                  item?.archetype?.title ||
                  "Palm Reading";

                const title =
                  item?.title ||
                  "Palm Analysis";

                const palmClass =
                  item?.palmAnalysis?.palmClass ||
                  item?.palmAnalysis?.hand ||
                  "Palm Analysis";

                const score =
                  Number(
                    item?.spiritualGuidanceScore ||
                      0
                  );

                const timestamp =
                  item?.timestamp
                    ? new Date(
                        item.timestamp
                      ).toLocaleString()
                    : "Date unavailable";

                return (
                  <motion.div
                    key={String(itemId)}
                    whileHover={{ x: 4 }}
                    onClick={() =>
                      onSelectReport(item)
                    }
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >

                    <div className="space-y-1">

                      <div className="flex items-center gap-2 flex-wrap">

                        <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold uppercase border border-cyan-500/30">
                          {archetypeTitle}
                        </span>

                        <h4 className="font-bold text-white text-sm">
                          {title}
                        </h4>

                      </div>

                      <p className="text-xs text-slate-400 font-mono">

                        Date: {timestamp}

                        {" • "}

                        Palm Class: {palmClass}

                      </p>

                    </div>

                    <div className="flex items-center gap-6 shrink-0">

                      <div className="text-right">

                        <span className="text-[10px] font-mono text-slate-400">
                          LIFE RESONANCE
                        </span>

                        <p className="text-lg font-black text-cyan-400">
                          {score}%
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectReport(item);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
};