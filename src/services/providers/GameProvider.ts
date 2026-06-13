/**
 * GameProvider — Generic interface for any game data source
 *
 * This is the top-level provider interface. Every data provider
 * (PokeAPI, Hyrule Compendium, Zelda Fan API) must implement this.
 *
 * The interface exposes methods for listing and fetching:
 * - Characters (formerly Pokémon)
 * - Character species/details
 * - Evolution chains / timelines
 * - Generations / eras
 * - Types / races
 * - Abilities / skills
 */

import type {
  DataListResponse,
  Character,
  CharacterSpecies,
  EvolutionChain,
  TypeResponse,
  Ability,
  GenerationResponse,
  Generation,
  GenerationInfo,
  SpeciesInfo,
  EvolutionChainData,
} from './types';

export interface GameProvider {
  /** Provider name identifier (e.g. 'pokeapi', 'hyrule-compendium') */
  readonly name: string;

  // ─── Character (Pokémon) ───────────────────────────────────────────

  /** Fetch paginated list of all characters */
  fetchCharacterList(): Promise<DataListResponse>;

  /** Fetch a single character by ID or name */
  fetchCharacter(id: number | string): Promise<Character>;

  /** Fetch multiple characters in parallel with concurrency control */
  fetchMultipleCharacters(ids: number[], concurrency?: number): Promise<Character[]>;

  // ─── Species / Details ─────────────────────────────────────────────

  /** Fetch species data for a character */
  fetchCharacterSpecies(id: number): Promise<CharacterSpecies>;

  /** Fetch enriched species info */
  fetchSpeciesInfo(id: number): Promise<SpeciesInfo | null>;

  /** Fetch species info by name */
  fetchSpeciesInfoByName(name: string): Promise<SpeciesInfo | null>;

  // ─── Evolution / Timeline ──────────────────────────────────────────

  /** Fetch evolution chain by ID */
  fetchEvolutionChain(id: number): Promise<EvolutionChain>;

  /** Fetch evolution chain by species ID */
  fetchEvolutionChainBySpeciesId(speciesId: number): Promise<EvolutionChainData | null>;

  // ─── Types / Races ─────────────────────────────────────────────────

  /** Fetch all characters of a specific type */
  fetchCharactersByType(typeName: string): Promise<TypeResponse>;

  // ─── Abilities / Skills ────────────────────────────────────────────

  /** Fetch ability details */
  fetchAbility(abilityName: string): Promise<Ability>;

  // ─── Generations / Eras ────────────────────────────────────────────

  /** Fetch list of all generations */
  fetchGenerationsList(): Promise<GenerationResponse>;

  /** Fetch details for a specific generation */
  fetchGeneration(id: number): Promise<Generation>;

  /** Fetch all generations with enriched details */
  fetchAllGenerations(): Promise<GenerationInfo[]>;
}
