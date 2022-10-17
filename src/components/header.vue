<template>
  <div class="header-wrapper standard-width row">
    <div class="header-logo-wrapper">
      <div class="logo-wrapper">
        <router-link to="/">
          <img class="img-fluid" src="../assets/images/logo/ash-logo.png" alt />
        </router-link>
      </div>
    </div>
    <div class="nav-right pull-right right-header p-0">
      <ul class="nav-menus w200 mt-1">
        <template v-if="!isDoctor">
          <li
            @click="loadComponent('/dashboard')"
            class="nav-link d-lg-block d-none"
            :class="{ active: currentRouteName == 'default' }"
          >
            {{ $t("header.home") }}
          </li>
          <li
            @click="loadComponent('/appointment/online/upcoming')"
            class="nav-link d-lg-block d-none"
            :class="{ active: currentRouteName == 'Upcoming Appointment' }"
          >
            {{ $t("header.bookings") }}
          </li>
          <li class="nav-link d-lg-block d-none">
            {{ $t("header.emergencyConsultations") }}
          </li>
          <li class="nav-link d-lg-block d-none">
            {{ $t("header.contactUs") }}
          </li>
        </template>
        <Notifications />
        <li class="profile-nav onhover-dropdown p-0 mr-0">
          <div class="media profile-media">
            <div class="media-body">
              <img
                src="../assets/images/header/hello.png"
                alt=""
                width="15px"
                class="mx-1"
              />
              <span class="w500">
                {{ $t("header.marhaba") }}
                {{
                  getUserInfo.first_name +
                  (getUserInfo.middle_name
                    ? " " + getUserInfo.middle_name
                    : "") +
                  (getUserInfo.family_name ? " " + getUserInfo.family_name : "")
                }}</span
              >
            </div>
            <img
              class="b-r-round"
              :src="
                getImageUrl(
                  typeof getUserInfo.photo == 'string'
                    ? { path: getUserInfo.photo }
                    : getUserInfo.photo
                )
              "
              alt=""
            />
          </div>
          <ul class="profile-dropdown onhover-show-div">
            <span class="sec-heading w500">{{ $t("header.settings") }}</span>
            <hr />
            <li v-if="!getUserInfo.isDependent">
              <a class="" @click="toggleLayout()">
                <span class="profile-dropdown-menu-icon">
                  <lock-svg />
                </span>
                <span>{{ $t("header.changePassword") }}</span>
              </a>
              <hr />
            </li>
            <li>
              <a class="" @click="toggleLayout()">
                <span class="profile-dropdown-menu-icon">
                  <change-comment-svg />
                </span>
                <span>{{ $t("header.changeLanguage") }}</span>
              </a>
              <hr />
            </li>
            <li v-if="!getUserInfo.isDependent">
              <a class="" @click="viewProfile">
                <span class="profile-dropdown-menu-icon">
                  <user-svg />
                </span>
                <span>{{ $t("header.viewProfile") }}</span>
              </a>
              <hr />
            </li>
            <li v-if="getUserInfo.isDependent">
              <a class="" @click="switchToMyProfile">
                <span class="profile-dropdown-menu-icon">
                  <switch-profile-svg />
                </span>
                <span>{{ $t("header.switchMyProfile") }}</span>
              </a>
              <hr />
            </li>
            <button @click="logout" class="btn btn-secondary btn-pill">
              {{ $t("header.logOut") }}
            </button>
          </ul>
        </li>
        <div class="hamburger" @click="toggle_sidebar" v-if="!isDoctor">
          <img
            src="../assets/images/header/hamburger.png"
            alt="hamburger"
            class="status_toggle middle"
            id="sidebar-toggle"
          />
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
let body = document.getElementsByTagName("body")[0];
import { mapActions, mapGetters, mapState } from "vuex";
import { userService } from "../services";
import Notifications from "./notifications";
export default {
  name: "Search",
  data() {
    return {
      terms: "",
      searchOpen: false,
      searchResult: false,
      searchResultEmpty: false,
      close_sidebar_var: false,
      clicked: false,
      mobile_toggle: false,
      mobile_search: false,
      openbonusUI: false,
      openLevelmenu: false,
      openlanguage: false,
      mobile_accordian: false,
      mixLayout: "light-only",
      layoutType: "ltr",
      isFullScreen: false,
      currentRouteName: "default",
    };
  },
  components: {
    Notifications,
  },
  computed: {
    ...mapState({
      menuItems: (state) => state.menu.searchData,
      megamenuItems: (state) => state.menu.megamenu,
      isSideBarOpen: (state) => state.menu.togglesidebar,
    }),
    ...mapGetters("user", ["getUserInfo"]),
  },
  mounted() {
    let layout = "ltr";
    if (userService.getSelectedLayout()) {
      layout = userService.getSelectedLayout();
    } else if (this.$i18n.locale == "ar") {
      layout = "rtl";
    }
    this.toggleLayout(layout);
    this.currentRouteName = this.$route.name;
  },
  methods: {
    ...mapActions("user", ["removeUserInfo", "setUserInfo"]),
    toggle_sidebar() {
      this.$store.dispatch("menu/opensidebar");
    },
    setNavActive(item) {
      this.$store.dispatch("menu/setNavLinkActive", item);
    },
    openlangpicker() {
      this.openlanguage = !this.openlanguage;
    },
    openlevelmenu() {
      this.openLevelmenu = !this.openLevelmenu;
    },
    openmegamenu() {
      this.openbonusUI = !this.openbonusUI;
    },
    closeBonusUI() {
      this.openbonusUI = false;
    },
    search_open() {
      this.searchOpen = true;
    },
    search_close() {
      this.searchOpen = false;
    },
    searchterm: function () {
      this.$store.dispatch("menu/searchTerm", this.terms);
    },
    changeLocale(locale) {
      this.setLang(locale);
    },
    mobileaccordian() {
      this.mobile_accordian = !this.mobile_accordian;
    },
    addFix() {
      body.classList.add("offcanvas");
      this.searchResult = true;
    },
    removeFix() {
      body.classList.remove("offcanvas");
      this.searchResult = false;
      this.terms = "";
    },
    toggle_fullscreen() {
      if (
        (document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)
      ) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
      this.isFullScreen = !this.isFullScreen;
    },
    customizeMixLayout(val) {
      this.mixLayout = val;
      this.$store.dispatch("layout/setLayout", val);
    },
    toggleLayout(layout) {
      if (layout) {
        this.layoutType = layout;
      } else {
        this.layoutType = this.layoutType == "ltr" ? "rtl" : "ltr";
      }
      let isArabic = this.layoutType == "rtl";
      this.$store.dispatch("layout/setLayoutType", this.layoutType);
      this.$i18n.locale = isArabic ? "ar" : "en";
      userService.setSelectedLayout(this.layoutType);
    },
    logout() {
      this.$root.$refs.appointmentModule &&
        this.$root.$refs.appointmentModule.destroyObjects();
      this.removeUserInfo();
      this.$messaging.deleteToken();
      this.navigateTo({ name: "Login Dashboard" });
    },
    viewProfile() {
      if (this.$route.name != "Profile") this.navigateTo("Profile");
    },
    switchToMyProfile() {
      let guardianInfo = { ...userService.getGuardianInfo() };
      userService.removeGuardianInfo();
      this.setUserInfo(guardianInfo);
      this.navigateTo("default");
    },
    loadComponent(path) {
      if (!this.isSideBarOpen) this.toggle_sidebar();
      this.setNavActive({ path });
      this.$router.push(path);
    },
  },
  watch: {
    menuItems: function () {
      this.terms ? this.addFix() : this.removeFix();
      if (!this.menuItems.length) this.searchResultEmpty = true;
      else this.searchResultEmpty = false;
    },
    $route: function (route) {
      this.currentRouteName = route.name;
    },
  },
};
</script>
