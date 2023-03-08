<template>
  <div class="login-card">
    <div class="heading w600">{{ $t("login.enterVerificationCode") }}</div>
    <div class="sub-heading font-secondary w200">
      {{ $t("login.codeSentMessage") }}
    </div>
    <div class="sub-heading font-primary w500">
      {{ translateNumber(phone) }} {{ email ? "& " + email : "" }}
    </div>
    <div class="login-form">
      <div class="row">
        <div class="col-md-12" @keydown.enter="doVerify">
          <v-otp-input
            ref="otpInput"
            :class="'otp-filled s' + otp.length"
            input-classes="otp-input"
            separator=""
            :num-inputs="4"
            :should-auto-focus="true"
            :is-input-num="true"
            input-type="number"
            @on-change="handleOnChange"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 button-group">
          <button class="btn btn-primary" @click="doVerify">
            {{ $t("login.verify") }}
          </button>
          <button class="btn btn-tertiary" @click="navigateTo('Login')">
            {{ $t("back") }}
          </button>
        </div>
        <div class="sign-up-link w200" v-if="time">
          {{ $t("login.resendIn") }}
          <span class="w500">
            {{ translateNumber("00:" + (time > 10 ? "" : "0") + time) }}
          </span>
        </div>
        <div class="sign-up-link w200" @click="resendOtp()" v-else>
          {{ $t("login.didntReceiveACode") }}
          <span class="w500"> {{ $t("login.resend") }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService, userService } from "../../services";
import constants from "../../constants/constants";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      otp: "",
      userId: "",
      phone: null,
      email: null,
      isResetPassword: false,
      resendTime: 60,
      time: null,
    };
  },
  mounted() {
    if (this.getAuthState == constants.auth.login) {
      this.resetAuthState();
      this.navigateTo("default");
    } else {
      if (
        this.getAuthState == constants.auth.loginOtp ||
        this.getAuthState == constants.auth.register
      ) {
        this.processData();
      } else if (this.getAuthState == constants.auth.forgotPassword) {
        this.isResetPassword = true;
        this.processData();
      } else {
        this.navigateTo("Login Dashboard");
      }
    }
  },
  computed: {
    ...mapGetters("user", ["getOtp", "getUserId", "getAuthState"]),
  },
  methods: {
    ...mapActions("user", [
      "setOtp",
      "setUserId",
      "setAuthState",
      "setUserInfo",
    ]),
    resetAuthState() {
      this.setOtp(null);
      this.setUserId(null);
      this.setAuthState(null);
    },
    processData() {
      if (process.env.NODE_ENV !== "production") {
        let otp = ("" + this.getOtp.otp_code).split("").map((x) => x);
        this.$refs.otpInput.otp = [...otp];
        this.otp = this.getOtp.otp_code;
      }
      this.phone = this.getOtp.phone_number;
      this.email = this.getOtp.email_address;
      if (this.getUserId) {
        this.userId = this.getUserId;
        this.setUserId("");
      }
      this.time = this.resendTime;
      let interval = setInterval(() => {
        this.time--;
        if (this.time == 0) {
          clearInterval(interval);
        }
      }, 1000);
    },
    handleOnChange(e) {
      this.otp = e;
    },
    doVerify() {
      if (!this.otp || this.otp.length < 4) {
        this.failureToast(this.$t("login.otpRequired"));
        return;
      }
      this.setLoadingState(true);
      authService
        .verifyOtp({
          ...this.userId,
          otp_code: this.otp,
          reset_flag: !this.isResetPassword,
        })
        .then(
          (response) => {
            if (response.data.status) {
              let data = response.data.data;
              if (this.isResetPassword) {
                this.setAuthState(constants.auth.forgotPassword);
                this.setUserId(this.userId);
                this.navigateTo("New Password");
              } else {
                if (this.getAuthState == constants.auth.register) {
                  this.successIconModal(
                    this.$t("register.modal.title"),
                    this.$t("register.modal.text"),
                    "m-check"
                  );
                  this.navigateTo("Login Dashboard");
                } else {
                  this.setAuthState(constants.auth.login);
                  if (data.user && data.user.id) {
                    userService.storeLoginInfo(data.user, data.access_token);
                    this.setUserInfo(data.user);
                    if (data.user.is_privacy_agreed) {
                      this.navigateTo("default");
                    } else {
                      this.navigateTo("Terms and Condition");
                    }
                  } else {
                    this.failureToast();
                  }
                }
              }
            } else {
              this.failureToast(response.data.message);
            }
            this.setLoadingState(false);
          },
          (error) => {
            this.setLoadingState(false);
            console.error(error);
          }
        );
    },
    resendOtp() {
      this.setLoadingState(true);
      authService.resendOtp(this.userId).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data;
            if (process.env.NODE_ENV != "Production") this.setOtp(data);
            this.processData();
          } else {
            this.failureToast(response.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          console.error(error);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          this.setLoadingState(false);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  padding-top: 2rem;
}
.heading {
  text-transform: uppercase;
  font-size: 2.938rem;
  color: var(--theme-secondary);
  margin-bottom: 1rem;
}
.sub-heading {
  font-size: 1.625rem;
  line-height: 3.75rem;
}
.button-group {
  margin-top: 3.875rem;
}
.sign-up-link {
  margin-top: 6.813rem;
}

.otp-filled {
  color: red;
  display: flex;
  gap: 1rem;
  :deep div {
    input {
      background-image: url(../../components/svgIcons/otp.svg);
      background-repeat: no-repeat;
      background-position: center;
      background-color: var(--theme-tertiary);
      width: 5.375rem;
      height: 4rem;
      border-radius: 0.75rem;
      text-align: center;
      font-size: 1.25rem;

      &,
      &:focus,
      &:focus-visible,
      &:hover {
        outline-color: transparent;
        border-color: transparent;
      }

      /* Chrome, Safari, Edge, Opera */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        display: none;
      }

      /* Firefox */
      &[type="number"] {
        -moz-appearance: textfield;
      }
    }
  }
  &.s1 {
    :deep div:nth-child(-n + 1) {
      input {
        background-image: none;
      }
    }
  }
  &.s2 {
    :deep div:nth-child(-n + 2) {
      input {
        background-image: none;
      }
    }
  }
  &.s3 {
    :deep div:nth-child(-n + 3) {
      input {
        background-image: none;
      }
    }
  }
  &.s4 {
    :deep div:nth-child(-n + 4) {
      input {
        background-image: none;
      }
    }
  }
}
</style>