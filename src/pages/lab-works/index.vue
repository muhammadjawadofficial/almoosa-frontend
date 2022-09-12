<template>
  <router-view />
</template>
  <script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("labwork", ["setSelectedLabWork"]),
  },
  beforeDestroy() {
    this.setSelectedLabWork(null);
  },
};
</script>