/**
 * Hyrule Compendium Service
 *
 * Consulta el Hyrule Compendium API (https://api.hyrule-compendium.com)
 * para obtener imágenes reales de personajes, criaturas y monstruos
 * de Breath of the Wild y Tears of the Kingdom.
 *
 * El Compendium usa slugs con guiones bajos (ej: "white-maned_lynel")
 * mientras que la Zelda Fan API usa nombres con espacios o guiones.
 * Hacemos fuzzy matching para relacionarlos.
 */

import { cacheManager } from '@/cache/cacheManager';

interface CompendiumEntry {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  common_locations: string[] | null;
  drops: string[] | null;
  edible?: boolean;
  dlc?: boolean;
}

interface CompendiumResponse {
  data: CompendiumEntry[];
}

const COMPENDIUM_API = 'https://api.hyrule-compendium.com/v3/compendium';
const CACHE_KEY = 'hyrule_compendium_images';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

/**
 * Normaliza un nombre para comparación: minúsculas, sin guiones, sin espacios extra.
 */
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[-_\s]+/g, ' ')
    .trim();
}

/**
 * Carga todas las entradas del Compendium (con caché en memoria).
 */
async function fetchAllEntries(): Promise<CompendiumEntry[]> {
  const cached = cacheManager.get<CompendiumEntry[]>(CACHE_KEY);
  if (cached) return cached;

  const response = await fetch(`${COMPENDIUM_API}/all`);
  if (!response.ok) {
    throw new Error(`Compendium API error: ${response.status}`);
  }

  const data: CompendiumResponse = await response.json();
  cacheManager.set(CACHE_KEY, data.data, CACHE_TTL);
  return data.data;
}

/**
 * Construye un mapa de nombre normalizado → URL de imagen.
 */
async function buildImageMap(): Promise<Map<string, string>> {
  const entries = await fetchAllEntries();
  const map = new Map<string, string>();

  for (const entry of entries) {
    if (!entry.image) continue;
    const key = normalize(entry.name);
    // Preferir la entrada más específica si hay duplicados
    if (!map.has(key)) {
      map.set(key, entry.image);
    }
  }

  return map;
}

/**
 * Busca la imagen de un personaje por nombre en el Compendium.
 * Hace matching flexible: primero exacto, luego parcial.
 */
export async function findCompendiumImage(name: string): Promise<string | null> {
  try {
    const map = await buildImageMap();
    return matchInMap(name, map);
  } catch {
    return null;
  }
}

/**
 * Obtiene imágenes para múltiples personajes en paralelo.
 */
export async function findCompendiumImages(names: string[]): Promise<Map<string, string>> {
  const map = await buildImageMap();
  const result = new Map<string, string>();

  for (const name of names) {
    const imageUrl = matchInMap(name, map);
    if (imageUrl) {
      result.set(name, imageUrl);
    }
  }

  return result;
}

/**
 * Estrategia de matching en varios niveles para relacionar nombres
 * de la Zelda Fan API con entradas del Hyrule Compendium.
 *
 * Reglas para evitar falsos positivos:
 * - Palabras muy cortas (< 4 chars) no se consideran para matching parcial
 * - El nombre del personaje DEBE contener completamente el nombre del Compendium
 *   (no al revés) para matches parciales, a menos que sea una palabra completa
 * - Se requiere que al menos una palabra significativa coincida exactamente
 *
 * Nivel 1: Coincidencia exacta (normalizada) — 100% confiable
 * Nivel 2: El nombre del personaje contiene el nombre completo del Compendium
 *          Ej: "cursed lizalfos" contiene "lizalfos" → match con "cursed lizalfos"
 * Nivel 3: Palabra clave individual significativa (≥4 chars) que existe en ambos
 *          Ej: "spiny chuchu" → "chuchu" está en entry "chuchu" → match
 */
function matchInMap(name: string, map: Map<string, string>): string | null {
  const normalized = normalize(name);

  // Nivel 1: Coincidencia exacta
  if (map.has(normalized)) {
    return map.get(normalized)!;
  }

  const nameWords = normalized.split(' ').filter(w => w.length >= 3);

  let bestMatch: { url: string; score: number } | null = null;

  for (const [entryName, imageUrl] of map) {
    const entryWords = entryName.split(' ');

    // Nivel 2: El nombre del personaje contiene COMPLETAMENTE el nombre del Compendium
    // Esto evita falsos como "ancient oven" → "ancient short sword"
    if (normalized.includes(entryName) && entryName.length >= 3) {
      const score = entryName.length; // Preferir el match más largo
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { url: imageUrl, score };
      }
      continue;
    }

    // Nivel 3: Palabra clave individual significativa (≥4 chars) que existe en ambos
    // Ej: "spiny chuchu" → words ["spiny", "chuchu"] → "chuchu" está en entry "chuchu"
    // Pero "ancient oven" → words ["ancient", "oven"] → "ancient" NO está sola en ninguna entry
    for (const word of nameWords) {
      if (word.length >= 4 && entryWords.includes(word)) {
        // Verificar que no sea un falso positivo: la palabra debe ser una parte
        // significativa del nombre, no una palabra genérica
        if (!isGenericWord(word)) {
          if (!bestMatch || 1 > bestMatch.score) {
            bestMatch = { url: imageUrl, score: 1 };
          }
          break;
        }
      }
    }
  }

  return bestMatch?.url ?? null;
}

/**
 * Palabras genéricas que no deberían usarse para matching.
 */
const GENERIC_WORDS = new Set([
  'ancient', 'golden', 'giant', 'sky', 'sea', 'dark', 'light', 'fire', 'ice',
  'thunder', 'stone', 'water', 'spiny', 'cursed', 'treasure', 'royal', 'soldier',
  'captain', 'guardian', 'hero', 'prince', 'princess', 'great', 'king', 'queen',
  'lord', 'lady', 'master', 'young', 'old', 'red', 'blue', 'green', 'black',
  'white', 'silver', 'iron', 'steel', 'wooden', 'forest', 'mountain', 'desert',
  'temple', 'castle', 'town', 'city', 'field', 'lake', 'river', 'beast',
]);

function isGenericWord(word: string): boolean {
  return GENERIC_WORDS.has(word);
}
