<template>
  <div class="back-navigation">
    <div class="back-icon" @click="navigateTo(backLink)">
      <img src="../assets/images/back.svg" alt="back-img" />
    </div>
    <div class="text" v-if="title">
      <div class="component-icon" v-if="icon"><component :is="icon" /></div>
      <div>
        {{ title }}
        <div v-if="subTitle" class="sub-text w200">{{ subTitle }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      default: "",
    },
    subTitle: {
      default: "",
    },
    backLink: {
      default: "default",
    },
    icon: {
      default: "",
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
  z-index: 5;
  .text {
    font-size: 1.75rem;
    display: flex;
  }
  .sub-text {
    color: #8696b8;
    font-size: 1rem;
  }
  .back-icon {
    cursor: pointer;
    width: 2rem;
    margin-top: 0.25rem;
    img {
      width: 100%;
    }
  }
  .component-icon {
    margin-inline-end: 1rem;
  }
}
</style>