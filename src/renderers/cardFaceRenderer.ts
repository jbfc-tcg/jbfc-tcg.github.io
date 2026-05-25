import { mount, tick, unmount } from 'svelte'
import { toBlob, toPng } from 'html-to-image'

import type {
  CardEffectTheme,
  CardFaceMeta,
  CardFacePlayerImage,
  CardFaceTheme,
  PlayerCard,
} from '../types/card'

const WIDTH = 900
const HEIGHT = 1257
const cache = new Map<string, Promise<string>>()

export function createCardFaceImageCacheKey(
  card: PlayerCard,
  faceTheme: CardFaceTheme,
  playerImage: CardFacePlayerImage,
  cardMeta: CardFaceMeta,
) {
  return `${card.id}:${faceTheme.id}:${playerImage.src}:${cardMeta.name}:${cardMeta.specialType}:${cardMeta.video ?? ''}`
}

export function renderCardFaceImage(
  card: PlayerCard,
  effectTheme: CardEffectTheme,
  faceTheme: CardFaceTheme,
  playerImage: CardFacePlayerImage,
  cardMeta: CardFaceMeta,
) {
  const key = createCardFaceImageCacheKey(card, faceTheme, playerImage, cardMeta)
  const cached = cache.get(key)
  if (cached) return cached

  const promise = captureCardFace(card, effectTheme, faceTheme, playerImage, cardMeta).catch((error) => {
    cache.delete(key)
    throw error
  })
  cache.set(key, promise)
  return promise
}

async function captureCardFace(
  card: PlayerCard,
  effectTheme: CardEffectTheme,
  faceTheme: CardFaceTheme,
  playerImage: CardFacePlayerImage,
  cardMeta: CardFaceMeta,
) {
  await document.fonts?.ready
  const capturePlayerImage = await inlineCaptureImage(playerImage)

  const { stage, wrapper } = createCaptureStage()
  document.body.appendChild(wrapper)

  const component = mount(faceTheme.component, {
    target: stage,
    props: { card, effectTheme, playerImage: capturePlayerImage, cardMeta },
  })

  try {
    await tick()
    await document.fonts?.ready
    await waitForImages(stage)
    await nextFrame()

    const blob = await toBlob(stage, {
      width: WIDTH,
      height: HEIGHT,
      canvasWidth: WIDTH,
      canvasHeight: HEIGHT,
      pixelRatio: 1,
      cacheBust: false,
      backgroundColor: 'transparent',
    })

    if (blob) return URL.createObjectURL(blob)

    return toPng(stage, {
      width: WIDTH,
      height: HEIGHT,
      canvasWidth: WIDTH,
      canvasHeight: HEIGHT,
      pixelRatio: 1,
      cacheBust: false,
      backgroundColor: 'transparent',
    })
  } finally {
    await unmount(component)
    wrapper.remove()
  }
}

async function inlineCaptureImage(playerImage: CardFacePlayerImage): Promise<CardFacePlayerImage> {
  if (playerImage.src.startsWith('data:') || playerImage.src.startsWith('blob:')) return playerImage

  try {
    const imageUrl = new URL(playerImage.src, window.location.href)
    if (imageUrl.origin !== window.location.origin) return playerImage

    const response = await fetch(imageUrl)
    if (!response.ok) return playerImage

    const dataUrl = await blobToDataUrl(await response.blob())
    return {
      ...playerImage,
      src: dataUrl,
    }
  } catch {
    return playerImage
  }
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Failed to read image blob as a data URL.'))
    })
    reader.addEventListener('error', () => reject(reader.error ?? new Error('Failed to read image blob.')))
    reader.readAsDataURL(blob)
  })
}

function createCaptureStage() {
  const wrapper = document.createElement('div')
  wrapper.setAttribute('data-card-face-capture-wrapper', 'true')
  wrapper.style.position = 'fixed'
  wrapper.style.left = '-1px'
  wrapper.style.top = '-1px'
  wrapper.style.width = '1px'
  wrapper.style.height = '1px'
  wrapper.style.overflow = 'hidden'
  wrapper.style.pointerEvents = 'none'
  wrapper.style.background = 'transparent'
  wrapper.style.zIndex = '-1'

  const stage = document.createElement('div')
  stage.setAttribute('data-card-face-capture-stage', 'true')
  stage.style.position = 'relative'
  stage.style.width = `${WIDTH}px`
  stage.style.height = `${HEIGHT}px`
  stage.style.overflow = 'hidden'
  stage.style.pointerEvents = 'none'
  stage.style.background = 'transparent'

  wrapper.appendChild(stage)

  return { stage, wrapper }
}

async function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll('img'))

  await Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true })
          image.addEventListener('error', () => resolve(), { once: true })
        })
      }

      await image.decode?.().catch(() => undefined)
    }),
  )
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}
