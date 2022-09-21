<template>
  <div
    class="
      appointment-detail-container
      medication-detail-container
      page-body-container
      standard-width
    "
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
                  <div class="title">Desloratidine 500 MG</div>
                  <div class="subTitle w200">Oral - 2 Times a day</div>
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip exea commodo unt in culpa qui officia
                  deserunt mollit id est laborum.Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip exea
                  commodo unt in culpa qui officia deserunt mollit id est
                  laborum.
                </div>
              </div>
              <div class="appointment-detail--sepecialist mt-5">
                <div class="appointment-detail--label">
                  {{ $t("myMedication.time") }}
                </div>
                <div class="appointment-detail--value">Three times a day</div>
                <div class="appointment-detail--value--details mt-3">
                  <span class="btn btn-secondary btn-pill">{{
                    translateNumber("11:00 AM")
                  }}</span>
                  <span class="btn btn-dark-blue btn-pill">{{
                    translateNumber("02:00 PM")
                  }}</span>
                  <span class="btn btn-primary btn-pill">{{
                    translateNumber("08:00 PM")
                  }}</span>
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
      :selectedMorningSlot="1"
      :selectedAfternoonSlot="3"
      :selectedEveningSlot="2"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
    setReminder() {
      this.$bvModal.show("setReminderCustomModal");
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
    ::v-deep {
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