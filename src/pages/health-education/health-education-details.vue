<template>
  <div class="doctor-list-container">
    <template v-if="getLoading">
      <div class="standard-width no-data">{{ $t("loading") }}</div>
    </template>
    <template v-else-if="!educationContent">
      <div class="standard-width no-data">{{ $t("noData") }}</div>
    </template>
    <template v-else>
      <div class="main-banner">
        <div class="background-image">
          <img
            :src="getImageUrl(educationContent.banner)"
            alt="main-banner"
            class="img-fluid w-100"
          />
          <div class="standard-width">
            <div class="main-banner-text w600" :class="{ 'px-3': getIsGuest }">
              {{ educationContent.long_title }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="standard-width educational-content"
        v-html="educationContent.long_text"
      ></div>
    </template>
  </div>
</template>

<script>
import { healthEducationService } from "../../services";
export default {
  data() {
    return {
      educationContent: null,
    };
  },
  mounted() {
    if (!this.$route.params.id) {
      this.navigateTo("Health Education List");
    }
    this.initializeData();
  },
  methods: {
    initializeData() {
      this.setLoadingState(true);
      healthEducationService
        .fetchHealthEducationsDetails(this.$route.params.id)
        .then(
          (response) => {
            if (response.data.status) {
              let data = response.data.data;
              this.educationContent = data;
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
  padding-block-end: 5rem;
  :deep * {
    font-family: "DiodrumArabicMedium" !important;
  }
}

.main-banner {
  .background-image {
    .main-banner-text {
      position: relative;
      inset: unset;
      padding-block-start: 2rem;
      width: 100%;
      font-size: 1.625rem;
      line-height: 1.4em;
    }
  }
}
@media (min-width: 991px) {
  .educational-content {
    padding-block-start: 1.5rem;
  }
  .main-banner {
    .background-image {
      isolation: isolate;
      height: 500px;
      display: flex;
      .main-banner-text {
        width: 45%;
        padding-block-end: 2rem;
        font-size: 2.625rem;
      }
      > img {
        position: absolute;
        z-index: -1;
        height: 100%;
      }
    }
  }
}
@media (max-width: 992px) {
  .main-banner {
    .background-image {
      > img {
        min-height: auto;
      }
    }
  }
}
</style>