export const userService = {
    isAuthenticatedUser,
    storeLoginInfo,
    removeLoginInfo,
    currentUser,
    getToken,
    removeToken,
    setToken,
    downloadFile
};

import axios from "axios";

const jwtTokenKey = 'token';
const userInfo = 'userInfo';

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

function getToken() {
    return localStorage.getItem(jwtTokenKey);
}
function removeToken() {
    return localStorage.removeItem(jwtTokenKey);
}
function setToken(token) {
    return localStorage.setItem(jwtTokenKey, token);
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