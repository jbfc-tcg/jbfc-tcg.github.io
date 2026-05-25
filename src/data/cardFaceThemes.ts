import type { CardFaceImageSurface, CardFaceTheme } from '../types/card'
import FramedBasicVideoButton from '../components/card-actions/FramedBasicVideoButton.svelte'
import FullArtVideoButton from '../components/card-actions/FullArtVideoButton.svelte'
import VideoArtVideoButton from '../components/card-actions/VideoArtVideoButton.svelte'
import FramedBasicCard from '../components/card-faces/FramedBasicCard.svelte'
import FullArtCard from '../components/card-faces/FullArtCard.svelte'
import VideoArtCard from '../components/card-faces/VideoArtCard.svelte'

const canvasSize = { width: 900, height: 1257 }
const fullCardClip = 'inset(0 round 18px)'

const framedBasicImageSurface: CardFaceImageSurface = {
  x: 66,
  y: 146,
  width: 768,
  height: 486,
  radius: 10,
  borderOutset: 3,
}

function toPercent(value: number) {
  return `${Number(value.toFixed(2))}%`
}

function clipFromImageSurface(surface: CardFaceImageSurface, outset = 0, radius = surface.radius) {
  const x = surface.x - outset
  const y = surface.y - outset
  const width = surface.width + outset * 2
  const height = surface.height + outset * 2
  const top = toPercent((y / canvasSize.height) * 100)
  const right = toPercent(((canvasSize.width - x - width) / canvasSize.width) * 100)
  const bottom = toPercent(((canvasSize.height - y - height) / canvasSize.height) * 100)
  const left = toPercent((x / canvasSize.width) * 100)

  return `inset(${top} ${right} ${bottom} ${left} round ${radius}px)`
}

function framedEffectSurface(surface: CardFaceImageSurface) {
  const clip = clipFromImageSurface(surface)
  const clipBorders = clipFromImageSurface(
    surface,
    surface.borderOutset ?? 2,
    surface.radius + (surface.borderOutset ?? 2),
  )

  return {
    clip,
    clipBorders,
    clipInvert: clip,
    clipStage: clip,
    clipStageInvert: clip,
    clipTrainer: clip,
    clipTrainerInvert: clip,
  }
}

export const cardFaceThemes: CardFaceTheme[] = [
  {
    id: 'framed-basic',
    name: 'Framed Basic',
    description: 'Classic framed card with a dedicated player visual area and stat panels.',
    kind: 'framed',
    component: FramedBasicCard,
    videoButtonComponent: FramedBasicVideoButton,
    imageSurface: framedBasicImageSurface,
    effectSurface: framedEffectSurface(framedBasicImageSurface),
  },
  {
    id: 'full-art',
    name: 'Full Art',
    description: 'Full-card player artwork treatment with overlaid match-card typography.',
    kind: 'full-art',
    component: FullArtCard,
    videoButtonComponent: FullArtVideoButton,
    effectSurface: {
      clip: fullCardClip,
      clipBorders: fullCardClip,
      clipInvert: fullCardClip,
      clipStage: fullCardClip,
      clipStageInvert: fullCardClip,
      clipTrainer: fullCardClip,
      clipTrainerInvert: fullCardClip,
    },
  },
  {
    id: 'video-art',
    name: 'Video Art',
    description: 'Full-card video moment treatment with large special type, vertical stats, and centered play action.',
    kind: 'full-art',
    component: VideoArtCard,
    videoButtonComponent: VideoArtVideoButton,
    effectSurface: {
      clip: fullCardClip,
      clipBorders: fullCardClip,
      clipInvert: fullCardClip,
      clipStage: fullCardClip,
      clipStageInvert: fullCardClip,
      clipTrainer: fullCardClip,
      clipTrainerInvert: fullCardClip,
    },
  },
]
