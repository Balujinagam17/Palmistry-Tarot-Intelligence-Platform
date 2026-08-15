import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SelectedTarotCard, TarotSpreadResult } from '../types';
import { FULL_TAROT_DECK, TAROT_SPREADS, TarotSpreadTemplate } from '../data/tarotDeck';
import { TarotCardVisual } from './TarotCardVisual';
import {
  Layers,
  Shuffle,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

interface TarotSanctuaryViewProps {
  onSpreadComplete: (result: TarotSpreadResult) => void;
  setActiveTab: (tab: string) => void;
  currentSpread?: TarotSpreadResult;
}

export const TarotSanctuaryView: React.FC<TarotSanctuaryViewProps> = ({
  onSpreadComplete,
  setActiveTab,
  currentSpread,
}) => {
  const [selectedSpreadTemplate, setSelectedSpreadTemplate] = useState<TarotSpreadTemplate>(
    TAROT_SPREADS[1] // Default: 3-Card Timeline Spread
  );

  const [selectedCards, setSelectedCards] = useState<SelectedTarotCard[]>(
    currentSpread?.cards || []
  );

  const [isShuffling, setIsShuffling] = useState(false);
  const [activeCardModal, setActiveCardModal] = useState<SelectedTarotCard | null>(null);

  // Draw or Shuffle Cards
  const handleShuffleAndDraw = () => {
    setIsShuffling(true);
    setSelectedCards([]);

    setTimeout(() => {
      const shuffled = [...FULL_TAROT_DECK].sort(() => Math.random() - 0.5);
      const drawnCards: SelectedTarotCard[] = [];

      const template = selectedSpreadTemplate;
      const count = Math.min(template.cardCount, shuffled.length);

      const elementalBalance: Record<string, number> = {
        Fire: 0,
        Water: 0,
        Air: 0,
        Earth: 0,
      };

      for (let i = 0; i < count; i++) {
        const card = shuffled[i];
        const isReversed = Math.random() < 0.25;
        const pos = template.positions[i] || {
          name: `Position ${i + 1}`,
          description: 'Spiritual focus area',
        };

        drawnCards.push({
          card,
          isReversed,
          positionName: pos.name,
          positionDescription: pos.description,
        });

        elementalBalance[card.element] = (elementalBalance[card.element] || 0) + 1;
      }

      const spreadResult: TarotSpreadResult = {
        spreadName: template.name,
        cards: drawnCards,
        overallEnergy: 'High Cosmic Resonance',
        elementalBalance,
        timestamp: new Date().toISOString(),
      };

      setSelectedCards(drawnCards);
      setIsShuffling(false);
      onSpreadComplete(spreadResult);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-12 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-widest mb-1">
            <Layers className="w-4 h-4" />
            <span>SACRED TAROT SANCTUARY</span>
          </div>
          <h1 className="text-2xl lg:text-4xl font-black text-white">
            Tarot Spread Guidance
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Choose your spread layout, shuffle the 78 Arcana deck, and reveal individual card insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShuffleAndDraw}
            disabled={isShuffling}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>{isShuffling ? 'Shuffling Deck...' : 'Shuffle & Draw Spread'}</span>
          </button>
        </div>
      </div>

      {/* Spread Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TAROT_SPREADS.map((template) => {
          const isSelected = selectedSpreadTemplate.id === template.id;
          return (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedSpreadTemplate(template);
                setSelectedCards([]);
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-purple-950/60 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-purple-400">
                  {template.cardCount} {template.cardCount === 1 ? 'Card' : 'Cards'}
                </span>
                {isSelected && <CheckCircle className="w-4 h-4 text-purple-400" />}
              </div>
              <h4 className="font-bold text-white text-sm mb-1">{template.name}</h4>
              <p className="text-slate-400 text-xs line-clamp-2">{template.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Drawn Spread Stage */}
      <div className="rounded-3xl border border-purple-500/30 bg-slate-950 p-6 lg:p-10 shadow-2xl relative overflow-hidden min-h-[460px] flex flex-col items-center justify-center">
        {isShuffling ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-950 border border-purple-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-pulse">
              <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
            <p className="text-sm font-mono font-bold text-purple-300">
              SHUFFLING 78 ARCANA CARDS & DRAWING SPREAD...
            </p>
          </div>
        ) : selectedCards.length === 0 ? (
          <div className="text-center space-y-4 max-w-md">
            <div className="w-20 h-20 rounded-full bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <Layers className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Ready to Draw: {selectedSpreadTemplate.name}
            </h3>
            <p className="text-slate-400 text-xs">
              Click 'Shuffle & Draw Spread' to draw {selectedSpreadTemplate.cardCount} cards from the deck.
            </p>
            <button
              onClick={handleShuffleAndDraw}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono shadow-lg transition-all cursor-pointer"
            >
              Draw Cards Now
            </button>
          </div>
        ) : (
          <div className="w-full space-y-8">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-lg">{selectedSpreadTemplate.name}</h3>
              </div>
              <span className="text-xs font-mono text-purple-300">
                Click any card to inspect full upright/reversed meanings
              </span>
            </div>

            {/* Cards Grid */}
            <div className="flex flex-wrap items-center justify-center gap-6 py-4">
              {selectedCards.map((item, idx) => (
                <TarotCardVisual
                  key={idx}
                  card={item.card}
                  isFlipped={true}
                  isReversed={item.isReversed}
                  positionLabel={item.positionName}
                  onClick={() => setActiveCardModal(item)}
                />
              ))}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>Elemental Distribution:</span>
                <span className="text-amber-400">
                  Fire: {selectedCards.filter((c) => c.card.element === 'Fire').length}
                </span>
                <span className="text-cyan-400">
                  Water: {selectedCards.filter((c) => c.card.element === 'Water').length}
                </span>
                <span className="text-purple-400">
                  Air: {selectedCards.filter((c) => c.card.element === 'Air').length}
                </span>
                <span className="text-emerald-400">
                  Earth: {selectedCards.filter((c) => c.card.element === 'Earth').length}
                </span>
              </div>

              <button
                onClick={() => setActiveTab('integrated_reading')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
              >
                <span>VIEW AI LIFE REPORT</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {activeCardModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 lg:p-8 max-w-xl w-full shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setActiveCardModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-mono text-xs p-2 rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕ CLOSE
              </button>

              <div className="flex items-start gap-4">
                <TarotCardVisual
                  card={activeCardModal.card}
                  isFlipped={true}
                  isReversed={activeCardModal.isReversed}
                  size="sm"
                />
                <div>
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                    {activeCardModal.positionName}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {activeCardModal.card.name} {activeCardModal.isReversed ? '(Reversed)' : '(Upright)'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {activeCardModal.positionDescription}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <h5 className="font-bold text-cyan-300 font-mono">
                  SIGNIFICANCE IN {activeCardModal.positionName.toUpperCase()}
                </h5>
                <p className="text-slate-200 leading-relaxed">
                  {activeCardModal.isReversed
                    ? activeCardModal.card.meanings.reversed.general
                    : activeCardModal.card.meanings.upright.general}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Career Guidance:</span>
                  <p className="text-amber-300 font-semibold mt-1">
                    {activeCardModal.isReversed
                      ? activeCardModal.card.meanings.reversed.career
                      : activeCardModal.card.meanings.upright.career}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Relationship Guidance:</span>
                  <p className="text-pink-300 font-semibold mt-1">
                    {activeCardModal.isReversed
                      ? activeCardModal.card.meanings.reversed.relationship
                      : activeCardModal.card.meanings.upright.relationship}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
