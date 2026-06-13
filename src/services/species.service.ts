/**
 * Species Service — Delegates to the active GameProvider
 *
 * All species-related data now flows through the GameProvider interface.
 * The provider handles caching, API calls, and data transformation.
 */

import { zeldaFanApiProvider } from '@/services/providers/zeldaFanApiProvider';
import type { SpeciesInfo as ProviderSpeciesInfo } from '@/services/providers/types';

// Re-export for backward compatibility
export type SpeciesInfo = ProviderSpeciesInfo;

/**
 * Fetches and enriches species data for a given character ID.
 */
export async function fetchSpeciesInfo(id: number): Promise<SpeciesInfo | null> {
  return zeldaFanApiProvider.fetchSpeciesInfo(id);
}

/**
 * Fetches species info by character name.
 */
export async function fetchSpeciesInfoByName(name: string): Promise<SpeciesInfo | null> {
  return zeldaFanApiProvider.fetchSpeciesInfoByName(name);
}

/**
 * Fetches species info for multiple characters in batch.
 */
export async function fetchMultipleSpeciesInfo(
  ids: number[],
  concurrency: number = 5
): Promise<Map<number, SpeciesInfo>> {
  const results = new Map<number, SpeciesInfo>();

  for (let i = 0; i < ids.length; i += concurrency) {
    const batch = ids.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((id) => zeldaFanApiProvider.fetchSpeciesInfo(id))
    );

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      if (result.status === 'fulfilled' && result.value) {
        results.set(batch[j], result.value);
      }
    }
  }

  return results;
}
