<template>
  <router-view />
</template>
  <script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("myTimeline", ["setSelectedTimeline"]),
  },
  beforeDestroy() {
    this.setSelectedTimeline(null);
  },
};
</script>