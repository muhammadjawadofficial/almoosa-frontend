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
              v-model="userId"
              :state="registerFormState.userId"
              :placeholder="$t('familyMembers.' + selectedItem.placeholder)"
              type="number"
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
              v-model="selectedRelation"
              :options="relations"
              track-by="id"
              :preselectFirst="true"
              :placeholder="$t('familyMembers.chooseRelation')"
              :selectLabel="$t('selectLabel')"
              :selectedLabel="$t('selectedLabel')"
              :deselectLabel="$t('deselectLabel')"
            >
              <template slot="singleLabel" slot-scope="props">
                {{ props.option[getLocaleKey("relation")] }}
              </template>
              <template slot="option" slot-scope="props">
                {{ props.option[getLocaleKey("relation")] }}
              </template>
            </multiselect>
            <div
              class="custom-state-invalid icon"
              :class="{
                'is-invalid': formSubmitted && selectedRelation == null,
              }"
            ></div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
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
              v-if="showDropzone"
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
        card_id: null,
        guardian_id: null,
        phone_number: "",
      },
      registerFormState: {
        card_id: null,
        phone_number: null,
        userId: null,
        relation_id: null,
      },
      formSubmitted: false,
      userId: "",
      constants,
      loading: false,
      selectedOption: null,
      selectedItem: {},
      loginOptions: [
        {
          value: 6,
          text: "saudiId",
          method: "saudi_id",
          placeholder: "enterId",
          type: constants.loginByOTP,
          error: "saudiId",
          minLength: constants.validation.saudi.min,
          maxLength: constants.validation.saudi.max,
        },
        {
          value: 2,
          text: "iqamaId",
          method: "iqama",
          placeholder: "enterId",
          type: constants.loginByOTP,
          error: "iqamaId",
          minLength: constants.validation.iqama.min,
          maxLength: constants.validation.iqama.max,
        },
      ],
      relations: [],
      selectedRelation: null,
      showDropzone: false,
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
    ...mapGetters("user", ["getUserInfo"]),
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
    this.showDropzone = true;
    this.selectedItem = this.selectedOption;
    this.registerForm.guardian_id = this.getUserInfo.id;
    this.checkDropdownValues();
  },
  methods: {
    ...mapActions("user", ["setOtp", "setUserId", "setAuthState"]),
    refreshDropzone() {
      this.showDropzone = false;
      setTimeout(() => {
        this.showDropzone = true;
      }, 200);
    },
    checkDropdownValues() {
      familyMemberService
        .fetchFamilyMemberRelations()
        .then((res) => {
          let response = res.data;
          if (response.status) {
            this.relations = response.data.items;
          } else {
            this.failureToast(response && response.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
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
    validateForm() {
      let form = this.registerForm;
      this.registerFormState.phone_number = this.validPhoneNumber;
      this.registerFormState.userId =
        this.userId != "" &&
        this.userId.length >= this.selectedItem.minLength &&
        this.userId.length <= this.selectedItem.maxLength;
      this.registerFormState.relation_id = this.selectedRelation != null;
      this.registerFormState.card_id = this.registerForm.card_id != null;

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
      }
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
      this.registerForm.relation_id = this.selectedRelation.id;
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
        },
        (error) => {
          console.error(error);
          this.failureToast(error.response.data.message);
        }
      );
    },
    itemSelected(item) {
      this.selectedItem = item;
      this.refreshDropzone();
      if (this.fileToUpload.length > 0) {
        this.fileToUpload = [];
        this.$refs.fileUpload.removeAllFiles();
      }
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
      console.log(file);

      authService.uploadId(file).then(
        (res) => {
          if (res.data.status) {
            this.registerForm.card_id = res.data.data.id;
            this.registerFormState.card_id = this.registerForm.card_id != null;
            this.successToast(
              this.$t(
                "register." + this.selectedOption.text + "UploadSuccessMessage"
              )
            );
          } else {
            this.failureToast(res.data.message);
          }
        },
        (error) => {
          console.error(error);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
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
.file-upload-container {
  min-height: 4.3rem;
}
</style>