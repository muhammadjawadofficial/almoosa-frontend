<template>
  <div class="doctor-details-container user-profile-container">
    <div class="doctor-details" v-if="getUserInfo">
      <div class="doctor-details-card">
        <div class="standard-width page-body-container">
          <div class="doctor-details-card-header">
            <div class="doctor-details-card-header-image">
              <img
                :src="
                  getImageUrl(
                    typeof getUserInfo.photo == 'string'
                      ? { path: getUserInfo.photo }
                      : getUserInfo.photo
                  )
                "
                alt="doctor-image"
              />
              <label for="user-profile-picture-upload">
                Upload Picture
                <input
                  type="file"
                  @change="changeProfilePicture"
                  id="user-profile-picture-upload"
                  class="d-none"
                />
              </label>
            </div>
            <div class="doctor-details-card-header-right">
              <div class="doctor-details-card-header-right-info">
                <div class="doctor-details-card-header-right-info-name">
                  {{
                    getUserInfo.first_name +
                    (getUserInfo.middle_name
                      ? " " + getUserInfo.middle_name + " "
                      : " ") +
                    getUserInfo.family_name
                  }}
                </div>
                <div class="doctor-details-card-header-right-info-user">
                  <div class="user-id">
                    {{
                      getUserInfo.mrn_number
                        ? getUserInfo.mrn_number
                        : getUserInfo.saudi_id
                        ? getUserInfo.saudi_id
                        : getUserInfo.iqama
                        ? getUserInfo.iqama
                        : getUserInfo.id
                    }}
                  </div>
                  <template v-if="getUserInfo.nationality">
                    <div class="nationality">
                      {{
                        getUserInfo.nationality.nationality ||
                        getUserInfo.nationality
                      }}
                    </div>
                  </template>
                </div>
                <div class="doctor-details-card-header-right-info-section">
                  <template v-if="getUserInfo.nationality">
                    <div
                      class="
                        doctor-details-card-header-right-info-section-detail
                      "
                    >
                      <div class="title">{{ $t("profile.nationality") }}</div>
                      <div class="value">
                        {{
                          getUserInfo.nationality.nationality ||
                          getUserInfo.nationality
                        }}
                      </div>
                    </div>
                  </template>
                  <div
                    class="doctor-details-card-header-right-info-section-detail"
                  >
                    <div class="title">{{ $t("profile.idNumber") }}</div>
                    <div class="value">
                      {{
                        getUserInfo.saudi_id
                          ? getUserInfo.saudi_id
                          : getUserInfo.iqama
                          ? getUserInfo.iqama
                          : getUserInfo.id
                      }}
                    </div>
                  </div>
                  <template v-if="getUserInfo.allergy">
                    <div
                      class="
                        doctor-details-card-header-right-info-section-detail
                      "
                    >
                      <div class="title">{{ $t("profile.nationality") }}</div>
                      <div class="value">
                        {{ getUserInfo.allergy.name }}
                      </div>
                    </div>
                  </template>
                  <template v-if="!isDoctor">
                    <div
                      class="
                        doctor-details-card-header-right-info-section-detail
                        with-icon
                      "
                    >
                      <div class="icon">
                        <img
                          src="../../assets/images/star-points.svg"
                          alt="star-img"
                        />
                      </div>
                      <div class="content">
                        <div class="title">
                          {{ $t("profile.loyaltyPoint") }}
                        </div>
                        <div class="value">
                          {{ getUserInfo.loyality_points }} /
                          <div class="sub-value">
                            {{ $t("equal") }}
                            {{
                              translateNumber(getUserInfo.loyality_points / 2)
                            }}
                            {{ $t("sar") }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="standard-width doctor-details-section">
        <div class="">
          <div class="profile-info patient" v-if="!isDoctor">
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/home.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.address") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="address"
                    :state="addressState"
                    :placeholder="$t('profile.address')"
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/heart-vitals.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.activeProblem") }}
                </div>
                <div class="profile-info-card-detail-value">
                  Caries of dentine
                </div>
              </div>
              <div class="profile-info-card-option"></div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/call.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.phoneNumber") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="phoneNumber"
                    :state="phoneNumberState"
                    :placeholder="$t('profile.phoneNumber')"
                    :formatter="formatNumber"
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/heart-vitals.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.clinicWarning") }}
                </div>
                <div class="profile-info-card-detail-value">Not Added Yet</div>
              </div>
              <div class="profile-info-card-option"></div>
            </div>
          </div>
          <div class="profile-info" v-else>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/location-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.clinics") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <multiselect
                    :disabled="!isEditing"
                    v-model="doctor.clinics"
                    :options="clinics"
                    :placeholder="
                      $t('profile.select') + ' ' + $t('profile.clinics')
                    "
                    multiple
                    track-by="id"
                    label="title"
                  ></multiselect>
                  <div
                    class="custom-state-invalid icon"
                    :class="{
                      'is-invalid': doctorState.clinicsState == false,
                    }"
                  ></div>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/heart-vitals-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.speciality") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <multiselect
                    v-model="doctor.speciality"
                    :disabled="!isEditing"
                    :options="specialities"
                    :placeholder="
                      $t('profile.select') + ' ' + $t('profile.speciality')
                    "
                    track-by="id"
                    label="title"
                  ></multiselect>
                  <div
                    class="custom-state-invalid icon"
                    :class="{
                      'is-invalid': doctorState.specialityState == false,
                    }"
                  ></div>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/strethoscope-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.department") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <multiselect
                    :disabled="!isEditing"
                    v-model="doctor.department"
                    :options="departments"
                    :placeholder="
                      $t('profile.select') + ' ' + $t('profile.department')
                    "
                    track-by="id"
                    label="name"
                  ></multiselect>
                  <div
                    class="custom-state-invalid icon"
                    :class="{
                      'is-invalid': doctorState.departmentState == false,
                    }"
                  ></div>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/user-id-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.degree") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.degree"
                    :state="doctorState.degreeState"
                    :placeholder="$t('profile.degree')"
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/doctor-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.expertise") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.expertise"
                    :state="doctorState.expertiseState"
                    :placeholder="$t('profile.expertise')"
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/flag-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.nationality") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <multiselect
                    :disabled="!isEditing"
                    v-model="doctor.nationality"
                    :options="nationalities"
                    track-by="id"
                    label="nationality"
                    :placeholder="
                      $t('profile.select') + ' ' + $t('profile.nationality')
                    "
                  ></multiselect>
                  <div
                    class="custom-state-invalid icon"
                    :class="{
                      'is-invalid': doctorState.nationalityState == false,
                    }"
                  ></div>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/translate-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.languages") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.languages"
                    :state="doctorState.languagesState"
                    :placeholder="$t('profile.languages')"
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/family-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.consulting") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.consulting"
                    :state="doctorState.consultingState"
                    :placeholder="$t('profile.consulting')"
                    :disabled="!isEditing"
                  ></b-form-input>
                </div>
              </div>
              <div class="profile-info-card-option">
                <img
                  src="../../assets/images/pencil.svg"
                  alt=""
                  v-if="isEditing"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 button-group">
              <button class="btn btn-secondary" @click="editProfile">
                {{
                  isEditing
                    ? $t("profile.updateProfile")
                    : $t("profile.editProfile")
                }}
              </button>
              <button class="btn btn-tertiary" @click="cancelEditing">
                {{ isEditing ? $t("cancel") : $t("back") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { appointmentService, authService, userService } from "../../services";
export default {
  data() {
    return {
      user: null,
      isEditing: false,
      address: "",
      addressState: null,
      phoneNumber: "",
      phoneNumberState: null,
      doctor: {
        clinics: [],
        speciality: {},
        department: {},
        degree: "",
        expertise: "",
        nationality: {},
        languages: "",
        consulting: "",
      },
      doctorState: {
        clinicsState: null,
        specialityState: null,
        departmentState: null,
        degreeState: null,
        expertiseState: null,
        nationalityState: null,
        languagesState: null,
        consultingState: null,
      },
      nationalities: [],
      departments: [],
      clinics: [],
      specialities: [],
    };
  },
  mounted() {
    this.initializeData();
    this.checkDropdownValues();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    validPhoneNumber() {
      let regex = /^(009665|9665|\+9665|05|5)([503649187])(\d{7})$/;
      let result = this.phoneNumber.match(regex);
      return !!(result && result.length);
    },
  },
  methods: {
    ...mapActions("user", ["updateUserInfo", "setUserInfo"]),
    changeProfilePicture(e) {
      let file = e.target.files[0];
      if (!file) {
        return;
      }
      this.setLoadingState(true);
      authService.uploadId(file).then(
        (res) => {
          if (res.data.status) {
            this.updateProfilePicture(
              { photo: res.data.data },
              { photo_id: res.data.data.id }
            );
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
      this.setLoadingState(true);
      authService.getDepartments().then(
        (res) => {
          if (res.data.status) {
            let data = res.data.data;
            if (data) {
              this.departments = data.items;
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
      this.setLoadingState(true);
      appointmentService.getClinics().then(
        (res) => {
          let response = res.data;
          if (response.status) {
            this.clinics = response.data.items;
          } else {
            this.failureToast(response.message);
          }
          this.setLoadingState(false);
        },
        (err) => {
          console.error(err);
          this.failureToast();
          this.setLoadingState(false);
        }
      );
      this.setLoadingState(true);
      appointmentService.getSpecialities().then(
        (res) => {
          let response = res.data;
          if (response.status) {
            this.specialities = res.data.data.items;
          } else {
            this.failureToast(response.message);
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
    initializeData() {
      this.resetData();
      this.getProfileData();
    },
    getProfileData() {
      if (this.getUserInfo.isDependent) {
        this.getUserData();
      } else {
        this.getLoggedInUserData();
      }
    },
    getLoggedInUserData() {
      this.setLoadingState(true);
      userService.getProfile(this.isDoctor ? "doctor" : "patient").then(
        (res) => {
          if (res.data.status) {
            this.setUserInfo(res.data.data);
            this.resetData();
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          this.setLoadingState(false);
          this.failureToast();
          console.error(error);
        }
      );
    },
    getUserData() {
      this.setLoadingState(true);
      userService.getProfileById(this.getUserInfo.id).then(
        (res) => {
          if (res.data.status) {
            this.setUserInfo(res.data.data.items[0]);
            this.resetData();
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          this.setLoadingState(false);
          this.failureToast();
          console.error(error);
        }
      );
    },
    resetData() {
      if (this.isDoctor) {
        this.doctor.clinics = this.getUserInfo.clinics || [];
        this.doctor.speciality = this.getUserInfo.speciality;
        this.doctor.department = this.getUserInfo.department;
        this.doctor.degree = this.getUserInfo.degree;
        this.doctor.nationality = this.getUserInfo.nationality;
        this.doctor.expertise = this.getUserInfo.expertise;
        this.doctor.languages = this.getUserInfo.languages;
        this.doctor.consulting = this.getUserInfo.consulting_age_group;
        this.doctorState = {
          clinicsState: null,
          specialityState: null,
          departmentState: null,
          degreeState: null,
          expertiseState: null,
          nationalityState: null,
          languagesState: null,
          consultingState: null,
        };
      } else {
        this.address = this.getUserInfo.location;
        this.phoneNumber = this.getUserInfo.phone_number;
        this.addressState = null;
        this.phoneNumberState = null;
      }
      this.isEditing = false;
    },
    validateForm() {
      if (this.isDoctor) {
        this.doctorState.clinicsState =
          this.doctor.clinics != [] &&
          this.doctor.clinics.length > 0 &&
          !!this.doctor.clinics;
        this.doctorState.specialityState =
          this.doctor.speciality != {} && !!this.doctor.speciality;
        this.doctorState.departmentState =
          this.doctor.department != {} && !!this.doctor.department;
        this.doctorState.degreeState =
          this.doctor.degree != "" && !!this.doctor.degree;
        this.doctorState.expertiseState =
          this.doctor.expertise != "" && !!this.doctor.expertise;
        this.doctorState.nationalityState =
          this.doctor.nationality != {} && !!this.doctor.nationality;
        this.doctorState.languagesState =
          this.doctor.languages != "" && !!this.doctor.languages;
        this.doctorState.consultingState =
          this.doctor.consulting != "" && !!this.doctor.consulting;
        return !Object.values(this.doctorState).includes(false);
      } else {
        this.addressState = this.address != "";
        this.phoneNumberState = this.validPhoneNumber;
        return this.addressState && this.phoneNumberState;
      }
    },
    editProfile() {
      if (this.isEditing) {
        if (!this.validateForm()) {
          return;
        }
        let updateUserObj = {};
        if (this.isDoctor) {
          if (
            this.getUserInfo.clinics.map((x) => x.id).join(",") !==
            this.doctor.clinics.map((x) => x.id).join(",")
          ) {
            updateUserObj.clinics = this.doctor.clinics.map((x) => x.id);
          }
          if (
            !this.getUserInfo.speciality ||
            this.getUserInfo.speciality.id !== this.doctor.speciality.id
          ) {
            updateUserObj.speciality_id = this.doctor.speciality.id;
          }
          if (
            !this.getUserInfo.department ||
            this.getUserInfo.department !== this.doctor.department
          ) {
            updateUserObj.department_id = this.doctor.department.id;
          }
          if (this.getUserInfo.degree !== this.doctor.degree) {
            updateUserObj.degree = this.doctor.degree;
          }
          if (this.getUserInfo.expertise !== this.doctor.expertise) {
            updateUserObj.expertise = this.doctor.expertise;
          }
          if (
            !this.getUserInfo.nationality ||
            this.getUserInfo.nationality.id !== this.doctor.nationality.id
          ) {
            updateUserObj.nationality_id = this.doctor.nationality.id;
          }
          if (this.getUserInfo.languages !== this.doctor.languages) {
            updateUserObj.languages = this.doctor.languages;
          }
          if (
            this.getUserInfo.consulting_age_group !== this.doctor.consulting
          ) {
            updateUserObj.consulting_age_group = this.doctor.consulting;
          }
        } else {
          updateUserObj = {
            location: this.address,
            phone_number: this.phoneNumber,
          };
        }
        this.updateProfileInfo(updateUserObj);
      } else {
        this.isEditing = true;
      }
    },
    updateProfileInfo(data) {
      this.setLoadingState(true);
      userService.updateProfile(data).then(
        (res) => {
          if (res.data.status) {
            this.getProfileData();
            this.successToast(this.$t("profile.updateSuccess"));
            this.resetData();
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          this.setLoadingState(false);
          this.failureToast();
          console.error(error);
        }
      );
    },
    updateProfilePicture(data, data_id) {
      this.setLoadingState(true);
      userService.updateProfile(data_id).then(
        (res) => {
          if (res.data.status) {
            let obj = { ...data };
            let doctorObj = { photo: data.photo.path };
            let saveObj = this.isDoctor ? doctorObj : obj;
            this.updateUserInfo({ ...saveObj });
            this.successToast(this.$t("profile.updateSuccess"));
            this.resetData();
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          this.setLoadingState(false);
          this.failureToast();
          console.error(error);
        }
      );
    },
    cancelEditing() {
      if (this.isEditing) {
        this.resetData();
      } else {
        this.navigateTo("default");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button-group {
  margin-top: 10rem;
  button {
    padding-block-start: 0.5rem;
    padding-block-end: 0.4rem;
    border-radius: 6px;
  }
  button.btn-secondary {
    font-size: 1.25rem;
    max-width: fit-content;
    min-width: 12.5rem;
  }
  button.btn-tertiary {
    max-width: 7.25rem !important;
    font-size: 1.125rem;
  }
}
.doctor-details-card-header-image {
  position: relative;
  label {
    position: absolute;
    bottom: -3.5rem;
    left: 0;
    right: 0;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s bottom;
    width: 100%;
    font-size: 1rem;
    color: var(--theme-tertiary);
    margin: 0;
    padding-bottom: 1rem;
    isolation: isolate;
    cursor: pointer;
    &::before {
      content: "";
      background: var(--theme-secondary);
      filter: opacity(0.5);
      position: absolute;
      inset: 0;
      z-index: -1;
    }
  }
  &:hover {
    label {
      bottom: 0;
    }
  }
}
</style>