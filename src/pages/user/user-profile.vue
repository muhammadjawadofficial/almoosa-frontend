<template>
  <div class="doctor-details-container user-profile-container">
    <div class="doctor-details" v-if="getUserInfo">
      <div class="doctor-details-card">
        <div class="standard-width page-body-container">
          <div class="doctor-details-card-header">
            <div class="doctor-details-card-header-image">
              <img :src="getImageUrl(getUserInfo)" alt="doctor-image" />
              <label for="user-profile-picture-upload">
                {{ $t("profile.uploadPicture") }}
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
                  {{ getFullName(getUserInfo) }}
                </div>
                <div class="doctor-details-card-header-right-info-user">
                  <div class="user-id">
                    {{
                      translateNumber(
                        (isDoctor ? getUserInfo.id : getUserInfo.mrn_number) ||
                          "N/A"
                      )
                    }}
                  </div>
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
                  <template v-if="getUserInfo.saudi_id">
                    <div
                      class="
                        doctor-details-card-header-right-info-section-detail
                      "
                    >
                      <div class="title">{{ $t("register.saudiId") }}</div>
                      <div class="value">
                        {{ translateNumber(getUserInfo.saudi_id) }}
                      </div>
                    </div>
                  </template>
                  <template v-if="getUserInfo.iqama">
                    <div
                      class="
                        doctor-details-card-header-right-info-section-detail
                      "
                    >
                      <div class="title">{{ $t("register.iqamaId") }}</div>
                      <div class="value">
                        {{ translateNumber(getUserInfo.iqama) }}
                      </div>
                    </div>
                  </template>
                  <template v-if="!isDoctor && false">
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
                        <div class="value" v-if="getUserInfo.loyality_points">
                          {{ getUserInfo.loyality_points }} /
                          <div class="sub-value">
                            {{ $t("equal") }}
                            {{
                              translateNumber(getUserInfo.loyality_points / 2)
                            }}
                            {{ $t("sar") }}
                          </div>
                        </div>
                        <div class="value" v-else>N/A</div>
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
                <img src="../../assets/images/active-problems.svg" alt="" />
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
                    v-if="isEditing"
                  ></b-form-input>
                  <div class="profile-info-card-detail-value" v-else>
                    {{ translateNumber(phoneNumber) }}
                  </div>
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
                <img src="../../assets/images/clinical-warning.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.clinicWarning") }}
                </div>
                <div class="profile-info-card-detail-value">
                  {{ $t("notAddedYet") }}
                </div>
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
                    :selectLabel="$t('selectLabel')"
                    :selectedLabel="$t('selectedLabel')"
                    :deselectLabel="$t('deselectLabel')"
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
                    :selectLabel="$t('selectLabel')"
                    :selectedLabel="$t('selectedLabel')"
                    :deselectLabel="$t('deselectLabel')"
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
                    track-by="code"
                    label="nationality"
                    :placeholder="
                      $t('profile.select') + ' ' + $t('profile.nationality')
                    "
                    :selectLabel="$t('selectLabel')"
                    :selectedLabel="$t('selectedLabel')"
                    :deselectLabel="$t('deselectLabel')"
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
        degree: "",
        expertise: "",
        nationality: {},
        languages: "",
        consulting: "",
      },
      doctorState: {
        clinicsState: null,
        specialityState: null,
        degreeState: null,
        expertiseState: null,
        nationalityState: null,
        languagesState: null,
        consultingState: null,
      },
      nationalities: [],
      clinics: [],
      specialities: [],
    };
  },
  mounted() {
    this.initializeData();
    if (this.isDoctor) {
      this.checkDropdownValues();
    } else {
      this.getProfileData();
    }
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    validPhoneNumber() {
      // let regex = /^(009665|9665|\+9665|05|5)([503649187])(\d{7})$/;
      let regex = /^(05)([503649187])(\d{7})$/;
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
    checkDropdownValues() {
      this.setLoadingState(true);
      Promise.all([
        authService.getNationalitiesV1(),
        appointmentService.getClinicsV1(),
        appointmentService.getSpecialities(),
      ])
        .then((res) => {
          let nationalities = res[0];
          let clinics = res[1];
          let specialities = res[2];
          if (nationalities.data.status) {
            let data = nationalities.data.data;
            if (data) {
              this.nationalities = data.items;
            }
          } else {
            this.failureToast(nationalities.data.message);
          }
          if (clinics.data.status) {
            let data = clinics.data.data;
            if (data) {
              this.clinics = data.items;
            }
          } else {
            this.failureToast(clinics.data.message);
          }
          if (specialities.data.status) {
            let data = specialities.data.data;
            if (data) {
              this.specialities = data.items;
            }
          } else {
            this.failureToast(specialities.data.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        })
        .finally(() => {
          this.setLoadingState(false);
          this.getProfileData();
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
    initializeData() {
      this.resetData();
    },
    getProfileData() {
      if (this.getUserInfo.isDependent) {
        this.getUserData();
      } else {
        if (this.isDoctor) this.getDoctorProfile();
        else this.getLoggedInUserData();
      }
    },
    getDoctorProfile() {
      this.setLoadingState(true);
      userService.getDoctorProfile(this.getUserInfo.id).then(
        (res) => {
          if (res.data.status) {
            this.updateUserInfo(res.data.data.items[0]);
            this.resetData();
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          this.setLoadingState(false);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          console.error(error);
        }
      );
    },
    getLoggedInUserData() {
      this.setLoadingState(true);
      userService
        .getProfile(
          this.isDoctor ? "doctor" : "patient",
          this.isDoctor ? this.getUserInfo.id : this.getUserInfo.mrn_number
        )
        .then(
          (res) => {
            if (res.data.status) {
              this.updateUserInfo(res.data.data);
              this.resetData();
            } else {
              this.failureToast(res.data.message);
            }
            this.setLoadingState(false);
          },
          (error) => {
            this.setLoadingState(false);
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
            console.error(error);
          }
        );
    },
    getUserData() {
      this.setLoadingState(true);
      userService.getProfileById(this.getUserInfo.mrn_number).then(
        (res) => {
          if (res.data.status) {
            this.updateUserInfo(res.data.data.items[0]);
            this.resetData();
          } else {
            this.failureToast(res.data.message);
          }
          this.setLoadingState(false);
        },
        (error) => {
          this.setLoadingState(false);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          console.error(error);
        }
      );
    },
    resetData() {
      if (this.isDoctor) {
        this.doctor.clinics = this.getUserInfo.clinics || [];
        this.doctor.speciality = this.getUserInfo.speciality;
        this.doctor.degree = this.getUserInfo.degree;
        this.doctor.nationality = this.getUserInfo.nationality;
        this.doctor.expertise = this.getUserInfo.expertise;
        this.doctor.languages = this.getUserInfo.languages;
        this.doctor.consulting = this.getUserInfo.consulting_age_group;
        this.doctorState = {
          clinicsState: null,
          specialityState: null,
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
            this.getUserInfo.clinics &&
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
            address: this.address,
            mobile_number: this.phoneNumber,
            mrn_number: this.getUserInfo.mrn_number,
          };
        }
        if (Object.keys(updateUserObj).length) {
          this.updateProfileInfo(updateUserObj);
        } else {
          this.isEditing = false;
        }
      } else {
        this.isEditing = true;
      }
    },
    updateProfileInfo(data) {
      this.setLoadingState(true);
      let v1;
      v1 = this.isDoctor
        ? userService.updateV1Profile(data)
        : userService.updateProfile(data);
      v1.then(
        (res) => {
          if (res.data.status) {
            this.getProfileData();
            this.successToast(this.$t("profile.updateSuccess"));
            this.resetData();
          } else {
            this.failureToast(res.data.message);
          }
        },
        (error) => {
          this.setLoadingState(false);
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
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
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
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