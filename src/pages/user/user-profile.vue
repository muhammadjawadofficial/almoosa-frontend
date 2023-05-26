<template>
  <div class="doctor-details-container user-profile-container">
    <div class="doctor-details" v-if="getUserInfo">
      <div class="doctor-details-card">
        <div class="standard-width page-body-container">
          <div class="doctor-details-card-header">
            <div class="doctor-details-card-header-image">
              <img :src="getImageUrl(getUserInfo.photo)" alt="doctor-image" />
              <label for="user-profile-picture-upload" v-if="!isDoctor">
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
                      class="doctor-details-card-header-right-info-section-detail"
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
                      class="doctor-details-card-header-right-info-section-detail"
                    >
                      <div class="title">{{ $t("register.saudiId") }}</div>
                      <div class="value">
                        {{ translateNumber(getUserInfo.saudi_id) }}
                      </div>
                    </div>
                  </template>
                  <template v-if="getUserInfo.iqama">
                    <div
                      class="doctor-details-card-header-right-info-section-detail"
                    >
                      <div class="title">{{ $t("register.iqamaId") }}</div>
                      <div class="value">
                        {{ translateNumber(getUserInfo.iqama) }}
                      </div>
                    </div>
                  </template>
                  <template v-if="!isDoctor && false">
                    <div
                      class="doctor-details-card-header-right-info-section-detail with-icon"
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
                  {{ $t("profile.area") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="area"
                    :state="areaState"
                    :placeholder="$t('profile.area')"
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
                <img src="../../assets/images/home.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.city") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="city"
                    :state="cityState"
                    :placeholder="$t('profile.city')"
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
                <img src="../../assets/images/home.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.district") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="district"
                    :state="districtState"
                    :placeholder="$t('profile.district')"
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
                    {{ translateNumber(phoneNumber || "N/A") }}
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
                <img src="../../assets/images/call.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.secondaryPhoneNumber") }}
                </div>
                <div
                  class="profile-info-card-detail-value"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="secondaryPhoneNumber"
                    :state="secondaryPhoneNumberState"
                    :placeholder="$t('profile.secondaryPhoneNumber')"
                    :formatter="formatNumber"
                    v-if="isEditing"
                  ></b-form-input>
                  <div class="profile-info-card-detail-value" v-else>
                    {{ translateNumber(secondaryPhoneNumber || "N/A") }}
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
                  >
                    <template slot="singleLabel" slot-scope="props">
                      {{ props.option[getLocaleKey("title")] }}
                    </template>
                    <template
                      slot="selection"
                      slot-scope="{ values, search, isOpen }"
                      ><span
                        class="multiselect__single"
                        v-if="values.length"
                        v-show="!isOpen"
                      >
                        {{
                          values
                            .map((x) => x[getLocaleKey("title")])
                            .join(" , ")
                        }}
                      </span>
                    </template>
                    <template slot="option" slot-scope="props">
                      {{ props.option[getLocaleKey("title")] }}
                    </template>
                  </multiselect>
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
                <div class="profile-info-card-detail-value inactive">
                  {{
                    (doctor.speciality &&
                      doctor.speciality[getLocaleKey("title")]) ||
                    "N/A"
                  }}
                  <multiselect
                    v-if="false"
                    v-model="doctor.speciality"
                    disabled
                    :options="specialities"
                    :placeholder="
                      $t('profile.select') + ' ' + $t('profile.speciality')
                    "
                    track-by="id"
                    label="title"
                    :selectLabel="$t('selectLabel')"
                    :selectedLabel="$t('selectedLabel')"
                    :deselectLabel="$t('deselectLabel')"
                  >
                  </multiselect>
                </div>
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/translate-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.languages") + " - " + $t("english") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceLtr"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.languages"
                    :state="doctorState.languagesState"
                    :placeholder="
                      $t('profile.languages') + ' - ' + $t('english')
                    "
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
                <div class="profile-info-card-detail-value inactive">
                  {{
                    (doctor.nationality &&
                      doctor.nationality[getLocaleKey("nationality")]) ||
                    "N/A"
                  }}
                  <multiselect
                    v-if="false"
                    disabled
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
                </div>
              </div>
            </div>
            <div class="profile-info-card">
              <div class="profile-info-card-logo">
                <img src="../../assets/images/doctor-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.expertise") + " - " + $t("english") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceLtr"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-textarea
                    v-model="doctor.expertise"
                    :state="doctorState.expertiseState"
                    :placeholder="
                      $t('profile.expertise') + ' - ' + $t('english')
                    "
                    :disabled="!isEditing"
                    no-resize
                    rows="3"
                    max-rows="3"
                  ></b-form-textarea>
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
                <img src="../../assets/images/doctor-bg-sec.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.expertise") + " - " + $t("arabic") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceRtl"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-textarea
                    v-model="doctor.expertiseAr"
                    :state="doctorState.expertiseArState"
                    :placeholder="
                      $t('profile.expertise') + ' - ' + $t('arabic')
                    "
                    :disabled="!isEditing"
                    no-resize
                    rows="3"
                    max-rows="3"
                  ></b-form-textarea>
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
                  {{ $t("profile.consulting") + " - " + $t("english") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceLtr"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.consulting"
                    :state="doctorState.consultingState"
                    :placeholder="
                      $t('profile.consulting') + ' - ' + $t('english')
                    "
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
                <img src="../../assets/images/family-bg-sec.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.consulting") + " - " + $t("arabic") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceRtl"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.consultingAr"
                    :state="doctorState.consultingArState"
                    :placeholder="
                      $t('profile.consulting') + ' - ' + $t('arabic')
                    "
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
                <img src="../../assets/images/translate-bg.svg" alt="" />
              </div>
              <div class="profile-info-card-detail">
                <div class="profile-info-card-detail-title">
                  {{ $t("profile.languages") + " - " + $t("arabic") }}
                </div>
                <div
                  class="profile-info-card-detail-value forceRtl"
                  :class="{ inactive: !isEditing }"
                >
                  <b-form-input
                    v-model="doctor.languagesAr"
                    :state="doctorState.languagesArState"
                    :placeholder="
                      $t('profile.languages') + ' - ' + $t('arabic')
                    "
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
      areaState: null,
      area: "",
      cityState: null,
      city: "",
      districtState: null,
      district: "",
      phoneNumber: "",
      phoneNumberState: null,
      secondaryPhoneNumber: "",
      secondaryPhoneNumberState: null,
      doctor: {
        clinics: [],
        speciality: {},
        degree: "",
        expertise: "",
        expertiseAr: "",
        nationality: {},
        languages: "",
        languagesAr: "",
        consulting: "",
        consultingAr: "",
      },
      doctorState: {
        clinicsState: null,
        specialityState: null,
        degreeState: null,
        expertiseState: null,
        expertiseArState: null,
        nationalityState: null,
        languagesState: null,
        languagesArState: null,
        consultingState: null,
        consultingArState: null,
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
  },
  methods: {
    ...mapActions("user", ["updateUserInfo", "setUserInfo"]),
    validPhoneNumber(phoneNumber) {
      // let regex = /^(009665|9665|\+9665|05|5)([503649187])(\d{7})$/;
      let regex = /^(05)([503649187])(\d{7})$/;
      let result = phoneNumber.match(regex);
      return !!(result && result.length);
    },
    changeProfilePicture(e) {
      let file = e.target.files[0];
      if (!file) {
        return;
      }
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
    checkDropdownValues() {
      Promise.all([
        authService.getNationalitiesV1(),
        appointmentService.getClinicsV1(),
        // appointmentService.getSpecialities("?doctor_id=null&appointment_type=null&clinic_id=null"),
      ])
        .then((res) => {
          let nationalities = res[0];
          let clinics = res[1];
          // let specialities = res[2];
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
          // if (specialities.data.status) {
          //   let data = specialities.data.data;
          //   if (data) {
          //     this.specialities = data.items;
          //   }
          // } else {
          //   this.failureToast(specialities.data.message);
          // }
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
      userService.getDoctorProfile(this.getUserInfo.id).then(
        (res) => {
          if (res.data.status) {
            this.updateUserInfo(res.data.data.items[0]);
            this.resetData();
          } else {
            this.failureToast(res.data.message);
          }
        },
        (error) => {
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
          },
          (error) => {
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
      userService.getProfileById(this.getUserInfo.mrn_number).then(
        (res) => {
          if (res.data.status) {
            this.updateUserInfo(res.data.data.items[0]);
            this.resetData();
          } else {
            this.failureToast(res.data.message);
          }
        },
        (error) => {
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
        this.doctor.expertiseAr = this.getUserInfo.expertise_ar;
        this.doctor.languages = this.getUserInfo.languages;
        this.doctor.languagesAr = this.getUserInfo.languages_ar;
        this.doctor.consulting = this.getUserInfo.consulting_age_group;
        this.doctor.consultingAr = this.getUserInfo.consulting_age_group_ar;
        this.doctorState = {
          clinicsState: null,
          specialityState: null,
          degreeState: null,
          expertiseState: null,
          expertiseArState: null,
          nationalityState: null,
          languagesState: null,
          languagesArState: null,
          consultingState: null,
          consultingArState: null,
        };
      } else {
        this.area = this.getUserInfo.area;
        this.city = this.getUserInfo.city;
        this.district = this.getUserInfo.district;
        this.phoneNumber = this.getUserInfo.phone_number;
        this.secondaryPhoneNumber = this.getUserInfo.secondary_phone_number;

        this.areaState = null;
        this.cityState = null;
        this.districtState = null;
        this.phoneNumberState = null;
        this.secondaryPhoneNumberState = null;
      }
      this.isEditing = false;
    },
    validateForm() {
      if (this.isDoctor) {
        this.doctorState.clinicsState =
          this.doctor.clinics != [] &&
          this.doctor.clinics.length > 0 &&
          !!this.doctor.clinics;
        this.doctorState.degreeState =
          this.doctor.degree != "" && !!this.doctor.degree;
        this.doctorState.expertiseState =
          this.doctor.expertise != "" && !!this.doctor.expertise;
        this.doctorState.expertiseArState =
          this.doctor.expertiseAr != "" && !!this.doctor.expertiseAr;
        this.doctorState.languagesState =
          this.doctor.languages != "" && !!this.doctor.languages;
        this.doctorState.languagesArState =
          this.doctor.languagesAr != "" && !!this.doctor.languagesAr;
        this.doctorState.consultingState =
          this.doctor.consulting != "" && !!this.doctor.consulting;
        this.doctorState.consultingArState =
          this.doctor.consultingAr != "" && !!this.doctor.consultingAr;
        return !Object.values(this.doctorState).includes(false);
      } else {
        this.areaState = this.area != "";
        this.cityState = this.city != "";
        this.districtState = this.district != "";
        this.phoneNumberState = this.validPhoneNumber(this.phoneNumber);
        this.secondaryPhoneNumberState = this.validPhoneNumber(
          this.secondaryPhoneNumber
        );
        return (
          this.areaState &&
          this.cityState &&
          this.districtState &&
          this.phoneNumberState &&
          this.secondaryPhoneNumberState
        );
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
          if (this.getUserInfo.degree !== this.doctor.degree) {
            updateUserObj.degree = this.doctor.degree;
          }
          if (this.getUserInfo.expertise !== this.doctor.expertise) {
            updateUserObj.expertise = this.doctor.expertise;
          }
          if (this.getUserInfo.expertiseAr !== this.doctor.expertiseAr) {
            updateUserObj.expertise_ar = this.doctor.expertiseAr;
          }
          if (this.getUserInfo.languages !== this.doctor.languages) {
            updateUserObj.languages = this.doctor.languages;
          }
          if (this.getUserInfo.languagesAr !== this.doctor.languagesAr) {
            updateUserObj.languages_ar = this.doctor.languagesAr;
          }
          if (
            this.getUserInfo.consulting_age_group !== this.doctor.consulting
          ) {
            updateUserObj.consulting_age_group = this.doctor.consulting;
          }
          if (
            this.getUserInfo.consulting_age_group_ar !==
            this.doctor.consultingAr
          ) {
            updateUserObj.consulting_age_group_ar = this.doctor.consultingAr;
          }
        } else {
          updateUserObj = {
            area: this.area,
            city: this.city,
            district: this.district,
            mobile_number: this.phoneNumber,
            secondary_phone_number: this.secondaryPhoneNumber,
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
      userService.updateV1Profile(data_id).then(
        (res) => {
          if (res.data.status) {
            let obj = { ...data };
            // let doctorObj = { photo: data.photo.path };
            let saveObj = obj;
            // console.log(obj, doctorObj, saveObj)
            this.updateUserInfo({ ...saveObj });
            this.successToast(this.$t("profile.updateSuccess"));
            this.resetData();
          } else {
            this.failureToast(res.data.message);
          }
        },
        (error) => {
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