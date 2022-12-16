<template>
  <div class="login-card">
    <div class="heading w600">{{ $t("login.login") }}</div>
    <div class="login-form">
      <div class="row">
        <div class="col-xl-5 col-lg-12 col-md-6" v-if="!isDoctor">
          <b-input-group class="custom-login-input-groups">
            <b-input-group-prepend is-text>
              <username-svg />
            </b-input-group-prepend>
            <b-form-select v-model="selectedOption" @input="itemSelected">
              <b-form-select-option
                v-for="option in loginOptions"
                :key="option.value + '-login-options'"
                :value="option.value"
                >{{ $t("login." + option.text) }}</b-form-select-option
              >
            </b-form-select>
          </b-input-group>
        </div>

        <div class="col-xl-5 col-lg-12 col-md-6" @keydown.enter="doLogin">
          <b-input-group class="custom-login-input-groups">
            <b-input-group-prepend is-text>
              <template v-if="isDoctor">
                <username-svg />
              </template>
              <template v-else>
                <mrn-svg />
              </template>
            </b-input-group-prepend>
            <b-form-input
              v-model="username"
              :placeholder="
                $t('login.' + (isDoctor ? 'enterId' : selectedItem.placeholder))
              "
              :state="usernameState"
              :formatter="numberOnly"
            ></b-form-input>
          </b-input-group>
        </div>
        <template
          v-if="selectedItem.type == constants.loginByPassword || isDoctor"
        >
          <div v-if="!isDoctor" class="col-xl-2 d-lg-block"></div>
          <div class="col-xl-5 col-lg-12 col-md-6" @keydown.enter="doLogin">
            <b-input-group class="custom-login-input-groups">
              <b-input-group-prepend is-text>
                <password-svg />
              </b-input-group-prepend>
              <b-form-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('login.enterPassword')"
                :state="passwordState"
              ></b-form-input>
            </b-input-group>
          </div>
          <div class="col-xl-5 col-lg-12 col-md-6" v-if="isDoctor">
            <b-form-checkbox
              id="rememberMe"
              v-model="rememberMe"
              name="rememberMe"
              class="mt-3 custom-checkbox"
            >
              {{ $t("login.rememberMe") }}
            </b-form-checkbox>
          </div>
          <div
            class="col-xl-5 col-lg-12 col-md-6 d-flex align-items-center"
            :class="{ 'justify-content-end': isDoctor }"
          >
            <span
              @click="navigateTo('Forgot Password')"
              class="forgot-password pointer mt-3 w200"
            >
              {{ $t("login.forgotPassword") }}
            </span>
          </div>
        </template>
      </div>
      <div class="row">
        <div class="col-md-12 button-group" :class="{ lg: isDoctor }">
          <button class="btn btn-primary" @click="doLogin">
            {{ $t("login.login") }}
          </button>
          <button
            class="btn btn-tertiary"
            @click="navigateTo('Login Dashboard')"
            v-if="!isDoctor"
          >
            {{ $t("back") }}
          </button>
        </div>
        <div
          class="sign-up-link w200 col-md-12"
          @click="navigateTo('Register')"
          v-if="!isDoctor"
        >
          {{ $t("login.dontHaveAccount") }}
          <span class="w500">{{ $t("login.signUp") }}</span>
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
      username: "",
      password: "",
      usernameState: null,
      passwordState: null,
      constants,
      showPassword: false,
      loading: false,
      rememberMe: false,
      selectedOption: -1,
      selectedItem: {},
      loginOptions: [
        {
          value: 1,
          text: "proceedWithMRN",
          method: "mrn_number",
          placeholder: "enterMRN",
          type: constants.loginByPassword,
        },
        {
          value: 2,
          text: "proceedWithIqamaId",
          method: "iqama",
          placeholder: "enterIqamaId",
          type: constants.loginByOTP,
        },
        {
          value: 6,
          text: "proceedWithSaudiId",
          method: "saudi_id",
          placeholder: "enterSaudiId",
          type: constants.loginByOTP,
        },
      ],
    };
  },
  computed: {
    ...mapGetters("user", ["getUserRole"]),
  },
  mounted() {
    this.selectedItem = this.loginOptions[0];
    this.selectedOption = this.selectedItem.value;
  },
  methods: {
    ...mapActions("user", [
      "setOtp",
      "setUserId",
      "setAuthState",
      "setUserInfo",
    ]),
    validateForm() {
      this.usernameState = this.username != "";
      if (this.selectedItem.type == constants.loginByPassword) {
        this.passwordState = this.password != "";
      } else {
        this.passwordState = true;
      }
      return this.usernameState && this.passwordState;
    },
    doLogin() {
      if (!this.validateForm()) {
        return;
      }
      let payload = {
        username: this.username,
        password: this.password,
        method: this.isDoctor ? "phone_number" : this.selectedItem.method,
        type: this.selectedItem.type,
      };
      if (this.getUserRole.includes("doc")) {
        this.doDoctorLogin(payload);
      } else {
        this.doPatientLogin(payload);
      }
    },
    doPatientLogin(payload) {
      this.setLoadingState(true);
      authService.login(payload).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data;
            if (payload.type == constants.loginByOTP) {
              if (process.env.NODE_ENV != "Production") this.setOtp(data);
              this.setUserId({
                [this.selectedItem.method]: this.username,
              });
              this.setAuthState(constants.auth.loginOtp);
            } else {
              this.setAuthState(constants.auth.login);
              userService.storeLoginInfo(data.user, data.access_token);
              this.setUserInfo(data.user);
            }
            this.navigateTo("OTP");
          } else {
            this.failureToast(response.data.message);
          }
          this.setLoadingState(false);
        },
        (err) => {
          this.failureToast(err.response && err.response.data.message);
          this.setLoadingState(false);
        }
      );
    },
    doDoctorLogin(payload) {
      this.setLoadingState(true);
      localStorage.removeItem("url");
      this.$root.$refs.appointmentModule &&
        this.$root.$refs.appointmentModule.destroyObjects(true);
      authService.loginDoctor(payload).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data;
            userService.storeLoginInfo(data.user, data.access_token);
            this.setUserInfo(data.user);
            this.navigateTo("default");
          } else {
            this.failureToast(response.data.message);
          }
          this.setLoadingState(false);
        },
        (err) => {
          this.failureToast(err.response && err.response.data.message);
          this.setLoadingState(false);
        }
      );
    },
    itemSelected(selectedId) {
      this.selectedItem = this.loginOptions.find((x) => x.value == selectedId);
      this.username = "";
      this.password = "";
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
  text-transform: uppercase;
}
.forgot-password {
  font-size: 1.125rem;
}
.button-group {
  margin-top: 3.875rem;
  &.lg {
    margin-top: 8.875rem;
  }
}
.sign-up-link {
  margin-top: 6.813rem;
}
.custom-checkbox {
  :deep {
    input:checked {
      ~ label {
        &::before {
          border-color: var(--theme-default);
          background-color: var(--theme-default);
          border-radius: 3px;
        }
      }
    }
    label {
      font-size: 1rem;
      color: var(--theme-default);
      margin-inline-start: 0.5rem;
      &::after,
      &::before {
        width: 1.563rem;
        height: 1.563rem;
        top: 0;
        bottom: 0;
        left: -2rem;
        margin: auto;
        border-color: var(--theme-default) !important;
      }
    }
  }
}
</style>