<template>
  <router-view />
</template>
<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("promotion", ["setSelectedPromotion"]),
  },
  beforeDestroy() {
    this.setSelectedPromotion(null);
  },
};
</script>