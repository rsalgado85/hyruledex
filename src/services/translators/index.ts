/**
 * Translators — Barrel export
 *
 * Central export point for all Hyrule-facing translators.
 * Components and hooks import from here to get Zelda-nomenclature types.
 *
 * Usage:
 *   import { toHyruleCharacter, getAttributeLabel } from '@/services/translators';
 *   import type { HyruleCharacter } from '@/services/translators';
 */

// ─── Types ─────────────────────────────────────────────────────────────────

export type {
  HyruleCharacter,
  HyruleCharacterWithStats,
  HyruleCharacterStats,
  HyruleCharacterImage,
  HyruleRace,
  HyruleAttribute,
  HyruleSkill,
  HyruleTechnique,
  HyruleCharacterRanking,
  HyruleComparisonData,
  HyruleStatDifference,
  HyruleRaceDistribution,
  HyruleRaceAverage,
  HyruleStatDistribution,
  HyruleLore,
  HyruleEra,
  HyruleEraFilter,
  HyruleTimeline,
  HyruleTimelineNode,
  HyruleTimelineDetail,
} from './types';

// ─── Character Translator ──────────────────────────────────────────────────

export {
  toHyruleCharacter,
  toHyruleImage,
  toHyruleStats,
  toHyruleCharacterWithStats,
  toHyruleRanking,
  toHyruleComparison,
  toHyruleStatDiff,
  toHyruleRaceDistribution,
  toHyruleRaceAverage,
  toHyruleStatDistribution,
  toHyruleLore,
  getAttributeLabel,
  getAttributeLabels,
} from './characterTranslator';

// ─── Era Translator ────────────────────────────────────────────────────────

export {
  toHyruleEra,
  toHyruleEraList,
  ERA_THEMES,
} from './eraTranslator';

// ─── Timeline Translator ───────────────────────────────────────────────────

export {
  toHyruleTimeline,
  toHyruleTimelineNode,
  toHyruleTimelineDetail,
} from './timelineTranslator';
