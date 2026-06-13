/**
 * Character Data Hooks
 * 
 * Architecture Decision:
 * We use TanStack Query (React Query) for server state management.
 * This provides:
 * 1. Automatic caching with configurable stale times
 * 2. Background refetching
 * 3. Loading/error states
 * 4. Deduplication of requests
 * 
 * Combined with our LocalStorage cache, this creates a robust
 * multi-level caching strategy.
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchPokemonList,
  fetchPokemon,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchMultiplePokemon,
} from '@/services/pokemonApi';
import { enrichPokemon, computeTypeDistribution, computeHeightDistribution, computeWeightDistribution, computeExperienceDistribution, getTopPokemonByStat, generateInsights, computeTypeAverages, getZeldaImageUrl } from '@/utils/pokemonUtils';
import { findCompendiumImages } from '@/services/compendium.service';
import { STALE_TIME } from '@/constants';
import { cacheManager } from '@/cache/cacheManager';
import type { PokemonStats, PokemonWithStats } from '@/types/pokemon';

/**
 * Hook to fetch all characters list (names and URLs).
 */
export function useCharacterList() {
  return useQuery({
    queryKey: ['pokemon-list'],
    queryFn: fetchPokemonList,
    staleTime: STALE_TIME,
  });
}

/**
 * Hook to fetch a single character by ID.
 */
export function useCharacter(id: number | string) {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemon(id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
}

/**
 * Hook to fetch enriched character data with computed stats.
 */
export function useEnrichedCharacter(id: number | string) {
  const query = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemon(id),
    staleTime: STALE_TIME,
    enabled: !!id,
    select: (data) => enrichPokemon(data),
  });
  return query;
}

/**
 * Hook to fetch character species data.
 */
