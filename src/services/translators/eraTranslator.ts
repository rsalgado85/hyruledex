/**
 * Era Translator — Maps provider Generation types → Hyrule-facing Era types
 *
 * Translates Generation/GenerationInfo from the provider into
 * HyruleDex-specific Era types with Zelda nomenclature.
 */

import type { GenerationInfo } from '@/services/providers/types';
import type { HyruleEra } from './types';

/**
 * Translates provider GenerationInfo → HyruleEra
 */
export function toHyruleEra(gen: GenerationInfo): HyruleEra {
  return {
    id: gen.id,
    name: gen.name,
    displayName: gen.displayName,
    kingdom: gen.region,
    characterCount: gen.pokemonCount,
    characters: gen.pokemonSpecies,
  };
}

/**
 * Translates an array of GenerationInfo → HyruleEra[]
 */
export function toHyruleEraList(generations: GenerationInfo[]): HyruleEra[] {
  return generations.map(toHyruleEra);
}

/**
 * Era display names mapped to Zelda timeline terminology
 * (informational — not applied automatically, for future use)
 */
export const ERA_THEMES: Record<number, { era: string; kingdom: string }> = {
  1: { era: 'Era of Chaos', kingdom: 'Kanto' },
  2: { era: 'Era of Prosperity', kingdom: 'Johto' },
  3: { era: 'Era of Decline', kingdom: 'Hoenn' },
  4: { era: 'Era of Twilight', kingdom: 'Sinnoh' },
  5: { era: 'Era of the Sky', kingdom: 'Unova' },
  6: { era: 'Era of the Goddess', kingdom: 'Kalos' },
  7: { era: 'Era of the Wild', kingdom: 'Alola' },
  8: { era: 'Era of the Champion', kingdom: 'Galar' },
  9: { era: 'Era of Legends', kingdom: 'Hisui' },
  10: { era: 'Era of the Void', kingdom: 'Paldea' },
};
