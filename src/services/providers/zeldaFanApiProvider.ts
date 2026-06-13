/**
 * ZeldaFanApiProvider — Implementation of GameProvider using Zelda Fan API
 *
 * This provider fetches REAL data from https://zelda.fanapis.com/api/
 * and maps it to the GameProvider interface.
 *
 * Data mapping:
 * - Characters → /api/characters (name, description, gender, race, appearances)
 * - Monsters → /api/monsters (name, description, appearances)
 * - Bosses → /api/bosses (name, description, appearances, dungeons)
 * - Games → /api/games (name, description, developer, publisher, released_date)
 * - Items → /api/items (name, description, games)
 * - Places → /api/places (name, description, appearances, inhabitants)
 * - Dungeons → /api/dungeons (name, description, appearances)
 *
 * Since the Zelda Fan API has a different data model than PokeAPI,
 * we map fields to the closest equivalent in the provider types.
 */

import axios from 'axios';
import { cacheManager } from '@/cache/cacheManager';
import { getZeldaImageUrl } from '@/utils/pokemonUtils';
import { findCompendiumImage } from '@/services/compendium.service';
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

// ─── Zelda Fan API Types ───────────────────────────────────────────────

interface ZeldaApiResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

interface ZeldaCharacter {
  id: string;
  name: string;
  description: string;
  gender: string | null;
  race: string | null;
  appearances: string[];
}

interface ZeldaMonster {
  id: string;
  name: string;
  description: string;
  appearances: string[];
}

interface ZeldaBoss {
  id: string;
  name: string;
  description: string;
  appearances: string[];
  dungeons: string[];
}

interface ZeldaGame {
  id: string;
  name: string;
  description: string;
  developer: string;
  publisher: string;
  released_date: string;
}

interface ZeldaItem {
  id: string;
  name: string;
  description: string;
  games: string[];
}

interface ZeldaPlace {
  id: string;
  name: string;
  description: string;
  appearances: string[];
  inhabitants: string[];
}

interface ZeldaDungeon {
  id: string;
  name: string;
  description: string;
  appearances: string[];
}

// ─── API Client ────────────────────────────────────────────────────────

const ZELDA_API_BASE = 'https://zelda.fanapis.com/api';

const api = axios.create({
  baseURL: ZELDA_API_BASE,
  timeout: 10000,
});

// ─── Cache Keys ────────────────────────────────────────────────────────

const CACHE_KEYS = {
  CHARACTERS_LIST: 'zelda_characters_list',
  CHARACTER: (id: string) => `zelda_character_${id}`,
  MONSTERS_LIST: 'zelda_monsters_list',
  MONSTER: (id: string) => `zelda_monster_${id}`,
  BOSSES_LIST: 'zelda_bosses_list',
  BOSS: (id: string) => `zelda_boss_${id}`,
  GAMES_LIST: 'zelda_games_list',
  GAME: (id: string) => `zelda_game_${id}`,
  ALL_CHARACTERS: 'zelda_all_characters',
};

// ─── Helpers ───────────────────────────────────────────────────────────

/**
 * Converts a Zelda API string ID to a numeric hash for compatibility.
 * The Zelda API uses MongoDB ObjectIDs, so we derive a numeric ID from them.
 */
function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Extracts game name from a Zelda API game URL.
 * e.g. "https://zelda.fanapis.com/api/games/5f6ce9d805615a85623ec2ce" → "5f6ce9d805615a85623ec2ce"
 */
function extractGameIdFromUrl(url: string): string {
  return url.split('/').pop() || '';
}

/**
 * Fetches all characters from the Zelda Fan API with pagination.
 */
