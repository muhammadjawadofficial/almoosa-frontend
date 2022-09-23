<template>
  <div class="lab-works-doctors-container page-body-container standard-width">
    <back-navigation
      :title="$t('myMedication.medicationList')"
      backLink="My Medication Sessions"
    />
    <b-card
      header-tag="div"
      no-body
      class="ash-card card-top-navigation transparent"
    >
      <b-card-body class="mt-5 p-0" style="--numberOfTabs: 2">
        <b-tabs pills slot="header" class="tabbed-card">
          <b-tab :title="$t('myMedication.currentMedication')">
            <div
              class="appointment-list"
              :class="{
                noData: !presentMedicationList || !presentMedicationList.length,
              }"
            >
              <div class="loading" v-if="presentMedicationList == null">
                {{ $t("loading") }}
              </div>
              <div class="no-data" v-else-if="!presentMedicationList.length">
                {{ $t("noData") }}
              </div>
              <template v-else>
                <div
                  class="appointment-list-item"
                  v-for="medication in presentMedicationList"
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
                        {{ medication.title + " " + medication.variation }}
                      </div>
                      <div class="doctor-speciality">
                        {{ medication.description }}
                      </div>
                      <div class="appointment-status">
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
                      <span
                        class="btn start-call-button w200"
                        @click.stop="setReminder(medication)"
                      >
                        {{ $t("myMedication.setReminder") }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </b-tab>
          <b-tab :title="$t('myMedication.pastMedication')">
            <div
              class="appointment-list"
              :class="{
                noData: !pastMedicationList || !pastMedicationList.length,
              }"
            >
              <div class="loading" v-if="pastMedicationList == null">
                {{ $t("loading") }}
              </div>
              <div class="no-data" v-else-if="!pastMedicationList.length">
                {{ $t("noData") }}
              </div>
              <template v-else>
                <div
                  class="appointment-list-item"
                  v-for="medication in pastMedicationList"
                  :key="'upcoming-appointment-id' + medication.id"
                >
                  <div class="appointment-card default">
                    <div class="doctor-avatar transparent">
                      <pill-bg-svg />
                    </div>
                    <div class="appointment-details">
                      <div class="doctor-name">
                        {{ medication.title + " " + medication.variation }}
                      </div>
                      <div class="doctor-speciality">
                        {{ medication.description }}
                      </div>
                      <div class="appointment-status">
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
          </b-tab>
        </b-tabs>
      </b-card-body>
    </b-card>
    <set-reminder-modal
      :medicationId="selectedMedication.id"
      :selectedMorningSlot="selectedMedication.morning_reminder"
      :selectedAfternoonSlot="selectedMedication.afternoon_reminder"
      :selectedEveningSlot="selectedMedication.evening_reminder"
      @update="handleSlotUpdate"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { medicationService } from "../../services";
import SetReminderModal from "./set-reminder-modal.vue";
export default {
  components: {
    SetReminderModal,
  },
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
    };
  },
  mounted() {
    if (!this.getSelectedMedicationSession) {
      this.navigateTo("My Medication Sessions");
      return;
    }
    this.fetchTimelines();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("myMedication", ["getSelectedMedicationSession"]),
  },
  methods: {
    ...mapActions("myMedication", ["setSelectedMedication"]),
    setReminder(medication) {
      this.selectedMedication = medication;
      this.$bvModal.show("setReminderCustomModal");
    },
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
    fetchTimelines() {
      this.setLoadingState(true);
      medicationService
        .getMedications(this.getSelectedMedicationSession.id)
        .then(
          (response) => {
            if (response.data.status) {
              let data = response.data.data.items;
              this.medicationList = [...data];
              this.filterMedications();
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
  },
};
</script>