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
      <b-card-body class="mt-5 p-0">
        <b-tabs pills slot="header" class="tabbed-card">
          <b-tab :title="$t('myMedication.currentMedication')">
            <div
              class="appointment-list"
              :class="{ noData: !medicationList || !medicationList.length }"
            >
              <div class="loading" v-if="medicationList == null">
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
                      <div class="doctor-name">Desloratidine 500 MG</div>
                      <div class="doctor-speciality">Oral - 2 Times a day</div>
                      <div class="appointment-status">
                        <div class="appointment-time-span">
                          {{
                            removeSecondsFromTimeString(medication.start_time)
                          }},
                          {{ removeSecondsFromTimeString(medication.end_time) }}
                        </div>
                      </div>
                      <span
                        class="btn start-call-button w200"
                        @click.stop="setReminder"
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
              :class="{ noData: !medicationList || !medicationList.length }"
            >
              <div class="loading" v-if="medicationList == null">
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
                  <div class="appointment-card default">
                    <div class="doctor-avatar transparent">
                      <pill-bg-svg />
                    </div>
                    <div class="appointment-details">
                      <div class="doctor-name">Desloratidine 500 MG</div>
                      <div class="doctor-speciality">Oral - 2 Times a day</div>
                      <div class="appointment-status">
                        <div class="appointment-time-span">
                          {{
                            removeSecondsFromTimeString(medication.start_time)
                          }},
                          {{ removeSecondsFromTimeString(medication.end_time) }}
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
      :selectedMorningSlot="1"
      :selectedAfternoonSlot="3"
      :selectedEveningSlot="2"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { reportService } from "../../services";
import SetReminderModal from "./set-reminder-modal.vue";
export default {
  components: {
    SetReminderModal,
  },
  data() {
    return {
      medicationList: null,
      itemLength: 4,
    };
  },
  mounted() {
    if (!this.getSelectedMedicationSession) {
      this.navigateTo("My Medication Sessions");
    }
    this.fetchTimelines();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("myMedication", ["getSelectedMedicationSession"]),
  },
  methods: {
    ...mapActions("myMedication", ["setSelectedMedication"]),
    setReminder() {
      this.$bvModal.show("setReminderCustomModal");
    },
    fetchTimelines() {
      this.setLoadingState(true);
      reportService.getAppointmentsWithReports(this.getUserInfo.id, "lab").then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.medicationList = [...data];
            if (this.itemLength) {
              this.medicationList = [];
              for (let index = 0; index < this.itemLength; index++) {
                this.medicationList.push({ ...data[0], id: index + 1 });
              }
            }
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
    viewDetails(medication) {
      this.setSelectedMedication(medication);
      this.navigateTo("My Medication Details");
    },
  },
};
</script>