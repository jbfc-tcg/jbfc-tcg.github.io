import cardDefinitionsJson from './cards/cards.json'
import { cardEffects } from './cardEffects'
import { cardFaceThemes } from './cardFaceThemes'
import { playerCards } from './playerCards'
import { cardFaceImages } from '../generated/cardFaces'
import type {
  CardDefinition,
  CardFacePlayerImage,
  PlayerCard,
  PlayerStats,
  ResolvedTradingCard,
  SpecialCardType,
  StatModifiers,
} from '../types/card'

const cardDefinitions = cardDefinitionsJson as CardDefinition[]

export const tradingCards: ResolvedTradingCard[] = cardDefinitions.map(resolveTradingCard)

function resolveTradingCard(definition: CardDefinition): ResolvedTradingCard {
  const player = playerCards.find((candidate) => candidate.id === definition.playerId)
  if (!player) {
    throw new Error(`Player not found for card definition: ${definition.id}`)
  }

  const faceTheme = cardFaceThemes.find((candidate) => candidate.id === definition.faceThemeId)
  if (!faceTheme) {
    throw new Error(`Face theme not found for card definition: ${definition.id}`)
  }

  const effectTheme = cardEffects.find((candidate) => candidate.id === (definition.effectThemeId ?? 'basic'))
  if (!effectTheme) {
    throw new Error(`Effect theme not found for card definition: ${definition.id}`)
  }

  const resolvedPlayer = applyStatModifiers(player, definition.statModifiers)

  return {
    id: definition.id,
    name: definition.name,
    specialType: definition.specialType ?? 'basic',
    video: definition.video?.trim() || undefined,
    faceImage: cardFaceImages[definition.id],
    player: resolvedPlayer,
    faceTheme,
    effectTheme,
    playerImage: resolvePlayerImage(resolvedPlayer, definition),
  }
}

function applyStatModifiers(player: PlayerCard, modifiers: StatModifiers | undefined): PlayerCard {
  if (!modifiers) return player

  return {
    ...player,
    stats: applyModifiers(player.stats, modifiers),
  }
}

function applyModifiers(stats: PlayerStats, modifiers: StatModifiers): PlayerStats {
  const nextStats = { ...stats }

  for (const [key, delta] of Object.entries(modifiers) as [keyof PlayerStats, number][]) {
    if (typeof delta === 'number' && Number.isFinite(delta)) {
      nextStats[key] += delta
    }
  }

  return nextStats
}

function resolvePlayerImage(player: PlayerCard, definition: CardDefinition): CardFacePlayerImage {
  const src = definition.image?.trim()

  if (src) {
    return {
      src,
      alt: definition.imageAlt?.trim() || player.imageAlt,
    }
  }

  return {
    src: player.image,
    alt: player.imageAlt,
  }
}

export function formatSpecialType(type: SpecialCardType) {
  return type
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}
