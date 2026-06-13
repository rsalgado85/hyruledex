/**
 * Character Translator — Maps provider Character types → Hyrule-facing types
 *
 * This translator converts the generic provider Character types into
 * HyruleDex-specific types with Zelda nomenclature (races, attributes, etc.).
 *
 * All mapping functions are pure: they take provider data and return Hyrule data.
 */

import type {
  Character,
  CharacterWithStats,
  CharacterStats,
  CharacterRanking,
  ComparisonData,
  StatDifference,
  TypeDistribution,
  TypeAverage,
  StatDistribution,
  SpeciesInfo,
} from '@/services/providers/types';
import type {
  HyruleCharacter,
  HyruleCharacterWithStats,
  HyruleCharacterStats,
  HyruleCharacterRanking,
  HyruleComparisonData,
  HyruleStatDifference,
  HyruleRaceDistribution,
  HyruleRaceAverage,
  HyruleStatDistribution,
  HyruleLore,
  HyruleCharacterImage,
} from './types';

// ─── Stat name mapping: Pokémon → Hyrule ───────────────────────────────────

const STAT_TO_ATTRIBUTE: Record<string, string> = {
  hp: 'hearts',
  attack: 'strength',
  defense: 'defense',
  'special-attack': 'wisdom',
  'special-defense': 'spirit',
  speed: 'speed',
};

const ATTRIBUTE_LABELS: Record<string, string> = {
  hearts: 'Hearts',
  strength: 'Strength',
  defense: 'Defense',
  wisdom: 'Wisdom',
  spirit: 'Spirit',
  speed: 'Speed',
};

// ─── Core translators ──────────────────────────────────────────────────────

/**
 * Translates a provider Character → HyruleCharacter
 */
export function toHyruleCharacter(character: Character): HyruleCharacter {
  return {
    id: character.id,
    name: character.name,
    hearts: character.base_experience,
    height: character.height,
    weight: character.weight,
    races: character.types.map((t) => ({
      slot: t.slot,
      race: { name: t.type.name, url: t.type.url },
    })),
    attributes: character.stats.map((s) => ({
      baseValue: s.base_stat,
      effort: s.effort,
      attribute: { name: s.stat.name, url: s.stat.url },
    })),
    skills: character.abilities.map((a) => ({
      skill: { name: a.ability.name, url: a.ability.url },
      is_hidden: a.is_hidden,
      slot: a.slot,
    })),
    image: toHyruleImage(character.sprites),
    category: character.species,
    techniques: character.moves?.map((m) => ({
      technique: { name: m.move.name, url: m.move.url },
      learnDetails: m.version_group_details.map((d) => ({
        levelLearnedAt: d.level_learned_at,
        method: d.move_learn_method.name,
        versionGroup: d.version_group.name,
      })),
    })),
  };
}

/**
 * Translates sprite data → HyruleCharacterImage
 */
export function toHyruleImage(sprites: Character['sprites']): HyruleCharacterImage {
  return {
    front_default: sprites.front_default,
    front_shiny: sprites.front_shiny,
    official: sprites.other?.['official-artwork']?.front_default || sprites.front_default,
    officialShiny: sprites.other?.['official-artwork']?.front_shiny || sprites.front_shiny,
    showdown: sprites.other?.showdown?.front_default || sprites.front_default,
  };
}

/**
 * Translates provider CharacterStats → HyruleCharacterStats
 */
export function toHyruleStats(stats: CharacterStats): HyruleCharacterStats {
  return {
    hearts: stats.hp,
    strength: stats.attack,
    defense: stats.defense,
    wisdom: stats.specialAttack,
    spirit: stats.specialDefense,
    speed: stats.speed,
  };
}

/**
 * Translates provider CharacterWithStats → HyruleCharacterWithStats
 */
export function toHyruleCharacterWithStats(c: CharacterWithStats): HyruleCharacterWithStats {
  return {
    ...toHyruleCharacter(c),
    computedStats: toHyruleStats(c.computedStats),
    totalStats: c.totalStats,
    dominantRace: c.dominantType,
    imageUrl: c.imageUrl,
    artworkUrl: c.artworkUrl,
  };
}

/**
 * Translates provider CharacterRanking → HyruleCharacterRanking
 */
export function toHyruleRanking(r: CharacterRanking): HyruleCharacterRanking {
  return {
    id: r.id,
    name: r.name,
    imageUrl: r.imageUrl,
    stat: r.stat,
    statName: ATTRIBUTE_LABELS[STAT_TO_ATTRIBUTE[r.statName]] || r.statName,
    races: r.types,
  };
}

/**
 * Translates provider ComparisonData → HyruleComparisonData
 */
export function toHyruleComparison(d: ComparisonData): HyruleComparisonData {
  return {
    character1: d.character1 ? toHyruleCharacterWithStats(d.character1) : null,
    character2: d.character2 ? toHyruleCharacterWithStats(d.character2) : null,
    differences: d.differences.map(toHyruleStatDiff),
  };
}

/**
 * Translates provider StatDifference → HyruleStatDifference
 */
export function toHyruleStatDiff(d: StatDifference): HyruleStatDifference {
  return {
    stat: ATTRIBUTE_LABELS[STAT_TO_ATTRIBUTE[d.stat]] || d.stat,
    value1: d.value1,
    value2: d.value2,
    difference: d.difference,
    percentageDiff: d.percentageDiff,
    winner: d.winner,
  };
}

/**
 * Translates provider TypeDistribution → HyruleRaceDistribution
 */
export function toHyruleRaceDistribution(td: TypeDistribution): HyruleRaceDistribution {
  return {
    name: td.name,
    count: td.count,
    percentage: td.percentage,
    color: td.color,
  };
}

/**
 * Translates provider TypeAverage → HyruleRaceAverage
 */
export function toHyruleRaceAverage(ta: TypeAverage): HyruleRaceAverage {
  return {
    race: ta.type,
    hearts: ta.hp,
    strength: ta.attack,
    defense: ta.defense,
    wisdom: ta.specialAttack,
    spirit: ta.specialDefense,
    speed: ta.speed,
    count: ta.count,
  };
}

/**
 * Translates provider StatDistribution → HyruleStatDistribution
 */
export function toHyruleStatDistribution(sd: StatDistribution): HyruleStatDistribution {
  return { range: sd.range, count: sd.count };
}

/**
 * Translates provider SpeciesInfo → HyruleLore
 */
export function toHyruleLore(info: SpeciesInfo): HyruleLore {
  return {
    id: info.id,
    name: info.name,
    color: info.color,
    shape: info.shape,
    biome: info.habitat,
    isAncient: info.is_legendary,
    isDeity: info.is_mythical,
    isBaby: info.is_baby,
    genderRate: info.gender_rate,
    captureRate: info.capture_rate,
    baseHappiness: info.base_happiness,
    growthRate: info.growth_rate,
    eggGroups: info.egg_groups,
    timelineUrl: info.evolution_chain_url,
    evolvesFrom: info.evolves_from_species,
    description: info.flavor_text,
    genus: info.genus,
  };
}

// ─── Utility ───────────────────────────────────────────────────────────────

/**
 * Returns the Hyrule label for a given stat name (supports both Pokémon and Hyrule names)
 */
export function getAttributeLabel(statName: string): string {
  const mapped = STAT_TO_ATTRIBUTE[statName];
  if (mapped) return ATTRIBUTE_LABELS[mapped];
  return ATTRIBUTE_LABELS[statName] || statName;
}

/**
 * Returns all attribute labels in order
 */
export function getAttributeLabels(): Record<string, string> {
  return { ...ATTRIBUTE_LABELS };
}
