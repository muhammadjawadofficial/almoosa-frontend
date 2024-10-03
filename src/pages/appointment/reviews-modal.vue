<template>
  <b-modal
    ref="ReviewModalRequest"
    id="ReviewCustomModal"
    centered
    hide-header
    hide-footer
    no-fade
    body-class="transparent"
  >
    <div
      class="swal2-container swal2-center swal-custom-icon-top-padding swal2-shown custom-swal2"
      style="overflow-y: auto"
    >
      <div
        aria-labelledby="swal2-title"
        aria-describedby="swal2-content"
        class="swal2-popup swal2-modal swal2-show"
        tabindex="-1"
        role="dialog"
        aria-live="assertive"
        aria-modal="true"
        style="display: flex"
      >
        <span class="close-btn" @click="closeModal">
          <i class="fa fa-times" aria-hidden="true"></i>
        </span>
        <div class="swal2-header">
          <img
            class="swal2-image"
            src="../../assets/images/star.svg"
            alt=""
            style="display: flex"
          />
          <h2 class="swal2-title" id="swal2-title" style="display: flex"></h2>
        </div>
        <div>
          <div class="heading text-center">
            {{ $t("doctorDetail.reviews") }}
          </div>

          <hr />
          <div class="d-flex main-container">
            <div class="review-container">
              <div class="reviews">
                {{
                  getSelectedDoctorRating ? getSelectedDoctorRating.average : 0
                }}
              </div>
              <div class="total-reviews">
                {{
                  getSelectedDoctorRating ? getSelectedDoctorRating.total : 0
                }}
                {{ $t("doctorDetail.reviews") }}
              </div>
            </div>
            <div class="star-container">
              <div class="value">
                <div class="rating-container disable-hover">
                  <div class="fa fa-star star"></div>
                  <div class="fa fa-star star"></div>
                  <div class="fa fa-star star"></div>
                  <div class="fa fa-star star"></div>
                  <div class="fa fa-star star"></div>
                  <div
                    class="rating-filled"
                    :style="{
                      width:
                        (getSelectedDoctorRating &&
                        getSelectedDoctorRating.average
                          ? (getSelectedDoctorRating.average / 5) * 100
                          : 0) + '%',
                    }"
                  >
                    <div class="fa fa-star star active"></div>
                    <div class="fa fa-star star active"></div>
                    <div class="fa fa-star star active"></div>
                    <div class="fa fa-star star active"></div>
                    <div class="fa fa-star star active"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="rating-item-container">
            <div
              class="rating-item"
              v-for="(item, index) in dynamicRatingCategories"
              :key="index"
            >
              <div class="category">{{ item.label }}</div>
              <div class="percentage">{{ item.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      ratingData: [],
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getBookingDoctor",
      "getSelectedDoctorRating",
    ]),
    dynamicRatingCategories() {
      // if (!this.getSelectedDoctorRating.percentage) return [];
      let percentages = this.getSelectedDoctorRating
        ? this.getSelectedDoctorRating.percentage
        : 0;
      const isArabic = this.$i18n.locale === "ar";

      return [
        {
          label: isArabic ? "ممتاز" : "Excellent",
          percentage: percentages ? percentages.five : 0,
        },
        {
          label: isArabic ? "جيد جدًا" : "Very Good",
          percentage: percentages ? percentages.four : 0,
        },
        {
          label: isArabic ? "جيد" : "Good",
          percentage: percentages ? percentages.three : 0,
        },
        {
          label: isArabic ? "متوسط" : "Average",
          percentage: percentages ? percentages.two : 0,
        },
        {
          label: isArabic ? "أقل من المتوسط" : "Below Average",
          percentage: percentages ? percentages.one : 0,
        },
      ];
    },
  },
  methods: {
    closeModal() {
      this.$refs.ReviewModalRequest.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.heading {
  font-size: 1.5rem;
  color: var(--theme-secondary);
}

.rating-item-container {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  margin-inline: 2rem;
}

.star-container :deep(.vue-star-rating-rating-text) {
  display: none !important;
}

.star-container :deep(svg.vue-star-rating-star) {
  height: 30px !important;
  width: 30px !important;
}

.main-container {
  justify-content: space-evenly;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 1rem;
  font-weight: 400;
  color: var(--dark);
}

.swal2-modal {
  position: relative;
}

.close-btn {
  position: absolute;
  right: 1.5rem;
  top: 0.5rem;
  cursor: pointer;
}
.total-reviews {
  font-size: 12px;
}
.reviews {
  font-size: 1.5rem;
}

.rating-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  margin: auto;
  position: relative;
  .star {
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #d8d8d8;
  }
  &:not(.disable-hover) {
    &:hover .star {
      color: #55b047;
    }
    .star:hover ~ .star {
      color: #d8d8d8;
    }
  }
  .star.active {
    color: #55b047;
  }
}

.rating-container {
  .star {
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;
    font-size: 1.5rem;
  }

  .rating-filled {
    position: absolute;
    display: flex;
    overflow: hidden;
    left: 0;
  }
}

.rtl .rating-filled {
  flex-direction: row-reverse;
}
</style>
