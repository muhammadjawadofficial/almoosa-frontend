<template>
  <div class="login-card">
    <div class="heading w600">{{ $t("login.setNewPassword") }}</div>
    <div class="sub-heading font-secondary w200">
      {{ $t("login.setNewPasswordDescription") }}
    </div>
    <div class="login-form">
      <b-form-input
        v-model="userId.email_address"
        type="text"
        name="username"
        autocomplete="username"
        hidden
      ></b-form-input>
      <div class="row">
        <div class="col-md-5" @keydown.enter="doVerify">
          <b-input-group class="custom-login-input-groups">
            <b-input-group-prepend is-text>
              <password-svg />
            </b-input-group-prepend>
            <b-form-input
              v-model="password"
              type="password"
              name="password"
              autocomplete="password"
              :placeholder="$t('login.enterNewPassword')"
              :state="passwordState"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-5" @keydown.enter="doVerify">
          <b-input-group class="custom-login-input-groups">
            <b-input-group-prepend is-text>
              <password-svg />
            </b-input-group-prepend>
            <b-form-input
              v-model="confirmPassword"
              type="password"
              :placeholder="$t('login.confirmPassword')"
              :state="confirmPasswordState"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 button-group">
          <button class="btn btn-primary" @click="doVerify">
            {{ $t("login.setPassword") }}
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
import { authService, userService } from "../../services";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      otp: "",
      userId: "",
      password: "",
      passwordState: null,
      confirmPassword: "",
      confirmPasswordState: null,
      phone: "+966***********",
      email: "*******@*****.com",
      isResetPassword: false,
    };
  },
  mounted() {
    let routeParams = this.$route.query;
    console.log(routeParams);
    if (routeParams.email && routeParams.otp_code) {
      this.userId = {
        email_address: routeParams.email,
      };
      this.otp = routeParams.otp_code;
      this.isResetPassword = true;
      this.setUserId("");
    } else if (!this.getUserId) {
      if (userService.isAuthenticatedUser()) {
        this.navigateTo("default");
      } else {
        this.navigateTo("Login");
      }
    } else {
      this.userId = this.getUserId;
      this.otp = this.getOtp.otp_code;
      this.isResetPassword = this.getUserId.resetPassword || false;
      this.setUserId("");
    }
  },
  computed: {
    ...mapGetters("user", ["getOtp", "getUserId"]),
  },
  methods: {
    ...mapActions("user", ["setOtp", "setUserId", "setAuthState"]),
    resetAuthState() {
      this.setOtp(null);
      this.setUserId(null);
      this.setAuthState(null);
    },
    validateForm() {
      this.passwordState = this.password != "";
      this.confirmPasswordState =
        this.confirmPassword != "" && this.password == this.confirmPassword;

      if (this.password == "") {
        this.failureToast(this.$t("login.passwordRequired"));
      } else if (this.confirmPassword == "") {
        this.failureToast(this.$t("login.confirmPasswordRequired"));
      } else if (!this.confirmPasswordState) {
        this.failureToast(this.$t("login.passwordDontMatch"));
      }
      return this.passwordState && this.confirmPasswordState;
    },
    doVerify() {
      if (!this.validateForm()) {
        return;
      }
      let payload = {
        ...this.userId,
        otp_code: this.otp,
        password: this.password,
      };
      this.setLoadingState(true);
      authService.resetPassword(payload).then(
        (response) => {
          if (response.data.status) {
            this.resetAuthState();
            this.successIconModal(
              this.$t("login.resetPasswordModalTitle"),
              this.$t("login.resetPasswordModalText")
            );
            this.navigateTo("Login");
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