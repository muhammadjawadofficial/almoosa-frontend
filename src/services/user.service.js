import { apiPath } from "../constants/apiPath";

export const userService = {
    isAuthenticatedUser,
    storeLoginInfo,
    removeLoginInfo,
    getGuardianInfo,
    storeGuardianInfo,
    removeGuardianInfo,
    currentUser,
    storeUserInfo,
    getToken,
    removeToken,
    setToken,
    setSelectedLayout,
    getSelectedLayout,
    getStoredLang,
    getRole,
    getUserRole,
    setRole,
    getBooking,
    removeBooking,
    setBooking,
    downloadFile,
    updateV1Profile,
    updateProfile,
    getProfile,
    getDoctorProfile,
    getProfileById,
    getUserWalletAmount,
    getServiceBaseRate,
    getPartialPayments,
    getPaymentAmount,
    getBanner,
    setFCMToken,
    getFCMToken,
    removeFCMToken,
    changeLanguage,
    logout,
    fetchNotifications,
    markAllAsRead,
    fetchNotificationSettings,
    updateNotificationSettings,
    redeemLoyaltyPoints
};

import axios from "axios";

const jwtTokenKey = 'token';
const userInfo = 'userInfo';
const guardianInfo = 'guardianInfo';
const fcmToken = 'fcmToken';

const preferredLayout = 'user-layout';

const userRole = 'userRole';

const paymentToBeBook = 'booking'

let userDataStorage = sessionStorage;

function isAuthenticatedUser() {
    if (localStorage.getItem(jwtTokenKey)) {
        userDataStorage = localStorage;
    } else {
        userDataStorage = sessionStorage;
    }

    return !!userDataStorage.getItem(jwtTokenKey);
}

function storeLoginInfo(user, token, rememberMe = false) {
    if (rememberMe) {
        userDataStorage = localStorage;
    }
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    userDataStorage.setItem(userInfo, JSON.stringify(user));
    userDataStorage.setItem(jwtTokenKey, token);
}

function removeLoginInfo() {
    sessionStorage.removeItem(userInfo);
    sessionStorage.removeItem(jwtTokenKey);
    localStorage.removeItem(userInfo);
    localStorage.removeItem(jwtTokenKey);
}

