<template>
  <router-view />
</template>
  <script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("myMedication", [
      "setSelectedMedication",
      "setSelectedMedicationSession",
    ]),
  },
  beforeDestroy() {
    this.setSelectedMedication(null);
    this.setSelectedMedicationSession(null);
  },
};
</script>