<template>
  <div class="doctor-list-container">
    <div class="main-banner">
      <div class="background-image">
        <img
          src="../../assets/images/banners/banner-main.png"
          alt="main-banner"
          class="img-fluid w-100"
        />
        <div class="standard-width">
          <!-- Commented This Line of Code as QA Suggested that we dont need a back button here
              User can navigate to previous screen using the browser back button
          <back-navigation
            class="back-btn"
            :backLink="'Health Education List' + (getIsGuest ? ' Guest' : '')"
          /> -->
          <div class="main-banner-text w600">
            {{ $t("dashboard.helpMillions") }}
          </div>
        </div>
      </div>
    </div>
    <div class="standard-width educational-content">
      <div class="text-content w200">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </div>
      <div class="text-content w200">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </div>
      <div class="text-content w200">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("healthEducation", ["getSelectedHealthEducation"]),
  },
  mounted() {
    if (!this.getSelectedHealthEducation) {
      this.navigateTo("Health Education List");
    }
  },
};
</script>

<style lang="scss" scoped>
.back-btn {
  position: absolute;
  top: 3rem;
  z-index: 1;
}
.text-content {
  font-size: 1.125rem;
  color: #8696b8;
  margin-block: 1.5rem;
}
.educational-content {
  padding-block-start: 1.5rem;
  padding-block-end: 5rem;
}
</style>