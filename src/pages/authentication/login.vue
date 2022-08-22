<template>
  <div class="login-card">
    <div class="heading w600">LOGIN</div>
    <div class="login-form">
      <div class="row">
        <div class="col-xl-5 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-input-group-prepend is-text>
              <username-svg />
            </b-input-group-prepend>
            <b-form-select v-model="selectedOption" @input="itemSelected">
              <b-form-select-option
                v-for="option in loginOptions"
                :key="option.value + '-login-options'"
                :value="option.value"
                >{{ option.text }}</b-form-select-option
              >
            </b-form-select>
          </b-input-group>
        </div>

        <div class="col-xl-5 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-input-group-prepend is-text>
              <mrn-svg />
            </b-input-group-prepend>
            <b-form-input
              v-model="username"
              :placeholder="selectedItem.placeholder"
              :state="usernameState"
            ></b-form-input>
          </b-input-group>
        </div>
        <template v-if="selectedItem.type == constants.loginByPassword">
          <div class="col-xl-2 d-lg-block"></div>
          <div class="col-xl-5 col-lg-12 col-md-6">
            <b-input-group class="custom-login-input-groups">
              <b-input-group-prepend is-text>
                <password-svg />
              </b-input-group-prepend>
              <b-form-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Your Password"
                :state="passwordState"
              ></b-form-input>
            </b-input-group>
          </div>
          <div class="col-xl-5 col-lg-12 col-md-6 d-flex align-items-center">
            <span
              @click="navigateTo('Forgot Password')"
              class="forgot-password pointer"
              >Forgot Password?</span
            >
          </div>
        </template>
      </div>
      <div class="row">
        <div class="col-md-12 button-group">
          <button class="btn btn-primary" @click="doLogin">Login</button>
          <button
            class="btn btn-tertiary"
            @click="navigateTo('Login Dashboard')"
          >
            Back
          </button>
        </div>
        <div
          class="sign-up-link w200 col-md-12"
          @click="navigateTo('Register')"
        >
          Don't have an account yet? <strong class="w500">Sign Up</strong>
        </div>
      </div>
      <div class="login-main login-form-card login-res" v-if="false">
        <form method="POST" @submit="onSubmit" class="theme-form">
          <div class="form-group">
            <label class="col-form-label">{{
              $t("login.fields.emailLabel")
            }}</label>
            <input
              class="form-control"
              type="text"
              required=""
              :placeholder="$t('login.fields.emailLabel')"
              v-model="username"
            />
          </div>
          <div class="form-group">
            <label class="col-form-label">{{
              $t("login.fields.passwordLabel")
            }}</label>
            <input
              class="form-control"
              :type="showPassword ? 'text' : 'password'"
              name="login[password]"
              required=""
              v-model="password"
              placeholder="*********"
            />
            <div class="show-hide" @click="showPassword = !showPassword">
              <span :class="{ show: !showPassword }"> </span>
            </div>
          </div>
          <div class="form-group mb-0">
            <!-- <div class="checkbox p-0">
                      <input id="checkbox1" type="checkbox" />
                      <label class="text-muted" for="checkbox1"
                        >Remember password</label
                      >
                    </div> -->
            <button
              class="btn btn-primary btn-block loader-button"
              :class="{ disabled: loading }"
              type="submit"
            >
              {{ $t("login.signIn") }}
              <div v-if="loading" class="loader-icon"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { authService, userService } from "../../services";
import constants from "../../constants/constants";
import { mapActions } from "vuex";
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
      selectedOption: -1,
      selectedItem: {},
      loginOptions: [
        {
          value: 1,
          text: "Proceed with MRN",
          method: "mrn_number",
          placeholder: "Enter Your MRN",
          type: constants.loginByPassword,
        },
        {
          value: 2,
          text: "Proceed with Iqama",
          method: "iqama",
          placeholder: "Enter Your Iqama",
          type: constants.loginByOTP,
        },
        {
          value: 6,
          text: "Proceed with Saudi ID",
          method: "saudi_id",
          placeholder: "Enter Your Saudi ID",
          type: constants.loginByOTP,
        },
      ],
    };
  },
  mounted() {
    this.selectedItem = this.loginOptions[0];
    this.selectedOption = this.selectedItem.value;
  },
  methods: {
    ...mapActions("user", ["setOtp", "setUserId", "setAuthState"]),
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
        method: this.selectedItem.method,
        type: this.selectedItem.type,
      };

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
    itemSelected(selectedId) {
      this.selectedItem = this.loginOptions.find((x) => x.value == selectedId);
      this.username = "";
      this.password = "";
      // if (selectedItem == constants.loginByOTP) {
      // }
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
}
.forgot-password {
  font-size: 1.125rem;
}
.button-group {
  margin-top: 3.875rem;
}
.sign-up-link {
  margin-top: 6.813rem;
}
</style>