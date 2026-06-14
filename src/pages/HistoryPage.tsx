/**
 * HistoryPage - Zelda History Timeline
 *
 * Interactive timeline showcasing the history of The Legend of Zelda from its inception
 * to the present day. Features:
 * - Chronological timeline with key milestones
 * - Game-by-game breakdown
 * - Avant-garde visual design
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';
import { ChevronDown, ChevronUp, Sparkles, Gamepad2, Globe, BookOpen, Star, Award, Zap, Sword, Shield, Gem } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  image?: string;
  facts: string[];
  type: 'milestone' | 'generation' | 'curiosity';
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '1986',
    title: 'The Legend of Zelda',
    subtitle: 'The Birth of a Legend',
    description: 'Shigeru Miyamoto and Takashi Tezuka release the first Zelda game for the Famicom Disk System. Inspired by Miyamoto\'s childhood explorations of caves and forests in Kyoto, the game introduces players to the land of Hyrule, the hero Link, and the princess Zelda. Its non-linear gameplay, secret discoveries, and the iconic "It\'s dangerous to go alone! Take this." moment set the foundation for action-adventure gaming.',
    icon: <Sparkles size={20} />,
    color: '#C6A15B',
    facts: [
      'First game to feature a save feature on the Famicom Disk System',
      'The name "Zelda" comes from Zelda Fitzgerald, wife of author F. Scott Fitzgerald',
      'Originally released in Japan on February 21, 1986',
      'Introduced the Triforce, Master Sword, and Ganon',
      'Sold over 6.5 million copies worldwide',
    ],
    type: 'milestone',
  },
  {
    year: '1987',
    title: 'Zelda II: The Adventure of Link',
    subtitle: 'A Bold Departure',
    description: 'The direct sequel takes a radically different approach, featuring side-scrolling combat, RPG-style experience points, and magic spells. Link travels across Hyrule to awaken Princess Zelda from a sleeping curse placed by an evil wizard. Though divisive among fans, the game introduced many elements that would become series staples.',
    icon: <Sword size={20} />,
    color: '#5B8A9E',
    facts: [
      'Only Zelda game with side-scrolling combat as the primary view',
      'Introduced RPG elements: experience points, levels, and magic',
      'Link learns spells like Reflect, Jump, and Fairy',
      'First appearance of Dark Link (Shadow Link)',
      'The most difficult game in the original series',
    ],
    type: 'generation',
  },
  {
    year: '1992',
    title: 'A Link to the Past',
    subtitle: 'The Golden Age Begins',
    description: 'Returning to the top-down perspective, A Link to the Past perfects the original formula. Set generations after the first game, Link must rescue the descendants of the Seven Sages and defeat Ganon in the Dark World. Widely regarded as one of the greatest video games of all time, it established the template for all future 2D Zelda games.',
    icon: <Star size={20} />,
    color: '#3E6B48',
    facts: [
      'Introduced the concept of the Light World and Dark World',
      'First game to feature the Master Sword as a central plot element',
      'The "Spin Attack" became a permanent series staple',
      'Considered one of the greatest games of the 16-bit era',
      'Sold over 4.6 million copies worldwide',
    ],
    type: 'generation',
  },
  {
    year: '1993',
    title: "Link's Awakening",
    subtitle: 'A Portable Masterpiece',
    description: 'The first handheld Zelda game takes Link to the mysterious Koholint Island, where he must awaken the Wind Fish to escape. Stripped of the traditional Hyrule setting and Zelda characters, the game features a dreamlike narrative, trading sequences, and cameos from other Nintendo franchises like Mario and Kirby.',
    icon: <Gamepad2 size={20} />,
    color: '#E8A040',
    facts: [
      'First handheld Zelda game, released for Game Boy',
      'No Princess Zelda, Ganon, or Triforce appear in the story',
      'Features a trading sequence with over 10 items',
      'Includes cameos from Mario, Yoshi, Kirby, and Dr. Wright',
      'The Wind Fish egg is one of gaming\'s most iconic mysteries',
    ],
    type: 'generation',
  },
  {
    year: '1998',
    title: 'Ocarina of Time',
    subtitle: 'The 3D Revolution',
    description: 'The first 3D Zelda game revolutionizes the action-adventure genre. Link travels through time between his childhood and adulthood, playing the Ocarina of Time to solve puzzles and warp across Hyrule. With its Z-targeting combat system, time travel narrative, and emotional story, Ocarina of Time is consistently ranked as the greatest video game of all time.',
    icon: <Award size={20} />,
    color: '#C6A15B',
    facts: [
      'First 3D Zelda game, released for Nintendo 64',
      'Introduced Z-targeting, now a standard in 3D action games',
      'Features the iconic "Song of Time" and time travel mechanics',
      'Metacritic score of 99 — the highest-rated game ever',
      'Sold over 7.6 million copies worldwide',
    ],
    type: 'generation',
  },
  {
    year: '2000',
    title: "Majora's Mask",
    subtitle: 'The Darkest Timeline',
    description: 'Using the same engine as Ocarina of Time, Majora\'s Mask presents a darker, more surreal adventure. Link is trapped in Termina, a parallel world where the moon is crashing in three days. The game\'s time loop mechanic forces players to relive the same three days, learning the schedules of every character and solving their personal tragedies.',
    icon: <Gem size={20} />,
    color: '#5B3A8B',
    facts: [
      'Completed in just 18 months of development',
      'Features a 3-day time cycle with real-time character schedules',
      'Over 20 unique masks with different abilities',
      'Darker tone exploring themes of loss, grief, and acceptance',
      'The "Fierce Deity" mask is one of gaming\'s most powerful rewards',
    ],
    type: 'generation',
  },
  {
    year: '2001',
    title: 'Oracle of Seasons & Ages',
    subtitle: 'A Linked Adventure',
    description: 'Two interconnected Game Boy Color games released simultaneously. Oracle of Seasons focuses on changing the seasons with the Rod of Seasons, while Oracle of Ages focuses on time travel with the Harp of Ages. Using a password system, players could link both games to unlock the true final boss and ending.',
    icon: <Gamepad2 size={20} />,
    color: '#78C850',
    facts: [
      'Developed by Capcom\'s Flagship studio under Nintendo supervision',
      'Two games that connect via password system for the true ending',
      'Seasons changes the environment; Ages changes the timeline',
      'Features the "Hero\'s Secret" — a hidden final boss in the linked game',
      'Originally planned as a trilogy, but the third game was cancelled',
    ],
    type: 'generation',
  },
  {
    year: '2003',
    title: 'The Wind Waker',
    subtitle: 'Sailing the Great Sea',
    description: 'After the initial backlash for its cel-shaded art style, The Wind Waker became beloved for its timeless visuals and emotional story. Set centuries after Ocarina of Time, Hyrule is flooded, and Link sails the Great Sea in search of his kidnapped sister. The game\'s expressive animation, vibrant world, and poignant narrative make it a fan favorite.',
    icon: <Globe size={20} />,
    color: '#3B7DD8',
    facts: [
      'Cel-shaded art style was initially controversial, later praised',
      'Features the vast Great Sea with over 40 islands to explore',
      'The "Picto Box" lets players take photos for side quests',
      'Ganondorf\'s backstory is explored more deeply than ever before',
      'The HD remaster on Wii U is considered the definitive version',
    ],
    type: 'generation',
  },
  {
    year: '2006',
    title: 'Twilight Princess',
    subtitle: 'The Darkest Hyrule',
    description: 'A darker, more realistic Zelda game released for GameCube and Wii. Link transforms into a wolf in the Twilight Realm, partnered with the mysterious Midna. The game\'s motion controls on Wii introduced a new way to play, while its mature story and epic scale made it a launch title for Nintendo\'s new console.',
    icon: <Shield size={20} />,
    color: '#704070',
    facts: [
      'Released as a launch title for the Wii console',
      'Link transforms into a wolf in the Twilight Realm',
      'Midna is one of the most beloved companion characters in gaming',
      'Features the largest Hyrule field of any game at the time',
      'The "Hidden Skills" system adds combat depth',
    ],
    type: 'generation',
  },
  {
    year: '2011',
    title: 'Skyward Sword',
    subtitle: 'The Beginning of the Timeline',
    description: 'The chronological first game in the Zelda timeline. Skyward Sword tells the origin story of the Master Sword, the Goddess Hylia, and the eternal conflict with Demise. The game\'s 1:1 motion controls with Wii MotionPlus require precise sword swings, making combat more immersive than ever.',
    icon: <Sword size={20} />,
    color: '#E8D8B0',
    facts: [
      'First game chronologically in the official Zelda timeline',
      '1:1 motion controls require precise sword swings',
      'Introduces the Goddess Hylia and the demon Demise',
      'Link rides a giant bird called a Loftwing',
      'The "Groose" character became an unexpected fan favorite',
    ],
    type: 'generation',
  },
  {
    year: '2017',
    title: 'Breath of the Wild',
    subtitle: 'The Open World Revolution',
    description: 'Breath of the Wild redefines the Zelda franchise with a fully open world where anything is possible. Link awakens from a 100-year slumber to defeat Calamity Ganon and save Hyrule. The game\'s physics engine, emergent gameplay, and freedom of exploration set a new standard for open-world games worldwide.',
    icon: <Zap size={20} />,
    color: '#3E6B48',
    facts: [
      'First open-world Zelda game with complete freedom of exploration',
      'Over 100 Shrines of Trials to complete',
      'The "Paraglider" replaces the traditional horse as primary transport',
      'Won over 200 Game of the Year awards',
      'Sold over 30 million copies worldwide',
    ],
    type: 'generation',
  },
  {
    year: '2023',
    title: 'Tears of the Kingdom',
    subtitle: 'The Sky and the Depths',
    description: 'The direct sequel to Breath of the Wild expands Hyrule vertically with floating Sky Islands and the vast Depths below. New abilities like Ultrahand, Fuse, and Recall allow unprecedented creativity in solving puzzles and traversing the world. The game builds on its predecessor\'s foundation while adding entirely new dimensions to explore.',
    icon: <Star size={20} />,
    color: '#5B8A9E',
    facts: [
      'Adds Sky Islands above Hyrule and the Depths below ground',
      'Ultrahand lets players build vehicles, bridges, and contraptions',
      'Fuse combines items to create new weapons and tools',
      'The Depths are a massive dark underground world to explore',
      'Sold over 20 million copies in its first year',
    ],
    type: 'generation',
  },
  {
    year: '2024',
    title: 'Echoes of Wisdom',
    subtitle: 'Zelda Takes the Lead',
    description: 'For the first time in series history, Princess Zelda is the main playable character. Using the Tri Rod, she creates "echoes" — copies of objects and monsters — to solve puzzles and defeat enemies. The game returns to the top-down perspective of A Link to the Past while introducing innovative new mechanics.',
    icon: <Gem size={20} />,
    color: '#E8A0D8',
    facts: [
      'First mainline Zelda game with Princess Zelda as the protagonist',
      'Uses a top-down perspective similar to A Link to the Past',
      'The "Echo" system lets players copy and summon objects/enemies',
      'Developed by Grezzo, the studio behind Link\'s Awakening HD',
      'Celebrated for its fresh take on the classic Zelda formula',
    ],
    type: 'generation',
  },
  {
    year: '2025',
    title: 'HyruleDex',
    subtitle: 'The Ultimate Zelda Encyclopedia',
    description: 'HyruleDex launches as the definitive digital encyclopedia of The Legend of Zelda universe. Compiling data from the Hyrule Compendium and Zelda Fan APIs, it catalogs every character, monster, boss, item, and location across the entire series. A tribute to the franchise that has inspired generations of gamers worldwide.',
    icon: <BookOpen size={20} />,
    color: '#C6A15B',
    facts: [
      'Comprehensive database of Zelda characters, monsters, and items',
      'Powered by the Zelda Fan API and Hyrule Compendium',
      'Features interactive timelines, comparisons, and statistics',
      'Bilingual support: English and Spanish',
      'A fan-made tribute to The Legend of Zelda franchise',
    ],
    type: 'milestone',
  },
];

export function HistoryPage() {
  const { theme, language } = useAppStore();
  const isDark = theme === 'dark';
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold gradient-text">{t('history.title', language)}</h1>
        <p className="text-text-secondary">
          {t('history.subtitle', language)}
        </p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: t('history.years', language), value: `${new Date().getFullYear() - 1986}+`, color: '#C6A15B' },
          { label: t('history.mainGames', language), value: '20+', color: '#3E6B48' },
          { label: t('history.copiesSold', language), value: '150M+', color: '#5B8A9E' },
          { label: t('history.creaturesCataloged', language), value: '150+', color: '#E8A040' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-2xl p-4 text-center"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}>{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div
          className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{
            background: `linear-gradient(to bottom, #C6A15B, #3E6B48, #5B8A9E, #704070, #E8A040, #C6A15B)`,
            opacity: 0.3,
          }}
        />

        <div className="space-y-4">
          {TIMELINE_EVENTS.map((event, index) => {
            const isLeft = index % 2 === 0;
            const isExpanded = expandedIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`relative flex flex-col md:flex-row items-start gap-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10 mt-6"
                  style={{
                    backgroundColor: event.color,
                    boxShadow: `0 0 12px ${event.color}66, 0 0 24px ${event.color}33`,
                  }}
                />

                {/* Content Card */}
                <div className={`w-full md:w-[calc(50%-2rem)] ml-12 md:ml-0 ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                  <motion.div
                    className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                      border: `1px solid ${isExpanded ? `${event.color}44` : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                      boxShadow: isExpanded
                        ? `0 8px 32px ${event.color}22`
                        : isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.04)',
                    }}
                    onClick={() => toggleExpand(index)}
                  >
                    {/* Header */}
                    <div className="p-5 flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${event.color}22`,
                          color: event.color,
                        }}
                      >
                        {event.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold"
                            style={{
                              backgroundColor: event.color,
                              color: '#ffffff',
                            }}
                          >
                            {event.year}
                          </span>
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider"
                            style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)' }}
                          >
                            {event.type === 'generation' ? t('history.newGame', language) : event.type === 'milestone' ? t('history.milestone', language) : t('history.curiosity', language)}
                          </span>
                        </div>
                        <h3 className="text-base font-bold" style={{ color: isDark ? '#ffffff' : '#1a1a2e' }}>
                          {event.title}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}>
                          {t(`history.game${index}.subtitle` as any, language)}
                        </p>
                      </div>

                      {/* Expand Icon */}
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
                        }}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-5 pb-5 space-y-4"
                            style={{
                              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                            }}
                          >
                            {/* Description */}
                            <p
                              className="text-sm leading-relaxed mt-4"
                              style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}
                            >
                              {t(`history.game${index}.description` as any, language)}
                            </p>

                            {/* Fun Facts */}
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: event.color }}>
                                {t('history.funFacts', language)}
                              </h4>
                              <ul className="space-y-1.5">
                                {event.facts.map((fact, fi) => (
                                  <li
                                    key={fi}
                                    className="flex items-start gap-2 text-xs"
                                    style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}
                                  >
                                    <span style={{ color: event.color }}>✦</span>
                                    {t(`history.game${index}.fact${fi}` as any, language)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-8"
      >
        <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)' }}>
          {t('history.footer', language)}
        </p>
        <p className="text-xs mt-1" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}>
          {t('history.footerDesc', language)}
        </p>
      </motion.div>
    </div>
  );
}
