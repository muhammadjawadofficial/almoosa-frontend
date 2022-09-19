<template>
  <div class="add-new-insurance-container standard-width page-body-container">
    <back-navigation
      :title="$t('insurance.addNewInsurance')"
      backLink="Medical Insurance List"
    />
    <div class="row mt-3">
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            v-model="registerForm.companyName"
            :state="registerFormState.companyName"
            :placeholder="$t('insurance.insuranceCompnayName')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <b-input-group class="custom-login-input-groups">
          <b-form-input
            type="number"
            v-model="registerForm.national_id"
            :state="registerFormState.national_id"
            :placeholder="$t('insurance.nationalId')"
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="custom-login-input-groups file-upload-container">
          <div class="upload-text" v-if="fileToUpload.length">
            {{ $t("insurance.clickToUpload") }}
          </div>
          <div class="upload-text text-muted w200 center" v-else>
            {{ $t("insurance.uploadId") }}
          </div>
          <vue-dropzone
            v-if="showUpload"
            @vdropzone-file-added="fileUpload"
            @vdropzone-removed-file="removeFile"
            :options="validationdropzoneOptions"
            ref="fileUpload"
            id="validationdropzone"
            class="dropzone digits custom-file-upload"
          >
          </vue-dropzone>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="register-navigation col-md-12">
        <div class="button-group">
          <button class="btn btn-primary" @click="addInsurance">
            {{ $t("insurance.addInsurance") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService, insuranceService } from "../../services";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showUpload: true,
      registerForm: {
        companyName: "",
        national_id: "",
        insurance_card_id: "",
      },
      registerFormState: {
        companyName: null,
        national_id: null,
      },
      formSubmitted: false,
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
  },
  methods: {
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
            this.registerForm.insurance_card_id = res.data.data.id;
            this.registerFormState.insurance_card_id =
              this.registerForm.insurance_card_id != null;
            this.successToast(this.$t("insurance.idUploaded"));
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
      this.registerFormState.companyName = form.companyName != "";
      this.registerFormState.national_id = form.national_id != "";

      return !Object.values(this.registerFormState).includes(false);
    },
    addInsurance() {
      this.formSubmitted = true;
      if (!this.validateForm()) {
        return;
      }
      this.setLoadingState(true);
      let newInsurance = {
        patient_id: this.getUserInfo.id,
        company_name: this.registerForm.companyName,
        national_id: this.registerForm.national_id,
      };
      if (this.registerForm.insurance_card_id) {
        newInsurance.insurance_card_id = this.registerForm.insurance_card_id;
      }
      insuranceService.addNewInsurace(newInsurance).then(
        (response) => {
          if (response.data.status) {
            this.resetForm();
            this.successToast(this.$t("insurance.insuranceAdded"));
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
    resetForm() {
      this.registerForm = {
        companyName: "",
        national_id: "",
        insurance_card_id: "",
      };
      this.registerFormState = {
        companyName: null,
        national_id: null,
      };
      this.fileToUpload = [];
      this.$refs.fileUpload.removeAllFiles();
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
  &.center {
    top: 0;
    bottom: 0;
    margin: auto;
    height: fit-content;
    font-size: 1.25rem;
  }
}
</style>