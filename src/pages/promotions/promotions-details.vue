<template>
  <div class="promotions-details-conatiner page-body-container standard-width">
    <div class="row" v-if="promotion">
      <div class="col-md-12">
        <div class="promotion-banner">
          <img src="../../assets/images/promotion.png" alt="" />
        </div>
      </div>
      <div class="col-md-12 mt-4">
        <div class="promotion-detail">
          <div class="promotion-detail-section">
            <div class="title">{{ $t("promotions.promotionTitle") }}</div>
            <div class="value">{{ promotion.title }}</div>
          </div>
          <div class="promotion-detail-section">
            <div class="title">{{ $t("promotions.promotionCode") }}</div>
            <div class="value">{{ promotion.promo_code }}</div>
          </div>
          <div class="promotion-detail-section">
            <div class="title">{{ $t("promotions.promotionDetails") }}</div>
            <div class="value">{{ promotion.details }}</div>
          </div>
          <div class="promotion-detail-section">
            <div class="title">{{ $t("promotions.promotionDateTime") }}</div>
            <div class="value">
              {{
                getLongDateAndTimeFromDate(promotion.start_date, true) +
                " - " +
                getLongDateAndTimeFromDate(promotion.end_date, true)
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="button-group col-md-12">
        <button
          class="btn btn-secondary"
          v-if="!promotion.active"
          @click="applyPromotion"
        >
          {{ $t("promotions.apply") }}
        </button>
        <button class="btn btn-secondary disabled" v-else>
          {{ $t("promotions.applied") }}
        </button>
        <button class="btn btn-tertiary" @click="navigateTo('Promotions')">
          {{ $t("back") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { promotionService } from "../../services";
export default {
  data() {
    return {
      promotion: null,
    };
  },
  computed: {
    ...mapGetters("promotion", ["getSelectedPromotion"]),
    ...mapGetters("user", ["getUserInfo"]),
  },
  mounted() {
    if (!this.getSelectedPromotion) {
      this.navigateTo("Promotions");
      return;
    }
    this.promotion = { ...this.getSelectedPromotion, active: false };
    this.promotion.active = this.isActivePromotion();
  },
  methods: {
    ...mapActions("user", ["updateUserInfo"]),
    isActivePromotion() {
      return this.promotion.promo_code == this.getUserInfo.promo_code;
    },
    applyPromotion() {
      this.setLoadingState(true);
      promotionService.applyPromotions(this.promotion.promo_code).then(
        (response) => {
          if (response.data.status) {
            this.updateUserInfo({ promo_code: this.promotion.promo_code });
            this.promotion.active = this.isActivePromotion();
            this.successIconModal(
              this.$t("promotions.promotionApplied"),
              this.$t("promotions.promotionAppliedText"),
              "m-bell"
            );
          } else {
            this.failureToast(response.data.message);
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
</style>