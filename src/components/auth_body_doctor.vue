<template>
  <div class="container-fluid">
    <div class="row full-height">
      <div
        class="col-xl-4 col-lg-6 b-center bg-size image-section"
        :style="{
          backgroundImage:
            'url(' +
            require('../assets/images/login/almoosabuilding.png') +
            ')',
        }"
      >
        <div class="login-dashboard-left">
          <div class="login-dashboard-left--top-section">
            <div class="login-dashboard-left--top-section--logo">
              <img src="../assets/images/login/ashlogo.svg" alt="" />
            </div>
            <div class="login-dashboard-left--top-section--logo-content">
              <div class="welcome-text">Welcome to</div>
              <div>AlMoosa Specialist Hospital!</div>
            </div>
          </div>
          <div class="login-dashboard-left--bottom-section">
            <button class="btn btn-tertiary">
              Click to Continue as a Patient
            </button>
            <button class="btn btn-primary">
              Click to Continue as a Doctor
            </button>
          </div>
        </div>
      </div>
      <div class="col-xl-8 col-lg-6 login-right-padding py-3">
        <div v-if="false" @click="switchLanguage" class="language-switcher">
          {{ layoutType == "ltr" ? "ع" : "En" }}
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      layoutType: "ltr",
    };
  },
  watch: {
    $route: function (val) {
      console.log(val);
    },
  },
  mounted() {
    this.layoutType = this.$i18n.locale == "en" ? "ltr" : "rtl";
    this.switchLanguage("ltr");
  },
  methods: {
    switchLanguage() {
      if (layout) {
        this.layoutType = layout;
      } else {
        this.layoutType = this.layoutType == "ltr" ? "rtl" : "ltr";
      }
      this.$store.dispatch("layout/setLayoutType", this.layoutType);
      this.$i18n.locale = this.layoutType == "rtl" ? "ar" : "en";
    },
  },
};
</script>
<style lang="scss" scoped>
.image-section {
  position: relative;
  background-size: cover;
  background-position: center center;
  display: block;
}
.language-switcher {
  position: absolute;
  right: -5px;
  top: 0.5rem;
  background: var(--theme-default);
  padding: 1rem;
  border-radius: 5px;
  color: var(--light);
  cursor: pointer;
}
.login-dashboard-left {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding: 2rem 3rem;
  gap: 8rem;
  &--top-section {
    &--logo {
      img {
        width: 5.406rem;
      }
    }
    &--logo-content {
      .welcome-text {
        font-size: 2.063rem;
      }
      color: white;
      font-size: 2.25rem;
      font-weight: 500;
      margin-top: 0.75rem;
    }
  }
  &--bottom-section {
    display: flex;
    gap: 2em;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    button {
      border-radius: 1rem;
      font-size: 1.25rem;
      padding-block: 0.938rem;
      width: calc(min(100%, 23.5rem));
      vertical-align: middle;
      background: #55b047 0% 0% no-repeat padding-box;
    }
  }
}
.full-height {
  min-height: 100vh;
}
.login-right-padding {
  padding-inline: 2.7rem;
}
</style>