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
              <div class="welcome-text">{{ $t("login.welcomeTo") }}</div>
              <div>{{ $t("ash") }}</div>
            </div>
          </div>
          <div class="login-dashboard-left--bottom-section" v-if="showButtons">
            <button
              @click="continueAs('patient')"
              class="btn"
              :class="getButtonActiveClass('patient')"
            >
              {{ $t("login.continueAsPatient") }}
            </button>
            <button
              @click="continueAs('doctor')"
              class="btn"
              :class="getButtonActiveClass('doctor')"
            >
              {{ $t("login.continueAsDoctor") }}
            </button>
          </div>
        </div>
      </div>
      <div
        class="col-xl-8 col-lg-6 login-dashboard-right login-right-padding py-3"
      >
        <div @click="switchLanguage()" class="language-switcher">
          {{ layoutType == "ltr" ? "ع" : "En" }}
        </div>
        <div class="carousel-inner" v-if="showSlider">
          <swiper class="swiper" :options="swiperOption" :slides-per-view="1">
            <swiper-slide>
              <div class="carousel-item active">
                <div class="login-dashboard-slide">
                  <div class="login-dashboard-slide--content">
                    {{ $t("dashboard.helpMillions") }}
                  </div>
                </div>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div class="carousel-item active">
                <div class="login-dashboard-slide">
                  <div class="login-dashboard-slide--content">
                    <pre>
                      {{ $t("dashboard.helpMillions") }}
                    </pre>
                  </div>
                </div>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div class="carousel-item active">
                <div class="login-dashboard-slide">
                  <div class="login-dashboard-slide--content">
                    {{ $t("dashboard.helpMillions") }}
                  </div>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>

        <div
          class="login-dashboard-login-section"
          v-if="showLoginRegister"
          :class="{ 'mt-0': !showSlider }"
        >
          <div class="row">
            <div class="col-xl-6 col-lg-12 col-md-6 content w200">
              {{ $t("login.toBrowse") }}
            </div>
            <div class="col-xl-6 col-lg-12 col-md-6 button-group">
              <button class="btn btn-secondary" @click="navigateTo('Login')">
                {{ $t("login.login") }}
              </button>
              <button class="btn btn-primary" @click="navigateToRegister()">
                {{ $t("login.register") }}
              </button>
            </div>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import { mapActions, mapGetters } from "vuex";
import { userService } from "../services";
export default {
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      layoutType: "ltr",
      showButtons: true,
      showSlider: false,
      showLoginRegister: false,
      role: "",
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        // autoplay: {
        //   delay: 2500,
        //   disableOnInteraction: false,
        // },
        navigation: {
          nextEl: `.next-${this.id}`,
          prevEl: `.prev-${this.id}`,
        },
      },
    };
  },
  watch: {
    $route: function (route) {
      this.checkConditions(route);
    },
    getUserRole: function (val) {
      this.role = val;
    },
  },
  computed: {
    ...mapGetters("user", ["getUserRole"]),
  },
  mounted() {
    let layout = "ltr";
    if (userService.getSelectedLayout()) {
      layout = userService.getSelectedLayout();
    } else if (this.$i18n.locale == "ar") {
      layout = "rtl";
    }
    this.switchLanguage(layout);
    this.role = this.getUserRole || "patient";
    let LSRole = this.getLSRole();
    if (LSRole && LSRole != this.getUserRole) {
      this.setUserRole(LSRole == 4 ? "doctor" : "patient");
    }
    this.checkConditions(this.$route);
  },
  methods: {
    ...mapActions("user", ["setUserRole"]),
    checkConditions(route) {
      this.showButtons = !route.meta.hideButtons;
      this.showSlider = route.name == "Login Dashboard";
      this.showLoginRegister = this.showSlider;
    },
    switchLanguage(layout) {
      if (layout) {
        this.layoutType = layout;
      } else {
        this.layoutType = this.layoutType == "ltr" ? "rtl" : "ltr";
      }
      this.$store.dispatch("layout/setLayoutType", this.layoutType);
      this.$i18n.locale = this.layoutType == "rtl" ? "ar" : "en";
      userService.setSelectedLayout(this.layoutType);
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
.login-dashboard-login-section {
  padding: 1.5rem 2.5rem;
  background: var(--theme-tertiary);
  border-radius: 1rem;
  margin-top: 2.5rem;
  .content {
    color: var(--theme-secondary);
    font-size: 1.375rem;
    line-height: 2rem;
  }
  > .row {
    align-items: center;
    .content,
    .button-group {
      padding-block: 0.5rem;
    }
    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      flex-wrap: wrap;
      button {
        flex: 1;
        max-width: 12.5rem;
        padding-block: 0.75rem;
        font-size: 1rem;
        font-weight: 500;
      }
    }
  }
}
.swiper-container {
  border-radius: 1.25rem;
  .login-dashboard-slide {
    display: flex;
    align-items: center;
    // height: 188px;
    padding: 3rem 3rem 4rem;
    background: url("../assets/images/login/slider/slide2.png");
    background-position: top right;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    &--content {
      // width: 23.625rem;
      color: white;
      font-size: 2.563rem;
      line-height: 3.063rem;
      font-weight: bold;
      pre {
        font: inherit;
        color: inherit;
        white-space: pre-line;
        padding: 0;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .swiper-pagination {
    :deep {
      .swiper-pagination-bullet {
        aspect-ratio: 1;
        height: 0.938rem;
        width: auto;
        background: white;
        opacity: 1;
        &-active {
          background: var(--theme-default);
        }
      }
    }
    left: 3rem;
    bottom: 1.75rem;
    width: fit-content;
  }
}
.image-section {
  position: relative;
  background-size: cover;
  background-position: center center;
  display: block;
}
.language-switcher {
  position: fixed;
  right: -5px;
  top: 1rem;
  background: var(--theme-default);
  padding-block: 1rem;
  border-radius: 1.25rem 0 0 1.25rem;
  color: var(--light);
  cursor: pointer;
  width: 40px;
  text-align: center;
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
.login-dashboard-right {
  max-height: 100vh;
  overflow: overlay;
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
    .login-dashboard-right {
      max-height: 100%;
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