import { mapGetters } from 'vuex';
import { appointmentService, userService } from '../services';

export default {
    data() {
        return {
            restartEnabled: false,
            checkRoleFromUser: false
        }
    },
    computed: {
        ...mapGetters("user", ["getUserRole", "getIsGuest", "getLoading"]),
        isDoctor() {
            let roleLS = this.getLSRole();
            let roleS = this.getUserRole;
            return (roleLS == 4 || (roleS && roleS.includes('doc')))
        },
    },
    watch: {
        "$i18n.locale": function (val) {
            this.moment.locale(val)
        }
    },
    methods: {
        getLSRole() {
            if (!userService.isAuthenticatedUser()) {
                return userService.getRole();
            } else {
                return (this.checkRoleFromUser ? userService.getUserRole() : userService.getRole())
            }
        },
        getImageUrl(profile) {
            if (profile) {
                return process.env.VUE_APP_SERVER + profile.path;
            }
            return "/profile.png";
        },
        getLocaleKey: function (key, wordCase = "camel") {
            let postKey = this.$i18n.locale == "ar" ? "Ar" : "En";
            if (wordCase == "upper") {
                postKey = postKey.toUpperCase();
            } else if (wordCase == "lower") {
                postKey = postKey.toLowerCase();
            }
            return key + postKey;
        },
        getCurrentLang() {
            return this.$i18n.locale;
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
        confirmIconModal(title, text, icon = 'm-check', confirmText = this.$t("ok"), cancelText = this.$t("cancel")) {
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
                    container: 'swal-custom-icon-top-padding theme-action-button',
                }
            });
        },
        ratingIconModal(title, text, icon, confirmText, cancelText, doctor_id) {
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
                        this.setLoadingState(true);
                        appointmentService.ratePhysician(doctor_id, selectedRating).then(
                            (response) => {
                                if (response.data.status) {
                                    success = true;
                                    this.successToast(this.$t('rating.submitted'));
                                    this.$swal.close();
                                } else {
                                    this.failureToast(response.data.message);
                                }
                                this.setLoadingState(false);
                            },
                            (err) => {
                                this.failureToast(err.response && err.response.data.message);
                                this.setLoadingState(false);
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
        navigateTo(name, params = null) {
            let obj = { name };
            if (params) {
                obj.params = params
            }
            this.$router.push(obj);
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
        getTimeFromDate(date, includeAmPm = false) {
            return this.moment(date).utc().format("hh:mm" + (includeAmPm ? " A" : ""));
        },
        removeSecondsFromTimeString(timeString, onlySplice = false, translate = true) {
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
        dateFormatter(date, format = 'MMMM Do YYYY, h:mm A', utc = false) {
            if (utc) {
                return this.moment(date).utc().format(format);
            }
            return this.moment(date).format(format);
        },
        formatLongDayDateFromDate(date, utc = true) {
            return this.dateFormatter(date, 'dddd, MMMM DD', utc);
        },
        removeDateTime(date) {
            return this.dateFormatter(date, "YYYY-MM-DD")
        },
        formatDate(date) {
            return this.dateFormatter(date, "DD-MM-YYYY")
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
            return this.dateFormatter(date, 'MMMM YYYY - hh:mm A', utc)
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
            if (this.getCurrentLang() == "ar") {
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
            let minutes = 1000 * 60;

            let startTime = start.split(":");
            let endTime = end.split(":");

            let now = new Date().getTime();
            let bookDate = new Date(date);
            let bookDateWithStartTime = bookDate.setHours(startTime[0], startTime[1]);
            let bookDateWithEndTime = bookDate.setHours(endTime[0], endTime[1]);

            let bookDateWithStartTimeMili = new Date(bookDateWithStartTime).getTime();
            let bookDateWithEndTimeMili = new Date(bookDateWithEndTime).getTime();

            let allowedStartLimit = bookDateWithStartTimeMili - (15 * minutes);
            let allowedEndLimit = bookDateWithEndTimeMili;

            return now > allowedStartLimit && now < allowedEndLimit;
        }
    },
}