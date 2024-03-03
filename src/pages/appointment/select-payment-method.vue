<template>
  <div
    class="select-payment-method-container only-back-container standard-width page-body-container"
  >
    <back-navigation
      :backLink="
        getPaymentObject.otherPayment
          ? 'Services Packages Details'
          : getPaymentObject.payLater
          ? 'Appointment Detail'
          : 'Doctor Details'
      "
    />

    <div class="row position-relative">
      <div class="col-lg-7">
        <div class="payment-section block-section mt-3">
          <div class="body-section">
            <div class="payment-method">
              <div class="payment-method--item secondary multiple-card-design">
                <div class="content">
                  <div class="content--info">
                    <div class="content--name">
                      {{ $t("selectPaymentMethod.currentBalance") }}
                    </div>
                    <div class="content--price">
                      {{ $t("sar") + " " + translateNumber(walletAmount) }}
                    </div>
                  </div>
                  <div class="content--action">
                    <span
                      class="edit-button pointer"
                      v-if="getPaymentObject.otherPayment"
                      @click.stop="partialCashPayment()"
                    >
                      <i :class="'fa fa-pencil'" aria-hidden="true"></i>
                    </span>
                    <button
                      class="btn useButton"
                      :class="{
                        used: useWalletAmount,
                        disabled:
                          !+getCalculatedAmount ||
                          isElligibleForFirstFreeVirtualAppointment ||
                          insuranceAmount == 0 ||
                          walletAmount == 0,
                      }"
                      @click="
                        +getCalculatedAmount && walletAmount
                          ? isElligibleForFirstFreeVirtualAppointment
                            ? failureToast(
                                $t('walletNotAllowedInFreeAppointment')
                              )
                            : ((useWalletAmount = !useWalletAmount),
                              setAppointmentAmount(),
                              fetchPaymentsType(),
                              resetPartialPayments())
                          : null
                      "
                    >
                      {{ $t("selectPaymentMethod.useWalletAmount") }}
                    </button>
                  </div>
                </div>
                <div class="layers">
                  <div class="layer alpha"></div>
                  <div class="layer beta"></div>
                  <div class="layer gamma"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-7">
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
        <div class="promotions-loyalty" v-if="isPromoEnabled">
          <div
            v-if="false"
            class="promotions-loyalty-item"
            @click="setDiscount('loyalty')"
            :class="{
              active: selectedDiscountType == 'loyalty',
              disabled:
                isPromoLoyaltyDisabled ||
                getUserInfo.loyality_points < loyaltiyPoints,
            }"
          >
            <div class="promotions-loyalty-item-icon">
              <img src="../../assets/images/badge.svg" alt="badge" />
              <span
                v-if="this.getDeductedLoyaltyPoints != null"
                class="number deducted font-danger"
              >
                - {{ translateNumber(this.getDeductedLoyaltyPoints) }}
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
          <div v-if="false" class="promotions-loyalty-separator">
            {{ $t("or") }}
          </div>
          <div
            class="promotions-loyalty-item"
            @click="setDiscount('promotion')"
            :class="{
              active: selectedDiscountType == 'promotion',
              disabled: isPromoLoyaltyDisabled,
            }"
          >
            <div class="promotions-loyalty-item-icon">
              <img
                src="../../assets/images/announcement.svg"
                alt="announcement"
              />
            </div>
            <div class="promotions-loyalty-item-title">
              <span class="number" v-if="selectedPromotion">
                <span
                  class="number"
                  v-if="
                    selectedPromotion.discount_type.toLowerCase() ==
                    'percentage'
                  "
                >
                  {{ $t("discount") }}: {{ selectedPromotion.discount }}%
                </span>

                <span class="number" v-else>
                  {{ $t("discount") }}: {{ selectedPromotion.discount }}
                  {{ $t("sar") }}
                </span>
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
      <div
        class="col-lg-7"
        v-if="
          !getPaymentObject.otherPayment ||
          (getPaymentObject.otherPayment &&
            +getAmountPayable + +partialCash > 0)
        "
      >
        <div class="payment-section block-section">
          <div class="heading-section">
            <div class="heading-text">
              <div class="heading-title">
                {{
                  $t(
                    "selectPaymentMethod." +
                      (getPaymentObject && getPaymentObject.otherPayment
                        ? "tamara"
                        : "insurance")
                  )
                }}
              </div>
              <div class="heading-subTitle">
                {{
                  $t(
                    "selectPaymentMethod.choose" +
                      (getPaymentObject && getPaymentObject.otherPayment
                        ? "Tamara"
                        : "Insurance")
                  )
                }}
              </div>
            </div>
          </div>
          <div class="body-section">
            <div class="payment-method">
              <template v-for="method in paymentMethodsOthers">
                <template
                  v-if="
                    getPaymentObject.otherPayment == method.isOtherPayment &&
                    (!method.hideOnTotalCovered ||
                      (method.hideOnTotalCovered &&
                        +getAmountPayable + +partialCash > 0))
                  "
                >
                  <div
                    class="payment-method--item primary"
                    :key="'payment-method-' + method.title"
                    @click="handleSelection(method)"
                  >
                    <div class="logo">
                      <component :is="method.icon" />
                    </div>
                    <div class="content">
                      <div class="content--name">
                        {{ $t("selectPaymentMethod." + method.title) }}
                      </div>
                      <div class="content--info">
                        <div class="content--price">
                          {{
                            insuranceAmount == null
                              ? ""
                              : insuranceAmount == 0
                              ? $t("selectPaymentMethod.fullyCovered")
                              : $t("sar") +
                                " " +
                                translateNumber(insuranceAmount)
                          }}
                        </div>
                        <i
                          :class="
                            'fa fa-chevron-' +
                            (toggleOtherPaymentSection
                              ? 'down'
                              : currentAppLang == 'en'
                              ? 'right'
                              : 'left')
                          "
                          aria-hidden="true"
                        ></i>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="toggleOtherPaymentSection"
                    class="payment-dropdown-section payment-method--item"
                    :key="'payment-dropdown-section-' + method.title"
                  >
                    <div
                      v-if="!getPaymentObject.otherPayment"
                      class="insurance"
                    >
                      <div v-if="patientInsurances">
                        <div
                          class="payment-dropdown-option"
                          :class="{
                            selected:
                              selectedInsurance &&
                              insurance.id == selectedInsurance.id,
                          }"
                          v-for="insurance in patientInsurances"
                          :key="'insurance-' + insurance.id"
                          @click="getInsuranceAmount(insurance)"
                        >
                          {{ insurance.company_name }}
                        </div>
                      </div>
                      <!-- lower -->
                      <div
                        v-else-if="!patientInsurances && tamaraInstallmentsType"
                      >
                        <!-- v-if="!patientInsurances && !tamaraInstallmentsType" -->
                        {{ $t("noData") }}
                      </div>
                    </div>

                    <div
                      v-else-if="getPaymentObject.otherPayment"
                      class="tamara"
                    >
                      <!-- upper -->
                      <div v-if="tamaraInstallmentsType">
                        <div
                          @click.stop="selectTamaraOption(installment)"
                          v-for="(installment, i) in tamaraInstallmentsType[0]
                            .supported_instalments"
                          :key="i"
                          class="payment-dropdown-option"
                          :class="{
                            selected:
                              selectedInstallment &&
                              installment.instalments ==
                                selectedInstallment.instalments,
                          }"
                        >
                          <div class="d-flex payment-dropdown-option">
                            <div class="">
                              {{ $t("selectPaymentMethod.payIn") }}
                              {{ installment.instalments }}
                              {{ $t("selectPaymentMethod.installments") }}
                            </div>
                            <div class="">
                              {{
                                $t("sar") +
                                " " +
                                (+(
                                  getAmountPayable / installment.instalments
                                )).toFixed(2)
                              }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        v-else-if="!tamaraInstallmentsType && patientInsurances"
                      >
                        {{ $t("noData") }}
                      </div>
                    </div>

                    <div v-if="!patientInsurances && !tamaraInstallmentsType">
                      {{ $t("noData") }}
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-lg-7 appointment--action-buttons"
        v-if="
          isElligibleForFirstFreeVirtualAppointment &&
          +getAmountPayable + +partialCash != 0
        "
      >
        <button
          class="btn btn-secondary"
          :class="{ disabled: isNotAllowedToBookFreeAppointment }"
          @click="
            isNotAllowedToBookFreeAppointment
              ? failureToast($t('selectInsuranceFirst'))
              : createPayment(null, 1)
          "
          v-if="serviceBaseRate && paymentAmount"
        >
          {{ $t("claimFreeAppointment") }}
        </button>
      </div>
      <div class="col-lg-7" v-else-if="+getAmountPayable + +partialCash != 0">
        <div class="payment-section block-section">
          <div class="heading-section">
            <div class="heading-text">
              <div class="heading-title">
                {{ $t("selectPaymentMethod.payCash") }}
              </div>
              <div class="heading-subTitle">
                {{ $t("selectPaymentMethod.chooseCash") }}
              </div>
            </div>
          </div>
          <div class="body-section">
            <div class="payment-method">
              <div
                class="payment-method--item"
                v-for="method in getPaymentMethodsOnline"
                :key="'payment-method-' + method.title"
                @click="handleSelection(method)"
              >
                <div class="logo">
                  <component :is="method.icon" />
                </div>
                <div class="content">
                  <div class="content--name">
                    {{ $t("selectPaymentMethod." + method.title) }}
                  </div>
                  <div class="content--info">
                    <div class="content--price">
                      {{
                        method.partialCash || !getPaymentObject.otherPayment
                          ? $t("sar") +
                            " " +
                            translateNumber(
                              amountLoading
                                ? "N/A"
                                : method.partialCash || getAmountPayable
                            )
                          : ""
                      }}
                    </div>
                    <span v-if="getPaymentObject.otherPayment">
                      <i
                        @click.stop="partialCashPayment(method)"
                        :class="'fa fa-pencil mx-2'"
                        aria-hidden="true"
                      ></i>
                      <i
                        @click.stop="
                          (method.partialCash = null), (partialCash = null)
                        "
                        :class="'fa fa-times mx-2'"
                        aria-hidden="true"
                      ></i>
                    </span>
                    <i
                      :class="
                        'fa fa-chevron-' +
                        (currentAppLang == 'en' ? 'right' : 'left')
                      "
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-7 appointment--action-buttons" v-else>
        <button
          class="btn btn-secondary"
          @click="createPayment"
          v-if="
            getPaymentObject.otherPayment || (serviceBaseRate && paymentAmount)
          "
        >
          {{ $t("bookAppointment.payNow") }}
        </button>
      </div>
      <div
        class="col-lg-7 appointment--action-buttons"
        v-if="
          getPaymentObject.otherPayment && +getAmountPayable + +partialCash != 0
        "
      >
        <button class="btn btn-secondary" @click="oneStepCheckout">
          {{ $t("continue") }}
        </button>
      </div>
      <div
        class="receipt-details col-lg-4 py-5"
        v-if="getPaymentObject && getPaymentObject.amount"
      >
        <div class="heading">
          {{ $t("selectPaymentMethod.receiptDetails") }}
        </div>
        <div class="details-group">
          <div class="details-group-item">
            <div class="title">
              {{
                $t(
                  "selectPaymentMethod." +
                    (getPaymentObject.otherPayment
                      ? "packageAmount"
                      : "appointmentAmount")
                )
              }}
            </div>
            <div class="value">
              {{ $t("sar") + " " + getPaymentObject.amount }}
            </div>
          </div>
          <template v-for="(partial, pindex) in partialPayments">
            <div class="details-group-item" :key="'partial-payment-' + pindex">
              <div class="title">
                {{ $t("partial") }}
                {{ $t("bookAppointment.payment") }}
                {{ partial.method ? `(${partial.method})` : "" }}
                -
                {{ pindex + 1 }}
              </div>
              <div class="value">
                {{ $t("sar") + " " + (partial.amount + partial.wallet_amount) }}
              </div>
            </div>
          </template>
          <template v-if="selectedInsurance && !amountLoading">
            <div class="details-group-item">
              <div class="title">
                {{ $t("selectPaymentMethod.insuranceCanCoverUpto") }}
              </div>
              <div class="value">
                {{
                  $t("sar") + " " + (getPaymentObject.amount - insuranceAmount)
                }}
              </div>
            </div>
          </template>
          <template v-if="selectedDiscountType == 'loyalty'">
            <div class="details-group-item">
              <div class="title">
                {{ $t("promotions.loyaltyPointCardTitle") }}
              </div>
              <div class="value">
                {{
                  $t("sar") +
                  " " +
                  (+(
                    getDeductedLoyaltyPoints * LOYALITY_POINTS_FACTOR
                  )).toFixed(2)
                }}
              </div>
            </div>
          </template>
          <template v-if="selectedDiscountType == 'promotion'">
            <div class="details-group-item">
              <div class="title">
                {{ $t("discount") }}
              </div>
              <div class="value">
                {{
                  $t("sar") +
                  " " +
                  (getAppointmentAmount - getCalculatedAmount).toFixed(2)
                }}
              </div>
            </div>
          </template>
          <template v-if="useWalletAmount">
            <div class="details-group-item">
              <div class="title">
                {{ partialWallet ? $t("partial") : "" }}
                {{ $t("selectPaymentMethod.walletAmount") }}
              </div>
              <div class="value">
                {{ $t("sar") + " " + getWalletDeductionAmount() }}
              </div>
            </div>
          </template>
          <template v-for="method in getPaymentMethodsOnline">
            <template v-if="method.partialCash">
              <div
                class="details-group-item"
                :key="'partial-cash-' + method.title"
              >
                <div class="title">
                  {{ $t("selectPaymentMethod." + method.title) }}
                </div>
                <div class="value">
                  {{ $t("sar") + " " + method.partialCash }}
                </div>
              </div>
            </template>
          </template>
          <div class="details-group-item total">
            <div class="title">
              {{
                $t(
                  !isNotAllowedToBookFreeAppointment &&
                    !amountLoading &&
                    isElligibleForFirstFreeVirtualAppointment &&
                    +appointmentAmount != 0
                    ? "coveredByASH"
                    : "selectPaymentMethod.amountPayable"
                )
              }}
            </div>
            <div class="value">
              {{
                amountLoading
                  ? "--"
                  : $t("sar") + " " + translateNumber(getAmountPayable)
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  appointmentService,
  freeAppointmentPromoService,
  insuranceService,
  promotionService,
  userService,
  systemConfigService,
} from "../../services";
export default {
  data() {
    return {
      tamaraUrl: null,
      tamaraInstallmentsType: null,
      countryName: "SA",
      currency: "SAR",
      useWalletAmount: false,
      selectedInstallment: null,
      toggleOtherPaymentSection: false,
      selectedInsurance: null,
      walletAmount: 0,
      actualWalletAmount: 0,
      insuranceAmount: null,
      appointmentAmount: 0,
      patientInsurances: null,
      serviceBaseRate: null,
      paymentAmount: null,
      LOYALITY_POINTS_FACTOR: null,
      loyaltiyPoints: null,
      backLink: "Upcoming Appointment",
      partialWallet: null,
      partialCash: null,
      partialPayments: [],
      totalPaidPartialAmount: null,
      paymentMethodsOnline: [
        {
          title: "applePay",
          icon: "apple-svg",
          currency: "sar",
          partialCash: null,
          isOnlinePayment: true,
        },
        {
          title: "card",
          icon: "cash-svg",
          currency: "sar",
          partialCash: null,
          isOnlinePayment: true,
        },
      ],
      paymentMethodsOthers: [
        {
          title: "insurance",
          icon: "insurance-svg",
          currency: "sar",
          isOnlinePayment: false,
        },
        {
          title: "tamara",
          icon: "cash-svg",
          currency: "sar",
          isOnlinePayment: false,
          isOtherPayment: true,
          hideOnTotalCovered: true,
        },
      ],
      paymentAmountResponse: null,
      amountLoading: false,
      selectedDiscountType: "",
      selectedPromotion: null,
      selectedLoyaltyPoints: null,
      promotionList: [],
      virtual_appointment: null,
      onsite_appointment: null,
      speciality: null,
      paymentConfig: {},
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getBookingAmount",
      "getPaymentObject",
      "getSelectedAppointment",
      "getBookingMethod",
      "getBookingSpeciality",
    ]),
    ...mapGetters("user", ["getUserInfo"]),
    getPaymentMethodsOnline() {
      let userAgent = navigator.userAgent;
      let browserName = "";
      if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "chrome";
      } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "firefox";
      } else if (userAgent.match(/safari/i)) {
        browserName = "safari";
      } else if (userAgent.match(/opr\//i)) {
        browserName = "opera";
      } else if (userAgent.match(/edg/i)) {
        browserName = "edge";
      } else {
        browserName = "No browser detection";
      }
      let isSafari = browserName == "safari";
      if (!this.isApplePayEnabled) isSafari = false;
      return isSafari
        ? this.paymentMethodsOnline
        : this.paymentMethodsOnline.filter((x) => !x.title.includes("apple"));
    },
    getAppointmentAmount() {
      return this.insuranceAmount == null
        ? this.getPaymentObject.amount
        : this.insuranceAmount;
    },
    getCalculatedAmount() {
      let actualAmount = this.getAppointmentAmount;
      if (this.selectedDiscountType == "promotion") {
        if (
          this.selectedPromotion &&
          this.selectedPromotion.discount_type.toLowerCase() == "percentage"
        ) {
          let discount = this.selectedPromotion.discount / 100;
          let discountedAmount = actualAmount * discount;
          actualAmount = actualAmount - discountedAmount;
        } else {
          actualAmount = actualAmount - this.selectedPromotion.discount;
        }
      } else if (this.selectedDiscountType == "loyalty") {
        let loyaltyAmount =
          this.getUserInfo.loyality_points * this.LOYALITY_POINTS_FACTOR;
        if (loyaltyAmount > actualAmount) {
          actualAmount = 0;
        } else {
          actualAmount = actualAmount - loyaltyAmount;
        }
      }
      return +actualAmount < 0 ? 0 : (+actualAmount || 0).toFixed(2);
    },
    getCalculatedLoyaltyPoints() {
      let loyaltyPoints = this.getUserInfo.loyality_points;
      if (this.getDeductedLoyaltyPoints) {
        loyaltyPoints -= this.getDeductedLoyaltyPoints;
      }
      return loyaltyPoints;
    },
    getDeductedLoyaltyPoints() {
      let deductedLoyalityPoints = null;
      if (this.selectedDiscountType == "loyalty") {
        let loyaltyAmount =
          this.getUserInfo.loyality_points * this.LOYALITY_POINTS_FACTOR;
        if (loyaltyAmount > this.getAppointmentAmount) {
          deductedLoyalityPoints = Math.ceil(
            this.getAppointmentAmount / this.LOYALITY_POINTS_FACTOR
          );
        } else {
          deductedLoyalityPoints = this.getUserInfo.loyality_points;
        }
      }
      return deductedLoyalityPoints;
    },
    getAmountPayable() {
      let baseAmount = this.getCalculatedAmount;

      if (this.useWalletAmount) {
        baseAmount = baseAmount - this.getWalletDeductionAmount();
      }

      this.getPaymentMethodsOnline.forEach((method) => {
        if (method.partialCash) {
          baseAmount = baseAmount - method.partialCash;
        }
      });

      if (this.totalPaidPartialAmount) {
        baseAmount = baseAmount - this.totalPaidPartialAmount;
      }

      if (baseAmount) {
        baseAmount = (+baseAmount).toFixed(2);
      }

      return baseAmount;
    },
    isNotAllowedToBookFreeAppointment() {
      return (
        this.patientInsurances &&
        this.patientInsurances.length &&
        !this.selectedInsurance
      );
    },
    isElligibleForFirstFreeVirtualAppointment() {
      return (
        this.isEligibleForFreeAppt &&
        this.getSelectedAppointment &&
        this.getSelectedAppointment.type.toLowerCase() == "online"
      );
    },
    isPromoLoyaltyDisabled() {
      return (
        this.insuranceAmount == 0 ||
        this.isElligibleForFirstFreeVirtualAppointment
      );
    },
    isPromoEnabled() {
      return (
        this.paymentConfig &&
        !!this.paymentConfig.promotion &&
        !!this.paymentConfig.promotion.enabled
      );
    },
    isApplePayEnabled() {
      return (
        this.paymentConfig &&
        this.paymentConfig.apple_pay &&
        this.paymentConfig.apple_pay.enabled &&
        ((this.paymentConfig.apple_pay.limited_access &&
          this.paymentConfig.apple_pay.allowed_users &&
          this.paymentConfig.apple_pay.allowed_users.length &&
          this.paymentConfig.apple_pay.allowed_users.includes(
            +this.getUserInfo.mrn_number
          )) ||
          !this.paymentConfig.apple_pay.limited_access)
      );
    },
  },
  async mounted() {
    if (this.$route.params.method == "package") {
      this.backLink = "Services Packages List";
    }
    if (!this.getPaymentObject) this.navigateTo(this.backLink);
    this.getWalletAmount();
    if (this.getPaymentObject && this.getPaymentObject.otherPayment) {
      this.fetchPartialPayments();
      this.fetchPaymentsType();
    } else {
      localStorage.removeItem("paymentVerifyObject");
      userService.removeBooking();
      if (!this.getSelectedAppointment) {
        if (!(this.getPaymentObject && this.getPaymentObject.otherPayment)) {
          this.navigateTo(this.backLink);
          return;
        }
      } else {
        if (!this.checkIfAllowedToPay()) {
          return;
        }
      }
      this.fetchLoyalityPointsFactor();
      this.handleAmount();
      this.getBookingtype();
      this.getUserData();
    }
  },
  methods: {
    ...mapActions("appointment", ["setPaymentObject"]),
    ...mapActions("user", ["updateUserInfo"]),
    oneStepCheckout() {
      let tamara_amount = this.selectedInstallment ? +this.getAmountPayable : 0;
      let hyperpay_amount = +this.partialCash;
      let wallet_amount = +this.getWalletDeductionAmount();
      let paid_amount = +this.totalPaidPartialAmount;
      let package_amount = +this.getPaymentObject.amount;

      let totalRequestAmount =
        wallet_amount + tamara_amount + hyperpay_amount + paid_amount;

      if (totalRequestAmount != package_amount) {
        this.failureToast(this.$t("amountIsNotCoveredTotally"));
        return false;
      }

      if (!this.isTamaraValid(this.selectedInstallment)) return false;

      if (
        tamara_amount &&
        this.partialPayments &&
        this.partialPayments.some((item) => item.method == "tamara")
      ) {
        this.failureToast(this.$t("tamaraPaymentAlreadyDone"));
        return;
      }

      if (!this.getPaymentObject.appointment_id) {
        return false;
      }

      let obj = {
        package_id: this.getPaymentObject.appointment_id,
        instalment_option: this.selectedInstallment
          ? this.selectedInstallment.instalments
          : null,
        wallet_amount: wallet_amount,
        tamara_amount: tamara_amount,
        hyperpay_amount: hyperpay_amount,
      };

      appointmentService.oneStepCheckout(obj).then(
        (res) => {
          let response = res.data;
          if (response.status) {
            this.tamaraUrl = null;
            this.tamaraUrl = response.data;
            if (this.tamaraUrl.checkout_url) {
              this.setLoadingState(true);
              // let obj = {
              //   ...this.getPaymentObject,
              //   url: this.tamaraUrl.checkout_url,
              // };
              // obj.method = null;

              // this.setPaymentObject(obj);
              // this.navigateTo("Pay Now");
              window.open(this.tamaraUrl.checkout_url, "_self");
            }
          } else {
            this.failureToast(response.message);
          }
        },
        (error) => {
          console.error(error);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    isTamaraValid(installment) {
      let currentInstallment = installment || this.selectedInstallment;
      if (currentInstallment) {
        if (
          this.getAmountPayable > currentInstallment.max_limit.amount ||
          this.getAmountPayable < currentInstallment.min_limit.amount
        ) {
          this.failureToast(
            this.$t("tamaraValidation", {
              min: currentInstallment.min_limit.amount,
              max: currentInstallment.max_limit.amount,
            })
          );
          this.selectedInstallment = null;
          return false;
        }
      }
      return true;
    },
    selectTamaraOption(installment) {
      if (!this.isTamaraValid(installment)) return;
      if (
        this.selectedInstallment &&
        this.selectedInstallment.instalments == installment.instalments
      ) {
        this.selectedInstallment = null;
      } else {
        this.selectedInstallment = installment;
      }
    },
    fetchPartialPayments() {
      userService
        .getPartialPayments(
          this.getPaymentObject.appointment_id,
          this.getUserInfo.id
        )
        .then((res) => {
          if (res.data.status) {
            let data = res.data.data;
            if (data && data.items && data.items.length) {
              this.$set(this, "partialPayments", [...data.items]);

              let totalPartialAmount = 0;

              if (data.items && data.items.length) {
                let cashAmount = data.items.reduce((acc, item) => {
                  return acc + item.amount;
                }, 0);
                let walletAmount = data.items.reduce((acc, item) => {
                  return acc + item.wallet_amount;
                }, 0);

                totalPartialAmount = cashAmount + walletAmount;

                this.totalPaidPartialAmount = totalPartialAmount;
              }
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    resetPartialPayments() {
      this.paymentMethodsOnline.forEach((method) => {
        method.partialCash = null;
      });
      this.partialWallet = null;
      this.partialCash = null;
    },
    partialCashPayment(method = null) {
      this.partialPaymentModal(
        this.$t("enterAmount"),
        this.$t("amountInSAR"),
        "m-info",
        "text",
        this.$t("ok"),
        this.$t("cancel"),
        true,
        this.$t("invalidAmount"),
        method
      ).then(async (modalValue) => {
        if (modalValue.dismiss) {
          return;
        }
        if (modalValue.value) {
          if (method) method.partialCash = +modalValue.value;
          else {
            this.partialWallet = +modalValue.value;
            this.useWalletAmount = true;
            this.fetchPaymentsType();
          }
        }
      });
    },
    partialPaymentModal(
      title,
      text,
      icon = "m-check",
      type = "text",
      confirmText = this.$t("ok"),
      cancelText = this.$t("cancel"),
      preConfirm = true,
      preConfirmText = this.$t("promotions.invalidPromo"),
      method = null
    ) {
      const imagePath = require("../../assets/images/" + icon + ".svg");
      return this.$swal({
        input: type,
        inputPlaceholder: text,
        title: title || this.$t("areYouSure"),
        showCancelButton: true,
        confirmButtonText: confirmText,
        confirmButtonColor: "#4466f2",
        cancelButtonText: cancelText,
        cancelButtonColor: "#4466f2",
        preConfirm: (inputVal) => {
          if (!preConfirm) return true;
          let trimInputVal = (inputVal + "").trim();
          let isValidInput = trimInputVal != "";
          let isValidNumber = !isNaN(+trimInputVal);
          let partialCashPayments = this.getPaymentMethodsOnline.reduce(
            (acc, method) => {
              return acc + (method.partialCash || 0);
            },
            0
          );
          let partialWalletPayment = this.getWalletDeductionAmount() || 0;
          let payableAmount = this.getAmountPayable;
          if (method) {
            this.partialCash = +trimInputVal;
            payableAmount = +payableAmount + +partialCashPayments;
            if (!this.getAmountPayable) {
              this.selectedInstallment = null;
            }
          } else {
            payableAmount = +payableAmount + +partialWalletPayment;
          }

          if (
            !isValidNumber ||
            !isValidInput ||
            +trimInputVal <= 0 ||
            +trimInputVal > payableAmount ||
            (!method && +trimInputVal > +this.walletAmount)
          ) {
            this.$swal.showValidationMessage(preConfirmText);
          }

          return isValidInput && trimInputVal;
        },
        imageUrl: imagePath,
        customClass: {
          container: "swal-custom-icon-top-padding theme-action-button",
        },
      });
    },
    getWalletAmount() {
      userService.getUserWalletAmount().then(
        (res) => {
          if (res.data.status) {
            let data = res.data.data;
            if (data) {
              this.walletAmount = data.wallet_balance || 0;
              this.actualWalletAmount = this.walletAmount;
            }
          } else {
            this.walletAmount = 0;
            this.failureToast(res.data.message);
          }
        },
        (error) => {
          this.walletAmount = 0;
          console.error(error);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    getUserData() {
      userService.getProfileById(this.getUserInfo.id).then(
        (res) => {
          if (res.data.status) {
            let data = res.data.data.items[0];
            if (data) {
              this.updateUserInfo({ loyality_points: data.loyality_points });
            }
          } else {
            this.failureToast(res.data.message);
          }
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          console.error(error);
        }
      );
    },
    fetchLoyalityPointsFactor() {
      systemConfigService.fetchConfig("?title=LOYALITY_POINTS_FACTOR").then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            let factor = JSON.parse(data[0].value);
            this.LOYALITY_POINTS_FACTOR = factor.factor;
            this.loyaltiyPoints = factor.minAllowed;
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
      systemConfigService.fetchConfig("?title=PAYMENT_CONFIG").then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            let config = JSON.parse(data[0].value);
            if (config) this.$set(this, "paymentConfig", config);
            if (this.isPromoEnabled) {
              this.fetchPromotionsList();
            }
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
    checkIfAllowedToPay() {
      if (
        (!this.getPaymentObject || !this.getPaymentObject.otherPayment) &&
        this.getSelectedAppointment &&
        this.getSelectedAppointment.type &&
        this.getSelectedAppointment.type.toLowerCase() == "online" &&
        !this.isAllowedToPay(this.getSelectedAppointment.start_time)
      ) {
        this.failureToast(this.$t("cannotPayForTheAppointment"));
        this.navigateTo(this.backLink);
        return false;
      }
      return true;
    },
    handleAmount() {
      Promise.all([
        userService.getServiceBaseRate(
          this.getUserInfo.mrn_number,
          this.getSelectedAppointment.doctor_id,
          this.getSelectedAppointment.id
        ),
        insuranceService.fetchInsurances(this.getUserInfo.mrn_number),
      ])
        .then(async (res) => {
          let serviceBaseRate = res[0].data;
          let insurances = res[1].data.data;
          this.patientInsurances = [...insurances.items];
          if (serviceBaseRate.status) {
            let data = serviceBaseRate.data.items;
            if (data && data.length && data[0]) {
              this.serviceBaseRate = data[0];
              this.walletAmount = (
                this.serviceBaseRate.advance_wallet || 0
              ).toFixed(2);
              this.actualWalletAmount = this.walletAmount;
              await this.getInsuranceAmount();
              if (
                this.patientInsurances.length &&
                this.isElligibleForFirstFreeVirtualAppointment
              )
                await this.getInsuranceAmount(this.patientInsurances[0]);
            } else {
              this.walletAmount = 0;
              throw Error(this.$t("noServiceFound"));
            }
          }
        })
        .catch((error) => {
          let message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message;
          if (!this.isAPIAborted(error)) this.failureToast(message);
          this.navigateBack();
        });
    },
    getWalletDeductionAmount() {
      let deductionAmount = 0;
      let appointmentAmount = this.getCalculatedAmount;
      if (this.useWalletAmount) {
        deductionAmount = this.partialWallet
          ? this.partialWallet
          : +appointmentAmount - this.totalPaidPartialAmount >=
            +this.walletAmount
          ? this.walletAmount
          : appointmentAmount - this.totalPaidPartialAmount;
      }

      if (!+deductionAmount) this.useWalletAmount = false;

      return deductionAmount;
    },
    setAppointmentAmount() {
      this.appointmentAmount =
        this.insuranceAmount == null
          ? this.getPaymentObject.amount
          : this.insuranceAmount;
      if (this.appointmentAmount > 0) {
        if (this.useWalletAmount) {
          this.appointmentAmount = this.appointmentAmount - this.walletAmount;
          this.appointmentAmount =
            this.appointmentAmount <= 0 ? 0 : this.appointmentAmount;
        }
      } else {
        this.useWalletAmount = false;
      }
      this.appointmentAmount = (+this.appointmentAmount).toFixed(2);

      if (!+this.appointmentAmount) {
        this.paymentMethodsOnline.forEach((method) => {
          method.partialCash = null;
        });
        this.partialCash = null;
      }
    },
    handleSelection(item) {
      if (this.getPaymentObject.otherPayment == item.isOtherPayment) {
        this.toggleOtherPaymentSection = !this.toggleOtherPaymentSection;
        return;
      }
      this.setAppointmentAmount();
      this.payViaCash(item);
    },
    payViaCash(item) {
      if (item.isOnlinePayment) {
        let obj = {
          ...this.getPaymentObject,
          payableAmount: (+item.partialCash || +this.getAmountPayable).toFixed(
            2
          ),
          currency: item.currency.toUpperCase(),
        };
        obj.method = null;
        if (item.title.includes("apple")) {
          obj.method = item.title.toUpperCase();
        }
        this.createPayment(obj);
      } else {
        this.toggleOtherPaymentSection = !this.toggleOtherPaymentSection;
      }
    },
    async getInsuranceAmount(insurance) {
      if (this.selectedInsurance && insurance.id == this.selectedInsurance.id) {
        if (this.isElligibleForFirstFreeVirtualAppointment) return;
        this.insuranceAmount = null;
        this.toggleOtherPaymentSection = false;
        this.paymentAmount = null;
        insurance = null;
      }
      this.selectedInsurance = insurance;
      this.amountLoading = true;

      try {
        const response = await userService.getPaymentAmount(
          this.getUserInfo.mrn_number,
          this.getSelectedAppointment.id,
          insurance ? insurance.scheme_id : 1,
          this.serviceBaseRate.service_code
        );
        let paymentAmount = response.data.data;
        this.paymentAmountResponse = paymentAmount;
        if (this.paymentAmountResponse.Message != "") {
          throw Error(this.paymentAmountResponse.Message);
        }
        this.paymentAmount = paymentAmount;
        let amountPayable =
          +paymentAmount.PatientShare + +paymentAmount.PatientTax;
        if (insurance) {
          this.insuranceAmount = amountPayable;
        } else {
          let patientAmount = amountPayable;
          let obj = {
            ...this.getPaymentObject,
            amount: (+patientAmount).toFixed(2),
            payableAmount: (+patientAmount).toFixed(2),
          };
          this.setPaymentObject(obj);
        }

        if (
          this.isElligibleForFirstFreeVirtualAppointment ||
          this.insuranceAmount == 0
        ) {
          this.resetDiscount(false);
        } else {
          if (this.getUserInfo.promo_code)
            this.applyPromotion(
              this.getUserInfo.promo_code.toLowerCase(),
              true
            );
        }

        this.setAppointmentAmount();
      } catch (error) {
        if (!this.isAPIAborted(error))
          this.failureToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
              error.message
          );
        this.navigateBack();
      } finally {
        this.amountLoading = false;
      }
    },
    getPaymentVerifyObject() {
      return {
        appointment_id: this.getSelectedAppointment.id,
        service_value: this.paymentAmountResponse.Amount || 0,
        service_discount: this.paymentAmountResponse.Discount || 0,
        service_tax: this.paymentAmountResponse.ServiceTax || 0,
        service_net_amount: this.paymentAmountResponse.NetAmount || 0,
        patient_amount: this.paymentAmountResponse.PatientShare || 0,
        patient_tax: this.paymentAmountResponse.PatientTax || 0,
        patient_share_total:
          (+this.paymentAmount.PatientShare || 0) +
          (+this.paymentAmount.PatientTax || 0),
        is_free_consultation: this.paymentAmountResponse.FreeConsultation || 0,
        patient_scheme_id: this.selectedInsurance
          ? this.selectedInsurance.scheme_id
          : 1,
        wallet_payment_amount: this.getWalletDeductionAmount(),
        gateway_payment_amount: this.getAmountPayable,
        gateway_payment_ref: "GATEWAY TRX REF",
        receipt_date: this.formatReceiptDateTime(new Date()),
        discount_type: this.selectedDiscountType,
        discount:
          this.selectedDiscountType == "loyalty"
            ? this.selectedLoyaltyPoints
            : this.selectedPromotion
            ? this.selectedPromotion.promo_code
            : null,
        package_id: 0,
        promo_code: this.selectedPromotion
          ? this.selectedPromotion.promo_code
          : null,
      };
    },
    getPackagePaymentVerifyObject() {
      return {
        appointment_id: 0,
        service_value: 0,
        service_discount: 0,
        service_tax: 0,
        service_net_amount: 0,
        patient_amount: 0,
        patient_tax: 0,
        patient_share_total: 0,
        is_free_consultation: 0,
        patient_scheme_id: 1,
        wallet_payment_amount: this.getWalletDeductionAmount(),
        gateway_payment_amount: this.getPaymentObject.payableAmount,
        gateway_payment_ref: "",
        receipt_date: this.formatReceiptDateTime(new Date()),
        discount_type: "",
        discount: "",
        package_id: this.getPaymentObject.appointment_id,
        promo_code: this.selectedPromotion
          ? this.selectedPromotion.promo_code
          : null,
        is_package: true,
      };
    },
    async createAppointmentPayment(paymentObj, isFree = false) {
      if (!this.paymentAmountResponse) {
        this.failureToast("Cannot Proceed with Payment");
        return;
      }
      let paymentVerifyObject = this.getPaymentVerifyObject();
      paymentVerifyObject.is_first_appointment_free = isFree;

      localStorage.setItem(
        "paymentVerifyObject",
        JSON.stringify(paymentVerifyObject)
      );
      if (this.getAmountPayable != 0 && !isFree) {
        await appointmentService
          .initializePayment(paymentVerifyObject)
          .then((response) => {
            if (response.data && response.data.status) {
              if (paymentObj) {
                this.setPaymentObject(paymentObj);
              }
              this.navigateTo("Pay Now");
            } else this.failureToast(response.data && response.data.message);
          })
          .catch((error) => {
            if (!this.isAPIAborted(error))
              this.failureToast(
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                  error.message
              );
            this.navigateTo(this.backLink);
          });
      } else {
        await this.doPayment();
        this.fetchActiveFirstFreePromo();
      }
    },
    fetchActiveFirstFreePromo() {
      freeAppointmentPromoService
        .fetchFreeActiveAppointmentPromos(
          "?mrn_number=" + this.getUserInfo.mrn_number
        )
        .then((promoRes) => {
          let promoResponse = promoRes.data;
          if (promoResponse.status) {
            this.updateUserInfo({
              first_free_promo: promoResponse.data.items,
            });
          }
        });
    },
    async createPayment(paymentObj = null, isFree = false) {
      if (this.getPaymentObject && this.getPaymentObject.otherPayment) {
        let paymentVerifyObject = this.getPackagePaymentVerifyObject();
        paymentVerifyObject.is_first_appointment_free = false;

        localStorage.setItem(
          "paymentVerifyObject",
          JSON.stringify(paymentVerifyObject)
        );
        if (this.getAmountPayable != 0 && !isFree) {
          await appointmentService
            .initializePayment(paymentVerifyObject)
            .then((response) => {
              if (response.data && response.data.status) {
                if (paymentObj) {
                  this.setPaymentObject(paymentObj);
                }
                this.navigateTo("Pay Now");
              } else this.failureToast(response.data && response.data.message);
            })
            .catch((error) => {
              if (!this.isAPIAborted(error))
                this.failureToast(
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message
                );
              this.navigateTo(this.backLink);
            });
        } else {
          await this.doPayment();

          freeAppointmentPromoService
            .fetchFreeActiveAppointmentPromos(
              "?mrn_number=" + this.getUserInfo.mrn_number
            )
            .then((promoRes) => {
              let promoResponse = promoRes.data;
              if (promoResponse.status) {
                this.updateUserInfo({
                  first_free_promo: promoResponse.data.items,
                });
              }
            });
        }
      } else {
        await this.createAppointmentPayment(paymentObj, isFree);
      }
    },
    fetchPromotionsList() {
      promotionService.fetchPromotions("?only_active=true").then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.promotionList = [...data];
            if (
              this.getUserInfo.promo_code &&
              this.promotionList &&
              this.promotionList.length &&
              this.promotionList.findIndex(
                (x) => x.promo_code == this.getUserInfo.promo_code
              ) > -1
            )
              this.applyPromotion(
                this.getUserInfo.promo_code.toLowerCase(),
                true
              );
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
    resetDiscount(updateUser = true) {
      if (this.selectedDiscountType == "promotion") {
        if (updateUser) {
          promotionService.removePromo().then(() => {
            this.updateUserInfo({ promo_code: "" });
            this.selectedPromotion = null;
          });
        } else {
          this.selectedPromotion = null;
        }
      }
      this.selectedDiscountType = "";
      this.selectedLoyaltyPoints = null;
    },
    getBookingtype() {
      if (!this.getBookingMethod || this.getSelectedAppointment) {
        if (this.getSelectedAppointment.type == "ONSITE") {
          this.speciality = this.getSelectedAppointment.doctor.speciality_id;
          this.virtual_appointment = false;
          this.onsite_appointment = true;
        } else {
          this.virtual_appointment = true;
          this.onsite_appointment = false;
          this.speciality = this.getSelectedAppointment.doctor.speciality_id;
        }
      }
    },

    setDiscount(type) {
      if (
        this.isPromoLoyaltyDisabled ||
        (type == "loyalty" &&
          this.getUserInfo.loyality_points < this.loyaltiyPoints)
      )
        return;
      if (type == "promotion") {
        if (this.selectedPromotion) {
          this.selectedDiscountType = type;
          this.selectedLoyaltyPoints = null;
        } else {
          this.inputIconModal(
            this.$t("promotions.addPromo"),
            this.$t("promotions.addPromoText"),
            "m-bell"
          ).then(async (modalValue) => {
            if (modalValue.dismiss) {
              return;
            }
            await this.applyPromotion(modalValue.value);
          });
        }
      } else {
        if (!this.getUserInfo.loyality_points) return;
        this.selectedDiscountType = type;
        this.setPromotionLoyalty();
      }
    },
    async applyPromotion(code, muteErrorMessages = false) {
      try {
        let data = {
          promo_code: code,
          appointment_flow: true,
          package_flow: false,
          virtual_appointment: this.virtual_appointment,
          onsite_appointment: this.onsite_appointment,
          speciality_id: this.speciality,
        };
        const response = await promotionService.applyPromotions(data);
        if (response.data.status) {
          this.selectedDiscountType = "promotion";
          this.selectedLoyaltyPoints = null;
          this.selectedPromotion = response.data.data;
          this.updateUserInfo({
            promo_code: this.selectedPromotion.promo_code,
          });
        } else {
          if (!muteErrorMessages) this.failureToast(response.data.message);
        }
      } catch (error) {
        if (!muteErrorMessages && !this.isAPIAborted(error))
          this.failureToast(
            error.response && error.response.data && error.response.data.message
          );
      }
    },
    setPromotionLoyalty() {
      this.selectedLoyaltyPoints = this.getDeductedLoyaltyPoints;
    },
    fetchPaymentsType() {
      if (!this.getPaymentObject.otherPayment) return;

      if (!this.getUserInfo.phone_number && !this.getAmountPayable) {
        return false;
      }

      let payableAmount = this.getAmountPayable;
      let query = `?country=${this.countryName}&phone=${this.getUserInfo.phone_number}&currency=${this.currency}&order_value=${payableAmount}`;
      appointmentService.fetchPaymentsTypes(query).then(
        (res) => {
          let response = res.data;
          if (response.status) {
            this.tamaraInstallmentsType = null;
            if (response.data.items && response.data.items.length)
              this.tamaraInstallmentsType = [...response.data.items];
            if (!this.getAmountPayable) {
              this.selectedInstallment = null;
            }
          } else {
            this.failureToast(response.message);
          }
        },
        (error) => {
          console.error(error);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    getTamaraUrl(tamara) {
      if (!this.isTamaraValid(tamara)) return;
      if (!this.getPaymentObject.appointment_id) {
        return false;
      }
      let obj = {
        package_id: this.getPaymentObject.appointment_id,
        wallet_payment_amount: this.getWalletDeductionAmount(),
        instalment_option: tamara.instalments,
        amount: this.getAmountPayable,
      };
      appointmentService.fetchTamaraUrl(obj).then(
        (res) => {
          let response = res.data;
          if (response.status) {
            this.tamaraUrl = null;
            this.tamaraUrl = response.data;
            if (this.tamaraUrl.checkout_url) {
              this.setLoadingState(true);
              window.open(this.tamaraUrl.checkout_url, "_self");
            }
          } else {
            this.failureToast(response.message);
          }
        },
        (error) => {
          console.error(error);
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
.t-min-max-limit {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}
.useButton {
  border-color: var(--theme-default);
  color: var(--theme-tertiary) !important;
  &.used {
    background-color: var(--theme-default);
  }
  &.disabled {
    cursor: default;
  }
}
.select-payment-method-container {
  .payment-method--item {
    &.payment-dropdown-section {
      display: block;
      position: relative;
      padding-top: 3rem;
      padding-bottom: 1rem;
      margin-top: -2rem;
      border: 2px solid var(--theme-default);
      z-index: -1;
      .payment-dropdown-option {
        font-size: 1rem;
        padding-block: 0.5rem;
        &:hover,
        &.selected {
          color: var(--theme-default);
        }
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
}
.receipt-details {
  @media (min-width: 992px) {
    position: absolute;
    top: 0;
    right: 0;
  }
  .heading {
    font-size: 1.75rem;
    padding-block: 0.5rem;
    border-bottom: 1px solid #eaeaea;
  }
  .details-group {
    padding-top: 0.25rem;
    &-item {
      padding-block: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1rem;
      color: #8696b8;
      &.total {
        border-top: 1px solid #eaeaea;
        margin-top: 0.25rem;
        padding-top: 0.5rem;
        font-weight: 600;
        color: #000;
      }
    }
  }
}
.edit-button {
  margin-inline: 1rem;
  color: white;
  border: 1px solid white;
  border-radius: 50%;
  width: 2rem;
  aspect-ratio: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>