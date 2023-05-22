<template>
  <div
    class="book-appointment-completion-conatiner page-body-container standard-width"
  >
    <b-card header-tag="div" no-body class="ash-card bg-tertiary card-rounded">
      <b-card-header class="bg-secondary">
        <div class="appointment-success-header">
          <div class="success-icon">
            <img src="../../assets/images/check-transparent.svg" alt="" />
          </div>
          <div class="success-message">
            <div class="success-message-text">
              {{ $t("bookAppointment.success") }}
            </div>
            <div class="success-message-info">
              {{ $t("bookAppointment.info") }}
            </div>
          </div>
        </div>
      </b-card-header>
      <b-card-body class="mt-0">
        <div class="appointment-success-body">
          <div class="appointment-detail">
            <div class="appointment-detail--type">
              <div class="appointment-detail--label">
                {{ $t("bookAppointment.appointment") }}
              </div>
              <div class="appointment-detail--value">
                {{ $t("bookAppointment." + getBookingMethod) }}
              </div>
            </div>
            <div class="appointment-detail--sepecialist">
              <div class="appointment-detail--label">
                {{ $t("bookAppointment.specialist") }}
              </div>
              <div class="appointment-detail--value">
                {{ getFullName(getBookingDoctor) }}
              </div>
            </div>
            <div class="appointment-detail--sepecialist">
              <div class="appointment-detail--label">
                {{ $t("bookAppointment.dateTime") }}
              </div>
              <div class="appointment-detail--value">
                {{
                  getLongDateFromDate(getBookingDate) +
                  " - " +
                  getTimeFromDate(getBookingStartTime, true) +
                  " - " +
                  getTimeFromDate(getBookingEndTime, true)
                }}
              </div>
            </div>
            <template v-if="false">
              <div class="appointment-detail--amount">
                <div class="appointment-detail--label">
                  {{ $t("bookAppointment.payment") }}
                  <div
                    class="reset-discount"
                    v-if="selectedDiscountType != ''"
                    @click="resetDiscount"
                  >
                    {{
                      selectedDiscountType == "promotion"
                        ? $t("promotions.removePromo")
                        : $t("promotions.clearSelection")
                    }}
                  </div>
                </div>
                <div class="appointment-detail--value d-flex">
                  {{ $t("sar") }} {{ translateNumber(getCalculatedAmount) }}
                </div>
              </div>
              <div class="appointment-detail--loyalty-promotion">
                <div class="appointment-detail--label">
                  {{ $t("promotions.loyaltyPoint") }}
                </div>
                <div class="appointment-detail--value">
                  {{ $t("promotions.loyaltyPointText") }}
                </div>
              </div>
            </template>
          </div>
          <div v-if="false" class="promotions-loyalty">
            <div
              class="promotions-loyalty-item"
              @click="setDiscount('loyalty')"
              :class="{
                active: selectedDiscountType == 'loyalty',
                disabled: !getUserInfo.loyality_points,
              }"
            >
              <div class="promotions-loyalty-item-icon">
                <img src="../../assets/images/badge.svg" alt="badge" />
                <span
                  v-if="selectedLoyaltyPoints != null"
                  class="number deducted font-danger"
                >
                  - {{ translateNumber(selectedLoyaltyPoints) }}
                </span>
              </div>
              <div class="promotions-loyalty-item-title">
                <span class="number">{{
                  translateNumber(getCalculatedLoyaltyPoints)
                }}</span>
                {{ $t("promotions.loyaltyPointCardTitle") }}
              </div>
              <div class="promotions-loyalty-item-info">
                {{ $t("promotions.loyaltyPointCardText") }}
              </div>
            </div>
            <div class="promotions-loyalty-separator">{{ $t("or") }}</div>
            <div
              class="promotions-loyalty-item"
              @click="setDiscount('promotion')"
              :class="{ active: selectedDiscountType == 'promotion' }"
            >
              <div class="promotions-loyalty-item-icon">
                <img
                  src="../../assets/images/announcement.svg"
                  alt="announcement"
                />
              </div>
              <div class="promotions-loyalty-item-title">
                <span class="number" v-if="selectedPromotion">
                  {{ translateNumber(selectedPromotion.discount_percent) }}%
                </span>
                {{
                  selectedPromotion
                    ? $t("promotions.promoCardTitle")
                    : $t("promotions.noPromo")
                }}
              </div>
              <div class="promotions-loyalty-item-info">
                {{ $t("promotions.promoCardText") }}
              </div>
            </div>
          </div>
        </div>
      </b-card-body>
    </b-card>
    <div class="row">
      <div class="col-md-12 button-group">
        <button class="btn btn-primary" @click="bookAppointment('payNow')">
          {{ $t("bookAppointment.payNow") }}
        </button>
        <button class="btn btn-secondary" @click="bookAppointment">
          {{ $t("bookAppointment.payLater") }}
        </button>
        <button class="btn btn-tertiary" @click="navigateTo('Doctor Details')">
          {{ $t("back") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { appointmentService, promotionService } from "../../services";
export default {
  data() {
    return {
      selectedDiscountType: "",
      selectedPromotion: null,
      selectedLoyaltyPoints: null,
      promotionList: [],
    };
  },
  mounted() {
    this.checkAccess();
    // this.fetchPromotionsList();
  },
  computed: {
    ...mapGetters("appointment", [
      "getBookingMethod",
      "getBookingDoctor",
      "getBookingDate",
      "getBookingTimeslot",
      "getBookingStartTime",
      "getBookingEndTime",
      "getBookingAmount",
    ]),
    ...mapGetters("user", ["getUserInfo"]),
    getCalculatedAmount() {
      let actualAmount = this.getBookingAmount;
      if (this.selectedDiscountType == "promotion") {
        if (this.selectedPromotion) {
          let discount = this.selectedPromotion.discount_percent / 100;
          let discountedAmount = this.getBookingAmount * discount;
          actualAmount = this.getBookingAmount - discountedAmount;
        }
      } else if (this.selectedDiscountType == "loyalty") {
        let loyaltyAmount = this.getUserInfo.loyality_points / 2;
        if (loyaltyAmount > this.getBookingAmount) {
          actualAmount = 0;
        } else {
          actualAmount = Math.ceil(this.getBookingAmount - loyaltyAmount);
        }
      }
      return actualAmount;
    },
    getCalculatedLoyaltyPoints() {
      let loyaltyPoints = this.getUserInfo.loyality_points;
      if (this.selectedLoyaltyPoints) {
        loyaltyPoints -= this.selectedLoyaltyPoints;
      }
      return loyaltyPoints;
    },
  },
  methods: {
    ...mapActions("appointment", [
      "resetBookAppointment",
      "setPaymentObject",
      "setSelectedAppointment",
      "setBookingAmount",
    ]),
    ...mapActions("promotion", ["setPromotionsList"]),
    ...mapActions("user", ["updateUserInfo"]),
    fetchPromotionsList() {
      promotionService.fetchPromotions().then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.promotionList = [...data];
            let userInfo = this.getUserInfo;
            let selectedPromotionIndex = data.findIndex(
              (x) => x.promo_code == userInfo.promo_code
            );
            let selectedPromotion = data[selectedPromotionIndex];
            if (selectedPromotion) {
              this.selectedDiscountType = "promotion";
              this.selectedPromotion = selectedPromotion;
            }
            this.setPromotionsList(this.promotionList);
          } else {
            this.failureToast(response.data.messsage);
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
    checkAccess() {
      if (
        !(
          this.getBookingAmount &&
          this.getBookingTimeslot &&
          this.getBookingEndTime &&
          this.getBookingStartTime &&
          this.getBookingDate &&
          this.getBookingDoctor &&
          this.getBookingMethod
        )
      ) {
        this.navigateTo("Doctor Details");
      }
    },
    showModal() {
      this.successIconModal(
        this.$t("bookAppointment.modal.confirmed"),
        this.$t("bookAppointment.modal.confirmedText")
      ).then(() => {
        this.checkAndDeductLoyaltyPoints();
        this.resetBookAppointment();
        this.navigateTo("Upcoming Appointment");
      });
    },
    bookAppointment(method = "payLater") {
      let promo = null;
      if (this.selectedDiscountType == "promotion" && this.selectedPromotion) {
        promo = this.selectedPromotion.promo_code;
      } else if (
        this.selectedDiscountType == "loyalty" &&
        this.selectedLoyaltyPoints
      ) {
        promo = "points";
      }
      appointmentService
        .createAppointment(
          this.getBookingMethod,
          this.getUserInfo,
          this.getBookingDoctor,
          this.getBookingDate,
          this.getBookingTimeslot,
          this.getBookingAmount,
          promo
        )
        .then(
          (res) => {
            let response = res.data;
            if (response.status) {
              if (method == "payNow") {
                let appointment = response.data.items[0];
                appointment.doctor = this.getBookingDoctor;
                this.setSelectedAppointment(appointment);
                this.checkAndDeductLoyaltyPoints();
                let obj = {
                  amount: appointment.amount,
                  appointment_id: appointment.id,
                  payLater: true,
                };
                this.setPaymentObject(obj);
                this.navigateTo("Select Payment Method");
              } else {
                this.showModal();
              }
            } else {
              this.failureToast(response.message);
            }
          },
          (error) => {
            console.error(error.response);
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          }
        );
    },
    checkAndDeductLoyaltyPoints() {
      if (
        this.selectedLoyaltyPoints &&
        this.selectedDiscountType == "loyalty"
      ) {
        this.setBookingAmount(this.getCalculatedAmount);
        this.updateUserInfo({
          loyality_points:
            this.getUserInfo.loyality_points - this.selectedLoyaltyPoints,
        });
      }
      this.resetDiscount();
    },
    resetDiscount() {
      if (this.selectedDiscountType == "promotion") {
        this.updateUserInfo({ promo_code: "" });
        this.selectedPromotion = null;
      }
      this.selectedDiscountType = "";
      this.selectedLoyaltyPoints = null;
    },
    setDiscount(type) {
      if (type == "promotion") {
        if (this.selectedPromotion) {
          this.selectedDiscountType = type;
          this.selectedLoyaltyPoints = null;
        } else {
          this.inputIconModal(
            this.$t("promotions.addPromo"),
            this.$t("promotions.addPromoText"),
            "m-bell"
          ).then((modalValue) => {
            if (modalValue.dismiss) {
              return;
            }
            let code = modalValue.value;
            promotionService.applyPromotions(code).then(
              (response) => {
                if (response.data.status) {
                  this.selectedDiscountType = type;
                  this.selectedLoyaltyPoints = null;
                  this.selectedPromotion = response.data.data;
                  this.updateUserInfo({
                    promo_code: this.selectedPromotion.promo_code,
                  });
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
          });
        }
      } else {
        this.selectedDiscountType = type;
        this.setPromotionLoyalty();
      }
    },
    setPromotionLoyalty() {
      if (this.selectedLoyaltyPoints == null) {
        let loyaltyAmount = this.getUserInfo.loyality_points / 2;
        if (loyaltyAmount > this.getBookingAmount) {
          this.selectedLoyaltyPoints = Math.ceil(this.getBookingAmount * 2);
        } else {
          this.selectedLoyaltyPoints = this.getUserInfo.loyality_points;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button-group {
  button {
    padding-block: 0.5rem;
    font-size: 1.125rem;
  }
}
.appointment-detail > * {
  margin-bottom: 2rem;
}
.page-body-container {
  padding-top: 2rem;
}
</style>