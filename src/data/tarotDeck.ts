import { TarotCardData } from '../types';
import tarotKbData from './knowledge_base/tarot_kb.json';

export const FULL_TAROT_DECK: TarotCardData[] = tarotKbData.cards.map((c: any) => ({
  id: c.id,
  name: c.name,
  arcana: c.arcana as 'Major' | 'Minor',
  number: c.number,
  element: c.element,
  keywords: c.keywords,
  meanings: c.meanings,
}));

export interface TarotSpreadTemplate {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: { name: string; description: string }[];
}

export const TAROT_SPREADS: TarotSpreadTemplate[] = [
  {
    id: 'single_daily',
    name: 'Single Arcana (Daily Insight)',
    description: 'A focused, single-card draw providing immediate guidance on present moment energy.',
    cardCount: 1,
    positions: [
      {
        name: 'The Focal Core',
        description: 'The dominant spiritual theme governing your current phase.',
      },
    ],
  },
  {
    id: 'three_card_timeline',
    name: '3-Card Temporal Spread (Past, Present, Future)',
    description: 'Explores the temporal progression of your life trajectory and immediate next horizon.',
    cardCount: 3,
    positions: [
      {
        name: '1. Root Foundation (Past)',
        description: 'Historical cause, ancestral momentum, or prior lesson learned.',
      },
      {
        name: '2. Active Portal (Present)',
        description: 'Current energetic state, primary choice, and present situation.',
      },
      {
        name: '3. Emergent Horizon (Future)',
        description: 'Likely outcome based on present choices and momentum.',
      },
    ],
  },
  {
    id: 'five_elemental',
    name: '5-Card Elemental Harmony Spread',
    description: 'Examines the 5 core dimensions: Mind (Air), Heart (Water), Soul (Fire), Foundation (Earth), Spirit (Ether).',
    cardCount: 5,
    positions: [
      { name: 'Air (Cognitive Mind)', description: 'Intellectual direction and clarity of thought.' },
      { name: 'Water (Emotional Heart)', description: 'Relational depth, feelings, and intuition.' },
      { name: 'Fire (Volitional Soul)', description: 'Ambition, creative drive, and action energy.' },
      { name: 'Earth (Physical Foundation)', description: 'Financial stability, health, and practical assets.' },
      { name: 'Ether (Spiritual Purpose)', description: 'Core soul path and divine synchronicities.' },
    ],
  },
  {
    id: 'celtic_cross',
    name: 'Celtic Cross Master Spread (10 Cards)',
    description: 'The definitive comprehensive tarot spread mapping internal psychology, external environment, hopes, fears, and ultimate destiny.',
    cardCount: 10,
    positions: [
      { name: '1. Present Situation', description: 'Core state of the query.' },
      { name: '2. Immediate Challenge', description: 'Crossing force or obstacle.' },
      { name: '3. Distant Past', description: 'Underlying foundation.' },
      { name: '4. Recent Past', description: 'Passing energies leaving your sphere.' },
      { name: '5. Highest Potential', description: 'Best achievable outcome.' },
      { name: '6. Near Future', description: 'Immediate next step.' },
      { name: '7. Self Projection', description: 'Your attitude and self-belief.' },
      { name: '8. External Environment', description: 'Influence of others and surroundings.' },
      { name: '9. Hopes & Secret Fears', description: 'Subconscious motivations.' },
      { name: '10. Ultimate Destiny', description: 'Synthesized long-term culmination.' },
    ],
  },
];
