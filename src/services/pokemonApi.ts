/**
 * Pokémon API Service — Delegates to the active GameProvider
 *
 * This service layer now delegates ALL calls to the current GameProvider
 * implementation (ZeldaFanApiProvider). No direct PokeAPI calls here.
 *
 * Architecture Decision:
 * The service layer remains as a thin facade so hooks and components
 * import from a stable path. The provider can be swapped without
 * changing any imports in the rest of the app.
 */

import { zeldaFanApiProvider } from '@/services/providers/zeldaFanApiProvider';
import type {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  EvolutionChain,
  TypeResponse,
  Ability,
} from '@/types/pokemon';

/**
 * Fetches the list of all characters with caching.
 */
export async function fetchPokemonList(): Promise<PokemonListResponse> {
  return zeldaFanApiProvider.fetchCharacterList() as Promise<PokemonListResponse>;
}

/**
 * Fetches a single character by ID or name with caching.
 */
export async function fetchPokemon(id: number | string): Promise<Pokemon> {
  return zeldaFanApiProvider.fetchCharacter(id) as Promise<Pokemon>;
}

/**
 * Fetches character species data for flavor text and evolution info.
 */
export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  return zeldaFanApiProvider.fetchCharacterSpecies(id) as Promise<PokemonSpecies>;
}

/**
 * Fetches evolution chain data.
 */
export async function fetchEvolutionChain(id: number): Promise<EvolutionChain> {
  return zeldaFanApiProvider.fetchEvolutionChain(id) as Promise<EvolutionChain>;
}

/**
 * Fetches all characters of a specific race/type.
 */
export async function fetchPokemonByType(typeName: string): Promise<TypeResponse> {
  return zeldaFanApiProvider.fetchCharactersByType(typeName) as Promise<TypeResponse>;
}

/**
 * Fetches ability details.
 */
export async function fetchAbility(abilityName: string): Promise<Ability> {
  return zeldaFanApiProvider.fetchAbility(abilityName) as Promise<Ability>;
}

/**
 * Fetches multiple characters in parallel with concurrency control.
 */
export async function fetchMultiplePokemon(
  ids: number[],
  concurrency: number = 5
): Promise<Pokemon[]> {
  const results = await zeldaFanApiProvider.fetchMultipleCharacters(ids, concurrency);
  return results as Pokemon[];
}
