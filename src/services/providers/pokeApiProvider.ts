/**
 * PokeApiProvider — Implementation of GameProvider using PokéAPI
 *
 * This is the CURRENT data provider. It implements the GameProvider interface
 * by wrapping all existing PokeAPI calls. The rest of the app talks to this
 * provider through the interface, never directly to PokeAPI.
 *
 * When Hyrule Compendium is ready, we swap this provider — the app doesn't change.
 */

import axios from 'axios';
import { API_BASE_URL, POKEMON_LIMIT } from '@/constants';
import { cacheManager } from '@/cache/cacheManager';
import type { GameProvider } from './GameProvider';
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
  EvolutionNodeData,
  EvolutionDetail,
} from './types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const CACHE_KEYS = {
  POKEMON_LIST: 'pokemon_list',
  POKEMON: (id: number | string) => `pokemon_${id}`,
  SPECIES: (id: number) => `species_${id}`,
  EVOLUTION: (id: number) => `evolution_${id}`,
  TYPE: (name: string) => `type_${name}`,
  ABILITY: (name: string) => `ability_${name}`,
  SPECIES_INFO: (id: number) => `species_info_${id}`,
  SPECIES_BY_NAME: (name: string) => `species_name_${name}`,
  EVOLUTION_CHAIN: (id: number) => `evolution_chain_${id}`,
  GENERATIONS_LIST: 'generations_list',
  GENERATION: (id: number) => `generation_${id}`,
};

export class PokeApiProvider implements GameProvider {
  readonly name = 'pokeapi';

  // ─── Character (Pokémon) ───────────────────────────────────────────

  async fetchCharacterList(): Promise<DataListResponse> {
    const cacheKey = CACHE_KEYS.POKEMON_LIST;
    const cached = cacheManager.get<DataListResponse>(cacheKey);
    if (cached) return cached;

    const { data } = await api.get<DataListResponse>(`/pokemon?limit=${POKEMON_LIMIT}`);
    cacheManager.set(cacheKey, data);
    return data;
  }

  async fetchCharacter(id: number | string): Promise<Character> {
    const cacheKey = CACHE_KEYS.POKEMON(id);
    const cached = cacheManager.get<Character>(cacheKey);
    if (cached) return cached;

    const { data } = await api.get<Character>(`/pokemon/${id}`);
    const size = JSON.stringify(data).length;
    if (size < 50000) {
      cacheManager.set(cacheKey, data);
    }
    return data;
  }

