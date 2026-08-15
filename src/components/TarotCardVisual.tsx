import React from 'react';
import { motion } from 'motion/react';
import { TarotCardData } from '../types';
import { Sparkles, ShieldAlert, Zap, Moon, Sun } from 'lucide-react';

interface TarotCardVisualProps {
  card?: TarotCardData;
  isFlipped?: boolean;
  isReversed?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  positionLabel?: string;
}

export const TarotCardVisual: React.FC<TarotCardVisualProps> = ({
  card,
  isFlipped = true,
  isReversed = false,
  onClick,
  size = 'md',
  positionLabel,
}) => {
  const sizeClasses = {
    sm: 'w-28 h-44 text-xs',
    md: 'w-44 h-72 text-sm',
    lg: 'w-60 h-96 text-base',
  };

  const getElementColor = (element?: string) => {
    switch (element) {
      case 'Fire':
        return 'from-amber-600/30 via-red-900/40 to-slate-950 border-amber-500/60 text-amber-400';
      case 'Water':
        return 'from-cyan-600/30 via-blue-900/40 to-slate-950 border-cyan-500/60 text-cyan-400';
      case 'Air':
        return 'from-purple-600/30 via-indigo-900/40 to-slate-950 border-purple-500/60 text-purple-400';
      case 'Earth':
        return 'from-emerald-600/30 via-teal-900/40 to-slate-950 border-emerald-500/60 text-emerald-400';
      default:
        return 'from-purple-600/30 via-blue-900/40 to-slate-950 border-cyan-500/60 text-cyan-400';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {positionLabel && (
        <span className="mb-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-500/30">
          {positionLabel}
        </span>
      )}
      <motion.div
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`relative cursor-pointer rounded-xl border p-3 backdrop-blur-xl shadow-2xl transition-all duration-300 select-none overflow-hidden ${
          sizeClasses[size]
        } ${getElementColor(card?.element)}`}
      >
        {!isFlipped ? (
          // CARD BACK (Mystic Cyber Grid Design)
          <div className="w-full h-full rounded-lg border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)]" />
            <div className="w-16 h-16 rounded-full border-2 border-cyan-400/40 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-cyan-300/70 uppercase">AETHER DECK</span>
          </div>
        ) : card ? (
          // CARD FRONT (Detailed Arcana View)
          <div
            className={`w-full h-full flex flex-col justify-between relative ${
              isReversed ? 'rotate-180' : ''
            }`}
          >
            {/* Header: Number & Element Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono font-bold text-xs text-white/80">#{card.number}</span>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                {card.element}
              </span>
            </div>

            {/* Center Symbol / Arcana Graphic */}
            <div className="my-auto flex flex-col items-center justify-center p-2 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                {card.number % 3 === 0 ? (
                  <Sun className="w-7 h-7 text-amber-400 animate-spin-slow" />
                ) : card.number % 3 === 1 ? (
                  <Moon className="w-7 h-7 text-cyan-400" />
                ) : (
                  <Zap className="w-7 h-7 text-purple-400" />
                )}
              </div>
              <h4 className="font-bold font-serif text-white tracking-wide">{card.name}</h4>
              <span className="text-[11px] text-cyan-300/80 font-mono mt-0.5">{card.arcana} Arcana</span>
            </div>

            {/* Keywords Pills */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex flex-wrap gap-1 justify-center">
                {card.keywords.slice(0, 2).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-black/40 text-cyan-200 border border-white/10"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Reversed Banner */}
            {isReversed && (
              <div className="absolute top-1/2 left-0 right-0 bg-red-950/90 text-red-300 text-[10px] font-mono font-bold text-center py-1 -rotate-12 border-y border-red-500/50 shadow-lg">
                REVERSED
              </div>
            )}
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};
