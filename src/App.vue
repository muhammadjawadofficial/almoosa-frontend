<template>
  <div id="app">
    <!-- Loader starts-->
    <div class="loader-wrapper" :class="{ loderhide: !show && !getLoading }">
      <div class="loader-index">
        <span>S</span>
      </div>
    </div>
    <!-- Loader ends-->

    <!--<Main/>-->
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "app",
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    this.timeOut();
    console.log("Firebase cloud messaging object", this.$messaging);
  },
  computed: {
    ...mapGetters("user", ["getLoading"]),
  },
  methods: {
    timeOut() {
      var self = this;
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
</style>
