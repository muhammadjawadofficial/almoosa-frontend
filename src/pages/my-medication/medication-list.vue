<template>
  <div class="lab-works-doctors-container page-body-container standard-width">
    <div class="flex-backlink-with-button">
      <back-navigation
        :title="$t('myMedication.medicationList')"
        backLink="My Medication Sessions"
      />
      <div>
        <button
          class="btn btn-secondary text-transform-unset"
          @click="showRequestRefillModal"
          v-if="medicationRequests != null && !getRefillRequest.length"
        >
          {{ $t("myMedication.requestRefill") }}
        </button>
        <button
          class="btn btn-secondary text-transform-unset"
          @click="showRequestDeliveryModal"
          v-if="
            medicationRequests != null && !getDeliveryRequest.length && false
          "
        >
          {{ $t("myMedication.requestDelivery") }}
        </button>
      </div>
    </div>
    <b-card header-tag="div" no-body class="ash-card transparent mt-0">
      <b-card-body class="mt-5 p-0" style="--numberOfTabs: 2">
        <div
          class="appointment-list"
          :class="{
            noData: !medicationList || !medicationList.length,
          }"
        >
          <div class="loading no-data" v-if="medicationList == null">
            {{ $t("loading") }}
          </div>
          <div class="no-data" v-else-if="!medicationList.length">
            {{ $t("noData") }}
          </div>
          <template v-else>
            <div
              class="appointment-list-item"
              v-for="medication in medicationList"
              :key="'upcoming-appointment-id' + medication.id"
            >
              <div
                class="appointment-card default"
                @click="viewDetails(medication)"
              >
                <div class="doctor-avatar transparent">
                  <pill-bg-svg />
                </div>
                <div class="appointment-details">
                  <div class="doctor-name">
                    {{
                      (medication.title ? medication.title + " " : "") +
                      medication.variation
                    }}
                  </div>
                  <div class="doctor-speciality">
                    {{ medication.description }}
                  </div>
                  <div class="appointment-status">
                    <div class="appointment-time-span">
                      <span>
                        {{ formatDateTime(medication.start_date) }}
                      </span>
                      -
                      <span>
                        {{ formatDateTime(medication.end_date) }}
                      </span>
                    </div>
                  </div>
                  <div class="appointment-status" v-if="false">
                    <div class="appointment-time-span">
                      {{
                        medication.morning_reminder
                          ? removeSecondsFromTimeString(
                              medication.morning_reminder
                            ) + ", "
                          : ""
                      }}
                      {{
                        medication.afternoon_reminder
                          ? removeSecondsFromTimeString(
                              medication.afternoon_reminder
                            ) + ", "
                          : ""
                      }}
                      {{
                        medication.evening_reminder
                          ? removeSecondsFromTimeString(
                              medication.evening_reminder
                            ) + ", "
                          : ""
                      }}
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
import { mapActions, mapGetters } from "vuex";
import { medicationService } from "../../services";
export default {
  data() {
    return {
      medicationList: null,
      pastMedicationList: null,
      presentMedicationList: null,
      selectedMedication: {
        id: null,
        morning_reminder: null,
        evening_reminder: null,
        afternoon_reminder: null,
      },
      medicationRequests: null,
    };
  },
  mounted() {
    if (!this.getSelectedMedicationSession) {
      this.navigateTo("My Medication Sessions");
      return;
    }
    this.fetchMedications();
    this.fetchMedicationRequest();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("myMedication", ["getSelectedMedicationSession"]),
    getRefillRequest() {
      return (
        !this.medicationRequests ||
        this.medicationRequests.filter(
          (item) => item.status === "pending" && item.is_delivery == false
        )
      );
    },
    getDeliveryRequest() {
      return (
        !this.medicationRequests ||
        this.medicationRequests.filter(
          (item) => item.status === "pending" && item.is_delivery == true
        )
      );
    },
  },
  methods: {
    ...mapActions("myMedication", ["setSelectedMedication"]),
    handleSlotUpdate(slots) {
      let findIndex = this.medicationList.findIndex(
        (x) => x.id == this.selectedMedication.id
      );
      if (findIndex > -1) {
        this.medicationList[findIndex].morning_reminder =
          slots.morning_reminder;
        this.medicationList[findIndex].afternoon_reminder =
          slots.afternoon_reminder;
        this.medicationList[findIndex].evening_reminder =
          slots.evening_reminder;
      }
    },
    fetchMedications() {
      medicationService
        .getMedications(this.getSelectedMedicationSession.id)
        .then(
          (response) => {
            if (response.data.status) {
              let data = response.data.data.items;
              this.medicationList = [...data];
              this.filterMedications();
            } else {
              this.medicationList = [];
              this.filterMedications();
              this.failureToast(response.data.messsage);
            }
          },
          (error) => {
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
            this.medicationList = [];
            this.filterMedications();
          }
        );
    },
    fetchMedicationRequest() {
      Promise.all([
        medicationService.getMedicationRequest(
          this.getSelectedMedicationSession.id
        ),
      ])
        .then((res) => {
          let requests = res[0];
          let response = requests.data;
          if (response.status && response.data.items) {
            this.medicationRequests = response.data.items;
          } else {
            this.medicationRequests = [];
            this.failureToast(response.messsage);
          }
        })
        .catch((error) => {
          this.medicationRequests = [];
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
    },
    filterMedications() {
      this.presentMedicationList = [];
      this.pastMedicationList = [];
      this.medicationList.forEach((medication) => {
        if (new Date() > new Date(medication.end_date)) {
          this.pastMedicationList.push(medication);
        } else {
          this.presentMedicationList.push(medication);
        }
      });
    },
    viewDetails(medication) {
      this.setSelectedMedication(medication);
      this.navigateTo("My Medication Details");
    },
    showMedicationModal(delivery = false) {
      medicationService
        .requestMedication({
          medication_id: this.getSelectedMedicationSession.id,
          mrn_number: this.getUserInfo.mrn_number,
          patient_name: this.getFullName(this.getUserInfo, "", ""),
          patient_name_ar: this.getFullName(this.getUserInfo, "", "_ar"),
          phone_number: this.getUserInfo.phone_number,
          clinic_id:
            this.getSelectedMedicationSession.doctor &&
            this.getSelectedMedicationSession.doctor.speciality_id,
          doctor_name: this.getFullName(
            this.getSelectedMedicationSession.doctor,
            "",
            ""
          ),
          doctor_name_ar: this.getFullName(
            this.getSelectedMedicationSession.doctor,
            "",
            "_ar"
          ),
          end_date: this.getSelectedMedicationSession.end_date,
          is_delivery: delivery,
        })
        .then(
          (response) => {
            if (response.data.status) {
              this.successIconModal(
                this.$t("myMedication.modal.requestTitle"),
                this.$t("myMedication.modal.requestSuccess"),
                "m-pill"
              ).then(() => {
                this.fetchMedicationRequest();
              });
            } else {
              this.failureToast(response.data.messsage);
            }
          },
          (error) => {
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
          }
        );
    },
    showRequestRefillModal() {
      this.successIconModal(
        this.$t("myMedication.modal.requestTitle"),
        this.$t("myMedication.modal.requestText"),
        "m-pill",
        this.$t("myMedication.modal.requestButton")
      ).then((modalResponse) => {
        if (modalResponse.value) {
          this.showMedicationModal(false);
        }
      });
    },
    showRequestDeliveryModal() {
      this.successIconModal(
        this.$t("myMedication.modal.requestDeliveryTitle"),
        this.$t("myMedication.modal.requestDeliveryText"),
        "m-pill",
        this.$t("myMedication.modal.requestButton")
      ).then((modalResponse) => {
        if (modalResponse.value) {
          this.showMedicationModal(true);
        }
      });
    },
  },
};
</script>

<style scoped>
.appointment-time-span span {
  white-space: nowrap;
}
.flex-backlink-with-button {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>