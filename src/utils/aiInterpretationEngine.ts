import {
  IntegratedReadingReport,
  PalmAnalysisResult,
  TarotSpreadResult,
  UserProfile,
} from "../types";

import personalityKbData from "../data/knowledge_base/personality_kb.json";
import recommendationsKbData from "../data/knowledge_base/recommendations_kb.json";

type FeatureScores = {
  vitality: number;
  logic: number;
  creativity: number;
  empathy: number;
  ambition: number;
  intuition: number;
};

type BackendFeatureData = {
  thumb_length?: number;
  index_length?: number;
  middle_length?: number;
  ring_length?: number;
  pinky_length?: number;
  palm_width?: number;
  palm_height?: number;
  aspect_ratio?: number;
};

const clamp = (value: number, min = 0, max = 100): number => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

const safeNumber = (value: unknown, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

function getPalmFeatureScores(palmAnalysis: PalmAnalysisResult): FeatureScores {
  const palm = palmAnalysis as PalmAnalysisResult & {
    featureScores?: Partial<FeatureScores>;
    features?: BackendFeatureData;
    backendFeatures?: BackendFeatureData;
    analysis?: {
      features?: BackendFeatureData;
    };
  };

  // Preferred: scores already calculated by the frontend.
  const existing = palm.featureScores;

  if (existing && typeof existing === "object") {
    return {
      vitality: clamp(safeNumber(existing.vitality, 90), 0, 100),
      logic: clamp(safeNumber(existing.logic, 88), 0, 100),
      creativity: clamp(safeNumber(existing.creativity, 88), 0, 100),
      empathy: clamp(safeNumber(existing.empathy, 85), 0, 100),
      ambition: clamp(safeNumber(existing.ambition, 88), 0, 100),
      intuition: clamp(safeNumber(existing.intuition, 86), 0, 100),
    };
  }

  // Next: use the real backend feature values when they are attached to
  // the converted PalmAnalysisResult.
  const backend =
    palm.features || palm.backendFeatures || palm.analysis?.features || {};

  const aspectRatio = safeNumber(backend.aspect_ratio, 1.2);
  const palmWidth = safeNumber(backend.palm_width, 0.45);
  const palmHeight = safeNumber(backend.palm_height, 0.54);

  const indexLength = safeNumber(backend.index_length, 0.96);
  const middleLength = safeNumber(backend.middle_length, 1.0);
  const ringLength = safeNumber(backend.ring_length, 0.97);
  const thumbLength = safeNumber(backend.thumb_length, 0.75);

  const vitality = clamp(
    70 + palmHeight * 25 + middleLength * 8 - Math.abs(aspectRatio - 1.2) * 10,
    60,
    99,
  );

  const logic = clamp(
    70 + indexLength * 18 + middleLength * 10 + palmWidth * 8,
    60,
    99,
  );

  const creativity = clamp(
    68 + ringLength * 18 + palmWidth * 12 + Math.abs(aspectRatio - 1.0) * 8,
    60,
    99,
  );

  const empathy = clamp(
    68 + palmHeight * 20 + palmWidth * 18 + thumbLength * 8,
    60,
    99,
  );

  const ambition = clamp(
    68 + middleLength * 16 + indexLength * 14 + thumbLength * 8,
    60,
    99,
  );

  const intuition = clamp(
    68 + palmHeight * 18 + ringLength * 12 + palmWidth * 12,
    60,
    99,
  );

  return {
    vitality,
    logic,
    creativity,
    empathy,
    ambition,
    intuition,
  };
}

export function generateIntegratedReadingReport(
  user: UserProfile,
  palmAnalysis: PalmAnalysisResult,
  tarotSpread: TarotSpreadResult,
): IntegratedReadingReport {
  // ---------------------------------------------------------
  // 1. Normalize inputs
  // ---------------------------------------------------------

  const safePalm = palmAnalysis || ({} as PalmAnalysisResult);
  const safeTarot = tarotSpread || ({} as TarotSpreadResult);

  const palmConf = safeNumber(safePalm.handLandmarks?.overallConfidence, 88);

  const cards = Array.isArray(safeTarot.cards) ? safeTarot.cards : [];

  const tarotCardsCount = cards.length;
  const tarotConf = tarotCardsCount > 0 ? 95 : 75;

  const confidenceScore = Math.round(
    clamp(palmConf, 0, 100) * 0.55 + tarotConf * 0.45,
  );

  // ---------------------------------------------------------
  // 2. Calculate personality/radar features safely
  // ---------------------------------------------------------

  const baseFeatures = getPalmFeatureScores(safePalm);

  const el =
    safeTarot.elementalBalance && typeof safeTarot.elementalBalance === "object"
      ? safeTarot.elementalBalance
      : {};

  const fireBonus = safeNumber(el.Fire, 0) * 4;
  const waterBonus = safeNumber(el.Water, 0) * 4;
  const airBonus = safeNumber(el.Air, 0) * 4;
  const earthBonus = safeNumber(el.Earth, 0) * 4;

  const radarMetrics = {
    intuition: clamp(baseFeatures.intuition + waterBonus, 60, 99),

    ambition: clamp(baseFeatures.ambition + fireBonus, 60, 99),

    empathy: clamp(baseFeatures.empathy + waterBonus, 60, 99),

    logic: clamp(baseFeatures.logic + airBonus, 60, 99),

    resilience: clamp(baseFeatures.vitality + earthBonus, 60, 99),

    creativity: clamp(baseFeatures.creativity + airBonus, 60, 99),
  };

  // ---------------------------------------------------------
  // 3. Spiritual Guidance Score
  // ---------------------------------------------------------

  const spiritualGuidanceScore = Math.round(
    radarMetrics.intuition * 0.25 +
      radarMetrics.ambition * 0.2 +
      radarMetrics.creativity * 0.2 +
      radarMetrics.resilience * 0.2 +
      confidenceScore * 0.15,
  );

  // ---------------------------------------------------------
  // 4. Determine Archetype
  // ---------------------------------------------------------

  let archetype = personalityKbData.archetypes.luminary_visionary;

  if (radarMetrics.intuition > 90 && radarMetrics.empathy > 88) {
    archetype = personalityKbData.archetypes.mystic_healer;
  } else if (radarMetrics.logic > 90 && radarMetrics.ambition > 88) {
    archetype = personalityKbData.archetypes.sovereign_strategist;
  } else if (radarMetrics.creativity > 90 && radarMetrics.ambition > 90) {
    archetype = personalityKbData.archetypes.catalyst_pioneer;
  }

  // ---------------------------------------------------------
  // 5. Life Trends & Timeline
  // ---------------------------------------------------------

  const pastScore = Math.round(radarMetrics.resilience * 0.9);

  const presentScore = spiritualGuidanceScore;

  const futureScore = Math.min(98, Math.round(spiritualGuidanceScore * 1.08));

  const lifeTrends = {
    pastTrajectory: pastScore,
    presentMomentum: presentScore,
    futurePotential: futureScore,

    timeline: [
      {
        period: "Past Phase (12-24 mos)",
        focus: "Consolidation & Re-alignment of Core Identity",
        score: pastScore,
      },
      {
        period: "Present Momentum (Now)",
        focus: "Catalytic Breakthroughs & Intuitive Action",
        score: presentScore,
      },
      {
        period: "Near Future (3-6 mos)",
        focus: "Strategic Horizon Expansion & Manifestation",
        score: Math.round((presentScore + futureScore) / 2),
      },
      {
        period: "Long Term (12+ mos)",
        focus: "Mastery, Prosperity & Legacy Consolidation",
        score: futureScore,
      },
    ],
  };

  // ---------------------------------------------------------
  // 6. Tarot card
  // ---------------------------------------------------------

  const primaryCard = cards[0]?.card;
  const cardName = primaryCard?.name || "The Arcana";

  const palmClass =
    (
      safePalm as PalmAnalysisResult & {
        palmClass?: string;
      }
    ).palmClass || "balanced";

  // ---------------------------------------------------------
  // 7. Multi-Domain Guidance
  // ---------------------------------------------------------

  const domainGuidance = {
    career: {
      score: Math.round((radarMetrics.ambition + radarMetrics.logic) / 2),

      text: `Your ${palmClass} palm architecture combined with ${cardName} signals a powerful shift toward leadership autonomy. Capitalize on your sharp Head Line clarity to restructure workflow bottlenecks.`,

      actionPoints: [
        "Take initiative on high-visibility strategic projects.",
        "Refine negotiation boundaries to secure earned equity or promotion.",
        "Leverage your intuitive market insight for rapid innovation.",
      ],
    },

    relationships: {
      score: Math.round((radarMetrics.empathy + radarMetrics.intuition) / 2),

      text: `A deep Heart Line curving toward Jupiter reflects your unwavering commitment to authentic soul connections. Your energy attracts partners who value mutual growth and transparent vulnerability.`,

      actionPoints: [
        "Practice open emotional expression with trusted allies.",
        "Protect personal boundaries against energy draining dynamics.",
        "Plan collaborative experiences that foster shared joy.",
      ],
    },

    finance: {
      score: Math.round((radarMetrics.logic + radarMetrics.resilience) / 2),

      text: `A prominent Fate Line and Sun Line indicate strong potential for multifaceted wealth accumulation. Discipline in portfolio management yields high long-term stability.`,

      actionPoints: [
        "Diversify income streams across tangible assets and digital IP.",
        "Avoid impulse expenditures during high emotional cycles.",
        "Reinvest surplus in skill mastery and long-term security.",
      ],
    },

    health: {
      score: Math.round((radarMetrics.resilience + radarMetrics.intuition) / 2),

      text: `Your robust Life Line arc provides high stamina, but balance is paramount. Integrate somatic nervous system cooling protocols to harmonize high cognitive drive.`,

      actionPoints: [
        "Incorporate daily somatic breathwork or grounding walks.",
        "Prioritize deep restorative sleep cycles.",
        "Maintain hydration and organic mineral nourishment.",
      ],
    },

    personalGrowth: {
      score: Math.round((radarMetrics.creativity + radarMetrics.intuition) / 2),

      text: `You stand at a pivotal spiritual threshold. The synergy between your palm landmarks and tarot guidance encourages unburdened self-trust.`,

      actionPoints: [
        "Dedicate 15 minutes daily to meditative contemplation.",
        "Document intuitive synchronicities and dreams in a journal.",
        "Embrace continuous learning in advanced creative domains.",
      ],
    },
  };

  // ---------------------------------------------------------
  // 8. Risk Indicators
  // ---------------------------------------------------------

  const riskIndicators = [
    "Cognitive Fatigue: High mental speed may lead to overthinking if ungrounded.",
    "Over-Giving: Generous Heart Line requires firm boundary enforcement in emotional commitments.",
    "Impatient Momentum: Desire for rapid outcomes must be balanced with steady strategic pacing.",
  ];

  // ---------------------------------------------------------
  // 9. Recommendations
  // ---------------------------------------------------------

  const recommendationGroups = recommendationsKbData?.recommendations;

  const candidates = [
    recommendationGroups?.career?.[0],
    recommendationGroups?.relationships?.[0],
    recommendationGroups?.wellness?.[0],
    recommendationGroups?.finance?.[0],
  ].filter(Boolean);

  const recs = candidates.map((r: any) => ({
    title: r.title,
    action: r.action,
    timeline: r.timeline,
    impact: r.impact as "High" | "Transformative" | "Medium",
  }));

  // ---------------------------------------------------------
  // 10. Final report
  // ---------------------------------------------------------

  return {
    id: `report-${Date.now().toString(36)}`,
    userId: user?.id || "",
    title: `Spiritual Intelligence Analysis - ${user?.name || "Seeker"}`,
    timestamp: new Date().toISOString(),

    palmAnalysis: safePalm,
    tarotSpread: safeTarot,

    spiritualGuidanceScore,
    confidenceScore,

    archetype,
    radarMetrics,
    lifeTrends,
    domainGuidance,
    riskIndicators,
    recommendations: recs,
  };
}
