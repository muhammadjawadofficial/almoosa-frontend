<template>
  <div class="login-card">
    <div class="heading w600">ENTER VERIFICATION CODE</div>
    <div class="sub-heading font-secondary w200">
      A 4 digit code has been sent to
    </div>
    <div class="sub-heading font-primary w500">{{ phone }} & {{ email }}</div>
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
            @on-change="handleOnChange"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 button-group">
          <button class="btn btn-primary" @click="doVerify">Verify</button>
          <button class="btn btn-tertiary" @click="navigateTo('Login')">
            Back
          </button>
        </div>
        <div class="sign-up-link w200" @click="resendOtp()">
          Didn't receive a code? <span class="w500">Resend</span>
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
      phone: "+966***********",
      email: "*******@*****.com",
      isResetPassword: false,
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
      if (process.env.NODE_ENV !== "Production") {
        let otp = ("" + this.getOtp.otp_code).split("").map((x) => x);
        this.$refs.otpInput.otp = otp;
        this.otp = this.getOtp.otp_code;
      }
      this.phone = this.getOtp.phone_number || this.phone;
      this.email = this.getOtp.email_address || this.email;
      if (this.getUserId) {
        this.userId = this.getUserId;
        this.setUserId("");
      }
    },
    handleOnChange(e) {
      this.otp = e;
    },
    doVerify() {
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
                  userService.storeLoginInfo(data.user, data.access_token);
                  this.setUserInfo(data.user);
                  if (data.user.is_privacy_agreed) {
                    this.navigateTo("default");
                  } else {
                    this.navigateTo("Terms and Condition");
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
        (err) => {
          this.failureToast();
          this.setLoadingState(false);
          console.error(err);
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