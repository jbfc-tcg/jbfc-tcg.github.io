import type { Component } from 'svelte'

export type PlayerStats = {
  rank: number
  point: number
  attack: number
  pass: number
  defense: number
  defenseGoalkeeper: number
  goalkeeper: number
  etc: number
}

export type SeasonRecord = {
  competition: string
  appearances: number
  goals: number
  assists: number
  shots: number
  shotsOnTarget: number
}

export type PlayerCard = {
  id: string
  season: number
  playerName: string
  playerNameEn: string
  title: string
  seasonOrEra: string
  kitNumber: number
  position: string
  country: string
  birthDate: string
  heightCm: number
  weightKg: number
  image: string
  imageAlt: string
  stats: PlayerStats
  seasonRecord: SeasonRecord
  sources: {
    profile: string
    dynamicPoint: string
    image: string
  }
}

export type SpecialCardType =
  | 'basic'
  | 'player-of-the-month'
  | 'goal-of-the-month'
  | 'best-celebration'
  | 'special-edition'

export type StatModifiers = Partial<Record<keyof PlayerStats, number>>

export type CardDefinition = {
  id: string
  playerId: string
  faceThemeId: string
  effectThemeId?: string
  name: string
  specialType?: SpecialCardType
  image?: string
  imageAlt?: string
  video?: string
  statModifiers?: StatModifiers
}

export type ResolvedTradingCard = {
  id: string
  name: string
  specialType: SpecialCardType
  video?: string
  faceImage?: string
  player: PlayerCard
  faceTheme: CardFaceTheme
  effectTheme: CardEffectTheme
  playerImage: CardFacePlayerImage
}

export type CardEffectTheme = {
  id: string
  name: string
  sourceStyle: string
  rarityLabel: string
  description: string
  className: string
  rarity: string
  subtypes: string
  supertype: string
  trainerGallery?: boolean
  typeClass?: string
  set?: string
  number?: string
}

export type CardFaceImageSurface = {
  x: number
  y: number
  width: number
  height: number
  radius: number
  borderOutset?: number
}

export type CardFaceKind = 'framed' | 'full-art'

export type CardFaceProps = {
  card: PlayerCard
  effectTheme: CardEffectTheme
  playerImage: CardFacePlayerImage
  cardMeta: CardFaceMeta
}

export type CardFacePlayerImage = {
  src: string
  alt: string
}

export type CardFaceMeta = {
  name: string
  specialType: SpecialCardType
  specialTypeLabel: string
  video?: string
}

export type CardVideoButtonProps = {
  card: PlayerCard
  cardMeta: CardFaceMeta
  video: string
  onPlay: () => void
}

export type CardFaceTheme = {
  id: string
  name: string
  description: string
  kind: CardFaceKind
  component: Component<CardFaceProps>
  videoButtonComponent?: Component<CardVideoButtonProps>
  imageSurface?: CardFaceImageSurface
  effectSurface: {
    clip: string
    clipBorders: string
    clipInvert: string
    clipStage: string
    clipStageInvert: string
    clipTrainer: string
    clipTrainerInvert: string
  }
}
