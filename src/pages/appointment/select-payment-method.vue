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
                    <button
                      class="btn useButton"
                      :class="{
                        used: useWalletAmount,
                        disabled: !walletAmount || insuranceAmount == 0,
                      }"
                      @click="
                        walletAmount
                          ? ((useWalletAmount = !useWalletAmount),
                            setAppointmentAmount())
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
                  v-if="getPaymentObject.otherPayment == method.isOtherPayment"
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
                    <div v-if="!patientInsurances || !patientInsurances.length">
                      {{ $t("noData") }}
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-7" v-if="appointmentAmount != 0">
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
                        $t("sar") +
                        " " +
                        translateNumber(
                          amountLoading ? "N/A" : appointmentAmount
                        )
                      }}
                    </div>
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
          v-if="serviceBaseRate && paymentAmount"
        >
          {{ $t("bookAppointment.payNow") }}
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
              {{ $t("selectPaymentMethod.appointmentAmount") }}
            </div>
            <div class="value">
              {{ $t("sar") + " " + getPaymentObject.amount }}
            </div>
          </div>
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
          <template v-if="useWalletAmount">
            <div class="details-group-item">
              <div class="title">
                {{ $t("selectPaymentMethod.walletAmount") }}
              </div>
              <div class="value">
                {{ $t("sar") + " " + getWalletDeductionAmount() }}
              </div>
            </div>
          </template>
          <div class="details-group-item total">
            <div class="title">
              {{ $t("selectPaymentMethod.amountPayable") }}
            </div>
            <div class="value">
              {{ $t("sar") + " " + translateNumber(appointmentAmount) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { insuranceService, userService } from "../../services";
export default {
  data() {
    return {
      useWalletAmount: false,
      toggleOtherPaymentSection: false,
      selectedInsurance: null,
      walletAmount: 0,
      actualWalletAmount: 0,
      insuranceAmount: null,
      appointmentAmount: 0,
      patientInsurances: null,
      serviceBaseRate: null,
      paymentAmount: null,
      paymentMethodsOnline: [
        {
          title: "applePay",
          icon: "apple-svg",
          currency: "sar",
          isOnlinePayment: true,
        },
        {
          title: "card",
          icon: "cash-svg",
          currency: "sar",
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
        },
      ],
      paymentAmountResponse: null,
      amountLoading: false,
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getBookingAmount",
      "getPaymentObject",
      "getSelectedAppointment",
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
      return isSafari
        ? this.paymentMethodsOnline
        : this.paymentMethodsOnline.filter((x) => !x.title.includes("apple"));
    },
  },
  mounted() {
    localStorage.removeItem("paymentVerifyObject");
    userService.removeBooking();
    if (!this.getSelectedAppointment) {
      if (!(this.getPaymentObject && this.getPaymentObject.otherPayment)) {
        this.navigateTo("Upcoming Appointment");
        return;
      }
    }
    this.handleAmount();
  },
  methods: {
    ...mapActions("appointment", ["setPaymentObject"]),
    handleAmount() {
      Promise.all([
        userService.getServiceBaseRate(
          this.getUserInfo.mrn_number,
          this.getSelectedAppointment.doctor_id,
          this.getSelectedAppointment.id
        ),
        insuranceService.fetchInsurances(this.getUserInfo.mrn_number),
      ])
        .then((res) => {
          let serviceBaseRate = res[0].data;
          if (serviceBaseRate.status) {
            let data = serviceBaseRate.data.items;
            if (data && data.length) {
              this.serviceBaseRate = data[0];
              this.walletAmount = this.serviceBaseRate.advance_wallet;
              this.actualWalletAmount = this.walletAmount;
              this.getInsuranceAmount();
            } else {
              this.walletAmount = 0;
            }
          }
          let insurances = res[1].data.data;
          this.patientInsurances = [...insurances.items];
        })
        .catch((error) => {
          let message =
            error.response &&
            error.response.data &&
            error.response.data.message;
          if (!this.isAPIAborted(error)) this.failureToast(message);
          this.navigateBack();
        });
    },
    getWalletDeductionAmount() {
      let appointmentAmount = !this.insuranceAmount
        ? this.getPaymentObject.amount
        : this.insuranceAmount;
      if (this.useWalletAmount) {
        return appointmentAmount >= this.walletAmount
          ? this.walletAmount
          : appointmentAmount;
      }
      return 0;
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
      this.appointmentAmount = this.appointmentAmount.toFixed(2);
    },
    handleSelection(item) {
      this.setAppointmentAmount();
      if (item.isOnlinePayment) {
        let obj = {
          amount: (+this.appointmentAmount).toFixed(2),
          appointment_id: this.getPaymentObject.appointment_id,
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
    getInsuranceAmount(insurance) {
      if (this.selectedInsurance && insurance.id == this.selectedInsurance.id) {
        this.insuranceAmount = null;
        this.toggleOtherPaymentSection = false;
        this.paymentAmount = null;
        insurance = null;
      }
      this.selectedInsurance = insurance;
      this.amountLoading = true;
      Promise.all([
        userService.getPaymentAmount(
          this.getUserInfo.mrn_number,
          this.getSelectedAppointment.id,
          insurance ? insurance.scheme_id : 1,
          this.serviceBaseRate.service_code
        ),
      ])
        .then((res) => {
          this.paymentAmountResponse = res[0].data.data;
          if (insurance) {
            let paymentAmount = res[0].data.data;
            if (paymentAmount.Message != "") {
              this.failureToast(paymentAmount.Message);
              return;
            }
            this.paymentAmount = paymentAmount;
            this.insuranceAmount =
              +paymentAmount.PatientShare + +paymentAmount.PatientTax;
          } else {
            let response = res[0].data.data;
            this.paymentAmount = response;
            let patientAmount = +response.PatientShare + +response.PatientTax;
            let obj = {
              ...this.getPaymentObject,
              amount: patientAmount,
            };
            this.setPaymentObject(obj);
          }

          this.setAppointmentAmount();
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          this.navigateBack();
        })
        .finally(() => {
          this.amountLoading = false;
        });
    },
    createPayment(paymentObj) {
      if (!this.paymentAmountResponse) {
        this.failureToast("Cannot Proceed with Payment");
        return;
      }
      let paymentVerifyObject = {
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
        gateway_payment_amount: this.appointmentAmount,
        gateway_payment_ref: "GATEWAY TRX REF",
        receipt_date: this.formatReceiptDateTime(new Date()),
      };
      localStorage.setItem(
        "paymentVerifyObject",
        JSON.stringify(paymentVerifyObject)
      );
      if (this.appointmentAmount !== 0) {
        if (paymentObj) {
          this.setPaymentObject(paymentObj);
        }
        this.navigateTo("Pay Now");
      } else {
        this.doPayment();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>