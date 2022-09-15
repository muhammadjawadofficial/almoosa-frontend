<template>
  <div class="promotions-list-conatiner page-body-container standard-width">
    <back-navigation :title="$t('promotions.title')" />
    <b-card header-tag="div" no-body class="ash-card simple transparent">
      <b-card-body>
        <div
          class="appointment-list"
          :class="{ noData: !promotionList || !promotionList.length }"
        >
          <template v-if="promotionList">
            <template v-if="promotionList.length">
              <div
                class="appointment-list-item"
                v-for="promotion in promotionList"
                :key="'promotion-' + promotion.id"
              >
                <div class="appointment-card default">
                  <div class="doctor-avatar">
                    <bell-bg-svg />
                  </div>
                  <div class="appointment-details">
                    <div class="doctor-name">{{ promotion.title }}</div>
                    <div class="doctor-speciality">
                      {{ promotion.details }}
                    </div>
                    <button
                      class="btn btn-primary start-call-button"
                      @click="viewPromotion(promotion)"
                    >
                      {{ $t("promotions.viewDetails") }}
                    </button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="no-data">{{ $t("promotions.noData") }}</div>
            </template>
          </template>
          <template v-else>
            <div class="no-data">{{ $t("loading") }}</div>
          </template>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { promotionService } from "../../services";
export default {
  data() {
    return {
      promotionList: null,
    };
  },
  mounted() {
    this.fetchPromotionsList();
  },
  methods: {
    ...mapActions("promotion", ["setSelectedPromotion", "setPromotionsList"]),
    fetchPromotionsList() {
      this.setLoadingState(true);
      promotionService.fetchPromotions().then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.promotionList = [...data];
            this.setPromotionsList(this.promotionList);
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
    viewPromotion(promotion) {
      this.setSelectedPromotion(promotion);
      this.navigateTo("Promotion Details");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>