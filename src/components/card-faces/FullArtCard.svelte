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
  class="card-face full-art-card"
  aria-label={`${card.playerName} ${cardMeta.specialTypeLabel} ${effectTheme.rarityLabel} full art trading card`}
>
  <section class="full-art-card__stage" aria-label="선수 이미지">
    {#if imageFailed}
      <div class="full-art-card__fallback" aria-hidden="true">{card.kitNumber}</div>
    {:else}
      <img src={playerImage.src} alt={playerImage.alt} on:error={() => (imageFailed = true)} />
    {/if}
  </section>

  <header class="full-art-card__header">
    <span class="full-art-card__badge">{cardMeta.specialTypeLabel}</span>
    <h2>{card.playerName}</h2>
    <strong>NO. {card.kitNumber}</strong>
  </header>

  <section class="full-art-card__stats" aria-label="선수 스탯">
    <dl>
      <div>
        <dt>ATTACK</dt>
        <dd>{card.stats.attack.toLocaleString()}</dd>
      </div>
      <div>
        <dt>PASS</dt>
        <dd>{card.stats.pass.toLocaleString()}</dd>
      </div>
      <div>
        <dt>DEFENSE</dt>
        <dd>{card.stats.defense.toLocaleString()}</dd>
      </div>
      <div>
        <dt>RECORD</dt>
        <dd>{card.seasonRecord.goals}G {card.seasonRecord.assists}A</dd>
      </div>
    </dl>
  </section>

  <section class="full-art-card__strips" aria-label="카드 메타 정보">
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

  <footer class="full-art-card__footer">JEONBUK HYUNDAI MOTORS FC</footer>
</article>

<style>
  .full-art-card {
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

  .full-art-card::before {
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

  .full-art-card::after {
    content: "";
    position: absolute;
    inset: 34px;
    z-index: 1;
    border-radius: 30px;
    background: radial-gradient(circle at 50% 54%, transparent 0 42%, rgba(0, 0, 0, 0.18) 100%);
    pointer-events: none;
  }

  .full-art-card > * {
    position: absolute;
    z-index: 2;
  }

  .full-art-card__stage {
    inset: 34px;
    z-index: 0;
    overflow: hidden;
    border-radius: 30px;
    background: #002e1c;
  }

  .full-art-card__stage img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    filter: saturate(1.08) contrast(1.02);
  }

  .full-art-card__fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: linear-gradient(180deg, #00523d, #00160d);
    color: rgba(255, 255, 255, 0.8);
    font-size: 160px;
    font-weight: 950;
  }

  .full-art-card__header,
  .full-art-card__stats,
  .full-art-card__strips,
  .full-art-card__footer {
    text-shadow:
      0 2px 0 rgba(255, 255, 255, 0.96),
      0 0 14px rgba(255, 255, 255, 0.72);
  }

  .full-art-card__header {
    top: 52px;
    right: 56px;
    left: 56px;
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr) 136px;
    align-items: center;
    gap: 18px;
  }

  .full-art-card__badge {
    display: grid;
    min-width: 0;
    height: 46px;
    place-items: center;
    border: 2px solid rgba(0, 0, 0, 0.32);
    border-radius: 11px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(202, 207, 199, 0.92));
    box-shadow:
      inset 0 2px 0 rgba(255, 255, 255, 0.72),
      0 2px 0 rgba(0, 0, 0, 0.18);
    color: #11170c;
    font-size: 17px;
    font-style: italic;
    font-weight: 950;
    letter-spacing: 0.02em;
    line-height: 1;
    overflow: hidden;
    padding: 0 18px;
    text-overflow: ellipsis;
    text-shadow: 0 1px 0 #fff;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .full-art-card__header h2 {
    overflow: hidden;
    margin: 0;
    color: #050704;
    font-size: 58px;
    font-weight: 950;
    letter-spacing: 0;
    line-height: 0.96;
    text-overflow: ellipsis;
    text-shadow:
      -2px -2px 0 rgba(255, 255, 255, 0.98),
      2px -2px 0 rgba(255, 255, 255, 0.98),
      -2px 2px 0 rgba(255, 255, 255, 0.98),
      2px 2px 0 rgba(255, 255, 255, 0.98),
      0 2px 0 rgba(255, 255, 255, 1),
      0 0 10px rgba(255, 255, 255, 1),
      0 0 18px rgba(255, 255, 255, 0.88),
      0 0 1px rgba(255, 255, 255, 1);
    white-space: nowrap;
  }

  .full-art-card__header strong {
    color: #050704;
    font-size: 34px;
    font-weight: 950;
    line-height: 1;
    text-align: right;
    text-shadow:
      -2px -2px 0 rgba(255, 255, 255, 0.98),
      2px -2px 0 rgba(255, 255, 255, 0.98),
      -2px 2px 0 rgba(255, 255, 255, 0.98),
      2px 2px 0 rgba(255, 255, 255, 0.98),
      0 2px 0 rgba(255, 255, 255, 1),
      0 0 10px rgba(255, 255, 255, 1),
      0 0 18px rgba(255, 255, 255, 0.88),
      0 0 1px rgba(255, 255, 255, 1);
  }

  .full-art-card__stats {
    right: 76px;
    bottom: 214px;
    width: 384px;
    padding: 24px 26px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.5);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.44),
      0 12px 30px rgba(0, 0, 0, 0.16);
  }

  .full-art-card__stats dl {
    display: grid;
    gap: 15px;
    margin: 0;
  }

  .full-art-card__stats div {
    display: grid;
    grid-template-columns: 1fr 142px;
    align-items: baseline;
    column-gap: 24px;
  }

  .full-art-card__stats dt,
  .full-art-card__stats dd {
    margin: 0;
    color: #050704;
    font-size: 29px;
    font-weight: 950;
    line-height: 1;
  }

  .full-art-card__stats dd {
    text-align: right;
  }

  .full-art-card__strips {
    right: 58px;
    bottom: 132px;
    left: 58px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }

  .full-art-card__strips div {
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
  }

  .full-art-card__strips strong {
    font-size: 21px;
    font-weight: 950;
  }

  .full-art-card__footer {
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
