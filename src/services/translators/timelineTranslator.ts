/**
 * Timeline Translator — Maps provider Evolution types → Hyrule-facing Timeline types
 *
 * Translates EvolutionChainData/EvolutionNodeData into HyruleDex-specific
 * Timeline types with Zelda nomenclature.
 */

import type { EvolutionChainData, EvolutionNodeData, EvolutionDetail } from '@/services/providers/types';
import type { HyruleTimeline, HyruleTimelineNode, HyruleTimelineDetail } from './types';

/**
 * Translates provider EvolutionChainData → HyruleTimeline
 */
export function toHyruleTimeline(chain: EvolutionChainData): HyruleTimeline {
  return {
    id: chain.id,
    chain: toHyruleTimelineNode(chain.chain),
    allCharacters: chain.all_species,
  };
}

/**
 * Translates provider EvolutionNodeData → HyruleTimelineNode
 */
export function toHyruleTimelineNode(node: EvolutionNodeData): HyruleTimelineNode {
  return {
    characterName: node.species_name,
    characterId: node.species_id,
    minLevel: node.min_level,
    trigger: node.trigger,
    item: node.item,
    details: node.details ? toHyruleTimelineDetail(node.details) : null,
    children: node.children.map(toHyruleTimelineNode),
  };
}

/**
 * Translates provider EvolutionDetail → HyruleTimelineDetail
 */
export function toHyruleTimelineDetail(detail: EvolutionDetail): HyruleTimelineDetail {
  return {
    item: detail.item,
    trigger: detail.trigger,
    gender: detail.gender,
    heldItem: detail.held_item,
    knownMove: detail.known_move,
    knownMoveType: detail.known_move_type,
    location: detail.location,
    minLevel: detail.min_level,
    minHappiness: detail.min_happiness,
    minBeauty: detail.min_beauty,
    minAffection: detail.min_affection,
    needsOverworldRain: detail.needs_overworld_rain,
    partySpecies: detail.party_species,
    partyType: detail.party_type,
    relativePhysicalStats: detail.relative_physical_stats,
    timeOfDay: detail.time_of_day,
    tradeSpecies: detail.trade_species,
    turnUpsideDown: detail.turn_upside_down,
  };
}
