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
        getPaymentObject.otherPayment
          ? 'Services Packages Details'
          : getPaymentObject.payLater
          ? 'Appointment Detail'
          : 'Doctor Details'
      "
    />

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
                  {{
                    $t("sar") + " " + translateNumber(getPaymentObject.amount)
                  }}
                </div>
              </div>
              <div class="content--action">
                <button class="btn btn-primary">
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
                    translateNumber(getPaymentObject.amount) + " " + $t("sar")
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
                        translateNumber(getPaymentObject.amount) +
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
            </template>
          </template>
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
      if (!(this.getPaymentObject && this.getPaymentObject.otherPayment)) {
        this.navigateTo("Upcoming Appointment");
        return;
      }
    }
  },
  methods: {
    ...mapActions("appointment", ["setPaymentObject"]),
    handleSelection(item) {
      if (item.isOnlinePayment) {
        console.log(this.getPaymentObject);
        let obj = {
          amount: this.getPaymentObject.amount,
          appointment_id: this.getPaymentObject.appointment_id,
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