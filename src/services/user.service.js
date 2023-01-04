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
    getPaymentAmount
};

import axios from "axios";

const jwtTokenKey = 'token';
const userInfo = 'userInfo';
const guardianInfo = 'guardianInfo';

const preferredLayout = 'user-layout';

const userRole = 'userRole';

const paymentToBeBook = 'booking'

function isAuthenticatedUser() {
    return !!localStorage.getItem(jwtTokenKey);
}

function storeLoginInfo(user, token) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem(userInfo, JSON.stringify(user));
    localStorage.setItem(jwtTokenKey, token);
}

function removeLoginInfo() {
    localStorage.removeItem(userInfo);
    localStorage.removeItem(jwtTokenKey);
}

function currentUser() {
    return JSON.parse(localStorage.getItem(userInfo));
}
function storeUserInfo(user) {
    localStorage.setItem(userInfo, JSON.stringify(user));
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
    return localStorage.getItem(jwtTokenKey);
}
function removeToken() {
    return localStorage.removeItem(jwtTokenKey);
}
function setToken(token) {
    return localStorage.setItem(jwtTokenKey, token);
}
function setSelectedLayout(lang) {
    return localStorage.setItem(preferredLayout, lang);
}
function getSelectedLayout() {
    return localStorage.getItem(preferredLayout);
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
function downloadFile(file) {
    let fileName = file.name;
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
    });
}
function updateProfile(profile) {
    return axios({
        method: apiPath.user.updateProfile(currentUser().id).method,
        url: apiPath.user.updateProfile(currentUser().id).url,
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
        method: apiPath.user.getWalletAmount(currentUser().id).method,
        url: apiPath.user.getWalletAmount(currentUser().id).url,
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
function getPaymentAmount(mrn, appointmentId, schemeId, serviceId) {
    let data = {
        "Mrno": mrn,
        "ApptAllocationID": appointmentId,
        "PatientSchemeID": schemeId,
        "ServiceID": serviceId,
    }
    return axios({
        method: apiPath.user.getPaymentAmount.method,
        url: apiPath.user.getPaymentAmount.url,
        // method: "get",
        // url: 'http://localhost:8008/paymentAmount.json',
        data
    })
}