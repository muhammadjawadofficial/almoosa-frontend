<template>
  <div
    class="
      select-payment-method-container
      only-back-container
      standard-width
      page-body-container
    "
  >
    <back-navigation
      :backLink="
        getPaymentObject.payLater
          ? 'Appointment Detail'
          : 'Doctor Details'
      "
    />

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
                    translateNumber(getSelectedAppointment.amount) +
                    " " +
                    $t("sar")
                  }}
                </div>
                <i
                  :class="
                    'fa fa-chevron-' +
                    (getCurrentLang() == 'en' ? 'right' : 'left')
                  "
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="payment-section block-section">
      <div class="heading-section">
        <div class="heading-text">
          <div class="heading-title">
            {{ $t("selectPaymentMethod.insurance") }}
          </div>
          <div class="heading-subTitle">
            {{ $t("selectPaymentMethod.chooseInsurance") }}
          </div>
        </div>
      </div>
      <div class="body-section">
        <div class="payment-method">
          <div
            class="payment-method--item primary"
            v-for="method in paymentMethodsInsurance"
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
                    translateNumber(getSelectedAppointment.amount) +
                    " " +
                    $t("sar")
                  }}
                </div>
                <i
                  :class="
                    'fa fa-chevron-' +
                    (getCurrentLang() == 'en' ? 'right' : 'left')
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
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
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

      paymentMethodsInsurance: [
        {
          title: "insurance",
          icon: "insurance-svg",
          currency: "sar",
          isOnlinePayment: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters("appointment", [
      "getBookingAmount",
      "getPaymentObject",
      "getSelectedAppointment",
    ]),
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
    if (!this.getSelectedAppointment) {
      this.navigateTo("Upcoming Appointment");
    }
  },
  methods: {
    ...mapActions("appointment", ["setPaymentObject"]),
    handleSelection(item) {
      if (item.isOnlinePayment) {
        let obj = {
          amount: this.getSelectedAppointment.amount,
          appointment_id: this.getSelectedAppointment.id,
          currency: item.currency.toUpperCase(),
        };
        obj.method = null;
        if (item.title.includes("apple")) {
          obj.method = item.title.toUpperCase();
        }
        this.setPaymentObject(obj);
        this.navigateTo("Pay Now");
      }
    },
  },
};
</script>

<style>
</style>