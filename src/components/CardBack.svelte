<script lang="ts">
  const emblemSrc = '/img/jeonbuk-emblem.png'

  let imageLoaded = false
  let imageFailed = false
</script>

<div class="card__back jbfc-card-back" aria-hidden="true">
  <div class="jbfc-card-back__pattern"></div>
  <div class="jbfc-card-back__mark">
    {#if emblemSrc && !imageFailed}
      <img
        class:loaded={imageLoaded}
        src={emblemSrc}
        alt=""
        on:load={() => (imageLoaded = true)}
        on:error={() => (imageFailed = true)}
      />
    {/if}

    {#if !emblemSrc || imageFailed || !imageLoaded}
      <div class="jbfc-card-back__fallback" aria-hidden="true">
        <strong>JB</strong>
        <span>1994</span>
      </div>
    {/if}
  </div>
  <p>JEONBUK HYUNDAI MOTORS FC</p>
</div>
