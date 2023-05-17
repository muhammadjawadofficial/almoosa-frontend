<template>
  <div
    class="my-medical-insurance-container standard-width page-body-container login-form"
  >
    <back-navigation :title="$t('familyMembers.title')" />

    <div class="row">
      <div class="col-sm-12" style="--numberOfTabs: 2">
        <b-card
          header-tag="div"
          no-body
          class="ash-card simple transparent my-0 card-top-navigation"
        >
          <div
            class="add-new-insurance"
            @click="navigateTo('Family Members Create')"
          >
            <div class="icon">
              <img src="../../assets/images/add.svg" alt="add" />
            </div>
            <div class="text">
              {{ $t("familyMembers.tapToAddFamilyMember") }}
            </div>
          </div>
          <b-card-body class="mt-0 px-0 pb-0">
            <div
              class="appointment-list"
              :class="{ noData: !familyMembers || !familyMembers.length }"
            >
              <div
                class="appointment-list-item"
                v-for="familyMember in familyMembers"
                :key="'upcoming-appointment-id' + familyMember.id"
              >
                <div
                  class="appointment-card"
                  :class="getStatusClass(familyMember.status)"
                >
                  <div class="doctor-avatar transparent">
                    <img
                      :src="getImageUrl(familyMember.dependent.photo)"
                      alt="photo"
                    />
                  </div>
                  <div class="appointment-details">
                    <div class="doctor-name w600">
                      {{ getFullName(familyMember.dependent) }}
                    </div>
                    <div class="doctor-speciality">
                      {{
                        $t("MRN") +
                        ": " +
                        (familyMember.dependent.mrn_number || "N/A")
                      }}
                    </div>
                    <div class="start-call-button">
                      <button
                        class="btn btn-conditional"
                        @click="loadFamilyMember(familyMember.dependent)"
                        v-if="familyMember.status == 'approved'"
                      >
                        {{ $t("familyMembers.switchProfile") }}
                      </button>
                      <button
                        class="btn btn-secondary ml-3"
                        @click="deleteFamilyMember(familyMember)"
                      >
                        {{ $t("familyMembers.deleteMember") }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="loading no-data" v-if="familyMembers == null">
              {{ $t("loading") }}
            </div>
            <div class="no-data" v-else-if="!familyMembers.length">
              {{ $t("noData") }}
            </div>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { familyMemberService, userService } from "../../services";
export default {
  data() {
    return {
      familyMembers: null,
    };
  },
  mounted() {
    this.getFamilyMembers();
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    getApprovedInsurances() {
      return (
        this.familyMembers &&
        this.familyMembers.filter((x) => x.status == "approved")
      );
    },
  },
  methods: {
    ...mapActions("user", ["setUserInfo"]),
    getFamilyMembers() {
      this.setLoadingState(true);
      familyMemberService
        .fetchFamilyMembers("?guardian_id=" + this.getUserInfo.id)
        .then(
          (response) => {
            if (response.data.status) {
              this.familyMembers = response.data.data.items;
            } else {
              this.failureToast(response.data.message);
            }
            this.setLoadingState(false);
          },
          (error) => {
            console.error(error);
            if (!this.isAPIAborted(error))
              this.failureToast(
                error.response &&
                  error.response.data &&
                  error.response.data.message
              );
            this.setLoadingState(false);
          }
        );
    },
    loadFamilyMember(familyMember) {
      if (!this.getUserInfo.isDependent) {
        userService.storeGuardianInfo({ ...this.getUserInfo });
      }
      this.setUserInfo(familyMember);
      this.navigateTo("default");
    },
    deleteFamilyMember(familyMember) {
      this.confirmIconModal(
        this.$t("familyMembers.confirmDelete"),
        " ",
        "m-info",
        this.$t("delete")
      ).then((res) => {
        if (res.value) {
          this.setLoadingState(true);
          familyMemberService.deleteFamilyMember(familyMember).then(
            (response) => {
              if (response.data.status) {
                this.successToast(this.$t("familyMembers.deletedSuccessfully"));
                this.getFamilyMembers();
              } else {
                this.failureToast(response.data.message);
                this.setLoadingState(false);
              }
            },
            (error) => {
              console.error(error);
              if (!this.isAPIAborted(error))
                this.failureToast(
                  error.response &&
                    error.response.data &&
                    error.response.data.message
                );
              this.setLoadingState(false);
            }
          );
        }
      });
    },
    getStatusClass(status) {
      if (status.toLowerCase() == "pending") return "warning";
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
  bottom: 100%;
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
    padding: 1rem 0 1rem;
  }
}
.card.ash-card .card-body {
  padding-top: 3rem;
  @media (max-width: 768px) {
    padding-top: 1rem;
  }
  .appointment-list-item .appointment-card .appointment-details {
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
      top: 0;
      bottom: 0;
      height: fit-content;
      margin: auto;
    }
  }
}
</style>