<template>
  <div>
    {{ this.$t("loading") }}
  </div>
</template>
<script>
export default {
  mounted() {
    let doctorRatingPayload = JSON.parse(
      localStorage.getItem("doctorRatingPayload")
    );
    localStorage.removeItem("doctorRatingPayload");
    if (doctorRatingPayload) {
      this.ratingIconModal(
        this.$t("rating.title"),
        this.$t("rating.text"),
        "m-star",
        this.$t("rating.success"),
        this.$t("rating.deny"),
        doctorRatingPayload
      );
    }
    this.navigateTo("default");
  },
};
</script>