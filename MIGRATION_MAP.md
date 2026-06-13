# MIGRATION MAP — DashDex → HyruleDex

> **FASE 1: AUDITORÍA COMPLETA**
> Fecha: 2026-06-13
> Objetivo: Mapear cada concepto de Pokémon a su equivalente en Zelda

---

## 1. MAPEO DE CONCEPTOS PRINCIPALES

| Pokémon (DashDex) | → | Zelda (HyruleDex) |
|---|---|---|
| Pokémon | → | Character / Creature |
| Pokémon (específico: Pikachu, Charizard) | → | Character (Link, Zelda, Ganon) |
| Type (Fire, Water, Grass) | → | Race (Hylian, Zora, Goron, Rito, Gerudo, Sheikah, Korok) |
| Region (Kanto, Johto) | → | Kingdom (Hyrule, Termina, Lorule, Skyloft, Great Sea) |
| Generation (Gen I-IX) | → | Era (Era of Chaos, Era of Prosperity, Era of Decline) |
| Evolution Chain | → | Character Timeline / Transformation |
| Move | → | Ability (Spin Attack, Farore's Wind, Din's Fire) |
| Ability (Pokémon trait) | → | Trait / Skill |
| Item | → | Equipment (Master Sword, Hylian Shield, Bow of Light) |
| Pokédex | → | Hyrule Compendium |
| Habitat | → | Biome / Territory (Death Mountain, Zora's Domain, Lost Woods) |
| Egg Group | → | N/A (no aplica directamente) |
| Legendary / Mythical | → | Ancient / Deity (Hylia, Demise, Golden Goddesses) |
| Base Stats (HP, ATK, DEF, etc.) | → | Attributes (Heart, Strength, Defense, Wisdom, Speed) |
| Type Effectiveness | → | Race Affinity / Elemental Alignment |
| Evolution Stone | → | Sacred Stone / Elemental Medallion |
| TM/HM | → | Ancient Technique / Sheikah Rune |

---

## 2. MAPEO DE ARCHIVOS — SERVICIOS API

| Archivo Actual | → | Archivo Destino |
|---|---|---|
| `src/services/pokemonApi.ts` | → | `src/services/providers/pokeApiProvider.ts` (abstracción) |
| — | → | `src/services/providers/hyruleCompendiumProvider.ts` (nuevo) |
| — | → | `src/services/providers/zeldaFanApiProvider.ts` (nuevo) |
| — | → | `src/services/providers/gameProvider.ts` (interfaz genérica) |
| — | → | `src/services/providers/characterProvider.ts` (interfaz genérica) |
| — | → | `src/services/providers/monsterProvider.ts` (interfaz genérica) |
| — | → | `src/services/providers/itemProvider.ts` (interfaz genérica) |
| `src/services/species.service.ts` | → | `src/services/character.service.ts` |
| `src/services/evolution.service.ts` | → | `src/services/timeline.service.ts` |
| `src/services/generation.service.ts` | → | `src/services/era.service.ts` |
| `src/services/rawg.service.ts` | → | `src/services/rawg.service.ts` (se mantiene para juegos) |

---

## 3. MAPEO DE ARCHIVOS — TIPOS TYPESCRIPT

| Archivo Actual | → | Archivo Destino |
|---|---|---|
| `src/types/pokemon.ts` | → | `src/types/character.ts` |
| `src/types/generations.ts` | → | `src/types/eras.ts` |
| — | → | `src/types/equipment.ts` (nuevo) |
| — | → | `src/types/monsters.ts` (nuevo) |
| — | → | `src/types/materials.ts` (nuevo) |
| — | → | `src/types/races.ts` (nuevo) |
| — | → | `src/types/kingdoms.ts` (nuevo) |

### 3.1 Mapeo de Tipos — Pokemon → Character

```typescript
// Pokemon → Character
interface Pokemon {           → interface Character {
  id: number;                 →   id: number;
  name: string;               →   name: string;
  base_experience: number;    →   base_hearts?: number;
  height: number;             →   height: number;
  weight: number;             →   weight: number;
  types: PokemonType[];       →   races: Race[];
  stats: PokemonStat[];       →   attributes: Attribute[];
  abilities: PokemonAbility[];→   skills: Skill[];
  sprites: PokemonSprites;    →   image: CharacterImage;
  species: { name, url };     →   category: { name, url };
  moves?: PokemonMove[];      →   techniques?: Technique[];
}                             → }
```

### 3.2 Mapeo de Tipos — Generations → Eras

```typescript
// Generation → Era
interface Generation {        → interface Era {
  id: number;                 →   id: number;
  name: string;               →   name: string;
  main_region: { name, url }; →   kingdom: { name, url };
  pokemon_species: [];        →   characters: [];
  types: [];                  →   races: [];
  moves: [];                  →   abilities: [];
}                             → }
```

---

## 4. MAPEO DE ARCHIVOS — HOOKS

| Archivo Actual | → | Archivo Destino |
|---|---|---|
| `src/hooks/usePokemon.ts` | → | `src/hooks/useCharacters.ts` |
| `src/hooks/useGenerations.ts` | → | `src/hooks/useEras.ts` |
| `src/hooks/useEvolution.ts` | → | `src/hooks/useTimelines.ts` |
| `src/hooks/useSpecies.ts` | → | `src/hooks/useCharacterDetails.ts` |
| `src/hooks/useFilters.ts` | → | `src/hooks/useFilters.ts` (se mantiene, actualizar lógica interna) |
| `src/hooks/useProgressiveLoader.ts` | → | `src/hooks/useProgressiveLoader.ts` (se mantiene, actualizar lógica interna) |

---

## 5. MAPEO DE ARCHIVOS — PÁGINAS

| Archivo Actual | → | Archivo Destino |
|---|---|---|
| `src/pages/DashboardPage.tsx` | → | `src/pages/DashboardPage.tsx` (solo datos) |
| `src/pages/PokemonDetailPage.tsx` | → | `src/pages/CharacterDetailPage.tsx` |
| `src/pages/ExplorerPage.tsx` | → | `src/pages/ExplorerPage.tsx` (solo datos) |
| `src/pages/ComparePage.tsx` | → | `src/pages/ComparePage.tsx` (solo datos) |
| `src/pages/StatisticsPage.tsx` | → | `src/pages/StatisticsPage.tsx` (solo datos) |
| `src/pages/RankingsPage.tsx` | → | `src/pages/RankingsPage.tsx` (solo datos) |
| `src/pages/InsightsPage.tsx` | → | `src/pages/InsightsPage.tsx` (solo datos) |
| `src/pages/FavoritesPage.tsx` | → | `src/pages/FavoritesPage.tsx` (solo datos) |
| `src/pages/VideogamesPage.tsx` | → | `src/pages/VideogamesPage.tsx` (se mantiene) |
| `src/pages/HistoryPage.tsx` | → | `src/pages/HistoryPage.tsx` (se mantiene) |
| `src/pages/AboutPage.tsx` | → | `src/pages/AboutPage.tsx` | **SE MANTIENE INTACTO** — perfil del creador, sin datos de Pokémon |

### 5.1 Nota sobre AboutPage
La página **About** (`src/pages/AboutPage.tsx`) es un perfil de creador que muestra:
- Bio del desarrollador
- Tech stack (React, TypeScript, etc.)
- Proyectos y estadísticas personales
- Redes sociales y contacto

**NO contiene datos de Pokémon.** Por lo tanto:
- ✅ Se mantiene **100% intacta** — sin cambios de código
- ✅ No requiere migración de datos
- ✅ Solo aplica rebranding visual menor (logo, paleta) en FASE 6

### 5.2 Nota sobre ComparePage
La página **Compare** (`src/pages/ComparePage.tsx`) debe adaptarse cuidadosamente:
- ✅ **Mantiene layout, cards, grids, responsive** exactamente igual
- ✅ Selector de personajes funciona igual que el selector de Pokémon
- ✅ Radar chart de stats se mantiene (solo cambian los labels)
- ✅ Comparación lado a lado preserva UX al 100%
- ⚠️ Los datos cambian: stats de Pokémon → atributos de personajes Zelda
- ⚠️ Las imágenes cambian: sprites → artwork de Hyrule Compendium

---

## 6. MAPEO DE ARCHIVOS — COMPONENTES

| Archivo Actual | → | Archivo Destino |
|---|---|---|
| `src/components/dashboard/HeroCard.tsx` | → | `src/components/dashboard/HeroCard.tsx` (solo datos) |
| `src/components/dashboard/TopMovesCard.tsx` | → | `src/components/dashboard/TopAbilitiesCard.tsx` |
| `src/components/dashboard/RecentPokemonCard.tsx` | → | `src/components/dashboard/RecentCharactersCard.tsx` |
| `src/components/dashboard/TopGenerationCard.tsx` | → | `src/components/dashboard/TopEraCard.tsx` |
| `src/components/evolution/EvolutionTree.tsx` | → | `src/components/timeline/TimelineTree.tsx` |
| `src/components/charts/BaseStatsRadarChart.tsx` | → | `src/components/charts/BaseStatsRadarChart.tsx` (solo datos) |
| `src/components/charts/TypeDistributionChart.tsx` | → | `src/components/charts/RaceDistributionChart.tsx` |
| `src/components/charts/GenerationDistributionChart.tsx` | → | `src/components/charts/EraDistributionChart.tsx` |
| `src/components/common/GenerationBadge.tsx` | → | `src/components/common/EraBadge.tsx` |
| `src/components/common/PokemonListModal.tsx` | → | `src/components/common/CharacterListModal.tsx` |
| `src/components/filters/AdvancedFilters.tsx` | → | `src/components/filters/AdvancedFilters.tsx` (solo datos) |
| `src/components/compare/MultiPokemonSelector.tsx` | → | `src/components/compare/MultiCharacterSelector.tsx` |

---

## 7. MAPEO DE RUTAS

| Ruta Actual | → | Ruta Destino |
|---|---|---|
| `/pokemon/:id` | → | `/character/:id` |
| `ROUTES.POKEMON_DETAIL` | → | `ROUTES.CHARACTER_DETAIL` |

---

## 8. MAPEO DE CONSTANTES

| Constante Actual | → | Constante Destino |
|---|---|---|
| `API_BASE_URL = 'https://pokeapi.co/api/v2'` | → | `API_BASE_URL = 'https://api.hyrule-compendium.com/v3'` |
| `TYPE_COLORS` | → | `RACE_COLORS` |
| `STAT_NAMES` | → | `ATTRIBUTE_NAMES` |
| `STAT_COLORS` | → | `ATTRIBUTE_COLORS` |
| `CACHE_PREFIX = 'hyruledex_'` | → | ✅ Ya actualizado |
| `NAV_ITEMS` | → | Se mantiene estructura, se renombran labels |

---

## 9. MAPEO DE TRADUCCIONES

| Clave Actual | → | Clave Destino |
|---|---|---|
| `common.pokemon` | → | ✅ Ya actualizado: "Creature" / "Criatura" |
| `common.types` | → | ✅ Ya actualizado: "Races" / "Razas" |
| `common.abilities` | → | ✅ Ya actualizado: "Abilities" / "Habilidades" |
| `detail.evolutionChain` | → | `detail.timeline` |
| `stats.typeDistribution` | → | `stats.raceDistribution` |
| `stats.generationDistribution` | → | `stats.eraDistribution` |
| `explorer.allTypes` | → | `explorer.allRaces` |
| `rankings.pokemon` | → | `rankings.character` |
| `dashboard.totalPokemon` | → | ✅ Ya actualizado: "Total Creatures" |
| `dashboard.totalTypes` | → | ✅ Ya actualizado: "Total Races" |
| `dashboard.totalAbilities` | → | ✅ Ya actualizado: "Total Abilities" |

---

## 10. MAPEO DE APIs EXTERNAS

| API Actual | → | API Destino |
|---|---|---|
| `https://pokeapi.co/api/v2` | → | `https://api.hyrule-compendium.com/v3` |
| — | → | `https://zelda-fan-api.com` (futuro) |
| `https://api.rawg.io/api` (juegos) | → | Se mantiene |

### 10.1 Endpoints — PokeAPI → Hyrule Compendium

| PokeAPI | → | Hyrule Compendium |
|---|---|---|
| `/pokemon?limit=2000` | → | `/compendium/category/monsters` |
| `/pokemon/{id}` | → | `/compendium/entry/{id}` |
| `/pokemon-species/{id}` | → | `/compendium/entry/{id}` (incluye descripción) |
| `/evolution-chain/{id}` | → | N/A (no hay evolución directa en Zelda) |
| `/type/{name}` | → | `/compendium/category/equipment` (para equipamiento) |
| `/ability/{name}` | → | `/compendium/entry/{id}` (habilidades incluidas) |
| `/generation` | → | N/A (línea temporal propia de Zelda) |

---

## 11. MAPEO DE DATOS — DASHBOARD

| KPI Actual | → | KPI Destino |
|---|---|---|
| Total Pokémon | → | Total Characters |
| Total Types | → | Total Races |
| Total Abilities | → | Total Abilities |
| Featured Pokémon | → | Featured Character (Link por defecto) |
| Top Generation | → | Top Era |
| Recent Viewed Pokémon | → | Recent Viewed Characters |
| Top Moves | → | Top Abilities |

---

## 12. RIESGOS IDENTIFICADOS

| # | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| 1 | Hyrule Compendium no tiene evolución | Alto | Reemplazar con "Character Timeline" (apariciones cronológicas) |
| 2 | Hyrule Compendium no tiene stats numéricos | Alto | Derivar stats de atributos cualitativos o asignar valores basados en lore |
| 3 | Hyrule Compendium tiene menos entries que PokeAPI | Medio | Combinar con Zelda Fan API para mayor cobertura |
| 4 | Imágenes pueden no estar disponibles | Medio | Implementar fallback con placeholders temáticos (Triforce, Sheikah eye) |
| 5 | Diferencia en estructura de datos | Medio | Capa de adaptadores/mappers en los providers |
| 6 | RAWG API sigue siendo Pokémon | Bajo | Se mantiene para la página de juegos (VideogamesPage) |

---

## 13. DEPENDENCIAS ENTRE FASES

```
FASE 1 (Auditoría) ────┐
                        ▼
               FASE 2 (Abstracción)
                        ▼
               FASE 3 (Hyrule Compendium)
                        ▼
               FASE 4 (Detalle)
                        ▼
               FASE 5 (Listados)
                        ▼
               FASE 6 (Rebranding) ◄── Parcialmente completado
                        ▼
               FASE 7 (Dashboard Zelda)
                        ▼
               FASE 8 (Optimización)
```

---

## 14. CHECKLIST DE VALIDACIÓN — FASE 1

- [x] Auditoría de estructura de carpetas
- [x] Auditoría de páginas y rutas
- [x] Auditoría de hooks y servicios
- [x] Auditoría de tipos TypeScript
- [x] Auditoría de componentes
- [x] Auditoría de constantes y traducciones
- [x] Mapeo conceptual (Pokémon → Zelda)
- [x] Mapeo de archivos (origen → destino)
- [x] Identificación de riesgos
- [x] Generación de MIGRATION_MAP.md
- [ ] Aprobación del equipo para avanzar a FASE 2

---

*Documento generado como parte de la FASE 1 del plan de migración DashDex → HyruleDex.*
