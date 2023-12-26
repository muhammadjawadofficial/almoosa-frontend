<template>
  <div class="promotions-details-conatiner page-body-container standard-width">
    <div class="row" v-if="promotion">
      <div class="col-md-12">
        <div class="promotion-banner">
          <img
            :src="
              promotion.image
                ? getImageUrl(promotion.image)
                : '../../assets/images/promotion.png'
            "
            alt=""
          />
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
            <div class="title">{{ $t("discount") }}</div>
            <div class="value">
              {{
                promotion.discount +
                (promotion.discount_type == "percentage" ? "%" : $t("sar"))
              }}
            </div>
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
                getLongDateAndTimeFromDate(promotion.expiry_date, true)
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="button-group col-md-12">
        <button class="btn btn-secondary disabled" v-if="promotionExpired">
          {{
            $t(
              "promotions." +
                (promotionExpired == 1
                  ? "expired"
                  : promotionExpired == 2
                  ? "notStarted"
                  : "notAvailable")
            )
          }}
        </button>
        <button
          class="btn btn-secondary"
          v-else-if="!promotion.active"
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
    promotionExpired() {
      if (
        this.promotion &&
        this.promotion.start_date &&
        this.promotion.expiry_date
      ) {
        let now = new Date();
        let start = new Date(this.promotion.start_date);
        let end = new Date(this.promotion.expiry_date);
        if (now > end) {
          return 1;
        } else if (now < start) {
          return 2;
        } else {
          return 0;
        }
      }
      return -1;
    },
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
      let data = {
        promo_code: this.promotion.promo_code,
        skip_validation: true,
      };
      promotionService.applyPromotions(data).then(
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
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>