/**
 * Timeline Hook
 * 
 * Provides React hooks for fetching and managing character timeline/evolution data.
 * Supports complex timeline trees with caching via TanStack Query.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchEvolutionChain, fetchEvolutionChainBySpeciesId, flattenEvolutionChain, canEvolveFurther, getEvolutionStage } from '@/services/evolution.service';
import { STALE_TIME } from '@/constants';
import type { EvolutionChainData, EvolutionNode } from '@/services/evolution.service';

/**
 * Hook to fetch a timeline chain by its ID.
 */
export function useTimelineChain(chainId: number) {
  return useQuery<EvolutionChainData | null>({
    queryKey: ['evolution-chain', chainId],
    queryFn: () => fetchEvolutionChain(chainId),
    staleTime: STALE_TIME,
    enabled: !!chainId && chainId > 0,
    retry: 2,
  });
}

/**
 * Hook to fetch a timeline chain by a character's species ID.
 */
export function useTimelineChainBySpecies(speciesId: number) {
  return useQuery<EvolutionChainData | null>({
    queryKey: ['evolution-chain-by-species', speciesId],
    queryFn: () => fetchEvolutionChainBySpeciesId(speciesId),
    staleTime: STALE_TIME,
    enabled: !!speciesId && speciesId > 0,
    retry: 2,
  });
}

/**
 * Hook to get the flattened timeline list for a character.
 * Returns an ordered array of species names in the timeline chain.
 */
export function useTimelineList(speciesId: number) {
  const { data: chain, isLoading, error } = useTimelineChainBySpecies(speciesId);

  const evolutionList = chain
    ? flattenEvolutionChain(chain.chain)
    : [];

  return {
    timelineList: evolutionList,
    chain,
    isLoading,
    error,
  };
}

/**
 * Hook to check if a character can evolve further.
 */
export function useCanEvolve(speciesName: string, speciesId: number) {
  const { data: chain } = useTimelineChainBySpecies(speciesId);

  if (!chain) return { canEvolve: false, isLoading: true };

  return {
    canEvolve: canEvolveFurther(speciesName, chain.chain),
    evolutionStage: getEvolutionStage(speciesName, chain.chain),
    isLoading: false,
  };
}

/**
 * Hook to get timeline chain data enriched with character images.
 * Returns timeline nodes with image URLs for rendering timeline trees.
 */
export function useTimelineWithImages(
  speciesId: number,
  characterImageMap: Map<string, { id: number; imageUrl: string; artworkUrl: string; types: { type: { name: string } }[] }>
) {
  const { data: chain, isLoading, error } = useTimelineChainBySpecies(speciesId);

  if (!chain || !characterImageMap) {
    return { timelineData: null, isLoading, error };
  }

  const timelineData = chain.all_species
    .map((name) => {
      const p = characterImageMap.get(name.toLowerCase());
      return {
        name,
        id: p?.id ?? 0,
        imageUrl: p?.artworkUrl ?? '',
        types: p?.types ?? [],
      };
    })
    .filter((e) => e.id > 0);

  return { timelineData, chain, isLoading, error };
}
