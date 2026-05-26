<script lang="ts">
  import { onMount } from 'svelte'
  import { spring } from 'svelte/motion'

  import CardBack from './CardBack.svelte'
  import type {
    CardEffectTheme,
    CardFaceMeta,
    CardFaceTheme,
    PlayerCard,
  } from '../types/card'

  export let card: PlayerCard
  export let effectTheme: CardEffectTheme
  export let faceTheme: CardFaceTheme
  export let faceImage: string | undefined
  export let cardMeta: CardFaceMeta = {
    name: 'Basic',
    specialType: 'basic',
    specialTypeLabel: 'Basic',
  }
  export let cardInstanceId: string
  export let expanded = false
  export let interactionDisabled = false
  export let onExpand: (id: string) => void = () => undefined
  export let onCollapse: () => void = () => undefined

  let cardShell: HTMLElement
  let cardTranslater: HTMLElement
  let cardRotator: HTMLElement
  let themeStyle = ''
  let reduceMotion = false
  let wasExpanded = false
  let interacting = false
  let isBackVisible = false
  let faceImageUrl = ''
  let faceImageFailed = false
  let videoOpen = false
  let isCompactViewport = false
  let rotateX = 0
  let rotateY = 0

  const interactSpring = { stiffness: 0.066, damping: 0.25 }
  const popoverSpring = { stiffness: 0.033, damping: 0.45 }
  const snapSpring = { stiffness: 0.01, damping: 0.06 }

  const springRotate = spring({ x: 0, y: 0 }, interactSpring)
  const springRotateDelta = spring({ x: 0, y: 0 }, popoverSpring)
  const springGlare = spring({ x: 50, y: 45, o: 0 }, interactSpring)
  const springBackground = spring({ x: 50, y: 50 }, interactSpring)
  const springPointer = spring({ x: 0.5, y: 0.5, center: 0 }, interactSpring)
  const springTranslate = spring({ x: 0, y: 0 }, popoverSpring)
  const springScale = spring(1, popoverSpring)

  const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max)
  const round = (value: number, precision = 3) => Number(value.toFixed(precision))
  const normalizeAngle = (value: number) => ((value % 360) + 360) % 360
  const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) =>
    round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin))

  $: videoUrl = cardMeta.video
  $: videoEmbedUrl = videoUrl ? toYouTubeEmbedUrl(videoUrl) : ''
  $: VideoButtonComponent = faceTheme.videoButtonComponent
  $: tiltDisabled = isCompactViewport && !expanded
  $: rotateX = tiltDisabled ? 0 : $springRotate.x + $springRotateDelta.x
  $: rotateY = tiltDisabled ? 0 : $springRotate.y + $springRotateDelta.y

  $: themeStyle = [
    '--card-surface: #00523d',
    '--card-surface-deep: #002e1c',
    '--card-frame: #ffd200',
    '--card-frame-dark: #00160d',
    '--card-accent: #ffd200',
    '--card-foil: #b7f700',
    '--card-glare: rgba(255, 255, 255, 0.72)',
    '--card-text: #ffffff',
    '--card-muted-text: rgba(255, 255, 255, 0.72)',
    `--pointer-x: ${$springGlare.x}%`,
    `--pointer-y: ${$springGlare.y}%`,
    `--background-x: ${$springBackground.x}%`,
    `--background-y: ${$springBackground.y}%`,
    `--pointer-from-center: ${$springPointer.center}`,
    `--pointer-from-top: ${$springPointer.y}`,
    `--pointer-from-left: ${$springPointer.x}`,
    `--card-opacity: ${$springGlare.o}`,
    `--rotate-x: ${rotateX}deg`,
    `--rotate-y: ${rotateY}deg`,
    `--translate-x: ${$springTranslate.x}px`,
    `--translate-y: ${$springTranslate.y}px`,
    `--card-scale: ${$springScale}`,
    `--translate-z: ${$springScale * 120}px`,
    `--clip: ${faceTheme.effectSurface.clip}`,
    `--clip-borders: ${faceTheme.effectSurface.clipBorders}`,
    `--clip-invert: ${faceTheme.effectSurface.clipInvert}`,
    `--clip-stage: ${faceTheme.effectSurface.clipStage}`,
    `--clip-stage-invert: ${faceTheme.effectSurface.clipStageInvert}`,
    `--clip-trainer: ${faceTheme.effectSurface.clipTrainer}`,
    `--clip-trainer-invert: ${faceTheme.effectSurface.clipTrainerInvert}`,
  ].join('; ')

  $: {
    const yRotation = normalizeAngle(rotateX)
    isBackVisible = !tiltDisabled && yRotation > 90 && yRotation < 270
  }

  onMount(() => {
    updateViewportSettings()
  })

  function setSpringSettings(settings: { stiffness: number; damping: number }) {
    springRotate.stiffness = settings.stiffness
    springRotate.damping = settings.damping
    springGlare.stiffness = settings.stiffness
    springGlare.damping = settings.damping
    springBackground.stiffness = settings.stiffness
    springBackground.damping = settings.damping
    springPointer.stiffness = settings.stiffness
    springPointer.damping = settings.damping
  }

  function resetInteraction(delay = 500) {
    window.setTimeout(() => {
      setSpringSettings(snapSpring)
      springRotate.set({ x: 0, y: 0 }, { soft: 1 })
      springGlare.set({ x: 50, y: 45, o: 0 }, { soft: 1 })
      springBackground.set({ x: 50, y: 50 }, { soft: 1 })
      springPointer.set({ x: 0.5, y: 0.5, center: 0 }, { soft: 1 })
      interacting = false
    }, delay)
  }

  function updateViewportSettings() {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    isCompactViewport = window.matchMedia('(max-width: 880px)').matches

    if (isCompactViewport && !expanded) {
      springRotate.set({ x: 0, y: 0 }, { hard: true })
      springRotateDelta.set({ x: 0, y: 0 }, { hard: true })
    }
  }

  function getExpandedWidth(rect: DOMRect) {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const baseWidth = viewportWidth <= 460 ? viewportWidth * 0.92 : viewportWidth * 0.86
    const widthLimit = viewportWidth <= 460 ? 390 : 470
    const heightLimit = viewportHeight * 0.88 * (63 / 88)

    return Math.max(Math.min(baseWidth, widthLimit, heightLimit), rect.width)
  }

  function centerCard() {
    const rect = cardShell.getBoundingClientRect()
    const deltaX = round(window.innerWidth / 2 - rect.x - rect.width / 2)
    const deltaY = round(window.innerHeight / 2 - rect.y - rect.height / 2)

    springTranslate.set({ x: deltaX, y: deltaY })
  }

  function openCard() {
    if (!cardShell || expanded || interactionDisabled) return

    const rect = cardShell.getBoundingClientRect()
    const targetWidth = getExpandedWidth(rect)
    const targetScale = Math.min(targetWidth / rect.width, 1.75)

    centerCard()
    springScale.set(reduceMotion ? 1 : targetScale)
    onExpand(cardInstanceId)

    if (!reduceMotion) {
      springRotateDelta.set({ x: 0, y: 0 }, { hard: true })
      springRotateDelta.set({ x: 360, y: 0 })
    }

    resetInteraction(reduceMotion ? 0 : 1000)
    cardRotator?.focus()
  }

  function closeCard() {
    if (!cardShell || !expanded) return

    onCollapse()
    springScale.set(1, { soft: true })
    springTranslate.set({ x: 0, y: 0 }, { soft: true })
    springRotateDelta.set({ x: 0, y: 0 }, { soft: true })
    resetInteraction(100)
  }

  function openVideo() {
    if (!videoEmbedUrl || interactionDisabled) return
    videoOpen = true
  }

  function closeVideo() {
    videoOpen = false
  }

  function toYouTubeEmbedUrl(url: string) {
    try {
      const parsed = new URL(url)
      let id = ''

      if (parsed.hostname === 'youtu.be') {
        id = parsed.pathname.replace('/', '')
      } else if (parsed.hostname.includes('youtube.com')) {
        const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?#]+)/)
        id = shortsMatch?.[1] ?? parsed.searchParams.get('v') ?? ''
      }

      if (!id) return url

      const start = parseYouTubeStart(parsed.searchParams.get('t'))
      const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`)
      embed.searchParams.set('autoplay', '1')
      embed.searchParams.set('rel', '0')
      if (start > 0) embed.searchParams.set('start', String(start))
      return embed.toString()
    } catch {
      return url
    }
  }

  function parseYouTubeStart(value: string | null) {
    if (!value) return 0
    const plainSeconds = Number(value.replace(/s$/, ''))
    if (Number.isFinite(plainSeconds)) return Math.max(0, Math.floor(plainSeconds))

    const match = value.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/)
    if (!match) return 0
    const hours = Number(match[1] ?? 0)
    const minutes = Number(match[2] ?? 0)
    const seconds = Number(match[3] ?? 0)
    return hours * 3600 + minutes * 60 + seconds
  }

  function toggleExpanded(event: MouseEvent) {
    event.stopPropagation()
    if (interactionDisabled) return

    if (expanded) {
      closeCard()
      return
    }

    openCard()
  }

  function updatePointer(event: PointerEvent) {
    if (interactionDisabled || tiltDisabled) return

    const bounds = cardTranslater.getBoundingClientRect()
    const percentX = clamp(round(((event.clientX - bounds.left) / bounds.width) * 100))
    const percentY = clamp(round(((event.clientY - bounds.top) / bounds.height) * 100))
    const centerX = percentX - 50
    const centerY = percentY - 50
    const pointerFromCenter = clamp(Math.sqrt(centerX * centerX + centerY * centerY) / 50, 0, 1)

    setSpringSettings(interactSpring)
    interacting = true
    springRotate.set({
      x: round(-(centerX / 3.5)),
      y: round(centerY / 3.5),
    })
    springGlare.set({ x: percentX, y: percentY, o: 1 })
    springBackground.set({
      x: adjust(percentX, 0, 100, 37, 63),
      y: adjust(percentY, 0, 100, 33, 67),
    })
    springPointer.set({
      x: round(percentX / 100),
      y: round(percentY / 100),
      center: round(pointerFromCenter),
    })
  }

  function resetPointer() {
    resetInteraction(120)
  }

  function handleKeydown(event: KeyboardEvent) {
    if (interactionDisabled) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (expanded) closeCard()
      else openCard()
    }

    if (event.key === 'Escape' && expanded) {
      closeCard()
    }
  }

  function handleWindowKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && videoOpen) {
      closeVideo()
      return
    }

    if (event.key === 'Escape' && expanded) {
      closeCard()
    }
  }

  function handleWindowClick(event: MouseEvent) {
    if (expanded && cardShell && !cardShell.contains(event.target as Node)) {
      closeCard()
    }
  }

  function handleScroll() {
    if (expanded) {
      centerCard()
    }
  }

  function handleResize() {
    updateViewportSettings()

    if (expanded) {
      const rect = cardShell.getBoundingClientRect()
      springScale.set(getExpandedWidth(rect) / rect.width)
      centerCard()
    }
  }

  $: if (expanded && !wasExpanded && cardShell) {
    wasExpanded = true
    openCard()
  }

  $: if (!expanded && wasExpanded) {
    wasExpanded = false
    springScale.set(1, { soft: true })
    springTranslate.set({ x: 0, y: 0 }, { soft: true })
    springRotateDelta.set({ x: 0, y: 0 }, { soft: true })
    resetInteraction(100)
  }

  $: if (faceImageUrl !== (faceImage ?? '')) {
    faceImageUrl = faceImage ?? ''
    faceImageFailed = false
  }
</script>

<svelte:window
  on:click={handleWindowClick}
  on:keydown={handleWindowKeydown}
  on:scroll={handleScroll}
  on:resize={handleResize}
/>

{#if expanded}
  <div
    class="card-backdrop"
    aria-hidden="true"
    on:click|stopPropagation={closeCard}
  ></div>
{/if}

{#if videoOpen}
  <div class="video-backdrop" role="dialog" aria-modal="true" aria-label={`${card.playerName} 영상`}>
    <button class="video-backdrop__close-layer" type="button" aria-label="영상 닫기" on:click={closeVideo}></button>
    <div class="video-player">
      <iframe
        src={videoEmbedUrl}
        title={`${card.playerName} video`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
      <button class="video-player__close" type="button" on:click={closeVideo}>Close</button>
    </div>
  </div>
{/if}

<div
  bind:this={cardShell}
  class={`card card-shell interactive ${effectTheme.typeClass ?? 'grass'} ${effectTheme.className}`}
  class:active={expanded}
  class:expanded
  class:interacting
  class:interaction-disabled={interactionDisabled}
  class:back-visible={isBackVisible}
  aria-hidden={interactionDisabled}
  data-effect={effectTheme.id}
  data-face-theme={faceTheme.id}
  data-side={isBackVisible ? 'back' : 'front'}
  data-rarity={effectTheme.rarity}
  data-subtypes={effectTheme.subtypes}
  data-supertype={effectTheme.supertype}
  data-trainer-gallery={effectTheme.trainerGallery ? 'true' : 'false'}
  data-set={effectTheme.set ?? 'jbfc'}
  data-number={effectTheme.number ?? card.kitNumber}
  style={themeStyle}
>
  <div bind:this={cardTranslater} class="card__translater">
    <div
      bind:this={cardRotator}
      class="card__rotator"
      role="button"
      tabindex={interactionDisabled ? -1 : 0}
      aria-disabled={interactionDisabled}
      aria-pressed={expanded}
      aria-label={`${card.playerName} ${card.seasonOrEra} trading card${
        isBackVisible
          ? ', 뒷면 표시 중'
          : expanded
            ? ', 확대됨, 다시 선택하면 닫힘'
            : ', 선택하면 확대됨'
      }`}
      on:pointermove={updatePointer}
      on:pointerleave={resetPointer}
      on:click={toggleExpanded}
      on:keydown={handleKeydown}
    >
      <div class="card__front">
        {#if faceImageUrl && !faceImageFailed}
          <img
            class="card-face-image"
            src={faceImageUrl}
            alt={`${card.playerName} ${faceTheme.name} card face`}
            on:error={() => (faceImageFailed = true)}
          />
        {:else}
          <div class="card-face-placeholder" aria-hidden="true"></div>
        {/if}
      </div>
      <CardBack />
      <div class="card__shine"></div>
      <div class="card__glare"></div>
      {#if videoUrl && VideoButtonComponent}
        <svelte:component
          this={VideoButtonComponent}
          card={card}
          {cardMeta}
          video={videoUrl}
          onPlay={openVideo}
        />
      {/if}
    </div>
  </div>
</div>
