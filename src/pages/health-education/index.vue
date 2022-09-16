<template>
  <router-view />
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("healthEducation", ["setSelectedHealthEducation"]),
  },
  beforeDestroy() {
    this.setSelectedHealthEducation(null);
  },
};
</script>

<style>
</style>