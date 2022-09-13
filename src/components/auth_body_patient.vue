<template>
  <div class="container-fluid">
    <div class="row full-height" :class="{ 'only-heading': !showButtons }">
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
          <div class="login-dashboard-left--bottom-section" v-if="showButtons">
            <button
              @click="continueAs('patient')"
              class="btn"
              :class="getButtonActiveClass('patient')"
            >
              Continue as a Patient
            </button>
            <button
              @click="continueAs('doctor')"
              class="btn"
              :class="getButtonActiveClass('doctor')"
            >
              Continue as a Doctor
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
import { mapActions, mapGetters } from "vuex";
import { userService } from "../services";
export default {
  data() {
    return {
      layoutType: "ltr",
      showButtons: true,
      role: "",
    };
  },
  watch: {
    $route: function (route) {
      this.showButtons = !route.meta.hideButtons;
    },
    getUserRole: function (val) {
      this.role = val;
    },
  },
  computed: {
    ...mapGetters("user", ["getUserRole"]),
  },
  mounted() {
    this.layoutType = this.$i18n.locale == "en" ? "ltr" : "rtl";
    this.switchLanguage("ltr");
    this.role = this.getUserRole || "patient";
    let LSRole = this.getLSRole();
    if (LSRole && LSRole != this.getUserRole) {
      this.setUserRole(LSRole == 4 ? "doctor" : "patient");
    }
    this.showButtons = !this.$route.meta.hideButtons;
  },
  methods: {
    ...mapActions("user", ["setUserRole"]),
    switchLanguage(layout) {
      if (layout) {
        this.layoutType = layout;
      } else {
        this.layoutType = this.layoutType == "ltr" ? "rtl" : "ltr";
      }
      this.$store.dispatch("layout/setLayoutType", this.layoutType);
      this.$i18n.locale = this.layoutType == "rtl" ? "ar" : "en";
    },
    continueAs(role) {
      this.setUserRole(role);
      userService.setRole(role.includes("doc") ? 4 : 3);
      if (role.includes("doc")) this.navigateTo("Login");
      else this.navigateTo("Login Dashboard");
    },
    getButtonActiveClass(role) {
      if (this.role) {
        if (this.role.toLowerCase().includes(role)) {
          return "btn-primary";
        } else {
          return "btn-tertiary";
        }
      }
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
  padding: 2rem;
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
    gap: 2rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 1;
    transition: 0.5s opacity;
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
  @media (max-width: 991px) {
    .login-right-padding {
      position: relative;
      top: -2rem;
      background: white;
      border-top-right-radius: 2rem;
      border-top-left-radius: 2rem;
      padding-top: 2.5rem !important;
    }
    .image-section {
      padding-bottom: 2rem;
    }
  }
  &.only-heading {
    .login-dashboard-left {
      justify-content: flex-start;
      padding-block: 8.5rem;
    }
    @media (max-width: 991px) {
      align-content: flex-start;
      .image-section {
        height: fit-content;
        padding-block: 3rem;
      }
      .login-dashboard-left {
        padding-block: 0;
        justify-content: flex-start;
      }
    }
  }
}
.login-right-padding {
  padding-inline: 2.7rem;
}
</style>