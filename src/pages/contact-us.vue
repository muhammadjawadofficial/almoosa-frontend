<template>
  <div class="page-body-container standard-width">
    <div v-if="hideBackLink" class="heading">{{ $t("contactUs.heading") }}</div>
    <back-navigation v-else :title="$t('contactUs.heading')" />
    <div class="row">
      <div class="col-sm-12" style="--numberOfTabs: 2">
        <b-card header-tag="div" no-body class="ash-card">
          <b-card-body class="mt-0">
            <div class="appointment-detail">
              <div class="appointment-detail--type">
                <div class="appointment-detail--label">
                  {{ $t("contactUs.telephone") }}
                </div>
                <div class="appointment-detail--value">
                  <a :href="'tel:' + telephone">
                    {{ translateNumber(telephone) }}
                  </a>
                </div>
              </div>
              <div class="appointment-detail--type">
                <div class="appointment-detail--label">
                  {{ $t("contactUs.email") }}
                </div>
                <div class="appointment-detail--value lowerCase">
                  <a :href="'mailto:' + email">{{ email }}</a>
                </div>
              </div>
              <div class="appointment-detail--type mb-0">
                <div class="appointment-detail--label">
                  {{ $t("contactUs.socialMediaLinks") }}
                </div>
                <div class="appointment-detail--value">
                  <div class="footer-icons mt-1">
                    <a
                      v-for="(link, index) in socialLinks"
                      :href="link.link"
                      target="_blank"
                      :key="'social-link' + index"
                    >
                      <i :class="link.icon"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from "../services";
export default {
  data() {
    return {
      hideBackLink: true,
      telephone: "+966-13-5369666",
      email: "info@almoosahospital.com.sa",
      socialLinks: [
        {
          icon: "fa fa-facebook",
          link: "https://www.facebook.com/almoosahospital1/",
        },
        {
          icon: "fa fa-linkedin",
          link: "https://www.linkedin.com/company/almoosa-specialist-hospital/",
        },
        {
          icon: "fa fa-twitter",
          link: "https://twitter.com/almoosahospital",
        },
        {
          icon: "fa fa-instagram",
          link: "https://www.instagram.com/almoosahospital/",
        },
        {
          icon: "fa fa-youtube",
          link: "https://www.youtube.com/channel/UCspHgrLVKETE06FNIFcBy3A",
        },
      ],
    };
  },
  mounted() {
    console.log(this.$route);
    this.hideBackLink = !!this.$route.meta.hideButtons;
    let lang = this.$route.query.lang;
    if (!lang) {
      if (userService.getSelectedLayout()) {
        lang = userService.getSelectedLayout() == "ltr" ? "en" : "ar";
      } else {
        lang = this.$i18n.locale;
      }
    }
    if (lang) {
      this.$i18n.locale = lang;
      let layoutType = lang == "en" ? "ltr" : "rtl";
      this.$store.dispatch("layout/setLayoutType", layoutType);
      userService.setSelectedLayout(layoutType);
    }
  },
};
</script>


<style lang="scss" scoped>
.heading {
  font-size: 1.75rem;
  display: flex;
}
.lowerCase {
  text-transform: lowercase;
}
a {
  color: inherit;
}
</style>