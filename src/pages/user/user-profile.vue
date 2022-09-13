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
                    isDoctor ? { path: getUserInfo.photo } : getUserInfo.photo
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
                    |
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="standard-width doctor-details-section">
        <div class="">
          <div class="profile-info">
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
import { authService, userService } from "../../services";
export default {
  data() {
    return {
      user: null,
      isEditing: false,
      address: "",
      addressState: null,
      phoneNumber: "",
      phoneNumberState: null,
    };
  },
  mounted() {
    this.initializeData();
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
    ...mapActions("user", ["updateUserInfo"]),
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
    resetData() {
      this.address = this.getUserInfo.location;
      this.phoneNumber = this.getUserInfo.phone_number;
      this.addressState = null;
      this.phoneNumberState = null;
      this.isEditing = false;
    },
    validateForm() {
      this.addressState = this.address != "";
      this.phoneNumberState = this.validPhoneNumber;
      return this.addressState && this.phoneNumberState;
    },
    editProfile() {
      if (this.isEditing) {
        if (!this.validateForm()) {
          return;
        }
        let updateUserObj = {
          location: this.address,
          phone_number: this.phoneNumber,
        };
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
            this.updateUserInfo({ ...data });
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
            console.log(data, data.path)
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
    width: 100%;
    font-size: 1rem;
    background: var(--theme-secondary);
    color: var(--theme-tertiary);
    margin: 0;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 1rem;
    transition: 0.2s bottom;
    cursor: pointer;
  }
  &:hover {
    label {
      bottom: 0;
    }
  }
}
</style>