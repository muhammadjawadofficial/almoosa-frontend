<template>
  <div class="login-card">
    <div class="heading w600">{{ $t("login.enterVerificationCode") }}</div>
    <div class="sub-heading font-secondary w200">
      {{ $t("login.enterRegisterId") }}
    </div>
    <div class="login-form">
      <div class="row">
        <div class="col-md-6" @keydown.enter="sendOtp">
          <b-input-group class="custom-login-input-groups">
            <b-input-group-prepend is-text>
              <username-svg />
            </b-input-group-prepend>
            <b-form-input
              v-model="username"
              :placeholder="$t('login.enterResetPasswordId')"
              :state="usernameState"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 button-group">
          <button class="btn btn-primary" @click="sendOtp">
            {{ $t("login.sendCode") }}
          </button>
          <button class="btn btn-tertiary" @click="navigateTo('Login')">
            {{ $t("back") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from "../../services";
import constants from "../../constants/constants";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      userId: "",
      username: "",
      usernameState: null,
      usernameKey: "",
      formSubmitted: false,
    };
  },
  mounted() {},
  computed: {
    validEmailAddress() {
      if (this.formSubmitted) {
        let regex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let result = this.username.match(regex);
        return !!(result && result.length);
      }
      return false;
    },
    validPhoneNumber() {
      if (this.formSubmitted) {
        let regex = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
        let result = this.username.match(regex);
        return !!(result && result.length);
      }
      return false;
    },
  },
  methods: {
    ...mapActions("user", ["setOtp", "setUserId", "setAuthState"]),
    validateForm() {
      if (this.validPhoneNumber) {
        this.usernameState = true;
        this.usernameKey = "phone_number";
      } else if (this.validEmailAddress) {
        this.usernameState = true;
        this.usernameKey = "email_address";
      } else {
        this.usernameKey = "";
        this.usernameState = false;
      }
      if (!this.usernameState)
        if (!this.username) {
          this.failureToast(this.$t("register.phoneEmailRequired"));
        } else if (!this.validPhoneNumber && !this.validEmailAddress) {
          this.failureToast(this.$t("register.phoneEmailValid"));
        }
      return this.usernameKey != "";
    },
    sendOtp() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      authService
        .resendOtp({
          [this.usernameKey]: this.username,
        })
        .then(
          (response) => {
            if (response.data.status) {
              let data = response.data.data;
              if (process.env.NODE_ENV != "Production") this.setOtp(data);
              this.setAuthState(constants.auth.forgotPassword);
              this.setUserId({
                [this.usernameKey]: this.username,
              });
              this.navigateTo("OTP");
            } else {
              this.failureToast(response.data.message);
            }
          },
          (err) => {
            this.failureToast(err.response ? err.response.data.message : null);
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
</style>