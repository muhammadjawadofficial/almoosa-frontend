<template>
  <div class="coming-soon-section" :class="{ guest: isGuest }">
    <div class="heading w600">
      <span class="font-secondary">{{ $t("comingSoon.coming") }}</span>
      <span class="font-primary">{{ $t("comingSoon.soon") }}</span>
    </div>
    <div class="sub-heading text-center">
      {{ $t("comingSoon.text") }}
      <div>
        <button class="btn btn-secondary mt-3" @click="navigateTo('default')">
          {{ $t("comingSoon.buttonText") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isGuest: false,
    };
  },
  mounted() {
    this.isGuest = this.$route.path.includes("guest");
  },
};
</script>

<style lang="scss" scoped>
.coming-soon-section {
  height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75em;
  font-size: 1rem;
  &.guest {
    height: 75vh;
    @media (max-width: 1200px) {
      height: 65vh;
    }
    @media (max-width: 992px) {
      height: auto;
      padding-block: 5em;
    }
  }
  @media (max-width: 1200px) {
    font-size: 0.75em;
  }
  @media (max-width: 992px) {
    font-size: 0.5em;
  }
  .heading {
    font-size: 4.5em;
    letter-spacing: 0.09em;
    line-height: 1;
    gap: 0.3em;
    display: flex;
  }
  .sub-heading {
    font-size: 1em;
    color: black;
    @media (max-width: 992px) {
      font-size: 2em;
    }
  }
}
</style>