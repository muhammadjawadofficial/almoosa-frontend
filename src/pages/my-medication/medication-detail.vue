<template>
  <div
    class="appointment-detail-container medication-detail-container page-body-container standard-width"
    v-if="getSelectedMedication"
  >
    <back-navigation
      backLink="My Medication List"
      :title="$t('myMedication.medicationDetails')"
    />
    <div class="row">
      <div class="col-sm-12">
        <b-card header-tag="div" no-body class="ash-card card-rounded">
          <b-card-body class="mt-0">
            <div class="header-section">
              <div class="header-section--info">
                <div class="icon">
                  <pill-bg-svg />
                </div>
                <div class="name">
                  <div class="title">
                    {{
                      (getSelectedMedication.title || "") +
                      " " +
                      getSelectedMedication.variation
                    }}
                  </div>
                  <div class="subTitle w200">
                    {{ getSelectedMedication.description }}
                  </div>
                </div>
              </div>
              <div class="header-section--button">
                <button class="btn btn-primary btn-pill" @click="setReminder">
                  {{ $t("myMedication.setReminder") }}
                </button>
              </div>
            </div>
            <div class="appointment-detail mt-5">
              <div
                class="appointment-detail--type"
                v-if="getSelectedMedication.instructions"
              >
                <div class="appointment-detail--label">
                  {{ $t("myMedication.doctorInstruction") }}
                </div>
                <div class="appointment-detail--value">
                  {{ getSelectedMedication.instructions }}
                </div>
              </div>
              <div class="appointment-detail--sepecialist mt-5">
                <div class="appointment-detail--label">
                  {{ $t("myMedication.time") }}
                </div>
                <div class="appointment-detail--value">
                  {{ getSelectedMedication.description }}
                </div>
                <div class="appointment-detail--value--details mt-5">
                  <span
                    v-if="medicationReminders.morning_reminder"
                    class="btn btn-secondary btn-pill"
                    >{{
                      translateNumber(
                        removeSecondsFromTimeString(
                          medicationReminders.morning_reminder
                        )
                      )
                    }}
                  </span>
                  <span
                    v-if="medicationReminders.afternoon_reminder"
                    class="btn btn-dark-blue btn-pill"
                    >{{
                      translateNumber(
                        removeSecondsFromTimeString(
                          medicationReminders.afternoon_reminder
                        )
                      )
                    }}
                  </span>
                  <span
                    v-if="medicationReminders.evening_reminder"
                    class="btn btn-primary btn-pill"
                    >{{
                      translateNumber(
                        removeSecondsFromTimeString(
                          medicationReminders.evening_reminder
                        )
                      )
                    }}
                  </span>
                  <span
                    v-if="medicationReminders.night_reminder"
                    class="btn btn-warning btn-pill"
                    >{{
                      translateNumber(
                        removeSecondsFromTimeString(
                          medicationReminders.night_reminder
                        )
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>
    </div>
    <set-reminder-modal
      :medicationId="medicationReminders.id"
      :selectedMorningSlot="medicationReminders.morning_reminder"
      :selectedAfternoonSlot="medicationReminders.afternoon_reminder"
      :selectedEveningSlot="medicationReminders.evening_reminder"
      :selectedNightSlot="medicationReminders.night_reminder"
      :numberOfDosage="numberOfDosage"
      @update="handleSlotUpdate"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { medicationService } from "../../services";
import SetReminderModal from "./set-reminder-modal.vue";
export default {
  data() {
    return {
      numberOfDosage: 0,
      medicationReminders: {},
    };
  },
  components: {
    SetReminderModal,
  },
  computed: {
    ...mapGetters("myMedication", [
      "getSelectedMedication",
      "getSelectedMedicationSession",
    ]),
    ...mapGetters("user", ["getUserInfo"]),
  },
  mounted() {
    if (!this.getSelectedMedication) {
      this.navigateTo("My Medication List");
    }
    this.fetchMedicationDetail();
    this.calculateDosage();
  },
  methods: {
    ...mapActions("myMedication", ["setSelectedMedication"]),
    setReminder() {
      this.$bvModal.show("setReminderCustomModal");
    },
    handleSlotUpdate(slots) {
      this.medicationReminders = { ...slots };
    },
    calculateDosage() {
      let description = this.getSelectedMedication.description.toLowerCase();
      if (description.includes("once")) {
        this.numberOfDosage = 1;
      } else if (description.includes("twice")) {
        this.numberOfDosage = 2;
      } else if (description.includes("thrice")) {
        this.numberOfDosage = 3;
      } else if (description.includes("four times")) {
        this.numberOfDosage = 4;
      } else {
        this.numberOfDosage = 4;
      }
    },
    fetchMedicationDetail() {
      Promise.all([
        medicationService.getMedicationDetails(this.getSelectedMedication.id),
      ])
        .then((res) => {
          let response = res[0];
          if (response.data.status) {
            if (response.data.data.items && response.data.data.items.length) {
              // this.setSelectedMedication({
              //   ...this.getSelectedMedication,
              //   ...response.data.data.items[0],
              // });
              this.medicationReminders = response.data.data.items[0];
            }
          } else {
            this.failureToast(response.data.messsage);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.appointment-detail--value--details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.appointment-detail {
  &--label {
    font-size: 1.25rem;
    color: black;
  }

  &--value {
    color: #8696b8;
  }
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 700px) {
    &--button {
      width: 100%;
      text-align: end;
    }
  }

  @media (max-width: 325px) {
    justify-content: center;

    &--button {
      text-align: center;
    }
  }

  &--info {
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 325px) {
      flex-direction: column;
    }

    :deep {
      .svg-icon-fill {
        fill: var(--theme-default);
      }

      .svg-icon-fill-bg {
        fill: #fbfaf7;
      }
    }

    .icon {
      width: 109px;
      height: 109px;

      svg {
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
      }
    }

    .title {
      font-size: 1.813rem;
    }

    .subTitle {
      font-size: 1rem;
      color: #8696b8;
    }
  }
}
</style>