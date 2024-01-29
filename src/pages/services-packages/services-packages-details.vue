<template>
  <div
    class="doctor-list-container standard-width page-body-container promotions-details-conatiner"
  >
    <back-navigation
      :title="$t('servicesPackages.title')"
      :backLink="'Services Packages List'"
    />
    <template v-if="getLoading">
      <div class="no-data">{{ $t("loading") }}</div>
    </template>
    <template v-else-if="!packageInfo">
      <div class="no-data">{{ $t("noData") }}</div>
    </template>
    <template v-else>
      <b-card
        header-tag="div"
        no-body
        class="ash-card simple card-wizard transparent"
      >
        <b-card-body class="p-0">
          <div class="promotion-detail">
            <div class="package-information">
              <div class="thumbnain-picture">
                <img
                  :src="getImageUrl(packageInfo.thumbnail)"
                  alt="package-thumbnail"
                />
              </div>
              <div class="package-info-section">
                <div class="title">
                  {{ $t("servicesPackages.packageTitle") }}
                </div>
                <div class="value">
                  {{ packageInfo[getLocaleKey("title")] }}
                </div>
                <div class="title">{{ $t("servicesPackages.price") }}</div>
                <div class="value">
                  {{ translateNumber(packageInfo.price) + " " + $t("sar") }}
                </div>
              </div>
            </div>
            <div class="promotion-detail-section">
              <div class="title">{{ $t("servicesPackages.description") }}</div>
              <div class="value">
                {{ packageInfo[getLocaleKey("description")] }}
              </div>
            </div>
            <div class="promotion-detail-section">
              <div class="title">
                {{ $t("servicesPackages.serviceDetails") }}
              </div>
              <div class="value">
                <div class="appointment-list mt-3 mx-2">
                  <div
                    class="appointment-list-item"
                    v-for="(item, pindex) in packageInfo.services"
                    :key="'package-' + pindex"
                  >
                    <div class="service-details bg-tertiary">
                      <div class="details-title">
                        {{ item[getLocaleKey("name")] }} {{ item.count }}
                      </div>
                      <div class="details-title">
                        {{ item[getLocaleKey("description")] }}
                      </div>
                      <div class="">
                        <!-- <div class="details-title sub-service-title fw-bold">
                          {{ $t("servicesPackages.subserviceDetails") }}
                        </div> -->
                        <div
                          class="details-value"
                          v-for="(item, pindex) in item.sub_services"
                          :key="'package-' + pindex"
                        >
                          <div>
                            {{ item[getLocaleKey("name")] }} ({{ item.count }})
                          </div>
                          <div>
                            {{ item[getLocaleKey("description")] }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-card>
      <div class="button-group" v-if="!isBooked">
        <button @click="makePayment" class="btn btn-secondary">
          {{ $t("servicesPackages.bookPackage") }}
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { cmsPagesService } from "../../services";
export default {
  data() {
    return {
      packageDetails: null,
      packageInfo: null,
      isBooked: false,
    };
  },
  computed: {
    ...mapGetters("servicesPackages", ["getSelectedPackage"]),
  },
  mounted() {
    this.isBooked = this.$route.params.method == "booked";
    if (!this.getSelectedPackage) {
      this.navigateTo("Services Packages List");
      return;
    }
    this.initializeData();
  },
  methods: {
    ...mapActions("appointment", ["setPaymentObject"]),
    initializeData() {
      this.packageInfo = this.getSelectedPackage;
    },
    async makePayment() {
      if (this.packageInfo.term_condition_id) {
        let cmsResponse = await cmsPagesService.fetchCmsPages(
          "?id=" + this.packageInfo.term_condition_id
        );
        if (
          cmsResponse.data &&
          cmsResponse.data.status &&
          cmsResponse.data.data &&
          cmsResponse.data.data.items &&
          cmsResponse.data.data.items.length
        ) {
          let cmsObject = cmsResponse.data.data.items[0];

          let obj = {
            amount: this.getSelectedPackage.price,
            appointment_id: this.getSelectedPackage.id,
            otherPayment: true,
          };
          this.setPaymentObject(obj);
          this.navigateTo("Services Packages Details Terms", {
            id: this.getSelectedPackage.term_condition_id,
          });
          return;
          this.htmlModal(cmsObject.long_text).then((res) => {
            console.log(res);
            if (res.value) {
              let obj = {
                amount: this.getSelectedPackage.price,
                appointment_id: this.getSelectedPackage.id,
                otherPayment: true,
              };
              this.setPaymentObject(obj);
              this.navigateTo("Select Payment Method", { method: "package" });
            }
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.back-btn {
  position: absolute;
  top: 3rem;
  z-index: 1;
}
.text-content {
  font-size: 1.125rem;
  color: #8696b8;
  margin-block: 1.5rem;
}
.educational-content {
  padding-block-end: 5rem;
  :deep * {
    font-family: "DiodrumArabicMedium" !important;
  }
}

.promotions-details-conatiner .promotion-detail-section {
  padding-top: 2rem;
  padding-bottom: 1.5rem;
}

.main-banner {
  .background-image {
    .main-banner-text {
      position: relative;
      inset: unset;
      padding-block-start: 2rem;
      width: 100%;
      font-size: 1.625rem;
      line-height: 1.4em;
    }
  }
}
@media (min-width: 991px) {
  .educational-content {
    padding-block-start: 1.5rem;
  }
  .main-banner {
    .background-image {
      isolation: isolate;
      height: 500px;
      display: flex;
      .main-banner-text {
        width: 45%;
        padding-block-end: 2rem;
        font-size: 2.625rem;
      }
      > img {
        position: absolute;
        z-index: -1;
        height: 100%;
      }
    }
  }
}
@media (max-width: 992px) {
  .main-banner {
    .background-image {
      > img {
        min-height: auto;
      }
    }
  }
}
</style>