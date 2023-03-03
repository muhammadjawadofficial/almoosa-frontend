<template>
  <div id="app">
    <!-- Loader starts-->
    <div class="loader-wrapper" :class="{ loderhide: !show && !getLoading }">
      <div class="loader-index">
        <span>S</span>
      </div>
    </div>
    <!-- Loader ends-->
    <router-view></router-view>

    <div class="developed-by" id="tooltip-target-1" v-if="isNotProduction">
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
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    this.timeOut();
  },
  methods: {
    timeOut() {
      let self = this;
      setTimeout(function () {
        self.show = false;
      }, 1000);
    },
    isNotProduction() {
      return process.env.NODE_ENV !== "production";
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
</style>
