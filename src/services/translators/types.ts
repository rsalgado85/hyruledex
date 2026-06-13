/**
 * Translator Types — Hyrule-facing output types
 *
 * These types represent the "ideal" HyruleDex data model.
 * Translators map from generic provider types → these Hyrule-specific types.
 *
 * The rest of the app imports from here (or from the translator index),
 * never from provider types directly. This completes the abstraction.
 */

// ─── Character (formerly Pokémon) ──────────────────────────────────────────

export interface HyruleCharacter {
  id: number;
  name: string;
  hearts: number;
  height: number;
  weight: number;
  races: HyruleRace[];
  attributes: HyruleAttribute[];
  skills: HyruleSkill[];
  image: HyruleCharacterImage;
  category: {
    name: string;
    url: string;
  };
  techniques?: HyruleTechnique[];
}

export interface HyruleRace {
  slot: number;
  race: {
    name: string;
    url: string;
  };
}

export interface HyruleAttribute {
  baseValue: number;
  effort: number;
  attribute: {
    name: string;
    url: string;
  };
}

export interface HyruleSkill {
  skill: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface HyruleCharacterImage {
  front_default: string;
  front_shiny: string;
  official: string;
  officialShiny: string;
  showdown: string;
}

export interface HyruleTechnique {
  technique: {
    name: string;
    url: string;
  };
  learnDetails: {
    levelLearnedAt: number;
    method: string;
    versionGroup: string;
  }[];
}

// ─── Computed Character ────────────────────────────────────────────────────

export interface HyruleCharacterStats {
  hearts: number;
  strength: number;
  defense: number;
  wisdom: number;
  spirit: number;
  speed: number;
}

export interface HyruleCharacterWithStats extends HyruleCharacter {
  computedStats: HyruleCharacterStats;
  totalStats: number;
  dominantRace: string;
  imageUrl: string;
  artworkUrl: string;
}

// ─── Race (formerly Type) ──────────────────────────────────────────────────

export interface HyruleRaceDistribution {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface HyruleRaceAverage {
  race: string;
  hearts: number;
  strength: number;
  defense: number;
  wisdom: number;
  spirit: number;
  speed: number;
  count: number;
}

// ─── Era (formerly Generation) ─────────────────────────────────────────────

export interface HyruleEra {
  id: number;
  name: string;
  displayName: string;
  kingdom: string;
  characterCount: number;
  characters: { name: string; url: string }[];
}

export interface HyruleEraFilter {
  eraId: number | null;
  race: string | null;
  kingdom: string | null;
  biome: string | null;
  color: string | null;
  shape: string | null;
  isAncient: boolean | null;
  isDeity: boolean | null;
  isBaby: boolean | null;
  searchQuery: string;
}

// ─── Timeline (formerly Evolution) ─────────────────────────────────────────

export interface HyruleTimelineDetail {
  item: string | null;
  trigger: string;
  gender: number | null;
  heldItem: string | null;
  knownMove: string | null;
  knownMoveType: string | null;
  location: string | null;
  minLevel: number | null;
  minHappiness: number | null;
  minBeauty: number | null;
  minAffection: number | null;
  needsOverworldRain: boolean;
  partySpecies: string | null;
  partyType: string | null;
  relativePhysicalStats: number | null;
  timeOfDay: string;
  tradeSpecies: string | null;
  turnUpsideDown: boolean;
}

export interface HyruleTimelineNode {
  characterName: string;
  characterId: number;
  minLevel: number | null;
  trigger: string;
  item: string | null;
  details: HyruleTimelineDetail | null;
  children: HyruleTimelineNode[];
}

export interface HyruleTimeline {
  id: number;
  chain: HyruleTimelineNode;
  allCharacters: string[];
}

// ─── Rankings ──────────────────────────────────────────────────────────────

export interface HyruleCharacterRanking {
  id: number;
  name: string;
  imageUrl: string;
  stat: number;
  statName: string;
  races: string[];
}

// ─── Comparison ────────────────────────────────────────────────────────────

export interface HyruleComparisonData {
  character1: HyruleCharacterWithStats | null;
  character2: HyruleCharacterWithStats | null;
  differences: HyruleStatDifference[];
}

export interface HyruleStatDifference {
  stat: string;
  value1: number;
  value2: number;
  difference: number;
  percentageDiff: number;
  winner: 1 | 2 | 0;
}

// ─── Stat Distribution ─────────────────────────────────────────────────────

export interface HyruleStatDistribution {
  range: string;
  count: number;
}

// ─── Species / Lore ────────────────────────────────────────────────────────

export interface HyruleLore {
  id: number;
  name: string;
  color: string;
  shape: string;
  biome: string | null;
  isAncient: boolean;
  isDeity: boolean;
  isBaby: boolean;
  genderRate: number;
  captureRate: number;
  baseHappiness: number;
  growthRate: string;
  eggGroups: string[];
  timelineUrl: string;
  evolvesFrom: string | null;
  description: string;
  genus: string;
}
