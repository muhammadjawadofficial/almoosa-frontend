<template>
  <div class="login-card">
    <div class="heading w600">{{ $t("login.register") }}</div>
    <div class="login-form">
      <div class="row">
        <div class="col-xl-6 col-lg-12 col-md-6">
          <div class="custom-login-input-groups">
            <multiselect
              v-model="selectedOption"
              :options="loginOptions"
              track-by="value"
              label="text"
              :preselectFirst="true"
              @input="itemSelected"
              :allowEmpty="false"
              :placeholder="$t('selectOptionLabel')"
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
                  {{ $t("register." + props.option.text) }}
                </div>
              </template>
              <template slot="option" slot-scope="props">
                {{ $t("register." + props.option.text) }}
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

        <div class="col-xl-4 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.first_name"
              :state="registerFormState.first_name"
              :placeholder="$t('register.firstName')"
              :formatter="alphabetsOnly"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.middle_name"
              :placeholder="$t('register.middleName')"
              :formatter="alphabetsOnly"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.family_name"
              :state="registerFormState.family_name"
              :placeholder="$t('register.familyName')"
              :formatter="alphabetsOnly"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-6 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.email_address"
              :state="
                !registerForm.email_address
                  ? null
                  : registerFormState.email_address
              "
              :placeholder="$t('register.emailAddress')"
              type="email"
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
        <div class="col-xl-4 col-lg-12 col-md-6">
          <div class="custom-login-input-groups">
            <multiselect
              v-model="registerForm.gender"
              :options="genderList"
              :placeholder="$t('register.selectGender')"
              :selectLabel="$t('selectLabel')"
              :selectedLabel="$t('selectedLabel')"
              :deselectLabel="$t('deselectLabel')"
            >
              <template slot="singleLabel" slot-scope="props">
                <div class="multiselect__with-icon">
                  <span class="multiselect__prepend-icon">
                    <username-svg />
                  </span>
                  {{ $t("register." + props.option) }}
                </div>
              </template>
              <template slot="option" slot-scope="props">
                {{ $t("register." + props.option) }}
              </template></multiselect
            >
            <div
              class="custom-state-invalid icon"
              :class="{
                'is-invalid': registerFormState.gender == false,
              }"
            ></div>
          </div>
        </div>
        <div class="col-xl-4 col-lg-12 col-md-6">
          <ash-datepicker
            :placeholder="$t('register.addDOB')"
            v-model="registerForm.dob"
            class="same-height"
            disableDate="backward"
          />
          <div
            class="custom-state-invalid icon mr-3"
            :class="{
              'is-invalid': registerFormState.dob == false,
            }"
          ></div>
        </div>
        <div class="col-xl-4 col-lg-12 col-md-6">
          <div class="custom-login-input-groups">
            <multiselect
              v-model="registerForm.nationality"
              :options="nationalities"
              label="nationality"
              track-by="code"
              :placeholder="$t('register.selectNationality')"
              :selectLabel="$t('selectLabel')"
              :selectedLabel="$t('selectedLabel')"
              :deselectLabel="$t('deselectLabel')"
            ></multiselect>
            <div
              class="custom-state-invalid icon"
              :class="{
                'is-invalid': registerFormState.nationality == false,
              }"
            ></div>
          </div>
        </div>
        <div class="col-xl-12 col-lg-12 col-md-12">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.location"
              :state="registerFormState.location"
              :placeholder="$t('register.yourLocation')"
            ></b-form-input>
            <b-input-group-append>
              <location-svg />
            </b-input-group-append>
          </b-input-group>
        </div>
        <div class="col-md-12">
          <div class="custom-login-input-groups file-upload-container">
            <template v-if="fileToUpload.length">
              <div class="re-upload-icon">
                <i class="fa fa-refresh" aria-hidden="true"></i>
              </div>
              <div class="upload-text new">
                {{ $t("insurance.clickToUpload") }}
              </div>
            </template>
            <div class="upload-text text-muted w200 center" v-else>
              {{
                selectedOption && selectedOption.text == "iqamaId"
                  ? $t("register.uploadIqamaID")
                  : $t("register.uploadSaudiID")
              }}
            </div>
            <vue-dropzone
              @vdropzone-file-added="fileUpload"
              @vdropzone-removed-file="removeFile"
              :options="validationdropzoneOptions"
              ref="fileUpload"
              id="validationdropzone"
              class="dropzone digits custom-file-upload"
            >
            </vue-dropzone>
            <div
              :class="{
                'dropzone is-invalid': registerFormState.card_id == false,
              }"
            ></div>
          </div>
        </div>
      </div>
      <div class="register-navigation">
        <div class="button-group">
          <button class="btn btn-primary" @click="doRegister">
            {{ $t("login.register") }}
          </button>
          <button
            class="btn btn-tertiary"
            @click="navigateTo('Login Dashboard')"
          >
            {{ $t("back") }}
          </button>
        </div>
        <div class="sign-up-link w200" @click="navigateTo('Login')">
          {{ $t("register.alreadyHaveAnAccount") }}
          <span class="w500">{{ $t("register.login") }}</span>
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
        first_name: "",
        middle_name: "",
        family_name: "",
        email_address: "",
        phone_number: "",
        gender: "",
        dob: "",
        location: "",
        role_id: 3,
        card_id: null,
        nationality: "",
      },
      registerFormState: {
        first_name: null,
        family_name: null,
        email_address: null,
        phone_number: null,
        gender: null,
        dob: null,
        location: null,
        userId: null,
        card_id: null,
        nationality: null,
      },
      nationalities: [],
      formSubmitted: false,
      userId: "",
      constants,
      loading: false,
      selectedOption: null,
      selectedItem: {},
      genderList: ["male", "female"],
      approveFromHISFlow: true,
      loginOptions: [
        {
          value: 2,
          text: "iqamaId",
          method: "iqama",
          placeholder: "enterIqamaId",
          type: constants.loginByOTP,
          validation: 10,
        },
        {
          value: 6,
          text: "saudiId",
          method: "saudi_id",
          placeholder: "enterSaudiId",
          type: constants.loginByOTP,
          autofill: "saudi",
          validation: 10,
        },
      ],
      validationdropzoneOptions: {
        url: "http://localhost:8080",
        thumbnailWidth: 150,
        acceptedFiles: ["image/jpeg", "image/png"],
        maxFiles: 1,
        dictDefaultMessage: "",
      },
      fileToUpload: [],
    };
  },
  computed: {
    validEmailAddress() {
      if (this.registerForm.email_address == "") {
        return null;
      }
      if (this.formSubmitted) {
        let regex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let result = this.registerForm.email_address.match(regex);
        return !!(result && result.length);
      }
      return false;
    },
    validPhoneNumber() {
      if (this.formSubmitted) {
        // let regex = /^(009665|9665|\+9665|05|5)([503649187])(\d{7})$/;
        let regex = /^(05)([503649187])(\d{7})$/;
        let result = this.registerForm.phone_number.match(regex);
        return !!(result && result.length);
      }
      return false;
    },
  },
  mounted() {
    this.selectedItem = this.selectedOption;
    this.checkDropdownValues();
  },
  methods: {
    ...mapActions("user", ["setOtp", "setUserId", "setAuthState"]),
    nextDateDisabled(ymd, date) {
      const today = new Date();

      // 👇️ OPTIONAL!
      // This line sets the hour of the current date to midnight
      // so the comparison only returns `true` if the passed in date
      // is at least yesterday
      today.setHours(0, 0, 0, 0);

      return date > today;
    },
    checkDropdownValues() {
      this.setLoadingState(true);
      authService.getNationalities().then(
        (res) => {
          if (res.data.status) {
            let data = res.data.data;
            if (data) {
              this.nationalities = data.items;
            }
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (err) => {
          console.error(err);
          this.failureToast();
          this.setLoadingState(false);
        }
      );
    },
    formatNumber(number, input) {
      if (
        input.type == "input" &&
        !((0 <= input.data && input.data <= 9) || input.data == "+")
      ) {
        return number.slice(0, -1);
      }
      return number;
    },
    removeFile() {
      if (this.fileToUpload.length > 1) {
        this.fileToUpload.splice(0, 1);
      }
    },
    fileUpload(file) {
      this.fileToUpload.push(file);
      if (this.fileToUpload.length > 1) {
        this.$refs.fileUpload.removeFile(this.fileToUpload[0]);
      }

      this.setLoadingState(true);
      authService.uploadId(file).then(
        (res) => {
          if (res.data.status) {
            this.registerForm.card_id = res.data.data.id;
            this.registerFormState.card_id = this.registerForm.card_id != null;
            this.successToast(this.$t("register.idUploadSuccessMessage"));
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (err) => {
          console.error(err);
          this.failureToast();
          this.setLoadingState(false);
        }
      );
    },
    validateForm() {
      let form = this.registerForm;
      this.registerFormState.first_name = form.first_name != "";
      this.registerFormState.family_name = form.family_name != "";
      this.registerFormState.email_address = this.validEmailAddress;
      this.registerFormState.phone_number = this.validPhoneNumber;
      this.registerFormState.gender = form.gender != "";
      this.registerFormState.dob = form.dob != "";
      this.registerFormState.location = form.location != "";
      this.registerFormState.userId =
        this.userId != "" && this.userId.length == this.selectedItem.validation;
      this.registerFormState.card_id = form.card_id != null;
      this.registerFormState.nationality = !!form.nationality;

      if (!this.registerFormState.userId) {
        if (this.userId == "")
          this.failureToast(
            this.$t("register." + this.selectedOption.text + "Required")
          );
        else {
          this.failureToast(
            this.$t("register." + this.selectedOption.text + "Length", {
              length: this.selectedItem.validation,
            })
          );
        }
      } else if (!this.registerFormState.first_name) {
        this.failureToast(this.$t("register.firstNameRequired"));
      } else if (!this.registerFormState.family_name) {
        this.failureToast(this.$t("register.familyNameRequired"));
      } else if (this.registerFormState.email_address == false) {
        this.failureToast(this.$t("register.emailValid"));
      } else if (this.registerFormState.phone_number == false) {
        if (this.registerForm.phone_number.length < 10)
          this.failureToast(this.$t("register.phoneLength", { length: 10 }));
        else this.failureToast(this.$t("register.phoneValid"));
      } else if (!this.registerFormState.gender) {
        this.failureToast(this.$t("register.genderRequired"));
      } else if (!this.registerFormState.dob) {
        this.failureToast(this.$t("register.dobRequired"));
      } else if (!this.registerFormState.nationality) {
        this.failureToast(this.$t("register.nationalityRequired"));
      } else if (!this.registerFormState.location) {
        this.failureToast(this.$t("register.locationRequired"));
      } else if (!this.registerFormState.card_id) {
        this.failureToast(this.$t("register.idRequired"));
      }

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
      this.setLoadingState(true);
      let form = { ...this.registerForm };
      Object.keys(form).forEach((key) => {
        if (form[key] === null || form[key] === undefined || form[key] === "") {
          delete form[key];
        } else if (key === "nationality") {
          form[key] = form[key].id;
        }
      });
      authService.register(form).then(
        (response) => {
          if (response.data.status) {
            if (this.approveFromHISFlow) {
              this.successIconModal(
                this.$t("register.modal.title"),
                this.$t("register.modal.text"),
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
            this.failureToast(response.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          console.error(error);
          this.failureToast(error.response.data.message);
          this.setLoadingState(false);
        }
      );
    },
    itemSelected(item) {
      this.selectedItem = item;
      if (item.autofill) {
        let nationality = this.nationalities.find(
          (n) => n.code.toLowerCase() == item.autofill
        );
        if (nationality) {
          this.registerForm.nationality = nationality;
        }
      } else {
        this.registerForm.nationality = null;
      }
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
.sub-heading {
  font-size: 1.25rem;
  line-height: 2rem;
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