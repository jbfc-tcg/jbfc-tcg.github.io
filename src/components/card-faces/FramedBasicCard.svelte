<script lang="ts">
  import type { CardEffectTheme, CardFaceMeta, CardFacePlayerImage, PlayerCard } from '../../types/card'

  export let card: PlayerCard
  export let effectTheme: CardEffectTheme
  export let playerImage: CardFacePlayerImage
  export let cardMeta: CardFaceMeta

  let imageFailed = false
</script>

<article
  class="card-face framed-card"
  aria-label={`${card.playerName} ${cardMeta.name} ${effectTheme.rarityLabel} framed trading card`}
>
  <header class="framed-card__header">
    <span class="framed-card__badge">BASIC</span>
    <h2>{card.playerName}</h2>
    <strong>NO. {card.kitNumber}</strong>
  </header>

  <section class="framed-card__portrait-frame" aria-label="선수 이미지">
    <div class="framed-card__portrait">
      {#if imageFailed}
        <div class="framed-card__fallback" aria-hidden="true">{card.kitNumber}</div>
      {:else}
        <img src={playerImage.src} alt={playerImage.alt} on:error={() => (imageFailed = true)} />
      {/if}
    </div>
    <p>
      <span>SEASON {card.season}</span>
      <span>{card.position}</span>
      <span>{card.heightCm}cm / {card.weightKg}kg</span>
      <span>{card.country}</span>
    </p>
  </section>

  <section class="framed-card__stats" aria-label="선수 스탯">
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

  <section class="framed-card__strips" aria-label="카드 메타 정보">
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

  <footer class="framed-card__footer">JEONBUK HYUNDAI MOTORS FC</footer>
</article>

<style>
  .framed-card {
    position: relative;
    width: 900px;
    height: 1257px;
    overflow: hidden;
    border-radius: 54px;
    background: #d2b867;
    color: #11170c;
    font-family:
      HyundaiSansText, Pretendard, GmarketSans, system-ui, "Apple SD Gothic Neo", AppleGothic,
      sans-serif;
  }

  .framed-card::before {
    content: "";
    position: absolute;
    inset: 34px;
    border: 5px solid #9e8548;
    border-radius: 30px;
    background:
      radial-gradient(circle at 34% 50%, rgba(255, 255, 255, 0.3), transparent 28%),
      radial-gradient(circle at 74% 18%, rgba(255, 255, 255, 0.2), transparent 24%),
      conic-gradient(
          from 90deg,
          rgba(255, 255, 255, 0.08) 0 25%,
          rgba(93, 158, 43, 0.1) 0 50%,
          rgba(255, 255, 255, 0.05) 0 75%,
          rgba(93, 158, 43, 0.13) 0
        )
        0 0 / 112px 112px,
      linear-gradient(180deg, #c8eb79 0%, #aad761 45%, #87bd49 100%);
    box-shadow:
      inset 0 0 0 2px rgba(255, 255, 255, 0.2),
      inset 0 -30px 55px rgba(0, 46, 28, 0.12);
  }

  .framed-card::after {
    content: "";
    position: absolute;
    inset: 34px;
    border-radius: 30px;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(0deg, rgba(0, 46, 28, 0.08) 1px, transparent 1px);
    background-size: 112px 112px;
    opacity: 0.42;
  }

  .framed-card > * {
    position: absolute;
    z-index: 1;
  }

  .framed-card__header {
    top: 52px;
    right: 56px;
    left: 56px;
    display: grid;
    grid-template-columns: 126px minmax(0, 1fr) 136px;
    align-items: center;
    gap: 18px;
  }

  .framed-card__badge {
    display: grid;
    height: 46px;
    place-items: center;
    border: 2px solid rgba(0, 0, 0, 0.32);
    border-radius: 11px;
    background: linear-gradient(180deg, #ffffff 0%, #d8ddda 42%, #a3aaa5 100%);
    box-shadow:
      inset 0 2px 0 rgba(255, 255, 255, 0.72),
      0 2px 0 rgba(0, 0, 0, 0.18);
    color: #27302c;
    font-size: 23px;
    font-style: italic;
    font-weight: 950;
    letter-spacing: 0.03em;
    line-height: 1;
  }

  .framed-card__header h2 {
    overflow: hidden;
    margin: 0;
    color: #050704;
    font-size: 58px;
    font-weight: 950;
    letter-spacing: 0;
    line-height: 0.96;
    text-overflow: ellipsis;
    text-shadow: 0 2px 0 rgba(255, 255, 255, 0.28);
    white-space: nowrap;
  }

  .framed-card__header strong {
    color: #050704;
    font-size: 34px;
    font-weight: 950;
    line-height: 1;
    text-align: right;
  }

  .framed-card__portrait-frame {
    top: 138px;
    left: 58px;
    width: 784px;
    height: 536px;
    overflow: hidden;
    border: 5px solid #eef0e7;
    border-radius: 18px;
    background: #f6f2e4;
    box-shadow:
      inset 0 0 0 2px rgba(0, 0, 0, 0.34),
      0 4px 0 rgba(0, 0, 0, 0.22);
  }

  .framed-card__portrait {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 768px;
    height: 486px;
    overflow: hidden;
    border-radius: 10px;
    background:
      radial-gradient(circle at 50% 76%, rgba(255, 255, 255, 0.28), transparent 28%),
      linear-gradient(180deg, #d2d5cf 0%, #b9beb7 48%, #969d95 100%);
  }

  .framed-card__portrait img {
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 520px;
    height: 470px;
    object-fit: contain;
    object-position: center bottom;
    filter: drop-shadow(0 26px 24px rgba(0, 0, 0, 0.45));
    transform: translateX(-50%);
  }

  .framed-card__fallback {
    position: absolute;
    bottom: 40px;
    left: 50%;
    display: grid;
    width: 280px;
    height: 340px;
    place-items: center;
    border-radius: 140px;
    background: linear-gradient(180deg, #d9dcd4, #8f9990);
    color: #fff;
    font-size: 132px;
    font-weight: 950;
    transform: translateX(-50%);
  }

  .framed-card__portrait-frame p {
    position: absolute;
    right: 8px;
    bottom: 8px;
    left: 8px;
    display: flex;
    height: 34px;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin: 0;
    border-top: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: 0 0 10px 10px;
    background: linear-gradient(180deg, #fbfaf4, #d7d6cc);
    color: #11170c;
    font-size: 18px;
    font-weight: 780;
    line-height: 1;
  }

  .framed-card__stats {
    top: 740px;
    left: 176px;
    width: 548px;
  }

  .framed-card__stats dl {
    display: grid;
    gap: 20px;
    margin: 0;
  }

  .framed-card__stats div {
    display: grid;
    grid-template-columns: 1fr 210px;
    align-items: baseline;
    column-gap: 36px;
  }

  .framed-card__stats dt,
  .framed-card__stats dd {
    margin: 0;
    color: #10150d;
    font-size: 35px;
    font-weight: 950;
    line-height: 1;
    text-shadow: 0 2px 0 rgba(255, 255, 255, 0.24);
  }

  .framed-card__stats dd {
    text-align: right;
  }

  .framed-card__strips {
    top: 1026px;
    left: 58px;
    display: grid;
    width: 784px;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }

  .framed-card__strips div {
    display: flex;
    height: 42px;
    align-items: center;
    justify-content: space-between;
    padding: 0 17px;
    border: 2px solid rgba(0, 0, 0, 0.28);
    border-radius: 8px;
    background: linear-gradient(180deg, #fffdf5, #d9d8cd);
    box-shadow:
      inset 0 2px 0 rgba(255, 255, 255, 0.62),
      0 2px 0 rgba(0, 0, 0, 0.16);
    color: #15170f;
    font-size: 16px;
    font-weight: 900;
    line-height: 1;
  }

  .framed-card__strips strong {
    font-size: 21px;
    font-weight: 950;
  }

  .framed-card__footer {
    right: 58px;
    bottom: 54px;
    left: 58px;
    color: rgba(11, 17, 7, 0.88);
    font-size: 20px;
    font-weight: 950;
    letter-spacing: 0.08em;
    line-height: 1;
    text-align: center;
  }
</style>
