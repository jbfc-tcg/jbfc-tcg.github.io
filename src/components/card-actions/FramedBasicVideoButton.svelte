<script lang="ts">
  import type { CardFaceMeta, PlayerCard } from '../../types/card'

  export let card: PlayerCard
  export let cardMeta: CardFaceMeta
  export let video: string
  export let onPlay: () => void
</script>

<button
  class="card-video-button framed-video-button"
  type="button"
  aria-label={`${card.playerName} ${cardMeta.specialTypeLabel} 영상 재생`}
  data-video={video}
  title="영상 재생"
  on:click|stopPropagation={onPlay}
>
  <span aria-hidden="true"></span>
  <strong>PLAY</strong>
</button>

<style>
  .framed-video-button {
    position: absolute;
    right: 7.5%;
    bottom: 8.25%;
    z-index: 12;
    display: inline-flex;
    width: auto;
    min-width: 70px;
    height: 28px;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 1px solid rgba(0, 0, 0, 0.36);
    border-radius: 7px;
    background: linear-gradient(180deg, #fffdf5, #d9d8cd);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.72),
      0 4px 10px rgba(0, 0, 0, 0.28);
    color: #10150d;
    cursor: pointer;
    font: inherit;
    padding: 0 10px;
    pointer-events: auto;
  }

  .framed-video-button span {
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 8px solid currentColor;
  }

  .framed-video-button strong {
    font-size: 11px;
    font-weight: 950;
    letter-spacing: 0.08em;
    line-height: 1;
  }
</style>
