/**
 * MonsterProvider — Interface for monster-specific data operations
 *
 * For providers that distinguish between characters and monsters
 * (e.g. Hyrule Compendium has separate categories for monsters).
 * For PokeAPI, this is the same as CharacterProvider.
 */

import type { Character, CharacterWithStats, DataListResponse } from './types';

export interface MonsterProvider {
  /** Fetch paginated list of monsters */
  fetchMonsterList(): Promise<DataListResponse>;

  /** Fetch a single monster by ID or name */
  fetchMonster(id: number | string): Promise<Character>;

  /** Fetch multiple monsters in parallel */
  fetchMultipleMonsters(ids: number[], concurrency?: number): Promise<Character[]>;

  /** Enrich a monster with computed stats */
  enrichMonster(monster: Character): CharacterWithStats;
}
