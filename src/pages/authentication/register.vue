<template>
  <div class="login-card">
    <div class="heading w600">REGISTER</div>
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
            >
              <template slot="placeholder">
                <div class="multiselect__with-icon">
                  <span class="multiselect__prepend-icon">
                    <username-svg />
                  </span>
                  Select Type of ID
                </div>
              </template>
              <template slot="singleLabel" slot-scope="props">
                <div class="multiselect__with-icon">
                  <span class="multiselect__prepend-icon">
                    <username-svg />
                  </span>
                  {{ props.option.text }}
                </div>
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

        <div class="col-xl-4 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.first_name"
              :state="registerFormState.first_name"
              placeholder="First Name"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.middle_name"
              placeholder="Middle Name"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.family_name"
              :state="registerFormState.family_name"
              placeholder="Family Name"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-6 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.email_address"
              :state="registerFormState.email_address"
              placeholder="Email Address"
              type="email"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-6 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.phone_number"
              :state="registerFormState.phone_number"
              placeholder="Phone Number"
              :formatter="formatNumber"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-lg-12 col-md-6">
          <div class="custom-login-input-groups">
            <multiselect
              v-model="registerForm.gender"
              :options="genderList"
              placeholder="Select Gender"
            ></multiselect>
            <div
              class="custom-state-invalid icon"
              :class="{
                'is-invalid': registerFormState.gender == false,
              }"
            ></div>
          </div>
        </div>
        <div class="col-xl-4 col-lg-12 col-md-6">
          <div class="custom-login-input-groups">
            <b-form-datepicker
              id="datepicker-placeholder"
              placeholder="Add DOB"
              calendar-width="100%"
              v-model="registerForm.dob"
              :state="registerFormState.dob"
              right
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              :hide-header="true"
              :date-disabled-fn="nextDateDisabled"
              show-decade-nav
              class="w200"
            >
              <template #button-content>
                <img src="../../assets/images/datepicker.svg" alt="" />
              </template>
            </b-form-datepicker>
          </div>
        </div>
        <div class="col-xl-4 col-lg-12 col-md-6">
          <div class="custom-login-input-groups">
            <multiselect
              v-model="registerForm.nationality"
              :options="nationalities"
              label="nationality"
              placeholder="Select Nationality"
              track-by="id"
            ></multiselect>
            <div
              class="custom-state-invalid icon"
              :class="{
                'is-invalid': registerFormState.nationality == false,
              }"
            ></div>
          </div>
        </div>
        <div class="col-xl-6 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="registerForm.location"
              :state="registerFormState.location"
              placeholder="Your Location"
            ></b-form-input>
            <b-input-group-append>
              <location-svg />
            </b-input-group-append>
          </b-input-group>
        </div>
        <div class="col-xl-6 col-lg-12 col-md-6">
          <b-input-group class="custom-login-input-groups">
            <b-form-input
              v-model="userId"
              :state="registerFormState.userId"
              :placeholder="selectedItem.placeholder"
              type="number"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-md-12">
          <div class="custom-login-input-groups file-upload-container">
            <div class="upload-text" v-if="fileToUpload.length">
              Click Here To Upload a New File
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
          <button class="btn btn-primary" @click="doRegister">Register</button>
          <button
            class="btn btn-tertiary"
            @click="navigateTo('Login Dashboard')"
          >
            Back
          </button>
        </div>
        <div class="sign-up-link w200" @click="navigateTo('Login')">
          Already have an account? <span class="w500">Log in</span>
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
      genderList: ["Male", "Female"],
      loginOptions: [
        {
          value: 2,
          text: "Iqama ID",
          method: "iqama",
          placeholder: "Enter Your Iqama Number",
          type: constants.loginByOTP,
        },
        {
          value: 6,
          text: "Saudi ID",
          method: "saudi_id",
          placeholder: "Enter Your Saudi ID",
          type: constants.loginByOTP,
        },
      ],
      validationdropzoneOptions: {
        url: "http://localhost:8080",
        thumbnailWidth: 150,
        acceptedFiles: ["image/jpeg", "image/png"],
        maxFilesize: 0.5,
        maxFiles: 1,
        dictDefaultMessage:
          "<span class='custom-file-upload text-muted w200'>Upload Your ID</span>",
      },
      fileToUpload: [],
    };
  },
  computed: {
    validEmailAddress() {
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
        let regex = /^(009665|9665|\+9665|05|5)([503649187])(\d{7})$/;
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
            this.successToast("ID uploaded successfully!");
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
      this.registerFormState.userId = this.userId != "";
      this.registerFormState.card_id = form.card_id != null;
      this.registerFormState.nationality = form.nationality != "";

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
      authService.register(this.registerForm).then(
        (response) => {
          if (response.data.status) {
            authService
              .resendOtp({ [this.selectedItem.method]: this.userId })
              .then(
                (otpResponse) => {
                  if (otpResponse.data.status) {
                    let data = otpResponse.data.data;
                    if (process.env.NODE_ENV != "Production") this.setOtp(data);
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
.upload-text {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
}
</style>