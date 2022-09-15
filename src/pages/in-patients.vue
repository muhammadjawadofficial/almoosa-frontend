<template>
  <div class="lab-works-doctors-container page-body-container standard-width">
    <back-navigation :title="$t('inPatients.title')" />
    <div class="search-box">
      <div class="search-icon">
        <i class="fa fa-search" aria-hidden="true"></i>
      </div>
      <div class="search-input">
        <b-form-input
          :placeholder="$t('doctorList.search')"
          id="type-search"
          type="search"
          v-model="searchQuery"
        ></b-form-input>
      </div>
    </div>
    <b-card header-tag="div" no-body class="ash-card simple transparent">
      <b-card-body class="p-0 mt-4">
        <div
          class="appointment-list"
          :class="{ noData: !filteredPatients || !filteredPatients.length }"
        >
          <div class="loading" v-if="filteredPatients == null">
            {{ $t("loading") }}
          </div>
          <div class="no-data" v-else-if="!filteredPatients.length">
            {{ $t("noData") }}
          </div>
          <template v-else>
            <div
              class="appointment-list-item"
              v-for="appointment in filteredPatients"
              :key="'upcoming-appointment-id' + appointment.id"
            >
              <div class="appointment-card default">
                <div class="doctor-avatar">
                  <img :src="getImageUrl(appointment.doctor.photo)" alt="" />
                </div>
                <div class="appointment-details">
                  <div class="doctor-name">
                    {{
                      appointment.doctor.first_name +
                      (appointment.doctor.middle_name
                        ? " " + appointment.doctor.middle_name + " "
                        : " ") +
                      appointment.doctor.family_name
                    }}
                  </div>
                  <div class="doctor-speciality">
                    {{ $t("bookAppointment." + appointment.type) }}
                  </div>
                  <div class="appointment-status">
                    <div class="appointment-time-span">
                      <div>MRN - {{ appointment.doctor.mrn_number }}</div>
                      <div>
                        {{ appointment.doctor.gender }} -
                        {{ getYears(appointment.doctor.dob) }} Years
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex";
import { patientService } from "../services";
export default {
  data() {
    return {
      patientList: null,
      filteredPatients: null,
      searchQuery: "",
    };
  },
  mounted() {
    this.fetchAppointments();
  },
  watch: {
    searchQuery(val) {
      this.filteredPatients = [
        ...this.patientList.filter((x) =>
          x.doctor.first_name.toLowerCase().includes(val.toLowerCase())
        ),
      ];
    },
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  methods: {
    fetchAppointments() {
      this.patientList = null;
      this.setLoadingState(true);
      patientService.fetchCriticalCare().then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.patientList = [...data];
            this.patientList = [
              {
                id: 6,
                patient_id: 2,
                doctor_id: 1,
                clinic_id: 1,
                type: "onsite",
                booked_date: "2022-08-16T00:00:00.000Z",
                start_time: "19:00:00",
                end_time: "20:00:00",
                amount: 100,
                status: "confirmed",
                use_loyality: false,
                loyality_discount: 0,
                promo_code: "",
                promo_discount: 0,
                doctor: {
                  id: 1,
                  email_address: "hina@qaenginner.com",
                  role_id: 4,
                  speciality_id: 2,
                  saudi_id: "2342545543",
                  iqama: "1232364676",
                  mrn_number: "56534324343",
                  first_name: "Hina",
                  middle_name: "Fatima",
                  family_name: "Sohail",
                  first_name_ar: "",
                  middle_name_ar: null,
                  family_name_ar: null,
                  phone_number: "00966561792921",
                  gender: "female",
                  dob: "2022-08-23",
                  location: "Lahore, Pakistan",
                  card_id: 4,
                  photo_id: 98,
                  status: "verified",
                  nationality_id: null,
                  promo_group_id: 18,
                  otp_code: 8639,
                  rating: 4,
                  loyality_points: 0,
                  promo_code: "",
                  udid: null,
                  fcm_token: null,
                  is_privacy_agreed: false,
                  deleted_at: null,
                  created_at: "2022-08-16T06:34:39.000Z",
                  updated_at: "2022-09-15T12:03:47.000Z",
                  photo: {
                    id: 98,
                    mimetype: "image/png",
                    filename: "76a2a384979e67e69579332f966dd8b8",
                    path: "image/76a2a384979e67e69579332f966dd8b8",
                  },
                },
                reports: [
                  {
                    id: 5,
                    appointment_id: 6,
                    dated: "2022-09-11T15:00:00.000Z",
                    type: "radiology",
                    title: "Sample RADIOLOGY Record",
                    result: "normal",
                    report_id: 122,
                    report_file: {
                      id: 122,
                      mimetype: "application/pdf",
                      filename: "425aaa2164320552dea820fcc9080887",
                      path: "pdf/425aaa2164320552dea820fcc9080887",
                    },
                  },
                ],
              },
              {
                id: 7,
                patient_id: 2,
                doctor_id: 1,
                clinic_id: 1,
                type: "onsite",
                booked_date: "2022-08-16T00:00:00.000Z",
                start_time: "19:00:00",
                end_time: "20:00:00",
                amount: 100,
                status: "confirmed",
                use_loyality: false,
                loyality_discount: 0,
                promo_code: "",
                promo_discount: 0,
                doctor: {
                  id: 1,
                  email_address: "hina@qaenginner.com",
                  role_id: 4,
                  speciality_id: 2,
                  saudi_id: "2342545543",
                  iqama: "1232364676",
                  mrn_number: "56534324343",
                  first_name: "Hina",
                  middle_name: "Fatima",
                  family_name: "Sohail",
                  first_name_ar: "",
                  middle_name_ar: null,
                  family_name_ar: null,
                  phone_number: "00966561792921",
                  gender: "female",
                  dob: "2022-08-23",
                  location: "Lahore, Pakistan",
                  card_id: 4,
                  photo_id: 98,
                  status: "verified",
                  nationality_id: null,
                  promo_group_id: 18,
                  otp_code: 8639,
                  rating: 4,
                  loyality_points: 0,
                  promo_code: "",
                  udid: null,
                  fcm_token: null,
                  is_privacy_agreed: false,
                  deleted_at: null,
                  created_at: "2022-08-16T06:34:39.000Z",
                  updated_at: "2022-09-15T12:03:47.000Z",
                  photo: {
                    id: 98,
                    mimetype: "image/png",
                    filename: "76a2a384979e67e69579332f966dd8b8",
                    path: "image/76a2a384979e67e69579332f966dd8b8",
                  },
                },
                reports: [
                  {
                    id: 5,
                    appointment_id: 6,
                    dated: "2022-09-11T15:00:00.000Z",
                    type: "radiology",
                    title: "Sample RADIOLOGY Record",
                    result: "normal",
                    report_id: 122,
                    report_file: {
                      id: 122,
                      mimetype: "application/pdf",
                      filename: "425aaa2164320552dea820fcc9080887",
                      path: "pdf/425aaa2164320552dea820fcc9080887",
                    },
                  },
                ],
              },
              {
                id: 8,
                patient_id: 2,
                doctor_id: 1,
                clinic_id: 1,
                type: "onsite",
                booked_date: "2022-08-16T00:00:00.000Z",
                start_time: "19:00:00",
                end_time: "20:00:00",
                amount: 100,
                status: "confirmed",
                use_loyality: false,
                loyality_discount: 0,
                promo_code: "",
                promo_discount: 0,
                doctor: {
                  id: 1,
                  email_address: "hina@qaenginner.com",
                  role_id: 4,
                  speciality_id: 2,
                  saudi_id: "2342545543",
                  iqama: "1232364676",
                  mrn_number: "56534324343",
                  first_name: "Hina",
                  middle_name: "Fatima",
                  family_name: "Sohail",
                  first_name_ar: "",
                  middle_name_ar: null,
                  family_name_ar: null,
                  phone_number: "00966561792921",
                  gender: "female",
                  dob: "2022-08-23",
                  location: "Lahore, Pakistan",
                  card_id: 4,
                  photo_id: 98,
                  status: "verified",
                  nationality_id: null,
                  promo_group_id: 18,
                  otp_code: 8639,
                  rating: 4,
                  loyality_points: 0,
                  promo_code: "",
                  udid: null,
                  fcm_token: null,
                  is_privacy_agreed: false,
                  deleted_at: null,
                  created_at: "2022-08-16T06:34:39.000Z",
                  updated_at: "2022-09-15T12:03:47.000Z",
                  photo: {
                    id: 98,
                    mimetype: "image/png",
                    filename: "76a2a384979e67e69579332f966dd8b8",
                    path: "image/76a2a384979e67e69579332f966dd8b8",
                  },
                },
                reports: [
                  {
                    id: 5,
                    appointment_id: 6,
                    dated: "2022-09-11T15:00:00.000Z",
                    type: "radiology",
                    title: "Sample RADIOLOGY Record",
                    result: "normal",
                    report_id: 122,
                    report_file: {
                      id: 122,
                      mimetype: "application/pdf",
                      filename: "425aaa2164320552dea820fcc9080887",
                      path: "pdf/425aaa2164320552dea820fcc9080887",
                    },
                  },
                ],
              },
            ];
            this.filteredPatients = [...this.patientList];
          } else {
            this.failureToast(response.data.messsage);
          }
          this.setLoadingState(false);
        },
        () => {
          this.setLoadingState(false);
          this.failureToast();
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.appointment-time-span {
  display: flex;
  gap: 0;
  flex-wrap: wrap;
  flex-direction: column;
  @media only screen and (min-width: 992px) {
    gap: 2rem;
    top: 1.875rem;
    bottom: 1.875rem;
    height: fit-content;
    margin: auto;
  }
  @media only screen and (min-width: 525px) {
    gap: 1rem;
    flex-direction: row;
  }
}
</style>