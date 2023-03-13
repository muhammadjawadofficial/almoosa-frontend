<template>
  <b-modal
    ref="setReminder"
    id="setReminderCustomModal"
    centered
    hide-header
    hide-footer
    no-fade
    body-class="transparent"
    @show="resetSelection"
  >
    <div
      class="swal2-container swal2-center swal-custom-icon-top-padding swal2-shown custom-swal2"
      style="overflow-y: auto"
    >
      <div
        aria-labelledby="swal2-title"
        aria-describedby="swal2-content"
        class="swal2-popup swal2-modal swal2-show"
        tabindex="-1"
        role="dialog"
        aria-live="assertive"
        aria-modal="true"
        style="display: flex"
      >
        <div class="swal2-header">
          <img
            class="swal2-image"
            src="../../assets/images/m-pill.svg"
            alt=""
            style="display: flex"
          />
          <h2 class="swal2-title" id="swal2-title" style="display: flex"></h2>
        </div>
        <div class="swal2-content">
          <div id="swal2-content" class="row" style="">
            <div class="daypart-section col-sm-12">
              <div class="logo">
                <img src="../../assets/images/alarm-clock.svg" alt="" />
              </div>
              <div class="content">
                <div class="title w500">
                  {{ $t("dosage") + " " + translateNumber(1) }}
                </div>
                <div class="reminder-timeslots">
                  <multiselect
                    v-model="selectedTimeslot.morning"
                    :options="timeslots.morning"
                    :preselectFirst="true"
                    @input="itemSelected"
                    :allowEmpty="false"
                    :placeholder="$t('selectOptionLabel')"
                    :selectLabel="''"
                    :selectedLabel="''"
                    :deselectLabel="''"
                  >
                    <template slot="singleLabel" slot-scope="props">
                      {{
                        translateNumber(
                          removeSecondsFromTimeString(props.option)
                        )
                      }}
                    </template>
                    <template slot="option" slot-scope="props">
                      {{
                        translateNumber(
                          removeSecondsFromTimeString(props.option)
                        )
                      }}
                    </template>
                  </multiselect>
                </div>
              </div>
            </div>
            <div class="daypart-section col-sm-12" v-if="numberOfDosage > 1">
              <div class="logo">
                <img src="../../assets/images/alarm-clock.svg" alt="" />
              </div>
              <div class="content">
                <div class="title w500">
                  {{ $t("dosage") + " " + translateNumber(2) }}
                </div>
                <div class="reminder-timeslots">
                  <div class="timeslot dark-blue">
                    {{
                      translateNumber(
                        removeSecondsFromTimeString(
                          selectedTimeslot.afternoon || "--:--"
                        )
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div class="daypart-section col-sm-12" v-if="numberOfDosage > 2">
              <div class="logo">
                <img src="../../assets/images/alarm-clock.svg" alt="" />
              </div>
              <div class="content">
                <div class="title w500">
                  {{ $t("dosage") + " " + translateNumber(3) }}
                </div>
                <div class="reminder-timeslots">
                  <div class="timeslot primary">
                    {{
                      translateNumber(
                        removeSecondsFromTimeString(
                          selectedTimeslot.evening || "--:--"
                        )
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div class="daypart-section col-sm-12" v-if="numberOfDosage > 3">
              <div class="logo">
                <img src="../../assets/images/alarm-clock.svg" alt="" />
              </div>
              <div class="content">
                <div class="title w500">
                  {{ $t("dosage") + " " + translateNumber(4) }}
                </div>
                <div class="reminder-timeslots">
                  <div class="timeslot tertiary">
                    {{
                      translateNumber(
                        removeSecondsFromTimeString(
                          selectedTimeslot.night || "--:--"
                        )
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="swal2-actions">
          <button
            type="button"
            class="swal2-confirm swal2-styled"
            aria-label=""
            style="
              display: inline-block;
              background-color: rgb(68, 102, 242);
              border-left-color: rgb(85, 176, 71);
              border-right-color: rgb(85, 176, 71);
            "
            @click="setReminder"
          >
            {{ $t("myMedication.setReminder") }}
          </button>
          <button
            type="button"
            class="swal2-cancel swal2-styled"
            aria-label=""
            style="display: none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from "vuex";
import { medicationService } from "../../services";
export default {
  props: [
    "selectedMorningSlot",
    "selectedAfternoonSlot",
    "selectedEveningSlot",
    "selectedNightSlot",
    "medicationId",
    "numberOfDosage",
  ],
  data() {
    return {
      timeslots: {
        morning: [],
        afternoon: [],
        evening: [],
        night: [],
      },
      selectedTimeslot: {
        morning: null,
        afternoon: null,
        evening: null,
        night: null,
      },
    };
  },
  watch: {
    selectedMorningSlot: function (val) {
      this.selectedTimeslot.morning = this.getHrMin(val);
    },
    selectedAfternoonSlot: function (val) {
      this.selectedTimeslot.afternoon = this.getHrMin(val);
    },
    selectedEveningSlot: function (val) {
      this.selectedTimeslot.evening = this.getHrMin(val);
    },
    selectedNightSlot: function (val) {
      this.selectedTimeslot.night = this.getHrMin(val);
    },
  },
  computed: {
    ...mapGetters("myMedication", ["getSelectedMedication"]),
  },
  mounted() {
    this.fetchTimeslots();
  },
  methods: {
    setReminder() {
      if (this.medicationId) {
        this.updateReminder();
      } else {
        this.createMedicationWithReminder();
      }
    },
    createMedicationWithReminder() {
      this.setLoadingState(true);
      let obj = {
        title: this.getSelectedMedication.variation,
        variation: this.getSelectedMedication.variation,
        description: this.getSelectedMedication.description,
        appointment_id: this.getSelectedMedication.id,
        start_date: this.getSelectedMedication.start_date,
        end_date: this.getSelectedMedication.end_date,
        morning_reminder: this.selectedTimeslot.morning,
      };
      if (this.numberOfDosage > 1) {
        obj.afternoon_reminder = this.selectedTimeslot.afternoon;
      }
      if (this.numberOfDosage > 2) {
        obj.evening_reminder = this.selectedTimeslot.evening;
      }
      if (this.numberOfDosage > 3) {
        obj.night_reminder = this.selectedTimeslot.night;
      }
      medicationService.createMedicationWithReminder(obj).then(
        (response) => {
          if (response.data.status) {
            this.$emit("update", { id: response.data.data.id, ...obj });
            this.$refs["setReminder"].hide();
            this.successIconModal(
              this.$t("myMedication.modal.reminderTitle"),
              this.$t("myMedication.modal.reminderText"),
              "m-pill"
            );
          } else {
            this.failureToast(response.data.messsage);
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
        }
      );
    },
    updateReminder() {
      this.setLoadingState(true);
      let obj = {
        morning_reminder: this.selectedTimeslot.morning,
      };
      if (this.numberOfDosage > 1) {
        obj.afternoon_reminder = this.selectedTimeslot.afternoon;
      }
      if (this.numberOfDosage > 2) {
        obj.evening_reminder = this.selectedTimeslot.evening;
      }
      if (this.numberOfDosage > 3) {
        obj.night_reminder = this.selectedTimeslot.night;
      }
      medicationService.updateReminder(obj, this.medicationId).then(
        (response) => {
          if (response.data.status) {
            this.$emit("update", obj);
            this.$refs["setReminder"].hide();
            this.successIconModal(
              this.$t("myMedication.modal.reminderTitle"),
              this.$t("myMedication.modal.reminderText"),
              "m-pill"
            );
          } else {
            this.failureToast(response.data.messsage);
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
        }
      );
    },
    itemSelected(item) {
      let gap = 0;
      if (this.numberOfDosage == 2) {
        gap = 12;
      } else if (this.numberOfDosage == 3) {
        gap = 8;
      } else if (this.numberOfDosage == 4) {
        gap = 6;
      }

      this.selectedTimeslot = {
        morning: null,
        afternoon: null,
        evening: null,
        night: null,
      };

      const getHr = (time) => {
        if (!time) return;
        return parseInt(time.split(":")[0]);
      };

      const hr = getHr(item);

      this.selectedTimeslot.morning = item;
      if (this.numberOfDosage > 1) {
        const time = hr + gap;
        if (time > 24) {
          return;
        }
        this.selectedTimeslot.afternoon = time + ":00";
      }
      if (this.numberOfDosage > 2) {
        const time = hr + gap * 2;
        if (time > 24) {
          return;
        }
        this.selectedTimeslot.evening = time + ":00";
      }
      if (this.numberOfDosage > 3) {
        const time = hr + gap * 3;
        if (time > 24) {
          return;
        }
        this.selectedTimeslot.night = time + ":00";
      }
    },
    fetchTimeslots() {
      this.timeslots.morning = [];
      for (let index = 0; index < 24; index++) {
        const hour = index;
        const parseHour = hour < 10 ? "0" + hour : hour;
        this.timeslots.morning.push(parseHour + ":00");
      }
      this.selectedTimeslot.morning = this.getHrMin(this.selectedMorningSlot);
      this.selectedTimeslot.afternoon = this.getHrMin(
        this.selectedAfternoonSlot
      );
      this.selectedTimeslot.evening = this.getHrMin(this.selectedEveningSlot);
      this.selectedTimeslot.night = this.getHrMin(this.selectedNightSlot);
    },
    getHrMin(time) {
      if (!time) return;
      const split = time.split(":");
      return split[0] + ":" + split[1];
    },
    resetSelection() {
      this.selectedTimeslot = {
        morning: this.getHrMin(this.selectedMorningSlot),
        afternoon: this.getHrMin(this.selectedAfternoonSlot),
        evening: this.getHrMin(this.selectedEveningSlot),
        night: this.getHrMin(this.selectedNightSlot),
      };
    },
    handleReminderClick(type, time) {
      if (this.selectedTimeslot[type] == time) {
        this.selectedTimeslot[type] = null;
        return;
      }
      this.selectedTimeslot[type] = time;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  gap: 1rem;
  .title {
    width: 5rem;
  }
}
.multiselect {
  &:deep(.multiselect__single) {
    text-align: center;
    // padding-inline-start: 40px;
  }
}
.daypart-section {
  align-items: center;
  margin-top: 0.5rem;
}
.reminder-timeslots {
  .timeslot {
  }
}
</style>