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
  gap: 0.75rem;
  &.guest {
    height: 75vh;
  }
  .heading {
    font-size: 4.5rem;
    letter-spacing: 4px;
    line-height: 1;
    gap: 1rem;
    display: flex;
  }
  .sub-heading {
    color: black;
  }
}
</style>