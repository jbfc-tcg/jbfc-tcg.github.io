<script lang="ts">
  import TradingCard from './TradingCard.svelte'
  import { cardFaceThemes } from '../data/cardFaceThemes'
  import { formatSpecialType } from '../data/tradingCards'
  import type { CardEffectTheme, ResolvedTradingCard } from '../types/card'

  export let cards: ResolvedTradingCard[]
  export let effects: CardEffectTheme[]

  const params = new URLSearchParams(window.location.search)
  const requestedFaceId = params.get('face') ?? params.get('faceTheme') ?? 'framed-basic'
  const requestedEffectId = params.get('effect') ?? 'basic'
  const fallbackCard = cards[0]

  let activeCardId: string | undefined

  $: selectedFaceTheme =
    cardFaceThemes.find((faceTheme) => faceTheme.id === requestedFaceId) ?? cardFaceThemes[0]

  $: selectedEffect =
    effects.find((effect) => effect.id === requestedEffectId) ??
    effects.find((effect) => effect.id === 'basic') ??
    effects[0]

  $: selectedCard = cards.find((card) => card.faceTheme.id === selectedFaceTheme.id) ?? {
    id: `theme-lab-${selectedFaceTheme.id}`,
    name: `${selectedFaceTheme.name} Test Card`,
    specialType: 'basic',
    player: fallbackCard.player,
    faceTheme: selectedFaceTheme,
    effectTheme: selectedEffect,
    playerImage: {
      src: fallbackCard.player.image,
      alt: fallbackCard.player.imageAlt,
    },
  } satisfies ResolvedTradingCard

  $: cardInstanceId = `theme-lab:${selectedEffect.id}:${selectedCard.id}`
</script>

<main class="theme-lab" data-theme-lab-screenshot>
  {#if selectedEffect && selectedCard}
    <TradingCard
      card={selectedCard.player}
      faceTheme={selectedCard.faceTheme}
      playerImage={selectedCard.playerImage}
      cardMeta={{
        name: selectedCard.name,
        specialType: selectedCard.specialType,
        specialTypeLabel: formatSpecialType(selectedCard.specialType),
        video: selectedCard.video,
      }}
      effectTheme={selectedEffect}
      {cardInstanceId}
      expanded={activeCardId === cardInstanceId}
      interactionDisabled={Boolean(activeCardId && activeCardId !== cardInstanceId)}
      onExpand={(id) => (activeCardId = id)}
      onCollapse={() => (activeCardId = undefined)}
    />
  {/if}
</main>

<style>
  .theme-lab {
    display: grid;
    min-width: 320px;
    min-height: 100vh;
    place-items: center;
    padding: 32px;
    background: #002e1c;
  }

  .theme-lab :global(.card-shell) {
    width: min(82vw, 380px);
  }

  @media (max-width: 520px) {
    .theme-lab {
      padding: 18px;
    }

    .theme-lab :global(.card-shell) {
      width: min(92vw, 340px);
    }
  }
</style>
