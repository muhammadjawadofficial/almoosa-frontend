<template>
  <div id="app">
    <!-- Loader starts-->
    <div class="loader-wrapper" :class="{ loderhide: !show && !getLoading }">
      <lottie-player
        autoplay
        loop
        mode="normal"
        src="/loader.json"
        style="width: 320px"
      >
      </lottie-player>
      <!-- Previous Loader (Build using HTML + CSS) -->
      <!-- <div class="loader-index">
        <span>S</span>
      </div> -->
    </div>
    <!-- Loader ends-->
    <router-view></router-view>

    <div
      class="developed-by"
      id="tooltip-target-1"
      v-if="isNotProduction && !isWebView"
    >
      <img src="./assets/images/db.png" alt="developed by devbatch" />
      <b-tooltip target="tooltip-target-1" triggers="hover">
        <span class="db-tooltip">
          Maintained and Developed by
          <a href="https://www.devbatch.com/contact-us/" target="_blank">
            DevBatch
          </a>
        </span>
      </b-tooltip>
    </div>

    <a
      v-if="currentRoute && !currentRoute.meta.hideWhatsapp"
      href="https://wa.link/h6lwse"
      target="_blank"
      class="floating-whatsapp-icon"
      rel="noopener noreferrer"
    >
      <img src="./assets/images/whatsapp.svg" alt="whatsapp" />
    </a>
  </div>
</template>

<script>
import { userService } from "./services";
export default {
  name: "app",
  data() {
    return {
      show: true,
      currentRoute: null,
    };
  },
  mounted() {
    this.timeOut();
    this.setCurrentRoute(this.$route);
  },
  watch: {
    $route: function (val) {
      this.setCurrentRoute(val);
    },
  },
  computed: {
    isNotProduction() {
      return process.env.NODE_ENV !== "production";
    },
    isAuthenticated() {
      return userService.isAuthenticatedUser();
    },
  },
  methods: {
    setCurrentRoute(route) {
      this.currentRoute = route;
    },
    timeOut() {
      let self = this;
      setTimeout(function () {
        self.show = false;
      }, 1000);
    },
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>
.loader-wrapper.loderhide {
  display: none;
}
.developed-by {
  position: fixed;
  bottom: 30px;
  left: 30px;
  cursor: pointer;
  z-index: 999999;
  img {
    border-radius: 50%;
    width: 4rem;
    aspect-ratio: 1;
    transition: 0.3s opacity;
  }
  &:hover {
    img {
      opacity: 1;
    }
  }
}
.tooltip {
  :deep {
    .tooltip-inner {
      background-color: #0070fb;
    }
    .arrow {
      &::before {
        border-top-color: #0070fb;
      }
    }
    .db-tooltip {
      color: white;
      a {
        font-weight: bold;
        color: white;
      }
    }
  }
}
.floating-whatsapp-icon {
  position: fixed;
  z-index: 999999;
  bottom: 25px;
  right: 30px;
  font-size: 2rem;
  cursor: pointer;
  border-radius: 50%;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
  }
}
</style>
