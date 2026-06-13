/**
 * EraBadge Component
 * 
 * Displays a small badge showing which era a character belongs to.
 * Uses the character's ID to determine the era dynamically.
 * Styled as a compact, glassmorphism tag that fits anywhere.
 */

import { useMemo } from 'react';
import { getGenerationIdFromPokemonId, getGenerationDisplayName } from '@/services/generation.service';

interface EraBadgeProps {
  pokemonId: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ERA_COLORS: Record<number, string> = {
  1: '#667eea',   // Era of Chaos - purple
  2: '#f5576c',   // Era of Prosperity - pink
  3: '#4facfe',   // Era of Decline - blue
  4: '#43e97b',   // Era of Light - green
  5: '#fa709a',   // Era of Shadow - rose
  6: '#a18cd1',   // Era of Twilight - lavender
  7: '#fccb90',   // Era of the Wild - peach
  8: '#e0c3fc',   // Era of the Sky - light purple
  9: '#f5576c',   // Era of the Ocean - coral
  10: '#ff6f00',  // Era of the Ancients - orange
};

const ERA_SHORT: Record<number, string> = {
  1: 'Era I',
  2: 'Era II',
  3: 'Era III',
  4: 'Era IV',
  5: 'Era V',
  6: 'Era VI',
  7: 'Era VII',
  8: 'Era VIII',
  9: 'Era IX',
  10: 'Era X',
};

export function EraBadge({ pokemonId, size = 'sm', showLabel = true }: EraBadgeProps) {
  const genId = useMemo(() => getGenerationIdFromPokemonId(pokemonId), [pokemonId]);
  const color = ERA_COLORS[genId] || '#6c5ce7';
  const shortLabel = ERA_SHORT[genId] || `Era ${genId}`;
  const fullLabel = getGenerationDisplayName(genId);

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${color}22`,
        color: color,
        border: `1px solid ${color}33`,
      }}
      title={fullLabel}
      aria-label={`Era ${genId}: ${fullLabel}`}
    >
      {/* Small dot indicator */}
      <span
        className="rounded-full"
        style={{
          backgroundColor: color,
          width: size === 'sm' ? 4 : size === 'md' ? 5 : 6,
          height: size === 'sm' ? 4 : size === 'md' ? 5 : 6,
        }}
      />
      {showLabel && shortLabel}
    </span>
  );
}
