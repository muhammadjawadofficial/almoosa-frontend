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
      class="
        swal2-container swal2-center
        swal-custom-icon-top-padding
        swal2-shown
        custom-swal2
      "
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
          <div id="swal2-content" style="display: block">
            <div class="daypart-section">
              <div class="logo">
                <img src="../../assets/images/alarm-clock.svg" alt="" />
              </div>
              <div class="content">
                <div class="title w500">Morning</div>
                <div class="sub-title">Select from morning slots</div>
                <div class="reminder-timeslots">
                  <div
                    class="timeslot secondary"
                    :class="{
                      active:
                        timeslot.reminder_time == selectedTimeslot.morning,
                    }"
                    v-for="timeslot in timeslots.morning"
                    @click="selectedTimeslot.morning = timeslot.reminder_time"
                    :key="'morning-timeslot-' + timeslot.id"
                  >
                    {{
                      translateNumber(
                        removeSecondsFromTimeString(timeslot.reminder_time)
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div class="daypart-section">
              <div class="logo">
                <img src="../../assets/images/alarm-clock.svg" alt="" />
              </div>
              <div class="content">
                <div class="title w500">Afternoon</div>
                <div class="sub-title">Select from afternoon slots</div>
                <div class="reminder-timeslots">
                  <div
                    class="timeslot dark-blue"
                    :class="{
                      active:
                        timeslot.reminder_time == selectedTimeslot.afternoon,
                    }"
                    v-for="timeslot in timeslots.afternoon"
                    :key="'afternoon-timeslot-' + timeslot.id"
                    @click="selectedTimeslot.afternoon = timeslot.reminder_time"
                  >
                    {{
                      translateNumber(
                        removeSecondsFromTimeString(timeslot.reminder_time)
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div class="daypart-section">
              <div class="logo">
                <img src="../../assets/images/alarm-clock.svg" alt="" />
              </div>
              <div class="content">
                <div class="title w500">Evening</div>
                <div class="sub-title">Select from evening slots</div>
                <div class="reminder-timeslots">
                  <div
                    class="timeslot primary"
                    :class="{
                      active:
                        timeslot.reminder_time == selectedTimeslot.evening,
                    }"
                    v-for="timeslot in timeslots.evening"
                    :key="'evening-timeslot-' + timeslot.id"
                    @click="selectedTimeslot.evening = timeslot.reminder_time"
                  >
                    {{
                      translateNumber(
                        removeSecondsFromTimeString(timeslot.reminder_time)
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
            Set Reminder</button
          ><button
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
    "medicationId",
  ],
  data() {
    return {
      timeslots: {
        morning: [],
        afternoon: [],
        evening: [],
      },
      selectedTimeslot: {
        morning: null,
        afternoon: null,
        evening: null,
      },
    };
  },
  watch: {
    selectedMorningSlot: function (val) {
      this.selectedTimeslot.morning = val;
    },
    selectedAfternoonSlot: function (val) {
      this.selectedTimeslot.afternoon = val;
    },
    selectedEveningSlot: function (val) {
      this.selectedTimeslot.evening = val;
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
      this.setLoadingState(true);
      let obj = {
        morning_reminder: this.selectedTimeslot.morning,
        afternoon_reminder: this.selectedTimeslot.afternoon,
        evening_reminder: this.selectedTimeslot.evening,
      };
      medicationService.setReminder(this.medicationId, obj).then(
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
        () => {
          this.setLoadingState(false);
          this.failureToast();
        }
      );
    },
    fetchTimeslots() {
      this.setLoadingState(true);
      medicationService.getReminderSlots().then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.timeslots.morning = data.filter(
              (x) => x.day_part == "morning"
            );
            this.timeslots.evening = data.filter(
              (x) => x.day_part == "evening"
            );
            this.timeslots.afternoon = data.filter(
              (x) => x.day_part == "afternoon"
            );
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
    resetSelection() {
      this.selectedTimeslot = {
        morning: this.selectedMorningSlot,
        afternoon: this.selectedAfternoonSlot,
        evening: this.selectedEveningSlot,
      };
    },
  },
};
</script>

<style>
</style>