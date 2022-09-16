<template>
  <div class="doctor-list-container page-body-container standard-width">
    <back-navigation :title="$t('healthEducation.title')" />
    <div class="doctor-card-container">
      <template v-if="healthEducationContent && healthEducationContent.length">
        <div
          class="doctor-card"
          v-for="content in healthEducationContent"
          :key="'doctor-card-' + content.id"
        >
          <div class="doctor-image">
            <!-- <img :src="getImageUrl(content.photo)" alt="doctor-image" /> -->
            <img src="../../assets/images/education-content.png" alt="" />
          </div>
          <div class="doctor-name">
            <!-- {{
              content.first_name +
              (content.middle_name ? " " + content.middle_name + " " : " ") +
              content.family_name
            }} -->
            Heart Disease
          </div>
          <div class="doctor-speciality">
            <!-- {{ content.speciality.title }} -->
            CDC study reveals hybrid
          </div>
          <button
            class="btn btn-primary make-appointment"
            @click="setSelectedContent(content)"
          >
            {{ $t("healthEducation.viewDetails") }}
          </button>
        </div>
      </template>
      <template v-else>
        <div class="no-data">{{ $t("healthEducation.noData") }}</div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      healthEducationContent: [
        {
          id: 1,
        },
        {
          id: 57,
        },
      ],
    };
  },
  methods: {
    ...mapActions("healthEducation", ["setSelectedHealthEducation"]),
    setSelectedContent(content) {
      this.setSelectedHealthEducation(content);
      this.navigateTo("Health Education Details");
    },
  },
};
</script>

<style lang="scss" scoped>
.doctor-list-container .doctor-card-container .doctor-card {
  border: none;
  background-color: var(--theme-tertiary);
  .make-appointment {
    font-size: 1.25em;
    padding-block: 0.5em;
    margin-top: 1em;
  }
  .doctor-image {
    height: auto;
    img {
      height: auto;
      width: 100%;
    }
  }
}
</style>