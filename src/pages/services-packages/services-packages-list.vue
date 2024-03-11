<template>
  <div class="doctor-list-container page-body-container standard-width">
    <back-navigation :title="$t('servicesPackages.title')" />
    <div class="row">
      <div class="col-sm-12" style="--numberOfTabs: 2">
        <b-card
          header-tag="div"
          no-body
          class="ash-card card-wizard card-top-navigation"
        >
          <b-card-body>
            <b-tabs
              pills
              slot="header"
              class="tabbed-card"
              @activate-tab="setActiveTab"
            >
              <b-tab
                :title="$t('servicesPackages.packageList')"
                :active="activeTab == 0"
              >
                <div class="doctor-card-container">
                  <template
                    v-if="
                      servicesPackagesContent && servicesPackagesContent.length
                    "
                  >
                    <div
                      class="doctor-card"
                      v-for="content in servicesPackagesContent"
                      :key="'doctor-card-' + content.id"
                    >
                      <div class="doctor-image">
                        <img
                          :src="getImageUrl(content.thumbnail)"
                          alt="doctor-image"
                        />
                      </div>
                      <div class="doctor-name">
                        {{ content[getLocaleKey("title")] }}
                      </div>
                      <div class="doctor-speciality">
                        {{ content[getLocaleKey("description")] }}
                      </div>
                      <div class="doctor-name font-secondary mt-auto mb-3">
                        {{ $t("sar") + " " + translateNumber(content.price) }}
                      </div>
                      <button
                        class="btn btn-primary make-appointment"
                        @click="setSelectedContent(content)"
                      >
                        {{ $t("servicesPackages.viewDetails") }}
                      </button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="no-data">{{ $t("noData") }}</div>
                  </template>
                </div>
              </b-tab>
              <b-tab
                :title="$t('servicesPackages.bookedPackages')"
                :active="activeTab == 1"
              >
                <div class="doctor-card-container">
                  <template
                    v-if="bookedPackagesList && bookedPackagesList.length"
                  >
                    <div
                      class="doctor-card"
                      v-for="content in bookedPackagesList"
                      :key="'doctor-card-' + content.id"
                      :class="{
                        partial: content.transaction_status != 'completed',
                      }"
                    >
                      <div class="doctor-image">
                        <img
                          :src="getImageUrl(content.package.thumbnail)"
                          alt="doctor-image"
                        />
                      </div>
                      <div class="doctor-name">
                        {{ content.package[getLocaleKey("title")] }}
                      </div>
                      <div class="doctor-speciality">
                        {{ content.package[getLocaleKey("description")] }}
                      </div>
                      <div class="doctor-name font-secondary">
                        {{
                          $t("sar") +
                          " " +
                          translateNumber(
                            content.transaction_status == "completed"
                              ? content.amount
                              : content.package.price
                          )
                        }}
                      </div>
                      <div class="doctor-speciality font-secondary">
                        {{
                          content.created_at
                            ? getLongDateAndTimeFromDateUtc(content.created_at)
                            : ""
                        }}
                      </div>
                      <button
                        class="btn btn-primary make-appointment"
                        @click="setSelectedContent(content, true)"
                      >
                        {{ $t("servicesPackages.viewDetails") }}
                      </button>
                      <div
                        class="card-side-banner"
                        v-if="content.transaction_status != 'completed'"
                      >
                        {{ $t("partialBooked") }}
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="no-data">
                      {{ $t("noData") }}
                    </div>
                  </template>
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
import { mapActions } from "vuex";
import { servicesPackagesService } from "../../services";
export default {
  data() {
    return {
      servicesPackagesContent: null,
      activeTab: 0,
      bookedPackagesList: null,
    };
  },
  mounted() {
    this.initializeData();
    this.fetchBookedPackages();
  },
  methods: {
    ...mapActions("servicesPackages", ["setSelectedPackage"]),
    setSelectedContent(content, is_booked = false) {
      this.setSelectedPackage(content);
      this.navigateTo(
        "Services Packages Details" + (is_booked ? " Booked" : ""),
        {
          method: is_booked ? "booked" : "available",
        }
      );
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    initializeData() {
      servicesPackagesService.fetchPackages().then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.servicesPackagesContent = [...data];
          } else {
            this.failureToast(response.data.messsage);
          }
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    fetchBookedPackages() {
      servicesPackagesService.fetchBookedPackages().then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.bookedPackagesList = [...data];
          } else {
            this.failureToast(response.data.messsage);
          }
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.doctor-list-container {
  .doctor-card-container {
    margin-top: 0;
    .doctor-card {
      border: none;
      margin-bottom: 0;
      background-color: var(--theme-tertiary);
      position: relative;
      .make-appointment {
        font-size: 1.25em;
        padding-block: 0.5em;
        margin-top: 1rem;
      }
      .doctor-image {
        height: 13.75rem;
        background: url(../../assets/images/loader.gif);
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
      .doctor-speciality {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  @media (max-width: 575px) and (min-width: 376px) {
    .card .card-body {
      padding: 2rem 0.5rem;
    }
    .doctor-card-container {
      gap: 1rem;
      .doctor-card {
        width: calc(50% - 0.5rem);
      }
    }
  }
}
.danger-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #ff0000;
  font-size: 1.5rem;
}
</style>