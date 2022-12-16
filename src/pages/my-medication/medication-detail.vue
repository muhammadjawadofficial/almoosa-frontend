<template>
  <div
    class="
      appointment-detail-container
      medication-detail-container
      page-body-container
      standard-width
    "
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
                      getSelectedMedication.title +
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
              <div class="appointment-detail--type">
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
                <div class="appointment-detail--value--details mt-3">
                  <span
                    v-if="getSelectedMedication.morning_reminder"
                    class="btn btn-secondary btn-pill"
                    >{{
                      translateNumber(
                        removeSecondsFromTimeString(
                          getSelectedMedication.morning_reminder
                        )
                      )
                    }}
                  </span>
                  <span
                    v-if="getSelectedMedication.afternoon_reminder"
                    class="btn btn-dark-blue btn-pill"
                    >{{
                      translateNumber(
                        removeSecondsFromTimeString(
                          getSelectedMedication.afternoon_reminder
                        )
                      )
                    }}
                  </span>
                  <span
                    v-if="getSelectedMedication.evening_reminder"
                    class="btn btn-primary btn-pill"
                    >{{
                      translateNumber(
                        removeSecondsFromTimeString(
                          getSelectedMedication.evening_reminder
                        )
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="appointment--action-buttons">
          <button class="btn btn-secondary" @click="requestRefill">
            {{ $t("myMedication.requestRefill") }}
          </button>
        </div>
      </div>
    </div>
    <set-reminder-modal
      :medicationId="getSelectedMedication.id"
      :selectedMorningSlot="getSelectedMedication.morning_reminder"
      :selectedAfternoonSlot="getSelectedMedication.afternoon_reminder"
      :selectedEveningSlot="getSelectedMedication.evening_reminder"
      @update="handleSlotUpdate"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SetReminderModal from "./set-reminder-modal.vue";
export default {
  components: {
    SetReminderModal,
  },
  computed: {
    ...mapGetters("myMedication", ["getSelectedMedication"]),
  },
  mounted() {
    if (!this.getSelectedMedication) {
      this.navigateTo("My Medication List");
    }
  },
  methods: {
    ...mapActions("myMedication", ["setSelectedMedication"]),
    setReminder() {
      this.$bvModal.show("setReminderCustomModal");
    },
    handleSlotUpdate(slots) {
      this.setSelectedMedication({ ...this.getSelectedMedication, ...slots });
    },
    requestRefill() {
      this.successIconModal(
        this.$t("myMedication.modal.requestTitle"),
        this.$t("myMedication.modal.requestText"),
        "m-pill",
        this.$t("myMedication.modal.requestButton")
      ).then((modalResponse) => {
        if (modalResponse.value) {
          this.successIconModal(
            this.$t("myMedication.modal.requestTitle"),
            this.$t("myMedication.modal.requestSuccess"),
            "m-pill"
          ).then(() => {
            this.navigateTo("My Medication List");
          });
        }
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