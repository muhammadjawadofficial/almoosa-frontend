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
              <div class="reviews">4.86</div>
              <div class="total-reviews">8296 Reviews</div>
            </div>
            <div class="star-container">
              <star-rating
                :rating="rating"
                :read-only="true"
                :increment="0.5"
                :star-size="20"
              />
            </div>
          </div>
          <!-- Rating Categories with Percentages -->
          <div class="rating-item-container">
            <div
              class="rating-item"
              v-for="(item, index) in ratingCategories"
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
import StarRating from "vue-star-rating";

export default {
  data() {
    return {
      rating: 4.5,
      ratingCategories: [
        { label: "Excellent", percentage: 85 },
        { label: "Very Good", percentage: 70 },
        { label: "Good", percentage: 20 },
        { label: "Average", percentage: 9 },
        { label: "Below Average", percentage: 2 },
      ],
    };
  },
  components: {
    StarRating,
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
</style>
