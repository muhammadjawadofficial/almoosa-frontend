<template>
  <div class="back-navigation">
    <div class="icon" @click="navigateTo(backLink)">
      <img src="../assets/images/back.svg" alt="back-img" />
    </div>
    <div class="text">
      {{ title }}
      <div v-if="subTitle" class="sub-text">{{ subTitle }}</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      default: "home",
    },
    subTitle: {
      default: "",
    },
    backLink: {
      default: "default",
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.back-navigation {
  display: flex;
  align-items: center;
  gap: 1.625rem;
  .text {
    font-size: 1.75rem;
  }
  .sub-text {
    color: #8696b8;
    font-size: 1rem;
  }
  .icon {
    cursor: pointer;
    width: 2rem;
    img {
      width: 100%;
    }
  }
}
</style>