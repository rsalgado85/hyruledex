/**
 * Provider Types — Generic interfaces for the abstraction layer
 *
 * These types define the contract that any game data provider must fulfill.
 * Currently implemented by PokeApiProvider, but designed to be agnostic
 * so future providers (Hyrule Compendium, Zelda Fan API) can be swapped in.
 *
 * Architecture Decision:
 * We use generic interfaces (not concrete types) so the rest of the app
 * never imports provider-specific types. This is the core of FASE 2.
 */

// ─── List / Collection Types ───────────────────────────────────────────────

export interface DataListItem {
  name: string;
  url: string;
  id?: number;
}

export interface DataListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DataListItem[];
}

// ─── Character (formerly Pokémon) ──────────────────────────────────────────

export interface CharacterType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface CharacterStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface CharacterAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface CharacterSprites {
  front_default: string;
  front_shiny: string;
  other: {
    'official-artwork': {
      front_default: string;
      front_shiny: string;
    };
    showdown: {
      front_default: string;
    };
  };
}

export interface CharacterMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
}

export interface Character {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  types: CharacterType[];
  stats: CharacterStat[];
  abilities: CharacterAbility[];
  sprites: CharacterSprites;
  species: {
    name: string;
    url: string;
  };
  moves?: CharacterMove[];
}

export interface CharacterSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
  evolution_chain: {
    url: string;
  };
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
}

export interface EvolutionChain {
  chain: EvolutionNode;
}

export interface EvolutionNode {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionNode[];
}

export interface TypeResponse {
  name: string;
  pokemon: {
    pokemon: DataListItem;
    slot: number;
  }[];
}

export interface Ability {
  name: string;
  effect_entries: {
    effect: string;
    language: {
      name: string;
    };
  }[];
}

// ─── Derived / Computed Types ──────────────────────────────────────────────

export interface CharacterStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface CharacterWithStats extends Character {
  computedStats: CharacterStats;
  totalStats: number;
  dominantType: string;
  imageUrl: string;
  artworkUrl: string;
}

export interface TypeDistribution {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface StatDistribution {
  range: string;
  count: number;
}

export interface CharacterRanking {
  id: number;
  name: string;
  imageUrl: string;
  stat: number;
  statName: string;
  types: string[];
}

export interface ComparisonData {
  character1: CharacterWithStats | null;
  character2: CharacterWithStats | null;
  differences: StatDifference[];
}

export interface StatDifference {
  stat: string;
  value1: number;
  value2: number;
  difference: number;
  percentageDiff: number;
  winner: 1 | 2 | 0;
}

export interface TypeAverage {
  type: string;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  count: number;
}

// ─── Generation / Era Types ────────────────────────────────────────────────

export interface GenerationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface Generation {
  id: number;
  name: string;
  abilities: { name: string; url: string }[];
  main_region: { name: string; url: string };
  moves: { name: string; url: string }[];
  names: {
    name: string;
    language: { name: string; url: string };
  }[];
  pokemon_species: { name: string; url: string }[];
  types: { name: string; url: string }[];
  version_groups: { name: string; url: string }[];
}

export interface GenerationInfo {
  id: number;
  name: string;
  displayName: string;
  region: string;
  pokemonCount: number;
  pokemonSpecies: { name: string; url: string }[];
}

export interface GenerationFilter {
  generationId: number | null;
  type: string | null;
  region: string | null;
  habitat: string | null;
  color: string | null;
  shape: string | null;
  isLegendary: boolean | null;
  isMythical: boolean | null;
  isBaby: boolean | null;
  isEvolvable: boolean | null;
  searchQuery: string;
}

// ─── Species Info ──────────────────────────────────────────────────────────

export interface SpeciesInfo {
  id: number;
  name: string;
  color: string;
  shape: string;
  habitat: string | null;
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  growth_rate: string;
  egg_groups: string[];
  evolution_chain_url: string;
  evolves_from_species: string | null;
  flavor_text: string;
  genus: string;
}

// ─── Evolution ─────────────────────────────────────────────────────────────

export interface EvolutionDetail {
  item: string | null;
  trigger: string;
  gender: number | null;
  held_item: string | null;
  known_move: string | null;
  known_move_type: string | null;
  location: string | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: string | null;
  party_type: string | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: string | null;
  turn_upside_down: boolean;
}

export interface EvolutionNodeData {
  species_name: string;
  species_id: number;
  min_level: number | null;
  trigger: string;
  item: string | null;
  details: EvolutionDetail | null;
  children: EvolutionNodeData[];
}

export interface EvolutionChainData {
  id: number;
  chain: EvolutionNodeData;
  all_species: string[];
}
