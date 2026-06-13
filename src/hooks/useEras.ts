/**
 * Eras Hook
 * 
 * Provides React hooks for fetching and managing Zelda game era data.
 * Uses TanStack Query for caching, deduplication, and background refetching.
 * All eras are loaded dynamically from Zelda Fan API - no hardcoded lists.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllGenerations, fetchGeneration, fetchGenerationsList, getGenerationIdFromPokemonId, getGenerationDisplayName } from '@/services/generation.service';
import { STALE_TIME } from '@/constants';
import type { GenerationInfo, Generation } from '@/types/generations';

/**
 * Hook to fetch all eras with their details.
 * This is the main hook for era data across the app.
 */
export function useAllEras() {
  return useQuery<GenerationInfo[]>({
    queryKey: ['all-generations'],
    queryFn: fetchAllGenerations,
    staleTime: STALE_TIME,
    retry: 3,
  });
}

/**
 * Hook to fetch a specific era by ID.
 */
export function useEra(id: number) {
  return useQuery<Generation>({
    queryKey: ['generation', id],
    queryFn: () => fetchGeneration(id),
    staleTime: STALE_TIME,
    enabled: !!id && id > 0,
    retry: 2,
  });
}

/**
 * Hook to get the era ID for a given character ID.
 * This is a synchronous computation, no API call needed.
 */
export function useCharacterEra(characterId: number) {
  const generationId = getGenerationIdFromPokemonId(characterId);
  const displayName = getGenerationDisplayName(generationId);
  
  return {
    eraId: generationId,
    displayName,
  };
}

/**
 * Hook to get all available era names for filter dropdowns.
 */
export function useEraOptions() {
  const { data: generations, isLoading, error } = useAllEras();

  const options = generations
    ? generations.map((gen) => ({
        id: gen.id,
        name: gen.name,
        displayName: gen.displayName,
        region: gen.region,
        pokemonCount: gen.pokemonCount,
      }))
    : [];

  return { options, isLoading, error };
}

/**
 * Hook to get the list of eras (basic, without details).
 */
export function useErasList() {
  return useQuery({
    queryKey: ['generations-list'],
    queryFn: fetchGenerationsList,
    staleTime: STALE_TIME,
  });
}