function currentUser() {
    return JSON.parse(userDataStorage.getItem(userInfo));
}
function storeUserInfo(user) {
    userDataStorage.setItem(userInfo, JSON.stringify(user));
}
function getGuardianInfo() {
    return JSON.parse(localStorage.getItem(guardianInfo));
}
function storeGuardianInfo(user) {
    localStorage.setItem(guardianInfo, JSON.stringify(user));
}
function removeGuardianInfo() {
    localStorage.removeItem(guardianInfo);
}
function getToken() {
    return userDataStorage.getItem(jwtTokenKey);
}
function removeToken() {
    return userDataStorage.removeItem(jwtTokenKey);
}
function setToken(token) {
    return userDataStorage.setItem(jwtTokenKey, token);
}
function setSelectedLayout(lang) {
    return localStorage.setItem(preferredLayout, lang);
}
function getSelectedLayout() {
    return localStorage.getItem(preferredLayout);
}
function getStoredLang() {
    return localStorage.getItem(preferredLayout) == 'ltr' ? 'en' : 'ar';
}
function getRole() {
    return localStorage.getItem(userRole);
}
function getUserRole() {
    return currentUser() && currentUser().role_id;
}
function setRole(role) {
    return localStorage.setItem(userRole, role);
}
function getBooking() {
    return JSON.parse(localStorage.getItem(paymentToBeBook));
}
function removeBooking() {
    return localStorage.removeItem(paymentToBeBook);
}
function setBooking(booking) {
    return localStorage.setItem(paymentToBeBook, JSON.stringify(booking));
}
function setFCMToken(token) {
    localStorage.setItem(fcmToken, token);
}
function getFCMToken() {
    return localStorage.getItem(fcmToken);
}
function removeFCMToken() {
    return localStorage.removeItem(fcmToken);
}
function downloadFile(file) {
    let fileName = file.name;
    let downloadSuccess = false;
    axios({
        url: file.url,
        method: "GET",
        responseType: "blob",
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        downloadSuccess = true;
    }).catch(() => {
        downloadSuccess = false;
    });
    return downloadSuccess
}
function updateProfile(profile) {
    return axios({
        method: apiPath.user.updateProfile(currentUser().mrn_number).method,
        url: apiPath.user.updateProfile(currentUser().mrn_number).url,
        data: profile
    })
}
function updateV1Profile(profile) {
    return axios({
        method: apiPath.user.updateV1Profile(currentUser().id).method,
        url: apiPath.user.updateV1Profile(currentUser().id).url,
        data: profile
    })
}
function getProfile(profile, mrn) {
    return axios({
        method: apiPath.user.getProfile(profile, mrn).method,
        url: apiPath.user.getProfile(profile, mrn).url,
    })
}
function getDoctorProfile(id) {
    return axios({
        method: apiPath.user.getDoctorProfile(id).method,
        url: apiPath.user.getDoctorProfile(id).url,
    })
}
function getProfileById(id) {
    return axios({
        method: apiPath.user.getProfileById(id).method,
        url: apiPath.user.getProfileById(id).url,
    })
}
function getUserWalletAmount() {
    return axios({
        method: apiPath.user.getWalletAmount(currentUser().mrn_number).method,
        url: apiPath.user.getWalletAmount(currentUser().mrn_number).url,
    })
}
function getServiceBaseRate(mrn, doctorId, appointmentId) {
    let data = {
        "mrn_number": mrn,
        "doctor_id": doctorId,
        "appointment_id": appointmentId
    }
    return axios({
        method: apiPath.user.getServiceBaseRate.method,
        url: apiPath.user.getServiceBaseRate.url,
        data
    })
}
function getPartialPayments(termId, userId) {
    let query = "?term_id=" + termId + "&patient_id=" + userId;
    return axios({
        method: apiPath.user.getPartialPayments(query).method,
        url: apiPath.user.getPartialPayments(query).url,
    })
}
function getPaymentAmount(mrn, appointmentId, schemeId, serviceId) {
    let data = {
        "Mrno": mrn,
        "ApptAllocationID": '' + appointmentId,
        "PatientSchemeID": '' + schemeId,
        "ServiceID": '' + serviceId,
    }
    return axios({
        method: apiPath.user.getPaymentAmount.method,
        url: apiPath.user.getPaymentAmount.url,
        // method: "get",
        // url: 'http://localhost:8008/paymentAmount.json',
        data
    })
}
function getBanner(query) {
    return axios({
        method: apiPath.user.getBanner(query).method,
        url: apiPath.user.getBanner(query).url,
    })
}
function changeLanguage(lang) {
    return axios({
        method: apiPath.user.changeLanguage.method,
        url: apiPath.user.changeLanguage.url,
        data: {
            "language": lang
        }
    })
}
function logout() {
    return axios({
        method: apiPath.user.logout.method,
        url: apiPath.user.logout.url,
    })
}
function fetchNotifications(query) {
    return axios({
        method: apiPath.user.fetchNotifications(query).method,
        url: apiPath.user.fetchNotifications(query).url,
    })
}
function markAllAsRead(data) {
    return axios({
        method: apiPath.user.markAllAsRead.method,
        url: apiPath.user.markAllAsRead.url,
        data
    })
}
// get-notifications-settings-list
function fetchNotificationSettings() {
    return axios({
        method: apiPath.user.fetchNotificationsSetting(currentUser().id).method,
        url: apiPath.user.fetchNotificationsSetting(currentUser().id).url,
    })
}
// update-notifications-settings
function updateNotificationSettings(data) {
    return axios({
        method: apiPath.user.updateNotificationSetting(data.id).method,
        url: apiPath.user.updateNotificationSetting(data.id).url,
        data: data,
    })
}
function redeemLoyaltyPoints(data) {
    return axios({
        method: apiPath.user.redeemLoyaltyPoints.method,
        url: apiPath.user.redeemLoyaltyPoints.url,
        data,
    })
}