async function fetchAllZeldaCharacters(): Promise<ZeldaCharacter[]> {
  const cacheKey = CACHE_KEYS.ALL_CHARACTERS;
  const cached = cacheManager.get<ZeldaCharacter[]>(cacheKey);
  if (cached) return cached;

  const allCharacters: ZeldaCharacter[] = [];
  let page = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const { data } = await api.get<ZeldaApiResponse<ZeldaCharacter>>(`/characters?limit=${limit}&page=${page}`);
    if (data.data && data.data.length > 0) {
      allCharacters.push(...data.data);
      page++;
      if (data.data.length < limit) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  cacheManager.set(cacheKey, allCharacters);
  return allCharacters;
}

/**
 * Fetches all monsters from the Zelda Fan API with pagination.
 */
async function fetchAllZeldaMonsters(): Promise<ZeldaMonster[]> {
  const cacheKey = 'zelda_all_monsters';
  const cached = cacheManager.get<ZeldaMonster[]>(cacheKey);
  if (cached) return cached;

  const allMonsters: ZeldaMonster[] = [];
  let page = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const { data } = await api.get<ZeldaApiResponse<ZeldaMonster>>(`/monsters?limit=${limit}&page=${page}`);
    if (data.data && data.data.length > 0) {
      allMonsters.push(...data.data);
      page++;
      if (data.data.length < limit) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  cacheManager.set(cacheKey, allMonsters);
  return allMonsters;
}

/**
 * Fetches all bosses from the Zelda Fan API with pagination.
 */
async function fetchAllZeldaBosses(): Promise<ZeldaBoss[]> {
  const cacheKey = 'zelda_all_bosses';
  const cached = cacheManager.get<ZeldaBoss[]>(cacheKey);
  if (cached) return cached;

  const allBosses: ZeldaBoss[] = [];
  let page = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const { data } = await api.get<ZeldaApiResponse<ZeldaBoss>>(`/bosses?limit=${limit}&page=${page}`);
    if (data.data && data.data.length > 0) {
      allBosses.push(...data.data);
      page++;
      if (data.data.length < limit) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  cacheManager.set(cacheKey, allBosses);
  return allBosses;
}

/**
 * Fetches all games from the Zelda Fan API with pagination.
 */
async function fetchAllZeldaGames(): Promise<ZeldaGame[]> {
  const cacheKey = CACHE_KEYS.GAMES_LIST;
  const cached = cacheManager.get<ZeldaGame[]>(cacheKey);
  if (cached) return cached;

  const allGames: ZeldaGame[] = [];
  let page = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const { data } = await api.get<ZeldaApiResponse<ZeldaGame>>(`/games?limit=${limit}&page=${page}`);
    if (data.data && data.data.length > 0) {
      allGames.push(...data.data);
      page++;
      if (data.data.length < limit) hasMore = false;
    } else {
      hasMore = false;
    }
  }

  cacheManager.set(cacheKey, allGames);
  return allGames;
}

// ─── Combined Entity List ──────────────────────────────────────────────

/**
 * Represents a combined entity from all Zelda API endpoints.
 * This is the main "character" in HyruleDex — any creature, person, or entity.
 */
interface ZeldaEntity {
  id: string;
  numericId: number;
  name: string;
  description: string;
  category: 'character' | 'monster' | 'boss';
  race: string | null;
  gender: string | null;
  appearances: string[];
  dungeons?: string[];
}

/**
 * Fetches ALL entities from all endpoints and combines them into a single list.
 * This is the main data source for the dashboard and explorer.
 */
async function fetchAllEntities(): Promise<ZeldaEntity[]> {
  const cacheKey = 'zelda_all_entities';
  const cached = cacheManager.get<ZeldaEntity[]>(cacheKey);
  if (cached) return cached;

  const [characters, monsters, bosses] = await Promise.all([
    fetchAllZeldaCharacters(),
    fetchAllZeldaMonsters(),
    fetchAllZeldaBosses(),
  ]);

  const entities: ZeldaEntity[] = [
    ...characters.map((c) => ({
      id: c.id,
      numericId: hashId(c.id),
      name: c.name,
      description: c.description,
      category: 'character' as const,
      race: c.race,
      gender: c.gender,
      appearances: c.appearances,
    })),
    ...monsters.map((m) => ({
      id: m.id,
      numericId: hashId(m.id),
      name: m.name,
      description: m.description,
      category: 'monster' as const,
      race: null,
      gender: null,
      appearances: m.appearances,
    })),
    ...bosses.map((b) => ({
      id: b.id,
      numericId: hashId(b.id),
      name: b.name,
      description: b.description,
      category: 'boss' as const,
      race: null,
      gender: null,
      appearances: b.appearances,
      dungeons: b.dungeons,
    })),
  ];

  // Remove duplicates by name (some entities appear in multiple endpoints)
  const seen = new Set<string>();
  const unique = entities.filter((e) => {
    const key = e.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  cacheManager.set(cacheKey, unique);
  return unique;
}

// ─── Provider Implementation ───────────────────────────────────────────

export class ZeldaFanApiProvider implements GameProvider {
  readonly name = 'zelda-fan-api';

  // ─── Character List ────────────────────────────────────────────────

  async fetchCharacterList(): Promise<DataListResponse> {
    const entities = await fetchAllEntities();
    return {
      count: entities.length,
      next: null,
      previous: null,
      results: entities.map((e) => ({
        name: e.name,
        url: `${ZELDA_API_BASE}/characters/${e.id}`,
        id: e.numericId,
      })),
    };
  }

  // ─── Single Character ──────────────────────────────────────────────

  async fetchCharacter(id: number | string): Promise<Character> {
    const entities = await fetchAllEntities();
    // If id is a numeric string (e.g. "716529771"), convert to number for lookup
    const normalizedId = typeof id === 'string' && /^\d+$/.test(id) ? parseInt(id, 10) : id;
    const entity = typeof normalizedId === 'string'
      ? entities.find((e) => {
          const normalizedName = e.name.toLowerCase().replace(/[-_\s]+/g, ' ');
          const normalizedIdStr = normalizedId.toLowerCase().replace(/[-_\s]+/g, ' ');
          return e.id === normalizedId || normalizedName === normalizedIdStr;
        })
      : entities.find((e) => e.numericId === normalizedId);

    if (!entity) {
      throw new Error(`Character not found: ${id}`);
    }

    const character = this.entityToCharacter(entity);

    // Try to get a real image from Hyrule Compendium
    try {
      const compendiumImage = await findCompendiumImage(entity.name);
      if (compendiumImage) {
        character.sprites.front_default = compendiumImage;
        character.sprites.front_shiny = compendiumImage;
        if (character.sprites.other?.['official-artwork']) {
          character.sprites.other['official-artwork'].front_default = compendiumImage;
          character.sprites.other['official-artwork'].front_shiny = compendiumImage;
        }
        if (character.sprites.other?.showdown) {
          character.sprites.other.showdown.front_default = compendiumImage;
        }
      }
    } catch {
      // Fallback to placeholder image is fine
    }

    return character;
  }

  /**
   * Converts a ZeldaEntity to the provider Character type.
   * Maps Zelda fields to the closest PokeAPI-equivalent fields.
   */
  private entityToCharacter(entity: ZeldaEntity): Character {
    const numericId = entity.numericId;
    const imageUrl = getZeldaImageUrl(entity.name, numericId);

    return {
      id: numericId,
      name: entity.name.toLowerCase().replace(/\s+/g, '-'),
      base_experience: entity.category === 'boss' ? 200 : entity.category === 'monster' ? 100 : 50,
      height: 10, // Default height (1.0m) — Zelda API doesn't provide this
      weight: 100, // Default weight (10.0kg) — Zelda API doesn't provide this
      types: [
        {
          slot: 1,
          type: {
            name: entity.race?.toLowerCase() || entity.category,
            url: '',
          },
        },
      ],
      stats: [
        { base_stat: 50, effort: 0, stat: { name: 'hp', url: '' } },
        { base_stat: entity.category === 'boss' ? 80 : entity.category === 'monster' ? 60 : 40, effort: 0, stat: { name: 'attack', url: '' } },
        { base_stat: entity.category === 'boss' ? 70 : entity.category === 'monster' ? 50 : 35, effort: 0, stat: { name: 'defense', url: '' } },
        { base_stat: 40, effort: 0, stat: { name: 'special-attack', url: '' } },
        { base_stat: 40, effort: 0, stat: { name: 'special-defense', url: '' } },
        { base_stat: entity.category === 'boss' ? 60 : entity.category === 'monster' ? 50 : 35, effort: 0, stat: { name: 'speed', url: '' } },
      ],
      abilities: [
        {
          ability: {
            name: entity.category,
            url: '',
          },
          is_hidden: false,
          slot: 1,
        },
      ],
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
      species: {
        name: entity.name.toLowerCase().replace(/\s+/g, '-'),
        url: `${ZELDA_API_BASE}/characters/${entity.id}`,
      },
    };
  }

  // ─── Multiple Characters ───────────────────────────────────────────

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
        }
      }
    }
    return results;
  }

  // ─── Species / Details ─────────────────────────────────────────────

  async fetchCharacterSpecies(id: number): Promise<CharacterSpecies> {
    const entities = await fetchAllEntities();
    const entity = entities.find((e) => e.numericId === id);

    // Use the entity's description as flavor text if available
    const description = entity?.description || '';

    return {
      flavor_text_entries: description
        ? [
            {
              flavor_text: description.replace(/[\n\f]/g, ' '),
              language: { name: 'en' },
            },
          ]
        : [],
      evolution_chain: { url: '' },
      genera: entity
        ? [
            {
              genus:
                entity.category.charAt(0).toUpperCase() +
                entity.category.slice(1),
              language: { name: 'en' },
            },
          ]
        : [],
    };
  }

  async fetchSpeciesInfo(id: number): Promise<SpeciesInfo | null> {
    const entities = await fetchAllEntities();
    const entity = entities.find((e) => e.numericId === id);
    if (!entity) return null;

    return {
      id: entity.numericId,
      name: entity.name.toLowerCase().replace(/\s+/g, '-'),
      color: entity.race?.toLowerCase() || 'unknown',
      shape: entity.category,
      habitat: null,
      is_legendary: entity.category === 'boss',
      is_mythical: false,
      is_baby: false,
      gender_rate: entity.gender === 'Male' ? 0 : entity.gender === 'Female' ? 8 : -1,
      capture_rate: 45,
      base_happiness: 50,
      growth_rate: 'medium',
      egg_groups: [],
      evolution_chain_url: '',
      evolves_from_species: null,
      flavor_text: entity.description.replace(/[\n\f]/g, ' '),
      genus: entity.category.charAt(0).toUpperCase() + entity.category.slice(1),
    };
  }

  async fetchSpeciesInfoByName(name: string): Promise<SpeciesInfo | null> {
    const entities = await fetchAllEntities();
    const entity = entities.find(
      (e) => e.name.toLowerCase() === name.toLowerCase()
    );
    if (!entity) return null;
    return this.fetchSpeciesInfo(entity.numericId);
  }

  // ─── Evolution / Timeline ──────────────────────────────────────────

  async fetchEvolutionChain(id: number): Promise<EvolutionChain> {
    // Zelda API doesn't have evolution chains
    return { chain: { species: { name: '', url: '' }, evolves_to: [] } };
  }

  async fetchEvolutionChainBySpeciesId(speciesId: number): Promise<EvolutionChainData | null> {
    return null;
  }

  parseEvolutionNode(rawNode: any, parentDetails: any = null): EvolutionNodeData {
    return {
      species_name: rawNode.species?.name || 'unknown',
      species_id: 0,
      min_level: null,
      trigger: 'unknown',
      item: null,
      details: null,
      children: [],
    };
  }

  flattenEvolutionChain(node: any): string[] {
    return [];
  }

  collectAllSpecies(node: EvolutionNodeData): string[] {
    return [];
  }

  // ─── Types / Races ─────────────────────────────────────────────────

  async fetchCharactersByType(typeName: string): Promise<TypeResponse> {
    const entities = await fetchAllEntities();
    const filtered = entities.filter(
      (e) => e.race?.toLowerCase() === typeName.toLowerCase() || e.category === typeName.toLowerCase()
    );
    return {
      name: typeName,
      pokemon: filtered.map((e) => ({
        pokemon: { name: e.name, url: `${ZELDA_API_BASE}/characters/${e.id}` },
        slot: 1,
      })),
    };
  }

  // ─── Abilities / Skills ────────────────────────────────────────────

  async fetchAbility(abilityName: string): Promise<Ability> {
    return {
      name: abilityName,
      effect_entries: [
        {
          effect: `This entity is classified as a ${abilityName} in the Zelda universe.`,
          language: { name: 'en' },
        },
      ],
    };
  }

  // ─── Generations / Eras ────────────────────────────────────────────

  async fetchGenerationsList(): Promise<GenerationResponse> {
    const games = await fetchAllZeldaGames();
    return {
      count: games.length,
      next: null,
      previous: null,
      results: games.map((g) => ({
        name: g.name.toLowerCase().replace(/\s+/g, '-'),
        url: `${ZELDA_API_BASE}/games/${g.id}`,
      })),
    };
  }

  async fetchGeneration(id: number): Promise<Generation> {
    const games = await fetchAllZeldaGames();
    // Use the game at index (id-1) as the "generation"
    const game = games[id - 1];
    if (!game) {
      throw new Error(`Game not found: ${id}`);
    }

    return {
      id,
      name: game.name.toLowerCase().replace(/\s+/g, '-'),
      abilities: [],
      main_region: { name: 'Hyrule', url: '' },
      moves: [],
      names: [
        { name: game.name, language: { name: 'en', url: '' } },
      ],
      pokemon_species: [],
      types: [],
      version_groups: [],
    };
  }

  async fetchAllGenerations(): Promise<GenerationInfo[]> {
    const games = await fetchAllZeldaGames();
    const entities = await fetchAllEntities();

    return games.map((game, index) => {
      const gameId = game.id;
      // Count entities that appear in this game
      const charactersInGame = entities.filter((e) =>
        e.appearances.some((a) => a.includes(gameId))
      );

      return {
        id: index + 1,
        name: game.name.toLowerCase().replace(/\s+/g, '-'),
        displayName: game.name,
        region: 'Hyrule',
        pokemonCount: charactersInGame.length,
        pokemonSpecies: charactersInGame.map((e) => ({
          name: e.name,
          url: `${ZELDA_API_BASE}/characters/${e.id}`,
        })),
      };
    });
  }
}

/** Singleton instance */
export const zeldaFanApiProvider = new ZeldaFanApiProvider();
