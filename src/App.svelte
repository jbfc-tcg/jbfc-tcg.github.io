<script lang="ts">
  import CardScene from './components/CardScene.svelte'
  import ThemeLab from './components/ThemeLab.svelte'
  import { cardEffects } from './data/cardEffects'
  import { tradingCards } from './data/tradingCards'

  const params = new URLSearchParams(window.location.search)
  const normalizedPath = window.location.pathname.replace(/\/$/, '')
  const isThemeLab = normalizedPath === '/theme-lab' || params.get('view') === 'theme-lab'
</script>

{#if isThemeLab}
  <ThemeLab cards={tradingCards} effects={cardEffects} />
{:else}
  <CardScene cards={tradingCards} />
{/if}