export function useCharacterSpecies(id: number) {
  return useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: () => fetchPokemonSpecies(id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
}

/**
 * Hook to fetch timeline chain.
 */
export function useTimelineChain(id: number) {
  return useQuery({
    queryKey: ['evolution-chain', id],
    queryFn: () => fetchEvolutionChain(id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
}

// Cache key for storing enriched Pokémon data as a single blob
// Uses a direct localStorage key (not prefixed) to avoid cacheManager version issues
const ENRICHED_CACHE_KEY = 'hyruledex_all_pokemon_cache';
const ENRICHED_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Saves enriched character data to localStorage as a single blob.
 * Stores ONLY the minimum data needed for the dashboard to render.
 */
function saveEnrichedCache(data: PokemonWithStats[]): void {
  try {
    const lightweight = data.map(p => ({
      id: p.id,
      name: p.name,
      types: p.types.map(t => ({ slot: t.slot, type: { name: t.type.name } })),
      artworkUrl: p.artworkUrl || getZeldaImageUrl(p.name, p.id),
      stats: p.stats.map(s => ({ base_stat: s.base_stat, stat: { name: s.stat.name } })),
      height: p.height,
      weight: p.weight,
      base_experience: p.base_experience,
      computedStats: p.computedStats,
      totalStats: p.totalStats,
      abilities: p.abilities.map(a => ({ ability: { name: a.ability.name } })),
    }));
    const entry = {
      data: lightweight,
      timestamp: Date.now(),
      ttl: ENRICHED_CACHE_TTL,
    };
    const serialized = JSON.stringify(entry);
    console.log(`[Cache] Saving enriched cache: ${(serialized.length / 1024 / 1024).toFixed(2)}MB for ${lightweight.length} characters`);
    localStorage.setItem(ENRICHED_CACHE_KEY, serialized);
  } catch (e) {
    console.warn('[Cache] Failed to save enriched cache (may exceed quota):', e);
  }
}

/**
 * Loads enriched character data from localStorage.
 * Returns null if not found or expired.
 */
function loadEnrichedCache(): PokemonWithStats[] | null {
  try {
    const raw = localStorage.getItem(ENRICHED_CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > entry.ttl) {
      localStorage.removeItem(ENRICHED_CACHE_KEY);
      return null;
    }
    return entry.data.map((p: any) => {
      const imageUrl = p.artworkUrl || getZeldaImageUrl(p.name, p.id);
      return {
        id: p.id,
        name: p.name,
        types: p.types,
        sprites: {
          front_default: imageUrl,
          front_shiny: imageUrl,
          other: {
            'official-artwork': {
              front_default: imageUrl,
              front_shiny: imageUrl,
            },
            showdown: {
              front_default: imageUrl,
            },
          },
        },
        stats: p.stats,
        height: p.height,
        weight: p.weight,
        base_experience: p.base_experience,
        abilities: p.abilities || [],
        species: { name: p.name, url: '' },
        computedStats: p.computedStats,
        totalStats: p.totalStats,
        dominantType: p.types[0]?.type?.name || 'normal',
        imageUrl,
        artworkUrl: imageUrl,
      };
    });
  } catch {
    localStorage.removeItem(ENRICHED_CACHE_KEY);
    return null;
  }
}

/**
 * Hook to fetch all characters with enriched data for the dashboard.
 * This is the main data hook used across the application.
 * 
 * Fetches ALL characters from the Zelda Fan API.
 * 
 * Performance Optimization:
 * - After the first successful load, saves lightweight enriched data as a single blob
 *   in localStorage under 'hyruledex_all_pokemon_cache'
 * - On subsequent full reloads, reads this blob synchronously as initialData
 * - TTL of 24h ensures data is eventually refreshed
 */
export function useAllCharacters() {
  const cachedEnriched = loadEnrichedCache();
  const hasCache = cachedEnriched !== null && cachedEnriched.length > 0;

  return useQuery({
    queryKey: ['all-pokemon'],
    queryFn: async () => {
      const list = await fetchPokemonList();
      const ids = list.results.map((result) => {
        // Use the numeric id from the provider if available (Zelda Fan API provides it)
        if (result.id !== undefined && result.id > 0) return result.id;
        // Fallback: extract from URL (PokeAPI format: /pokemon/{id}/)
        const parts = result.url.split('/');
        return parseInt(parts[parts.length - 2], 10);
      }).filter((id) => !isNaN(id) && id > 0);
      
      const pokemonList = await fetchMultiplePokemon(ids);
      
      // Try to get real images from Hyrule Compendium API
      const names = pokemonList.map((p) => p.name);
      let compendiumImages = new Map<string, string>();
      try {
        compendiumImages = await findCompendiumImages(names);
        console.log(`[Compendium] Found ${compendiumImages.size} images out of ${names.length} characters`);
      } catch (e) {
        console.warn('[Compendium] Failed to fetch images:', e);
      }
      
      const enriched = pokemonList.map((p) => {
        const enriched_p = enrichPokemon(p);
        // Use Compendium image if available, otherwise generate placeholder
        const compendiumUrl = compendiumImages.get(p.name);
        const imageUrl = compendiumUrl || getZeldaImageUrl(enriched_p.name, enriched_p.id);
        return {
          ...enriched_p,
          imageUrl,
          artworkUrl: imageUrl,
          sprites: {
            front_default: imageUrl,
            front_shiny: imageUrl,
            other: {
              'official-artwork': {
                front_default: imageUrl,
                front_shiny: imageUrl,
              },
              showdown: {
                front_default: imageUrl,
              },
            },
          },
        };
      });
      
      saveEnrichedCache(enriched);
      return enriched;
    },
    staleTime: hasCache ? Infinity : STALE_TIME,
    initialData: hasCache ? cachedEnriched : undefined,
    refetchOnMount: hasCache ? false : undefined,
    refetchOnWindowFocus: hasCache ? false : undefined,
  });
}

/**
 * Hook to get dashboard KPIs.
 */
export function useDashboardKPIs() {
  const { data: pokemonList, isLoading, error } = useAllCharacters();

  if (!pokemonList) {
    return { kpis: null, isLoading, error };
  }

  const totalPokemon = pokemonList.length;
  const totalTypes = new Set(pokemonList.flatMap((p) => p.types.map((t) => t.type.name))).size;
  // Calculate unique abilities across all Pokémon
  // If abilities are empty in cache (old cache format), fall back to a reasonable estimate
  const totalAbilities = pokemonList.some(p => p.abilities.length > 0)
    ? new Set(pokemonList.flatMap((p) => p.abilities.map((a) => a.ability.name))).size
    : Math.round(totalPokemon * 0.3); // ~30% of total Pokémon as fallback estimate

  const fastest = [...pokemonList].sort((a, b) => b.computedStats.speed - a.computedStats.speed)[0];
  const strongest = [...pokemonList].sort((a, b) => b.computedStats.attack - a.computedStats.attack)[0];
  const toughest = [...pokemonList].sort((a, b) => b.computedStats.defense - a.computedStats.defense)[0];

  const kpis = {
    totalPokemon,
    totalTypes,
    totalAbilities,
    fastest: fastest ? { name: fastest.name, value: fastest.computedStats.speed, id: fastest.id } : null,
    strongest: strongest ? { name: strongest.name, value: strongest.computedStats.attack, id: strongest.id } : null,
    toughest: toughest ? { name: toughest.name, value: toughest.computedStats.defense, id: toughest.id } : null,
  };

  return { kpis, isLoading, error };
}

/**
 * Hook to get type distribution data.
 */
export function useTypeDistribution() {
  const { data: pokemonList } = useAllCharacters();
  if (!pokemonList) return null;
  return computeTypeDistribution(pokemonList);
}

/**
 * Hook to get height distribution data.
 */
export function useHeightDistribution() {
  const { data: pokemonList } = useAllCharacters();
  if (!pokemonList) return null;
  return computeHeightDistribution(pokemonList);
}

/**
 * Hook to get weight distribution data.
 */
export function useWeightDistribution() {
  const { data: pokemonList } = useAllCharacters();
  if (!pokemonList) return null;
  return computeWeightDistribution(pokemonList);
}

/**
 * Hook to get experience distribution data.
 */
export function useExperienceDistribution() {
  const { data: pokemonList } = useAllCharacters();
  if (!pokemonList) return null;
  return computeExperienceDistribution(pokemonList);
}

/**
 * Hook to get top characters by a specific stat.
 */
export function useTopCharacters(statName: keyof PokemonStats, limit: number = 20) {
  const { data: pokemonList } = useAllCharacters();
  if (!pokemonList) return null;
  return getTopPokemonByStat(pokemonList, statName, limit);
}

/**
 * Hook to get generated insights.
 */
export function useInsights() {
  const { data: pokemonList } = useAllCharacters();
  if (!pokemonList) return null;
  return generateInsights(pokemonList);
}

/**
 * Hook to get type averages.
 */
export function useTypeAverages() {
  const { data: pokemonList } = useAllCharacters();
  if (!pokemonList) return null;
  return computeTypeAverages(pokemonList);
}