  async fetchMultipleCharacters(ids: number[], concurrency: number = 5): Promise<Character[]> {
    const results: Character[] = [];

    for (let i = 0; i < ids.length; i += concurrency) {
      const batch = ids.slice(i, i + concurrency);
      const batchResults = await Promise.allSettled(
        batch.map((id) => this.fetchCharacter(id))
      );
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.warn(`Failed to fetch character, skipping:`, result.reason);
        }
      }
    }

    return results;
  }

  // ─── Species / Details ─────────────────────────────────────────────

  async fetchCharacterSpecies(id: number): Promise<CharacterSpecies> {
    const cacheKey = CACHE_KEYS.SPECIES(id);
    const cached = cacheManager.get<CharacterSpecies>(cacheKey);
    if (cached) return cached;

    const { data } = await api.get<CharacterSpecies>(`/pokemon-species/${id}`);
    cacheManager.set(cacheKey, data);
    return data;
  }

  async fetchSpeciesInfo(id: number): Promise<SpeciesInfo | null> {
    const cacheKey = CACHE_KEYS.SPECIES_INFO(id);
    const cached = cacheManager.get<SpeciesInfo>(cacheKey);
    if (cached) return cached;

    try {
      const { data } = await api.get(`/pokemon-species/${id}`);

      const info: SpeciesInfo = {
        id: data.id,
        name: data.name,
        color: data.color?.name || 'unknown',
        shape: data.shape?.name || 'unknown',
        habitat: data.habitat?.name || null,
        is_legendary: data.is_legendary,
        is_mythical: data.is_mythical,
        is_baby: data.is_baby,
        gender_rate: data.gender_rate,
        capture_rate: data.capture_rate,
        base_happiness: data.base_happiness,
        growth_rate: data.growth_rate?.name || 'unknown',
        egg_groups: data.egg_groups?.map((g: any) => g.name) || [],
        evolution_chain_url: data.evolution_chain?.url || '',
        evolves_from_species: data.evolves_from_species?.name || null,
        flavor_text: data.flavor_text_entries
          ?.find((e: any) => e.language.name === 'en')
          ?.flavor_text?.replace(/[\n\f]/g, ' ') || '',
        genus: data.genera
          ?.find((g: any) => g.language.name === 'en')
          ?.genus || '',
      };

      cacheManager.set(cacheKey, info);
      return info;
    } catch (error) {
      console.warn(`Failed to fetch species info for ${id}:`, error);
      return null;
    }
  }

  async fetchSpeciesInfoByName(name: string): Promise<SpeciesInfo | null> {
    const cacheKey = CACHE_KEYS.SPECIES_BY_NAME(name);
    const cached = cacheManager.get<SpeciesInfo>(cacheKey);
    if (cached) return cached;

    try {
      const { data } = await api.get(`/pokemon-species/${name.toLowerCase()}`);

      const info: SpeciesInfo = {
        id: data.id,
        name: data.name,
        color: data.color?.name || 'unknown',
        shape: data.shape?.name || 'unknown',
        habitat: data.habitat?.name || null,
        is_legendary: data.is_legendary,
        is_mythical: data.is_mythical,
        is_baby: data.is_baby,
        gender_rate: data.gender_rate,
        capture_rate: data.capture_rate,
        base_happiness: data.base_happiness,
        growth_rate: data.growth_rate?.name || 'unknown',
        egg_groups: data.egg_groups?.map((g: any) => g.name) || [],
        evolution_chain_url: data.evolution_chain?.url || '',
        evolves_from_species: data.evolves_from_species?.name || null,
        flavor_text: data.flavor_text_entries
          ?.find((e: any) => e.language.name === 'en')
          ?.flavor_text?.replace(/[\n\f]/g, ' ') || '',
        genus: data.genera
          ?.find((g: any) => g.language.name === 'en')
          ?.genus || '',
      };

      cacheManager.set(cacheKey, info);
      return info;
    } catch (error) {
      console.warn(`Failed to fetch species info by name ${name}:`, error);
      return null;
    }
  }

  // ─── Evolution / Timeline ──────────────────────────────────────────

  async fetchEvolutionChain(id: number): Promise<EvolutionChain> {
    const cacheKey = CACHE_KEYS.EVOLUTION(id);
    const cached = cacheManager.get<EvolutionChain>(cacheKey);
    if (cached) return cached;

    const { data } = await api.get<EvolutionChain>(`/evolution-chain/${id}`);
    cacheManager.set(cacheKey, data);
    return data;
  }

  async fetchEvolutionChainBySpeciesId(speciesId: number): Promise<EvolutionChainData | null> {
    const species = await this.fetchCharacterSpecies(speciesId);
    if (!species?.evolution_chain?.url) return null;

    const parts = species.evolution_chain.url.split('/');
    const chainId = parseInt(parts[parts.length - 2] || '0', 10);
    if (!chainId) return null;

    const cacheKey = CACHE_KEYS.EVOLUTION_CHAIN(chainId);
    const cached = cacheManager.get<EvolutionChainData>(cacheKey);
    if (cached) return cached;

    try {
      const { data } = await api.get(`/evolution-chain/${chainId}`);

      const chainData: EvolutionChainData = {
        id: chainId,
        chain: this.parseEvolutionNode(data.chain),
        all_species: this.flattenEvolutionChain(data.chain),
      };

      cacheManager.set(cacheKey, chainData);
      return chainData;
    } catch (error) {
      console.warn(`Failed to fetch evolution chain ${chainId}:`, error);
      return null;
    }
  }

  parseEvolutionNode(rawNode: any, parentDetails: any = null): EvolutionNodeData {
    const speciesUrl = rawNode.species?.url || '';
    const speciesId = parseInt(speciesUrl.split('/').filter(Boolean).pop() || '0', 10);

    const rawDetail = rawNode.evolution_details?.[0] || parentDetails || {};

    const detail: EvolutionDetail = {
      item: rawDetail.item?.name || null,
      trigger: rawDetail.trigger?.name || 'unknown',
      gender: rawDetail.gender ?? null,
      held_item: rawDetail.held_item?.name || null,
      known_move: rawDetail.known_move?.name || null,
      known_move_type: rawDetail.known_move_type?.name || null,
      location: rawDetail.location?.name || null,
      min_level: rawDetail.min_level ?? null,
      min_happiness: rawDetail.min_happiness ?? null,
      min_beauty: rawDetail.min_beauty ?? null,
      min_affection: rawDetail.min_affection ?? null,
      needs_overworld_rain: rawDetail.needs_overworld_rain || false,
      party_species: rawDetail.party_species?.name || null,
      party_type: rawDetail.party_type?.name || null,
      relative_physical_stats: rawDetail.relative_physical_stats ?? null,
      time_of_day: rawDetail.time_of_day || '',
      trade_species: rawDetail.trade_species?.name || null,
      turn_upside_down: rawDetail.turn_upside_down || false,
    };

    const node: EvolutionNodeData = {
      species_name: rawNode.species?.name || 'unknown',
      species_id: speciesId,
      min_level: detail.min_level,
      trigger: detail.trigger,
      item: detail.item,
      details: detail,
      children: (rawNode.evolves_to || []).map((child: any) => this.parseEvolutionNode(child, rawDetail)),
    };

    return node;
  }

  flattenEvolutionChain(node: any): string[] {
    const names: string[] = [node.species.name];
    for (const child of (node.evolves_to || [])) {
      names.push(...this.flattenEvolutionChain(child));
    }
    return names;
  }

  /** Collects all species names from a parsed EvolutionNodeData tree */
  collectAllSpecies(node: EvolutionNodeData): string[] {
    const names: string[] = [node.species_name];
    for (const child of node.children) {
      names.push(...this.collectAllSpecies(child));
    }
    return names;
  }

  // ─── Types / Races ─────────────────────────────────────────────────

  async fetchCharactersByType(typeName: string): Promise<TypeResponse> {
    const cacheKey = CACHE_KEYS.TYPE(typeName);
    const cached = cacheManager.get<TypeResponse>(cacheKey);
    if (cached) return cached;

    const { data } = await api.get<TypeResponse>(`/type/${typeName}`);
    cacheManager.set(cacheKey, data);
    return data;
  }

  // ─── Abilities / Skills ────────────────────────────────────────────

  async fetchAbility(abilityName: string): Promise<Ability> {
    const cacheKey = CACHE_KEYS.ABILITY(abilityName);
    const cached = cacheManager.get<Ability>(cacheKey);
    if (cached) return cached;

    const { data } = await api.get<Ability>(`/ability/${abilityName}`);
    cacheManager.set(cacheKey, data);
    return data;
  }

  // ─── Generations / Eras ────────────────────────────────────────────

  async fetchGenerationsList(): Promise<GenerationResponse> {
    const cacheKey = CACHE_KEYS.GENERATIONS_LIST;
    const cached = cacheManager.get<GenerationResponse>(cacheKey);
    if (cached) return cached;

    const { data } = await api.get<GenerationResponse>('/generation');
    cacheManager.set(cacheKey, data);
    return data;
  }

  async fetchGeneration(id: number): Promise<Generation> {
    const cacheKey = CACHE_KEYS.GENERATION(id);
    const cached = cacheManager.get<Generation>(cacheKey);
    if (cached) return cached;

    const { data } = await api.get<Generation>(`/generation/${id}`);
    cacheManager.set(cacheKey, data);
    return data;
  }

  async fetchAllGenerations(): Promise<GenerationInfo[]> {
    const list = await this.fetchGenerationsList();

    const generationIds = list.results.map((result) => {
      const parts = result.url.split('/');
      return parseInt(parts[parts.length - 2], 10);
    });

    const generations: GenerationInfo[] = [];
    const concurrency = 5;

    for (let i = 0; i < generationIds.length; i += concurrency) {
      const batch = generationIds.slice(i, i + concurrency);
      const batchResults = await Promise.allSettled(
        batch.map((id) => this.fetchGeneration(id))
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          const gen = result.value;
          const englishName = gen.names.find((n) => n.language.name === 'en');
          const regionName = gen.main_region.name;

          generations.push({
            id: gen.id,
            name: gen.name,
            displayName: englishName?.name ?? gen.name,
            region: regionName,
            pokemonCount: gen.pokemon_species.length,
            pokemonSpecies: gen.pokemon_species,
          });
        }
      }
    }

    generations.sort((a, b) => a.id - b.id);
    return generations;
  }
}

/** Singleton instance — the rest of the app imports this */
export const pokeApiProvider = new PokeApiProvider();
