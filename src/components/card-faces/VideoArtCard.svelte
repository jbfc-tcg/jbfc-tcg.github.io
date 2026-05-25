<script lang="ts">
  import type {
    CardEffectTheme,
    CardFaceMeta,
    CardFacePlayerImage,
    PlayerCard,
  } from '../../types/card'

  export let card: PlayerCard
  export let effectTheme: CardEffectTheme
  export let playerImage: CardFacePlayerImage
  export let cardMeta: CardFaceMeta

  let imageFailed = false
</script>

<article
  class="card-face video-art-card"
  aria-label={`${card.playerName} ${cardMeta.specialTypeLabel} ${effectTheme.rarityLabel} video art trading card`}
>
  <section class="video-art-card__stage" aria-label="선수 이미지">
    {#if imageFailed}
      <div class="video-art-card__fallback" aria-hidden="true">{card.kitNumber}</div>
    {:else}
      <img src={playerImage.src} alt={playerImage.alt} on:error={() => (imageFailed = true)} />
    {/if}
  </section>

  <header class="video-art-card__headline">
    <span>{cardMeta.specialTypeLabel}</span>
  </header>

  <section class="video-art-card__left-stack" aria-label="주요 기록">
    <strong>{card.position}</strong>
    <strong>{card.kitNumber}</strong>
    <i aria-hidden="true"></i>
    <span>GOAL</span>
    <strong>{card.seasonRecord.goals}</strong>
    <i aria-hidden="true"></i>
    <span>ASSIST</span>
    <strong>{card.seasonRecord.assists}</strong>
  </section>

  <section class="video-art-card__name" aria-label="선수명">
    <h2>{card.playerNameEn}</h2>
  </section>

  <section class="video-art-card__strips" aria-label="카드 메타 정보">
    <div>
      <span>POSITION</span>
      <strong>{card.position}</strong>
    </div>
    <div>
      <span>RANK</span>
      <strong>{card.stats.rank}</strong>
    </div>
    <div>
      <span>APPS</span>
      <strong>{card.seasonRecord.appearances}</strong>
    </div>
    <div>
      <span>SHOTS</span>
      <strong>{card.seasonRecord.shots}</strong>
    </div>
  </section>

  <footer class="video-art-card__footer">JEONBUK HYUNDAI MOTORS FC</footer>
</article>

<style>
  .video-art-card {
    position: relative;
    width: 900px;
    height: 1257px;
    overflow: hidden;
    border-radius: 54px;
    background: #d2b867;
    color: #050704;
    font-family:
      HyundaiSansText, Pretendard, GmarketSans, system-ui, "Apple SD Gothic Neo", AppleGothic,
      sans-serif;
  }

  .video-art-card::before {
    content: "";
    position: absolute;
    inset: 34px;
    z-index: 1;
    border: 5px solid #9e8548;
    border-radius: 30px;
    pointer-events: none;
    box-shadow:
      inset 0 0 0 2px rgba(255, 255, 255, 0.22),
      inset 0 0 80px rgba(0, 0, 0, 0.18);
  }

  .video-art-card::after {
    content: "";
    position: absolute;
    inset: 34px;
    z-index: 1;
    border-radius: 30px;
    background:
      linear-gradient(90deg, rgba(0, 0, 0, 0.34), transparent 22%, transparent 78%, rgba(0, 0, 0, 0.3)),
      radial-gradient(circle at 50% 54%, transparent 0 38%, rgba(0, 0, 0, 0.28) 100%);
    pointer-events: none;
  }

  .video-art-card > * {
    position: absolute;
    z-index: 2;
  }

  .video-art-card__stage {
    inset: 34px;
    z-index: 0;
    overflow: hidden;
    border-radius: 30px;
    background: #002e1c;
  }

  .video-art-card__stage img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    filter: saturate(1.08) contrast(1.04);
  }

  .video-art-card__fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: linear-gradient(180deg, #00523d, #00160d);
    color: rgba(255, 255, 255, 0.8);
    font-size: 160px;
    font-weight: 950;
  }

  .video-art-card__headline,
  .video-art-card__left-stack,
  .video-art-card__name,
  .video-art-card__strips,
  .video-art-card__footer {
    text-shadow: none;
  }

  .video-art-card__headline {
    top: 54px;
    right: 70px;
    left: 70px;
    display: grid;
    justify-items: start;
  }

  .video-art-card__headline span {
    display: block;
    max-width: 100%;
    overflow: visible;
    color: #fffdf5;
    font-size: 94px;
    font-weight: 1000;
    letter-spacing: 0.01em;
    line-height: 0.86;
    text-align: left;
    text-transform: uppercase;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .video-art-card__left-stack {
    top: 50%;
    left: 72px;
    display: grid;
    width: 154px;
    justify-items: center;
    gap: 13px;
    color: #fffdf5;
    text-align: center;
    transform: translateY(-50%);
  }

  .video-art-card__left-stack span,
  .video-art-card__left-stack strong {
    display: block;
    font-size: 42px;
    font-weight: 1000;
    letter-spacing: 0.02em;
    line-height: 0.9;
    text-transform: uppercase;
  }

  .video-art-card__left-stack strong {
    font-size: 54px;
  }

  .video-art-card__left-stack i {
    display: block;
    width: 86px;
    height: 1px;
    margin: 10px 0 4px;
    border-radius: 999px;
    background: #fffdf5;
    box-shadow: none;
  }

  .video-art-card__name {
    right: 70px;
    bottom: 214px;
    left: 70px;
    display: grid;
    justify-items: center;
  }

  .video-art-card__name h2 {
    margin: 0;
    color: #fffdf5;
    font-size: 44px;
    font-weight: 1000;
    letter-spacing: 0;
    line-height: 0.96;
    text-align: center;
    white-space: nowrap;
  }

  .video-art-card__strips {
    right: 58px;
    bottom: 132px;
    left: 58px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }

  .video-art-card__strips div {
    display: flex;
    height: 42px;
    align-items: center;
    justify-content: space-between;
    padding: 0 17px;
    border: 2px solid rgba(0, 0, 0, 0.28);
    border-radius: 8px;
    background: linear-gradient(
      180deg,
      rgba(255, 253, 245, 0.94),
      rgba(217, 216, 205, 0.88)
    );
    box-shadow:
      inset 0 2px 0 rgba(255, 255, 255, 0.62),
      0 2px 0 rgba(0, 0, 0, 0.16);
    color: #050704;
    font-size: 16px;
    font-weight: 900;
    line-height: 1;
    text-shadow: none;
  }

  .video-art-card__strips strong {
    font-size: 21px;
    font-weight: 950;
  }

  .video-art-card__footer {
    right: 58px;
    bottom: 54px;
    left: 58px;
    color: #050704;
    font-size: 20px;
    font-weight: 950;
    letter-spacing: 0.08em;
    line-height: 1;
    text-align: center;
  }
</style>
