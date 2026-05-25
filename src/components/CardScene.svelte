<script lang="ts">
  import TradingCard from './TradingCard.svelte'
  import { formatSpecialType } from '../data/tradingCards'
  import type { ResolvedTradingCard } from '../types/card'

  export let cards: ResolvedTradingCard[]

  let activeCardId: string | undefined
</script>

<main class="scene" aria-label="Jeonbuk Hyundai Motors FC trading cards">
  <header class="gallery-hero">
    <p class="eyebrow">JEONBUK HYUNDAI MOTORS FC</p>
  </header>

  <section class="home-card-gallery" aria-label="Trading card gallery">
    {#each cards as tradingCard}
      {@const effect = tradingCard.effectTheme}
      {@const cardInstanceId = `${effect.id}:${tradingCard.id}`}
      <article class="home-card-gallery__item" aria-labelledby={`card-${tradingCard.id}`}>
        <TradingCard
          card={tradingCard.player}
          faceTheme={tradingCard.faceTheme}
          playerImage={tradingCard.playerImage}
          cardMeta={{
            name: tradingCard.name,
            specialType: tradingCard.specialType,
            specialTypeLabel: formatSpecialType(tradingCard.specialType),
            video: tradingCard.video,
          }}
          effectTheme={effect}
          {cardInstanceId}
          expanded={activeCardId === cardInstanceId}
          interactionDisabled={Boolean(activeCardId && activeCardId !== cardInstanceId)}
          onExpand={(id) => (activeCardId = id)}
          onCollapse={() => (activeCardId = undefined)}
        />
        <h2 id={`card-${tradingCard.id}`}>{tradingCard.player.playerName}</h2>
        <p>{formatSpecialType(tradingCard.specialType)}</p>
      </article>
    {/each}
  </section>

  <footer class="sources">
    <span>Profile: Jeonbuk Hyundai Motors FC</span>
    <span>Stats: K LEAGUE Dynamic Point</span>
  </footer>
</main>
