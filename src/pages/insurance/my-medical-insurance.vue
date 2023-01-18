<template>
  <div
    class="
      my-medical-insurance-container
      standard-width
      page-body-container
      login-form
    "
  >
    <back-navigation :title="$t('insurance.medicalInsurance')" />

    <div class="row mt-3">
      <div class="col-sm-12" style="--numberOfTabs: 2">
        <b-card
          header-tag="div"
          no-body
          class="ash-card card-top-navigation tabs-start"
        >
          <div
            class="add-new-insurance"
            @click="navigateTo('Add New Insurance')"
          >
            <div class="icon">
              <img src="../../assets/images/add.svg" alt="add" />
            </div>
            <div class="text">
              {{ $t("insurance.addNewInsurance") }}
            </div>
          </div>
          <b-card-body class="mt-0">
            <b-tabs pills slot="header" class="tabbed-card">
              <b-tab :title="$t('insurance.myInsurance')">
                <div
                  class="appointment-list"
                  :class="{
                    noData: !insuranceList || !insuranceList.length,
                  }"
                >
                  <div
                    class="appointment-list-item"
                    v-for="insurance in insuranceList"
                    :key="'upcoming-appointment-id' + insurance.id"
                  >
                    <div class="appointment-card success">
                      <div class="doctor-avatar transparent">
                        <shield-bg-svg />
                      </div>
                      <div class="appointment-details">
                        <div class="doctor-name w600">
                          {{ $t("insurance.medicalSupport") }}
                        </div>
                        <div class="doctor-speciality">
                          {{ insurance.medical_support || "N/A" }}
                        </div>
                        <div class="doctor-name w600">
                          {{ $t("insurance.policyNum") }}
                        </div>
                        <div class="doctor-speciality">
                          {{ insurance.policy_number || "N/A" }}
                        </div>
                        <div class="doctor-name w600">
                          {{ $t("insurance.planDetails") }}
                        </div>
                        <div class="doctor-speciality">
                          {{ insurance.plan_details || "N/A" }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="loading no-data" v-if="!insuranceList">
                  {{ $t("loading") }}
                </div>
                <div class="no-data" v-else-if="!insuranceList.length">
                  {{ $t("noData") }}
                </div>
              </b-tab>
              <b-tab :title="$t('insurance.approvals')">
                <div
                  class="appointment-list"
                  :class="{
                    noData: !insuranceServices || !insuranceServices.length,
                  }"
                >
                  <div
                    class="appointment-list-item"
                    v-for="(insurance, index) in insuranceServices"
                    :key="'upcoming-appointment-id' + index + insurance.id"
                  >
                    <div
                      class="appointment-card"
                      :class="getStatusClass(insurance.approval_status)"
                    >
                      <div class="doctor-avatar transparent">
                        <shield-bg-svg />
                      </div>
                      <div class="appointment-details">
                        <div class="doctor-name w600">
                          {{ insurance.service_name }}
                        </div>
                        <div class="doctor-speciality">
                          {{ insurance.medical_support }}
                        </div>
                        <div class="last-update-on w200">
                          {{ $t("insurance.lastUpdate") }}
                        </div>
                        <div class="date-time w200">
                          {{ getLongDateAndTimeFromDate(insurance.updated_at) }}
                        </div>
                        <button class="btn start-call-button">
                          {{
                            $t(
                              "approvalStatus." +
                                insurance.approval_status.toLowerCase()
                            )
                          }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="loading no-data" v-if="insuranceServices == null">
                  {{ $t("loading") }}
                </div>
                <div class="no-data" v-else-if="!insuranceServices.length">
                  {{ $t("noData") }}
                </div>
              </b-tab>
            </b-tabs>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { insuranceService } from "../../services";
export default {
  data() {
    return {
      insuranceList: null,
      insuranceServices: null,
    };
  },
  mounted() {
    this.getInsurances();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    getApprovedInsurances() {
      return (
        this.insuranceList &&
        this.insuranceList.filter((x) => x.status == "approved")
      );
    },
  },
  methods: {
    getInsurances() {
      this.setLoadingState(true);
      Promise.all([
        insuranceService.fetchInsurances(this.getUserInfo.mrn_number),
        insuranceService.fetchInsuranceServices(this.getUserInfo.mrn_number),
      ])
        .then((response) => {
          let myInsurances = response[0];
          let insuranceServices = response[1];
          if (myInsurances.data.status) {
            this.insuranceList = myInsurances.data.data.items;
          } else {
            this.failureToast(myInsurances.data.message);
          }
          if (insuranceServices.data.status) {
            this.insuranceServices = insuranceServices.data.data.items;
          } else {
            this.failureToast(insuranceServices.data.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error)) this.failureToast();
        })
        .finally(() => {
          this.setLoadingState(false);
        });
    },
    getStatusClass(statusTemp) {
      let status = statusTemp || "";
      if (
        status.toLowerCase() == "unpaid" ||
        status.toLowerCase().includes("approval")
      )
        return "warning";
      else if (status.toLowerCase() == "rejected") return "danger";
      else return "success";
    },
  },
};
</script>
<style lang="scss" scoped>
.add-new-insurance {
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: absolute;
  top: calc(var(--pill-height) * -1);
  right: 0;
  cursor: pointer;
  .icon {
    width: 2.5rem;
    height: 2.5rem;
    img {
      width: 100%;
    }
  }
  @media (max-width: 768px) {
    position: relative;
    inset: unset;
    padding: 2rem 2rem 0;
  }
}
.card.ash-card
  .card-body
  .appointment-list-item
  .appointment-card
  .appointment-details {
  .doctor-name {
    color: #0f425e;
    margin-top: 1rem;
    font-size: 1.375rem;
  }
  .doctor-speciality {
    font-size: 1.188rem;
  }
  .last-update-on {
    margin-top: 1rem;
    font-size: 1.125rem;
  }
  .date-time {
    font-size: 1rem;
    color: #aeaeb4;
  }
  .start-call-button {
    text-transform: capitalize;
  }
}
</style>