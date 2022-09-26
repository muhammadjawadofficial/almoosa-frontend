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
            <img :src="getImageUrl(content.thumbnail)" alt="doctor-image" />
          </div>
          <div class="doctor-name">
            {{ content.short_title }}
          </div>
          <div class="doctor-speciality">
            {{ content.short_text }}
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
import { healthEducationService } from "../../services";
export default {
  data() {
    return {
      healthEducationContent: null,
    };
  },
  mounted() {
    this.initializeData();
  },
  methods: {
    ...mapActions("healthEducation", ["setSelectedHealthEducation"]),
    setSelectedContent(content) {
      this.setSelectedHealthEducation(content);
      this.navigateTo("Health Education Details" + (this.getIsGuest ? " Guest" : ""), {
        id: content.id,
      });
    },
    initializeData() {
      this.setLoadingState(true);
      healthEducationService.fetchHealthEducations().then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.healthEducationContent = [...data];
          } else {
            this.failureToast(response.data.messsage);
          }
          this.setLoadingState(false);
        },
        () => {
          this.setLoadingState(false);
          this.failureToast();
        }
      );
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
    height: 13.75rem;
    width: 17.5rem;
    background: url(../../assets/images/loader.gif);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    img {
      height: auto;
      width: 100%;
    }
  }
}
</style>