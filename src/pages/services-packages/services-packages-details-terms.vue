<template>
  <div
    class="login-card standard-width position-relative"
    :class="{ 'py-0': isWebView }"
  >
    <div class="terms-header">
      <back-navigation
        :title="$t('servicesPackages.title')"
        :backLink="'Services Packages Details'"
      />
      <button
        class="back-btn btn btn-secondary export-button"
        @click="viewTermsOnly ? downloadSavedTerms() : downloadTerms(true)"
      >
        {{ $t("download") }}
      </button>
    </div>
    <template v-if="viewTermsOnly">
      <iframe
        ref="terms_condition_iframe"
        height="400px"
        :src="getViewTermsOnly"
        frameborder="0"
      ></iframe>
    </template>
    <template v-else-if="termsAndConditionCMS">
      <div class="heading w600">
        {{ termsAndConditionCMS[getLocaleKey("page_title")] }}
        ({{ $t("draft") }})
      </div>
      <div class="sub-heading w200">
        {{ termsAndConditionCMS[getLocaleKey("long_title")] }}
      </div>
      <div
        class="cmsText"
        v-html="
          getComputedHTML(termsAndConditionCMS[getLocaleKey('long_text')])
        "
      ></div>
    </template>
    <template v-else>
      <div class="heading w600">
        {{ $t("termsAndConditions.privacyPolicy") }}
      </div>
      <div class="sub-heading w200">
        {{ $t("termsAndConditions.mustAgree") }}
      </div>
      <div
        class="cmsText"
        v-for="(terms, termIndex) in agreement"
        :key="getTitle(termIndex)"
      >
        <div class="text-heading" v-if="terms.title">
          {{ $t(getTitle(termIndex)) }}
        </div>
        <template v-if="terms.description">
          {{ $t(getDescription(termIndex)) }}
        </template>
        <template v-if="terms.points">
          <ul>
            <li
              v-for="(point, pointIndex) in terms.points"
              :key="getPoint(termIndex, pointIndex)"
            >
              {{ $t(getPoint(termIndex, pointIndex)) }}
              <ul v-if="point.sub">
                <li
                  v-for="subPoint in point.sub"
                  :key="getSubPoint(termIndex, pointIndex, subPoint)"
                >
                  {{ $t(getSubPoint(termIndex, pointIndex, subPoint)) }}
                </li>
              </ul>
            </li>
          </ul>
        </template>
      </div>
    </template>

    <div class="pt-5"></div>
    <template v-if="extraFields && extraFields.length">
      <div v-for="item in extraFields" :key="item.id">
        <div v-if="item.type == 'input'">
          <div class="sub-heading w200">
            <h3>
              {{ item[getLocaleKey("field_title")] }}
            </h3>
          </div>
          <div class="row mt-3">
            <div class="col-md-5">
              <b-input-group class="custom-login-input-groups">
                <!-- :state="registerFormState.companyName" -->
                <b-form-input
                  v-model="item.value"
                  :placeholder="item[getLocaleKey('field_title')]"
                ></b-form-input>
              </b-input-group>
            </div>
          </div>
        </div>
        <div v-if="item.type == 'textBox'">
          <div class="sub-heading w200">
            <h3>
              {{ item[getLocaleKey("field_title")] }}
            </h3>
          </div>
          <div class="row mt-3">
            <div class="col-md-5">
              <b-input-group class="custom-login-input-groups">
                <!-- :state="registerFormState.companyName" -->
                <b-form-textarea
                  v-model="item.value"
                  :placeholder="item[getLocaleKey('field_title')]"
                  :max="3"
                ></b-form-textarea>
              </b-input-group>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="!isWebView">
      <div class="agree-terms" v-if="!viewTermsOnly">
        <div class="mt-5">
          <b-form-checkbox
            id="rememberMe"
            v-model="agreeTerms"
            :state="!submitted || agreeTerms == true"
            name="rememberMe"
            class="mt-3 custom-checkbox"
          >
            {{ $t("termsAndConditions.iAgree") }}
          </b-form-checkbox>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 button-group" :class="{ 'mt-0': viewTermsOnly }">
          <button
            class="btn btn-primary"
            @click="
              viewTermsOnly
                ? navigateTo('Select Payment Method', { method: 'package' })
                : acceptTerms()
            "
          >
            {{ $t("continue") }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { cmsPagesService, servicesPackagesService } from "../../services";
export default {
  data() {
    return {
      bookedPackageTermsDownloadLink: false,
      extraFields: [],
      cmsContentFields: [],
      agreeTerms: false,
      submitted: false,
      username: "",
      mrn_number: "",
      viewTermsOnly: false,
      agreement: [
        {
          description: "description",
        },
        {
          title: "title",
          points: [{ sub: 0 }, { sub: 3 }],
        },
        {
          title: "title",
          points: [{ sub: 0 }, { sub: 4 }, { sub: 0 }, { sub: 0 }, { sub: 0 }],
        },
        {
          title: "title",
          points: [{ sub: 4 }, { sub: 0 }, { sub: 0 }],
        },
        {
          title: "title",
          description: "description",
        },
      ],
      termsAndConditionCMS: null,
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    ...mapGetters("servicesPackages", ["getSelectedPackage"]),
    getViewTermsOnly() {
      return `${process.env.VUE_APP_SERVER}api/v1/booked-package-terms/render/${this.currentAppLang}/${this.getSelectedPackage.id}/${this.getUserInfo.id}`;
    },
  },
  mounted() {
    this.setAppLanguageFromRoute();
    this.viewTermsOnly = this.$route.query.terms == "view";
    // set the height of the body to the height of the iframe
    if (this.viewTermsOnly) {
      this.$nextTick(() => {
        const iframe = this.$refs.terms_condition_iframe;
        iframe.onload = () => {
          iframe.style.height =
            iframe.contentWindow.document.body.scrollHeight + "px";
        };
      });
    }

    this.getCmsPage("terms_and_conditions");
    this.username = this.$route.query.username || "";
    this.mrn_number = this.$route.query.mrn || "";
    // this.getCmsContentFields();
  },
  methods: {
    ...mapActions("user", ["removeUserInfo"]),
    ...mapActions("user", ["updateUserInfo", "setUserInfo"]),
    getComputedHTML(html) {
      if (this.getUserInfo) {
        html = html.replace(
          "{mrn}",
          this.mrn_number || this.translateNumber(this.getUserInfo.mrn_number)
        );
        html = html.replace(
          "{username}",
          this.username || this.getFullName(this.getUserInfo)
        );
      }
      return html;
    },
    getTitle(index) {
      return "termsAndConditions.sections.section" + index + ".title";
    },
    getDescription(index) {
      return "termsAndConditions.sections.section" + index + ".description";
    },
    getPoint(index, pointIndex) {
      return (
        "termsAndConditions.sections.section" +
        index +
        ".points.point" +
        (pointIndex + 1)
      );
    },
    getSubPoint(index, pointIndex, subPointIndex) {
      return (
        "termsAndConditions.sections.section" +
        index +
        ".points.point" +
        (pointIndex + 1) +
        "-" +
        subPointIndex
      );
    },
    validateFields() {
      return !!this.agreeTerms;
    },
    acceptTerms() {
      const val = this.extraFields.some((item) => {
        const { value } = item;
        if (!value) {
          this.failureToast("Fields are required");
          return true;
        }
        return false;
      });
      if (!this.validateFields() && val == false) {
        this.failureToast("Please Accept Privacy Policy");
        return;
      }
      if (this.validateFields() && val == false) {
        this.downloadTerms(false);
        this.submitted = true;
        this.navigateTo("Select Payment Method", { method: "package" });
      }
    },
    getCmsPage(type) {
      cmsPagesService.fetchCmsPages("?id=" + this.$route.query.id).then(
        (res) => {
          if (res.data.status) {
            this.termsAndConditionCMS = res.data.data.items[0];
            this.extraFields = this.termsAndConditionCMS.cms_content_fields;
          } else {
            this.failureToast(res.data.message);
          }
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          console.error(error);
        }
      );
    },
    getCmsContentFields() {
      cmsPagesService.fetchCmsContentFields(this.$route.query.id).then(
        (res) => {
          if (res.data.status) {
            this.cmsContentFields = res.data.data.items;
            this.extraFields = this.cmsContentFields;
          } else {
            this.failureToast(res.data.message);
          }
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          console.error(error);
        }
      );
    },
    downloadTerms(save) {
      //  if (this.extraFields) {
      //    this.extraFields.map((item) => {
      //      const { value } = item
      //            if (!value) {
      //              this.failureToast("fields are required");
      //               return false
      //            }
      //        })
      //     }
      let data = {
        userId: this.getUserInfo.id,
        packageId: this.$route.query.packageId,
        contentId: this.$route.query.id,
        extraFields: this.extraFields.map((item) => {
          const { field_title, type, value, display_rank } = item;
          return {
            field_title,
            type,
            value,
            display_rank,
          };
        }),
        draft: save,
      };
      servicesPackagesService
        .postBookedPackageTerms(data)
        .then((res) => {
          if (res.data.status) {
            this.bookedPackageTermsDownloadLink =
              res.data.data.items[0].downloadlink;
            if (this.bookedPackageTermsDownloadLink && save) {
              const downloadLink = document.createElement("a");
              downloadLink.href = this.bookedPackageTermsDownloadLink;
              downloadLink.download = "Downoad-PDF";
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          } else {
            this.failureToast(res.data.message);
          }
        })
        .catch(() => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          console.error(error);
        });
    },
    downloadSavedTerms() {
      let data = `${this.currentAppLang}/${this.$route.query.packageId}/${this.getUserInfo.id}`;
      servicesPackagesService
        .fetchBookedPackageTermsDownloadLink(data)
        .then((res) => {
          if (res.data.status) {
            let bookedPackageTermsDownloadLink =
              res.data.data && res.data.data.items[0];
            if (bookedPackageTermsDownloadLink) {
              const downloadLink = document.createElement("a");
              downloadLink.href = bookedPackageTermsDownloadLink.downloadlink;
              downloadLink.download = "Downoad-PDF";
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          } else {
            this.failureToast(res.data.message);
          }
        })
        .catch((error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
          console.error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.heading {
  text-transform: uppercase;
  font-size: 2.938rem;
  color: var(--theme-default);
  margin-bottom: 1rem;
  font-family: "DiodrumArabicSemiBold";
}
.sub-heading {
  font-size: 1.625rem;
  font-family: "DiodrumArabicSemiBold";
  color: black;
}
@media (max-width: 991px) {
  .login-card {
    padding-top: 1.25rem;
  }
  .heading {
    font-size: 1.5rem;
  }
  .sub-heading {
    font-size: 1rem;
  }
}
@media (max-width: 525px) {
  .heading {
    font-size: 2rem;
  }
  .sub-heading {
    font-size: 1.25rem;
  }
  .button-group {
    button {
      max-width: 100%;
      border-radius: 9px;
    }
  }
}
.button-group {
  margin-top: 3rem;
}
.custom-checkbox {
  :deep {
    input:checked {
      ~ label {
        &::before {
          border-color: var(--theme-default);
          background-color: var(--theme-default);
          border-radius: 3px;
        }
      }
    }
    label {
      font-size: 1rem;
      color: var(--theme-default);
      margin-inline-start: 0.5rem;
      cursor: pointer;
      &::after,
      &::before {
        width: 1.563rem;
        height: 1.563rem;
        top: 0;
        bottom: 0;
        left: -2rem;
        margin: auto;
        border-color: var(--theme-default) !important;
      }
    }
  }
}
</style>