/**
 * Generation Service — Delegates to the active GameProvider
 *
 * All generation data now flows through the GameProvider interface.
 * The provider handles caching, API calls, and data transformation.
 *
 * Pure utility functions (getGenerationIdFromPokemonId, getGenerationDisplayName)
 * remain here as they are provider-agnostic.
 */

import { zeldaFanApiProvider } from '@/services/providers/zeldaFanApiProvider';
import type { GenerationResponse, Generation, GenerationInfo } from '@/types/generations';

/**
 * Fetches the list of all generations from the Zelda Fan API.
 */
export async function fetchGenerationsList(): Promise<GenerationResponse> {
  return zeldaFanApiProvider.fetchGenerationsList();
}

/**
 * Fetches details for a specific generation by ID.
 */
export async function fetchGeneration(id: number): Promise<Generation> {
  return zeldaFanApiProvider.fetchGeneration(id);
}

/**
 * Fetches all generations with their details.
 */
export async function fetchAllGenerations(): Promise<GenerationInfo[]> {
  return zeldaFanApiProvider.fetchAllGenerations();
}

/**
 * Gets the generation ID for a specific character.
 * Uses a hash-based approach since Zelda API uses string IDs.
 */
export function getGenerationIdFromPokemonId(pokemonId: number): number {
  // Zelda entities are mapped to games; use modulo to distribute
  return (pokemonId % 19) + 1;
}

/**
 * Gets the display name for a generation.
 */
export function getGenerationDisplayName(generationId: number): string {
  const names: Record<number, string> = {
    1: 'The Legend of Zelda',
    2: 'Zelda II: The Adventure of Link',
    3: 'A Link to the Past',
    4: "Link's Awakening",
    5: 'Ocarina of Time',
    6: "Majora's Mask",
    7: 'Oracle of Seasons / Ages',
    8: 'The Wind Waker',
    9: 'Four Swords Adventures',
    10: 'The Minish Cap',
    11: 'Twilight Princess',
    12: 'Phantom Hourglass',
    13: 'Spirit Tracks',
    14: 'Skyward Sword',
    15: 'A Link Between Worlds',
    16: 'Tri Force Heroes',
    17: 'Breath of the Wild',
    18: 'Tears of the Kingdom',
    19: 'Echoes of Wisdom',
  };
  return names[generationId] || `Game ${generationId}`;
}
