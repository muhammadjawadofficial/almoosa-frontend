import { mapActions, mapGetters } from 'vuex';
import { appointmentService, userService } from '../services';
import { axios } from '../services/axios';

export default {
    data() {
        return {
            restartEnabled: false,
            checkRoleFromUser: false,
            browserTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            isWebView: false,
            isEligibleForFirstFreeAppt: false
        }
    },
    computed: {
        ...mapGetters("user", ["getUserRole", "getUserInfo", "getIsGuest", "getLoading"]),
        ...mapGetters("appointment", ["getSelectedAppointment"]),
        isDoctor() {
            let roleLS = this.getLSRole();
            let roleS = this.getUserRole;
            return (roleLS == 4 || (roleS && roleS.includes('doc')))
        },
        currentAppLang() {
            return this.$i18n.locale;
        },
        isEligibleForFreeAppt() {
            if (!this.isEligibleForFirstFreeAppt) return this.isEligibleForFirstFreeAppt;
            let isElligible = null;
            let promos = this.getUserInfo.first_free_promo;

            if (!promos) return isElligible;

            promos.forEach(item => {
                if (item.status == "pending" && !item.appointment_id) {
                    isElligible = item
                }
            })

            return isElligible;
        },
        isEligibleForCancelFreeAppt() {
            if (!this.isEligibleForFirstFreeAppt) return this.isEligibleForFirstFreeAppt;
            let isElligible = null;
            let promos = this.getUserInfo.first_free_promo;

            if (!promos) return isElligible;

            promos.forEach(item => {
                if (item.status == "completed" && item.appointment_id) {
                    isElligible = item
                }
            })

            return isElligible;
        }
    },
    mounted() {
        this.moment.locale(this.$i18n.locale)
        this.checkWebView();
    },
    watch: {
        "$i18n.locale": function (val) {
            this.moment.locale(val)
        },
        "$route": function (val) {
            this.checkWebView();
        }
    },
    methods: {
        ...mapActions("appointment", ["setSelectedAppointment"]),
        checkWebView() {
            this.isWebView = this.$route.meta.webview;
        },
        getLSRole() {
            if (!userService.isAuthenticatedUser()) {
                return userService.getRole();
            } else {
                return (this.checkRoleFromUser ? userService.getUserRole() : userService.getRole())
            }
        },
        getImageUrl(profile) {
            let path = '/profile.png'
            let getPathFromUrl = (url) => {
                let urlParts = url.split('/');
                let lastPart = urlParts[urlParts.length - 1];
                if (lastPart.includes('.')) {
                    return url;
                }
                return path;
            }

            if (profile == null)
                return path;
            else if (typeof profile == 'string')
                path = getPathFromUrl(profile);
            else if (profile.path)
                path = process.env.VUE_APP_SERVER + profile.path;
            else if (profile.photo && profile.photo.path)
                path = process.env.VUE_APP_SERVER + profile.photo.path;
            else if (profile.profile_photo_url)
                path = getPathFromUrl(profile.profile_photo_url)
            return path
        },
        getLocaleKey: function (key, enLocale = "", arLocale = "_ar", wordCase = "camel") {
            let postKey = this.$i18n.locale == "ar" ? arLocale : enLocale;
            if (wordCase == "upper") {
                postKey = postKey.toUpperCase();
            } else if (wordCase == "lower") {
                postKey = postKey.toLowerCase();
            }
            return key + postKey;
        },
        numberOnly(number, input) {
            /**
             * @param {string} number
             * @param {string} input
             * @returns {number}
             * @description
             * 1. if input is not a number, return the number without the last character
             * 2. if input is a number, return the number
             * 3. if input is a number and the number is not a number, return the number by removing all non-numbers
             * 4. if input is a number and getLocalthe number is a number, return the number
             * 5. if input is not a number and the number is not a number, return the number by removing all non-numbers
             * 6. if input is not a number and the number is a number, return the number
             */
            if (isNaN(input) || input == ' ') {
                return number.replace(/[^0-9]/g, "");
            } else {
                return number;
            }
        },
        phoneNumberCharactersOnly(number, input) {
            /**
             * @param {string} number
             * @param {string} input
             * @returns {number}
             * @description
             * 1. if input is a telephone number of saudi format, return the number
             * 2. if input is not a telephone number of saudi format, return the number without valid characters
             */
            if (input.data == ' ' || input.type == "input" && !((0 <= input.data && input.data <= 9) || input.data == "+")) {
                return number.replace(/[^0-9+]/g, "");
            } else {
                return number;
            }
        },
        alphabetsOnly(string) {
            /**
             * @param {string} string
             * @returns {string}
             */
            let regex = this.currentAppLang == "en" ? /[^a-zA-Z ]/g : /[^ء-ي ]/g;
            return string.replace(regex, "");
        },

        confirmModal(title, confirmText, cancelText) {
            return this.$swal({
                text: title || this.$t('areYouSure'),
                type: 'question',
                showCancelButton: true,
                confirmButtonText: confirmText || this.$t("ok"),
                confirmButtonColor: "#4466f2",
                cancelButtonText: cancelText || this.$t("cancel"),
                cancelButtonColor: "#4466f2",
            });
        },
        successModal(title, text, confirmText) {
            return this.$swal({
                title: title || this.$t('changesDone'),
                text: text || this.$t('changesDone'),
                type: 'success',
                confirmButtonText: confirmText || this.$t("ok"),
                confirmButtonColor: "#4466f2",
            });
        },
        confirmIconModal(title, text, icon = 'm-check', confirmText = this.$t("ok"), cancelText = this.$t("cancel"), customClass = "") {
            const imagePath = require("../assets/images/" + icon + ".svg")
            return this.$swal({
                title: title || this.$t('areYouSure'),
                text: text || this.$t('areYouSure'),
                showCancelButton: true,
                confirmButtonText: confirmText,
                confirmButtonColor: "#4466f2",
                cancelButtonText: cancelText,
                cancelButtonColor: "#4466f2",
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding theme-action-button ' + customClass,
                }
            });
        },
        ratingIconModal(title, text, icon, confirmText, cancelText, doctorRatingPayload) {
            const imagePath = require("../assets/images/" + (icon || 'm-check') + ".svg");
            let selectedRating = null;
            let innerHTML = `
                            <div class="swal-title">${text}</div>
                            <div class="rating-container">
                                <div class="fa fa-star star"></div>
                                <div class="fa fa-star star"></div>
                                <div class="fa fa-star star"></div>
                                <div class="fa fa-star star"></div>
                                <div class="fa fa-star star"></div>
                            </div>
                            `;
            return this.$swal({
                title: title || this.$t('areYouSure'),
                text: text || this.$t('areYouSure'),
                showCancelButton: true,
                confirmButtonText: confirmText || this.$t("ok"),
                confirmButtonColor: "#4466f2",
                cancelButtonText: cancelText || this.$t("cancel"),
                cancelButtonColor: "#4466f2",
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding theme-action-button',
                },
                html: innerHTML,
                onBeforeOpen: () => {
                    const ratings = document.getElementsByClassName('star')
                    Object.values(ratings).forEach((rating, index) => {
                        rating.addEventListener('click', () => {
                            for (const element of ratings) {
                                element.classList.remove('active')
                            }
                            for (let i = 0; i <= index; i++) {
                                ratings[i].classList.add('active')
                            }
                            selectedRating = index + 1;
                        })
                    })
                },
                preConfirm: () => {
                    if (selectedRating == null) {
                        this.$swal.showValidationMessage(
                            this.$t('rating.error')
                        )
                        return selectedRating != null
                    } else {
                        let success = false;
                        appointmentService.ratePhysician({ ...doctorRatingPayload, rating_value: selectedRating }).then(
                            (response) => {
                                if (response.data.status) {
                                    success = true;
                                    this.successToast(this.$t('rating.submitted'));
                                    this.$swal.close();
                                } else {
                                    this.failureToast(response.data.message);
                                }
                            },
                            (err) => {
                                this.failureToast(err.response && err.response.data.message);
                            }
                        );
                        return success && selectedRating != null && selectedRating
                    }
                },
            });
        },
        inputIconModal(title, text, icon = 'm-check', type = 'text', confirmText = this.$t("ok"), cancelText = this.$t("cancel")) {
            const imagePath = require("../assets/images/" + icon + ".svg")
            return this.$swal({
                input: type,
                inputPlaceholder: text,
                title: title || this.$t('areYouSure'),
                showCancelButton: true,
                confirmButtonText: confirmText,
                confirmButtonColor: "#4466f2",
                cancelButtonText: cancelText,
                cancelButtonColor: "#4466f2",
                preConfirm: (inputVal) => {
                    let trimInputVal = (inputVal + "").trim();
                    let isValidInput = trimInputVal != '';
                    if (!isValidInput) {
                        this.$swal.showValidationMessage(
                            this.$t('promotions.invalidPromo')
                        )
                    }

                    return isValidInput && trimInputVal;
                },
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding theme-action-button',
                }
            });
        },
        successIconModal(title, text, icon = 'm-check', confirmText = this.$t("ok")) {
            const imagePath = require("../assets/images/" + icon + ".svg")
            return this.$swal({
                title: title || this.$t('changesDone'),
                text: text || this.$t('changesDone'),
                confirmButtonText: confirmText,
                confirmButtonColor: "#4466f2",
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding',
                }
            });
        },
        successIconListModal(title, text, icon = 'm-check', confirmText = this.$t("ok")) {
            const imagePath = require("../assets/images/" + icon + ".svg")
            return this.$swal({
                title: title || this.$t('changesDone'),
                html: text || this.$t('changesDone'),
                confirmButtonText: confirmText,
                confirmButtonColor: "#4466f2",
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding',
                }
            });
        },
        failureModal(title, confirmText) {
            this.$swal({
                text: title || this.$t('error.somethingWentWrong'),
                type: 'error',
                confirmButtonText: confirmText || this.$t("ok"),
                confirmButtonColor: "#4466f2"
            });
        },
        failureIconModal(title, text, icon = 'm-check', confirmText = this.$t("ok")) {
            const imagePath = require("../assets/images/" + icon + ".svg")
            this.$swal({
                title: title || this.$t('error.somethingWentWrong'),
                text: text || this.$t('error.somethingWentWrong'),
                confirmButtonText: confirmText,
                confirmButtonColor: "#4466f2",
                imageUrl: imagePath,
                customClass: {
                    container: 'swal-custom-icon-top-padding',
                }
            });
        },
        successToast(message) {
            this.$toasted.show(message || this.$t("success"), {
                theme: "bubble",
                position: "top-right",
                type: "success",
                duration: 5000,
            });
        },
        failureToast(message) {
            this.$toasted.show(message || this.$t("error.somethingWentWrong"), {
                theme: "bubble",
                position: "top-right",
                type: "error",
                duration: 5000,
            });
        },
        setLoadingState(state) {
            this.$store.dispatch('user/setLoading', state);
        },
        download(url) {
            userService.downloadFile(url);
        },
        navigateBack() {
            this.$router.go(-1);
        },
        navigateTo(name, params = null, external = false) {
            if (external) {
                window.open(name, '_blank')
                return;
            }
            if (this.$route.name == name && this.isEqual(this.$route.params, params)) {
                return;
            }
            let obj = { name };
            if (params) {
                obj.params = params
            }
            this.$router.push(obj);
        },
        createRoomId(appointment_id, doctor_id, patient_id) {
            return patient_id + "-" + doctor_id;
        },
        isEqual(obj1, obj2) {
            /**
             * compare obj1 and obj2 and return true if they are equal
             */

            if (obj1 == obj2 || !obj1 || !obj2) {
                return true;
            }

            // Create arrays of property names
            let aProps = Object.getOwnPropertyNames(obj1);
            let bProps = Object.getOwnPropertyNames(obj2);

            // If number of properties is different,
            // objects are not equivalent
            if (aProps.length != bProps.length) {
                return false;
            }

            for (let i = 0; i < aProps.length; i++) {
                let propName = aProps[i];

                // If values of same property are not equal,
                // objects are not equivalent
                if (obj1[propName] !== obj2[propName]) {
                    return false;
                }
            }

            // If we made it this far, objects
            // are considered equivalent
            return true;
        },
        replaceTo(name) {
            this.$router.replace({ name })
        },
        getDate(dateString, utc = true) {
            let date = this.moment(dateString);
            if (utc) {
                date = date.utc();
            }
            if (this.moment(date).isSame(new Date(), "day")) {
                return this.$t('header.today');
            } else {
                return date.format("DD MMM");
            }
        },
        getYear(dateString, utc = true) {
            let date = this.moment(dateString);
            if (utc) {
                date = date.utc();
            }
            if (this.moment(date).isSame(new Date(), "day")) {
                return;
            } else {
                return date.format("YYYY");
            }
        },
        getTimeFromDate(date, includeAmPm = false) {
            return this.moment(date).utc().format("hh:mm" + (includeAmPm ? " A" : ""));
        },
        removeSecondsFromTimeString(timeString, onlySplice = false, translate = true) {
            if (timeString == '--:--') {
                return '--:--';
            }
            let timeArray = timeString.split(":");
            let hh = timeArray[0];
            let mm = timeArray[1];

            let withoutSeconds = hh + ":" + mm;
            if (onlySplice) {
                if (translate) {
                    return this.translateNumber(withoutSeconds)
                }
                return withoutSeconds;
            }
            let parsedString = "";

            if (hh >= 0 && +hh < 12) {
                if (+hh == 0) {
                    hh = '12';
                }
                parsedString = hh + ":" + mm + "AM"
            } else {
                if (hh > 12) {
                    hh = hh - 12;
                }
                hh = '' + hh;
                if (hh.split("").length < 2) {
                    hh = '0' + hh
                }
                parsedString = hh + ":" + mm + "PM"
            }
            return this.translateNumber(parsedString);
        },
        getDateTimeWithoutTimezone() {
            let format = "YYYY-MM-DDTHH:mm:ss";
            let utcTimezone = ".000Z";
            let date = this.moment().format(format) + utcTimezone;
            return date;
        },
        dateFormatter(date, format = 'MMMM Do YYYY, h:mm A', utc = false, locale, tz = this.browserTimezone) {
            if (utc) {
                return this.moment(date).tz(tz).locale(locale || this.currentAppLang).utc().format(format);
            }
            return this.moment(date).tz(tz).locale(locale || this.currentAppLang).format(format);
        },
        formatDateTime(date, utc = true) {
            return this.dateFormatter(date, 'DD/MM/YYYY hh:mm A', utc);
        },
        formatLongDayDateFromDate(date, utc = true) {
            return this.dateFormatter(date, 'dddd, MMMM DD, YYYY', utc);
        },
        removeDateTime(date) {
            return this.dateFormatter(date, "YYYY-MM-DD", false, "en")
        },
        formatDate(date) {
            return this.dateFormatter(date, "DD-MM-YYYY", false, "en")
        },
        getLongMonthDayFromDate(date) {
            return this.dateFormatter(date, 'MMMM, D dddd')
        },
        getLongDateFromDate(date) {
            return this.dateFormatter(date, 'D MMMM YYYY')
        },
        getLongDateAndTimeFromDate(date, utc = false) {
            return this.dateFormatter(date, 'DD MMMM YYYY - hh:mm A', utc)
        },
        getShortDateFromDate(date, separator = "-") {
            return this.dateFormatter(date, "YYYY" + separator + "MM" + separator + "DD")
        },
        formatNotificationTime(date, utc = false) {
            return this.dateFormatter(date, 'DD MMMM YYYY - hh:mm A', utc)
        },
        formatReceiptDateTime(date, utc = false) {
            return this.dateFormatter(date, 'YYYY-MM-DD HH:mm:ss', utc, "en", "Asia/Riyadh")
        },
        isDateSame(date1, date2) {
            let fdate1 = this.formatDate(new Date(date1));
            let fdate2 = this.formatDate(new Date(date2));
            return fdate1 == fdate2;
        },
        getYears(date) {
            return this.moment().diff(date, 'years')
        },
        translateNumber(num) {
            let strNum = num + '';
            // e.g., 12:00AM
            if (this.currentAppLang == "ar") {
                let ar = '٠١٢٣٤٥٦٧٨٩'.split('');
                let en = '0123456789'.split('');
                if (strNum.includes("PM")) {
                    strNum = strNum.replace("PM", "")
                    strNum = "م" + strNum;
                }
                if (strNum.includes("AM")) {
                    strNum = strNum.replace("AM", "")
                    strNum = "ص" + strNum;
                }
                let strArray = strNum.split("");
                let translateString = "";
                strArray.forEach(character => {
                    if (en.includes(character)) {
                        translateString += ar[en.indexOf(character)]
                    } else {
                        translateString += character;
                    }
                })
                return translateString;
            }
            return strNum;
        },
        isAllowedToCall(date, start, end) {
            /**
             * @param date: date in string format with date & time
             * @param start: start time in string format with date & time
             * @param end: end time in string format with date & time
             * @returns boolean
             */

            let now = this.moment().utcOffset(0, true);
            let allowedMinutes = 60;

            let bookDateWithStartTime = this.moment(start).utc().add(-allowedMinutes, 'minutes');
            let bookDateWithEndTime = this.moment(start).utc().add(allowedMinutes, 'minutes');

            let allowedStartLimit = bookDateWithStartTime;
            let allowedEndLimit = bookDateWithEndTime;

            if (now < allowedStartLimit) {
                this.failureToast(this.$t("cantJoinCallEarly", { minutes: this.translateNumber(allowedMinutes) }));
                return false;
            } else if (now > allowedEndLimit) {
                this.failureToast(this.$t("cantJoinCallLate", { minutes: this.translateNumber(allowedMinutes) }));
                return false;
            } else {
                return true;
            }
        },
        navigateToRegister() {
            this.confirmIconModal(
                this.$t('register.modal.selectToContinue'),
                ' ',
                'm-info',
                this.$t('register.modal.iHaveMedicalFile'),
                this.$t('register.modal.iDontHaveMedicalFile'),
                'one-line-equal-width-buttons',
            ).then(res => {
                if (res.value) {
                    this.navigateTo('Register Medical File');
                } else if (res.dismiss == 'cancel') {
                    this.navigateTo('Register');
                }
            })
        },
        getFullName(user, prepend = "", locale = null) {
            if (!user) {
                return 'N/A'
            }
            let parseName = (name) => name ? name + " " : "";
            let fullName = "";
            if (locale != null) {
                fullName = user['first_name' + locale] + " " + user['middle_name' + locale] + " " + user['family_name' + locale];
            } else {
                fullName = parseName(user[this.getLocaleKey('first_name')]) + parseName(user[this.getLocaleKey('middle_name')]) + parseName(user[this.getLocaleKey('family_name')]);
            }
            if (!fullName) {
                fullName = parseName(user.first_name) + parseName(user.middle_name) + parseName(user.family_name)
            }
            if (prepend) {
                fullName = prepend + " " + fullName.trim();
            } else {
                if (fullName && user.role_id == 4) {
                    fullName = this.$t('dr') + " " + fullName.trim();
                }
            }
            return fullName || 'N/A';
        },
        isAPIAborted(error) {
            return axios.isCancel(error)
        },
        setBookingState() {
            let booking = userService.getBooking();
            userService.removeBooking();
            if (!booking) {
                booking = this.getSelectedAppointment;
            }
            this.setSelectedAppointment({ ...booking });

            return booking;
        },
        async doPayment() {
            let booking = this.setBookingState();
            let paymentVerifyObject = JSON.parse(
                localStorage.getItem("paymentVerifyObject")
            );
            localStorage.removeItem("paymentVerifyObject");
            if (!paymentVerifyObject) {
                this.navigateTo("default");
                return;
            }
            try {
                let res = await appointmentService.createPayment(paymentVerifyObject)
                let response = res.data;
                if (response && response.status) {
                    if (
                        response.data.items[0].operation_status
                            .toLowerCase()
                            .includes("fail")
                    ) {
                        this.successIconModal(
                            this.$t("selectPaymentMethod.paymentFailed"),
                            response.data.items[0][
                            this.getLocaleKey("operation_message", "lower", "", "_ar")
                            ],
                            "m-payment-failure"
                        ).then(() => {
                            this.navigateTo("Upcoming Appointment");
                        });
                        return;
                    }
                    if (booking) {
                        this.setSelectedAppointment({ ...booking, status: 'paid' });
                    }
                    this.successIconModal(
                        this.$t("selectPaymentMethod.paymentSuccessful"),
                        this.$t("selectPaymentMethod.paymentSuccessfulText"),
                        "m-payment-success"
                    ).then(() => {
                        this.navigateTo("Upcoming Appointment");
                    });
                } else {
                    this.failureToast(response.message);
                }
            } catch (error) {
                if (!this.isAPIAborted(error)) this.failureToast(error.response.data && error.response.data.message);
            }
        },
        forceFullyChangeUserLanguage(lang) {
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
        setAppLanguageFromRoute() {
            this.hideBackLink = !!this.$route.meta.hideButtons;
            let lang = this.$route.query.lang;
            this.forceFullyChangeUserLanguage(lang);
        },
        async setFCMToken() {
            if (this.$messaging) {
                // await this.removeFCMToken();
                this.$messaging.onTokenRefresh(async () => {
                    await this.initializeFCMToken();
                })
                await this.initializeFCMToken();
            }
        },
        async initializeFCMToken() {
            try {
                await this.$messaging.deleteToken({
                    vapidKey:
                        "BNLgxwZ2Lmx4lq30n9wEMDap0N7geVOFe9Rq3FTGxm5bQ-TPP3tnabS2mmO_xkcbCslllkKusQiJUBeX3r0ecSk",
                });
                let currentToken = await this.$messaging.getToken({
                    vapidKey:
                        "BNLgxwZ2Lmx4lq30n9wEMDap0N7geVOFe9Rq3FTGxm5bQ-TPP3tnabS2mmO_xkcbCslllkKusQiJUBeX3r0ecSk",
                });
                if (currentToken) {
                    userService.setFCMToken(currentToken);
                    console.log("client token");
                    console.log(currentToken);
                }
            } catch (error) {
                console.log("An error occurred while retrieving token. ", error);
            }
        },
        getFCMToken() {
            return userService.getFCMToken();
        },
        async removeFCMToken() {
            if (this.$messaging) {
                await this.$messaging.deleteToken();
                userService.removeFCMToken();
            }
        },
        isAllowedToPay(appointment_time) {
            let now = this.moment().utcOffset(0, true);
            let appointmentTime = this.moment(appointment_time).utc();
            let allowedMinutes = -30;
            let diff = now.diff(appointmentTime, 'minutes');

            return diff <= allowedMinutes;
        }
    },
}