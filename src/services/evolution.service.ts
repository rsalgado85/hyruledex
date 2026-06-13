/**
 * Evolution Service — Delegates to the active GameProvider
 *
 * All evolution chain data now flows through the GameProvider interface.
 * The provider handles parsing, caching, and API calls.
 *
 * Pure utility functions (flattenEvolutionChain, getEvolutionStage, canEvolveFurther)
 * remain here as they are provider-agnostic transformations.
 *
 * NOTE: The Zelda Fan API does not have evolution chains. This service
 * returns empty/minimal data for evolution-related queries.
 */

import { zeldaFanApiProvider } from '@/services/providers/zeldaFanApiProvider';
import type { EvolutionChainData, EvolutionNodeData } from '@/services/providers/types';

// Re-export types for backward compatibility
export type EvolutionDetail = import('@/services/providers/types').EvolutionDetail;
export type EvolutionNode = EvolutionNodeData;

export { type EvolutionChainData };

/**
 * Fetches an evolution chain by chain ID.
 * Zelda API doesn't have evolution chains, returns null.
 */
export async function fetchEvolutionChain(chainId: number): Promise<EvolutionChainData | null> {
  return null;
}

/**
 * Fetches evolution chain by species ID.
 * Zelda API doesn't have evolution chains, returns null.
 */
export async function fetchEvolutionChainBySpeciesId(
  speciesId: number
): Promise<EvolutionChainData | null> {
  return null;
}

/**
 * Flattens an evolution chain into a linear array of species names in order.
 */
export function flattenEvolutionChain(node: EvolutionNodeData): string[] {
  const names: string[] = [node.species_name];
  for (const child of node.children) {
    names.push(...flattenEvolutionChain(child));
  }
  return names;
}

/**
 * Gets the evolution stage of a species within its chain.
 * 1 = basic, 2 = stage 1, 3 = stage 2, etc.
 */
export function getEvolutionStage(
  speciesName: string,
  chain: EvolutionNodeData,
  depth: number = 1
): number {
  if (chain.species_name === speciesName) return depth;
  for (const child of chain.children) {
    const stage = getEvolutionStage(speciesName, child, depth + 1);
    if (stage > 0) return stage;
  }
  return -1;
}

/**
 * Checks if a character can still evolve (has further evolutions).
 */
export function canEvolveFurther(
  speciesName: string,
  chain: EvolutionNodeData
): boolean {
  if (chain.species_name === speciesName) {
    return chain.children.length > 0;
  }
  for (const child of chain.children) {
    if (canEvolveFurther(speciesName, child)) return true;
  }
  return false;
}
