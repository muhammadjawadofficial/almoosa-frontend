<template>
  <div class="login-card">
    <div class="heading w600">{{ $t("login.userRegistration") }}</div>
    <div class="login-form">
      <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12">
          <div class="custom-login-input-groups">
            <multiselect
              v-model="selectedOption"
              :options="loginOptions"
              track-by="value"
              label="text"
              :preselectFirst="true"
              @input="itemSelected"
              :allowEmpty="false"
              :placeholder="$t('login.selectNationalityId')"
              :selectLabel="$t('selectLabel')"
              :selectedLabel="$t('selectedLabel')"
              :deselectLabel="$t('deselectLabel')"
            >
              <template slot="placeholder">
                <div class="multiselect__with-icon">
                  <span class="multiselect__prepend-icon">
                    <username-svg />
                  </span>
                  {{ $t("selectOption") }}
                </div>
              </template>
              <template slot="singleLabel" slot-scope="props">
                <div class="multiselect__with-icon">
                  <span class="multiselect__prepend-icon">
                    <username-svg />
                  </span>
                  {{ $t("login." + props.option.text) }}
                </div>
              </template>
              <template slot="option" slot-scope="props">
                {{ $t("login." + props.option.text) }}
              </template>
            </multiselect>
            <div
              class="custom-state-invalid icon"
              :class="{
                'is-invalid': selectedOption == null || selectedOption == -1,
              }"
            ></div>
          </div>
        </div>
        <div class="col-xl-6 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="userId"
              :state="registerFormState.userId"
              :placeholder="
                selectedItem ? $t('login.' + selectedItem.placeholder) : ''
              "
              :formatter="numberOnly"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-6 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.phone_number"
              :state="registerFormState.phone_number"
              :placeholder="$t('register.phoneNumber')"
              :formatter="phoneNumberCharactersOnly"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-6 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.email_address"
              :state="registerFormState.email_address"
              :placeholder="$t('register.emailAddress')"
              type="email"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="register-navigation">
        <div class="button-group">
          <button class="btn btn-primary" @click="doRegister">
            {{ $t("register.register") }}
          </button>
          <button
            class="btn btn-tertiary"
            @click="navigateTo('Login Dashboard')"
          >
            {{ $t("back") }}
          </button>
        </div>
        <div class="sign-up-link w200" @click="navigateTo('Register')">
          {{ $t("register.dontHaveAFile") }}
          <span class="w500">{{ $t("login.signUp") }}</span>
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
      registerForm: {
        email_address: "",
        phone_number: "",
        role_id: 3,
      },
      registerFormState: {
        email_address: null,
        phone_number: null,
        userId: null,
      },
      formSubmitted: false,
      userId: "",
      constants,
      loading: false,
      selectedOption: null,
      selectedItem: {},
      approveFromHISFlow: true,
      loginOptions: [
        {
          value: 6,
          text: "proceedWithSaudiId",
          method: "saudi_id",
          placeholder: "enterId",
          error: "saudiId",
          minLength: constants.validation.saudi.min,
          maxLength: constants.validation.saudi.max,
        },
        {
          value: 2,
          text: "proceedWithIqamaId",
          method: "iqama",
          placeholder: "enterId",
          error: "iqamaId",
          minLength: constants.validation.iqama.min,
          maxLength: constants.validation.iqama.max,
        },
        {
          value: 3,
          text: "proceedWithMRN",
          method: "mrn_number",
          placeholder: "enterId",
          error: "mrn",
          minLength: constants.validation.mrn.min,
          maxLength: constants.validation.mrn.max,
        },
      ],
    };
  },
  computed: {
    validPhoneNumber() {
      if (this.formSubmitted) {
        // let regex = /^(009665|9665|\+9665|05|5)([503649187])(\d{7})$/;
        let regex = /^(05)([503649187])(\d{7})$/;
        let result = this.registerForm.phone_number.match(regex);
        return !!(result && result.length);
      }
      return false;
    },
    validEmailAddress() {
      if (this.formSubmitted) {
        let regex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let result = this.registerForm.email_address.match(regex);
        return !!(result && result.length);
      }
      return false;
    },
  },
  mounted() {
    this.selectedItem = this.selectedOption;
  },
  methods: {
    ...mapActions("user", ["setOtp", "setUserId", "setAuthState"]),
    validateForm() {
      if (!!this.registerForm.email_address)
        this.registerFormState.email_address = this.validEmailAddress;
      else this.registerFormState.email_address = null;
      this.registerFormState.phone_number = this.validPhoneNumber;
      this.registerFormState.userId =
        this.userId != "" &&
        this.userId.length >= this.selectedItem.minLength &&
        this.userId.length <= this.selectedItem.maxLength;
      console.log(this.registerFormState);
      if (!this.registerFormState.userId) {
        if (this.userId == "")
          this.failureToast(
            this.$t("register." + this.selectedItem.error + "Required")
          );
        else {
          let isRange =
            this.selectedItem.minLength != this.selectedItem.maxLength;
          let textToPrepend = "";
          if (isRange) {
            textToPrepend =
              this.$t("between") +
              " " +
              this.translateNumber(this.selectedItem.minLength) +
              " " +
              this.$t("and") +
              " " +
              this.translateNumber(this.selectedItem.maxLength) +
              " ";
          } else {
            textToPrepend = this.translateNumber(this.selectedItem.minLength);
          }
          this.failureToast(
            this.$t("register." + this.selectedItem.error + "Length", {
              length: textToPrepend,
            })
          );
        }
      } else if (this.registerFormState.phone_number == false) {
        if (!this.registerForm.phone_number)
          this.failureToast(this.$t("register.phoneRequired"));
        else if (this.registerForm.phone_number.length !== 10)
          this.failureToast(this.$t("register.phoneLength", { length: 10 }));
        else this.failureToast(this.$t("register.phoneValid"));
      } else if (this.registerFormState.email_address == false)
        this.failureToast(this.$t("register.emailValid"));
      return !Object.values(this.registerFormState).includes(false);
    },
    doRegister() {
      this.formSubmitted = true;
      if (!this.selectedOption) {
        return;
      }
      if (!this.validateForm()) {
        return;
      }
      this.registerForm[this.selectedItem.method] = +this.userId;
      this.registerForm.app_language = this.currentAppLang;
      authService.registerViaMedicalFile(this.registerForm).then(
        (response) => {
          if (response.data.status) {
            if (this.approveFromHISFlow) {
              this.successIconModal(
                this.$t("register.modal.title"),
                this.$t("register.modal.medicalFileText"),
                "m-check"
              );
              this.navigateTo("Login Dashboard");
            } else {
              authService
                .resendOtp({ [this.selectedItem.method]: this.userId })
                .then(
                  (otpResponse) => {
                    if (otpResponse.data.status) {
                      let data = otpResponse.data.data;
                      if (process.env.NODE_ENV != "Production")
                        this.setOtp(data);
                      this.setAuthState(constants.auth.register);
                      this.setUserId({
                        [this.selectedItem.method]: this.userId,
                      });
                      this.navigateTo("OTP");
                    } else {
                      this.failureToast(otpResponse.data.message);
                    }
                  },
                  (otpError) => {
                    console.error(otpError);
                    this.failureToast(otpError.response.data.message);
                  }
                );
            }
          } else {
            let message = response.data.message;
            if (message) {
              message = message.toLowerCase();
            }
            // check if message includes 'given data' and assign a boolean value to the variable
            if (message.includes("given data") && message.includes("exist")) {
              this.successIconModal(
                this.$t("register.modal.medicalFileAlreadyExistTitle"),
                this.$t("register.modal.medicalFileAlreadyExistText"),
                "m-info",
                this.$t("continue")
              ).then((res) => {
                if (res.value) {
                  this.navigateTo("Login");
                }
              });
            } else {
              this.failureToast(response.data.message);
            }
          }
        },
        (error) => {
          console.error(error);
          this.failureToast(error.response.data.message);
        }
      );
    },
    itemSelected(item) {
      this.selectedItem = item;
      this.loginOptions.forEach((option) => {
        delete this.registerForm[option.method];
      });
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
}
.forgot-password {
  font-size: 1.125rem;
}
.register-navigation {
  display: flex;
  margin-top: 3.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.sign-up-link {
  text-align: right;
}
.custom-login-input-groups {
  isolation: unset;
}
.same-height {
  min-height: 4.375rem;
  max-width: 100%;
  display: flex;
  align-items: center;
}
.custom-state-invalid {
  z-index: 1;
}
</style>