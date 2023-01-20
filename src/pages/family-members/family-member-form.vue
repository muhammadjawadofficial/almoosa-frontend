<template>
  <div class="login-card standard-width page-body-container">
    <back-navigation
      :title="$t('familyMembers.addFamilyMember')"
      backLink="Family Members List"
    />
    <div class="add-family-member-form">
      <div class="row">
        <div class="col-xl-8 col-lg-12">
          <div class="custom-login-input-groups same-height">
            <multiselect
              v-model="selectedOption"
              :options="loginOptions"
              track-by="value"
              label="text"
              :preselectFirst="true"
              @input="itemSelected"
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
                  {{ $t("familyMembers.selectTypeOfId") }}
                </div>
              </template>
              <template slot="singleLabel" slot-scope="props">
                <div class="multiselect__with-icon">
                  <span class="multiselect__prepend-icon">
                    <username-svg />
                  </span>
                  {{ $t("familyMembers." + props.option.text) }}
                </div>
              </template>
              <template slot="option" slot-scope="props">
                {{ $t("familyMembers." + props.option.text) }}
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
      </div>
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="registerForm.first_name"
              :state="registerFormState.first_name"
              :placeholder="$t('familyMembers.firstName')"
              :formatter="alphabetsOnly"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="registerForm.middle_name"
              :placeholder="$t('familyMembers.middleName')"
              :formatter="alphabetsOnly"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="registerForm.family_name"
              :state="registerFormState.family_name"
              :placeholder="$t('familyMembers.familyName')"
              :formatter="alphabetsOnly"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="userId"
              :state="registerFormState.userId"
              :placeholder="$t('familyMembers.' + selectedItem.placeholder)"
              type="number"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="registerForm.email_address"
              :state="registerFormState.email_address"
              :placeholder="$t('familyMembers.emailAddress')"
              type="email"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="registerForm.phone_number"
              :state="registerFormState.phone_number"
              :placeholder="$t('familyMembers.phoneNumber')"
              :formatter="formatNumber"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <div class="custom-login-input-groups same-height">
            <multiselect
              v-model="registerForm.nationality"
              :options="nationalities"
              label="nationality"
              :placeholder="$t('familyMembers.selectNationality')"
              track-by="code"
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
        <div class="col-xl-4 col-md-6">
          <ash-datepicker
            :placeholder="$t('familyMembers.addDOB')"
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
      </div>
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <b-input-group class="custom-login-input-groups same-height">
            <b-form-input
              v-model="registerForm.location"
              :state="registerFormState.location"
              :placeholder="$t('familyMembers.yourLocation')"
            ></b-form-input>
            <b-input-group-append>
              <location-svg />
            </b-input-group-append>
          </b-input-group>
        </div>
        <div class="col-xl-4 col-md-6">
          <div class="custom-login-input-groups same-height">
            <multiselect
              v-model="registerForm.gender"
              :options="genderList"
              :placeholder="$t('familyMembers.selectGender')"
              :selectLabel="$t('selectLabel')"
              :selectedLabel="$t('selectedLabel')"
              :deselectLabel="$t('deselectLabel')"
            ></multiselect>
            <div
              class="custom-state-invalid icon"
              :class="{
                'is-invalid': registerFormState.gender == false,
              }"
            ></div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-8 col-lg-12">
          <div class="custom-login-input-groups file-upload-container">
            <template v-if="fileToUpload.length">
              <div class="re-upload-icon">
                <i class="fa fa-refresh" aria-hidden="true"></i>
              </div>
              <div class="upload-text new">
                {{ $t("familyMembers.uploadNewFile") }}
              </div>
            </template>
            <div
              class="custom-file-upload upload-text text-muted w200 center"
              v-else
            >
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
          <button class="btn btn-primary" @click="addFamilyMember">
            {{ $t("familyMembers.addMember") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService, familyMemberService } from "../../services";
import constants from "../../constants/constants";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      registerForm: {
        guardian_id: null,
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
          value: 6,
          text: "saudiId",
          method: "saudi_id",
          placeholder: "enterId",
          type: constants.loginByOTP,
          validation: 10,
        },
        {
          value: 2,
          text: "iqamaId",
          method: "iqama",
          placeholder: "enterId",
          type: constants.loginByOTP,
          validation: 10,
        },
      ],
      validationdropzoneOptions: {
        url: "http://localhost:8080",
        thumbnailWidth: 150,
        acceptedFiles: ["image/jpeg", "image/png"],
        maxFilesize: 0.5,
        maxFiles: 1,
        dictDefaultMessage: "",
      },
      fileToUpload: [],
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
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
    this.registerForm.guardian_id = this.getUserInfo.id;
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
    addFamilyMember() {
      this.formSubmitted = true;
      if (!this.selectedOption) {
        return;
      }
      if (!this.validateForm()) {
        return;
      }
      this.registerForm[this.selectedItem.method] = +this.userId;
      this.setLoadingState(true);
      familyMemberService.addFamilyMember(this.registerForm).then(
        (response) => {
          if (response.data.status) {
            this.successIconModal(
              this.$t("familyMembers.addFamilyMember"),
              this.$t("familyMembers.addedSuccessfully")
            ).then(() => {
              this.navigateTo("Family Members List");
            });
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
.add-family-member-form {
  padding-top: 2rem;
  :deep {
    .custom-login-input-groups {
      isolation: auto;
      &:before {
        z-index: 0;
      }
      &.same-height {
        min-height: 4.375rem;
        display: flex;
        align-items: center;
      }
    }
    .ash-datetime-container {
      max-width: 100%;
      .b-form-datepicker > button.btn img {
        width: 1.75rem;
      }
    }
    .input-group-append,
    .custom-state-invalid {
      z-index: 1;
    }
  }
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
</style>