<template>
  <div
    :class="`horizontal-main text-center ${
      only === 'desktop'
        ? 'only-desktop'
        : only === 'mobile'
          ? 'only-mobile'
          : ''
    }`"
  >
    <iframe
      src="//a.exdynsrv.com/iframe.php?idzone=4229374&size=728x90"
      width="728"
      height="90"
      scrolling="no"
      marginwidth="0"
      marginheight="0"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
export default {
  props: {
    only: {
      type: String,
      default() {
        return null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 760px) {
  .only-desktop {
    display: none !important;
  }
}

@media (min-width: 520px) {
  .only-mobile {
    display: none !important;
  }
}
.horizontal-main {
  display: block;
}
</style>
