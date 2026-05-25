<script lang="ts">
  import type { CardFaceMeta, PlayerCard } from '../../types/card'

  export let card: PlayerCard
  export let cardMeta: CardFaceMeta
  export let video: string
  export let onPlay: () => void
</script>

<button
  class="card-video-button full-art-video-button"
  type="button"
  aria-label={`${card.playerName} ${cardMeta.specialTypeLabel} 영상 재생`}
  data-video={video}
  title="영상 재생"
  on:click|stopPropagation={onPlay}
>
  <span aria-hidden="true"></span>
</button>

<style>
  .full-art-video-button {
    position: absolute;
    top: 4.45%;
    right: 18.7%;
    z-index: 12;
    display: inline-flex;
    width: auto;
    width: 6.3%;
    min-width: 0;
    height: auto;
    aspect-ratio: 1;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(0, 0, 0, 0.42);
    border-radius: 50%;
    background: rgba(255, 253, 245, 0.88);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      0 8px 20px rgba(0, 0, 0, 0.34);
    color: #050704;
    cursor: pointer;
    font: inherit;
    padding: 0;
    pointer-events: auto;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
  }

  .full-art-video-button span {
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    border-radius: 50%;
    background: transparent;
  }

  .full-art-video-button span::before {
    content: "";
    width: 38%;
    height: 46%;
    margin-left: 8%;
    background: #050704;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
  }
</style>
