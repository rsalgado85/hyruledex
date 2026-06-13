/**
 * CharacterProvider — Interface for character-specific data operations
 *
 * Provides methods for querying characters by various criteria:
 * - By type/race
 * - By generation/era
 * - By habitat/biome
 * - By color, shape, legendary status, etc.
 *
 * This is a specialized sub-interface of GameProvider.
 */

import type { Character, CharacterWithStats, DataListResponse } from './types';

export interface CharacterProvider {
  /** Fetch characters filtered by type/race */
  fetchByType(typeName: string): Promise<DataListResponse>;

  /** Fetch characters filtered by generation/era */
  fetchByGeneration(generationId: number): Promise<DataListResponse>;

  /** Fetch characters filtered by habitat/biome */
  fetchByHabitat(habitat: string): Promise<DataListResponse>;

  /** Fetch characters filtered by color */
  fetchByColor(color: string): Promise<DataListResponse>;

  /** Enrich a character with computed stats */
  enrichCharacter(character: Character): CharacterWithStats;
}
