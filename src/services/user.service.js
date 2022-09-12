export const userService = {
    isAuthenticatedUser,
    storeLoginInfo,
    removeLoginInfo,
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
    downloadFile
};

import axios from "axios";

const jwtTokenKey = 'token';
const userInfo = 'userInfo';

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
function downloadFile(url) {
    let userToken = userService.getToken();
    userService.removeToken();
    let urlSplitArray = url.split("/");
    let fileName = urlSplitArray[urlSplitArray.length - 1];
    axios({
        url: url,
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
        userService.setToken(userToken);
    });
}