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
          <h2 class="swal2-title" id="swal2-title" style="display: flex">
            Refill Request
          </h2>
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
                      active: timeslot.id == selectedTimeslot.morning,
                    }"
                    v-for="timeslot in timeslots.morning"
                    @click="selectedTimeslot.morning = timeslot.id"
                    :key="'morning-timeslot-' + timeslot.id"
                  >
                    {{ timeslot.value }}
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
                      active: timeslot.id == selectedTimeslot.afternoon,
                    }"
                    v-for="timeslot in timeslots.afternoon"
                    :key="'afternoon-timeslot-' + timeslot.id"
                    @click="selectedTimeslot.afternoon = timeslot.id"
                  >
                    {{ timeslot.value }}
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
                      active: timeslot.id == selectedTimeslot.evening,
                    }"
                    v-for="timeslot in timeslots.evening"
                    :key="'evening-timeslot-' + timeslot.id"
                    @click="selectedTimeslot.evening = timeslot.id"
                  >
                    {{ timeslot.value }}
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
export default {
  props: [
    "selectedMorningSlot",
    "selectedAfternoonSlot",
    "selectedEveningSlot",
  ],
  data() {
    return {
      timeslots: {
        morning: [
          { id: 1, value: "08:00 AM" },
          { id: 2, value: "09:00 AM" },
          { id: 3, value: "10:00 AM" },
        ],
        afternoon: [
          { id: 1, value: "12:00 PM" },
          { id: 2, value: "01:00 PM" },
          { id: 3, value: "02:00 PM" },
        ],
        evening: [
          { id: 1, value: "08:00 PM" },
          { id: 2, value: "09:00 PM" },
          { id: 3, value: "10:00 PM" },
        ],
      },
      selectedTimeslot: {
        morning: null,
        afternoon: null,
        evening: null,
      },
    };
  },
  methods: {
    setReminder() {
      this.$refs["setReminder"].hide();
    },
    resetSelection() {
      this.selectedTimeslot = {
        morning: this.selectedMorningSlot,
        afternoon: this.selectedAfternoonSlot,
        evening: this.selectedEveningSlot,
      };
      console.log(this.selectedTimeslot);
    },
  },
};
</script>

<style>
</style>