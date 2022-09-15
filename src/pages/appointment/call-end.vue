<template>
  <div>
    {{ this.$t("loading") }}
  </div>
</template>
<script>
export default {
  mounted() {
    this.setLoadingState(true);
    let doctor_id = localStorage.getItem("doctor");
    localStorage.removeItem("doctor");
    if (doctor_id) {
      this.ratingIconModal(
        this.$t("rating.title"),
        this.$t("rating.text"),
        "m-star",
        this.$t("rating.success"),
        this.$t("rating.deny"),
        doctor_id
      );
    }
    this.navigateTo("default");
    this.setLoadingState(false);
  },
};
</script>