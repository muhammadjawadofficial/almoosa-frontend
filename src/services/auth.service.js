import * as axios from "axios";
import { apiPath } from "../constants/apiPath";
import constants from "../constants/constants"

export const authService = {
    login,
    loginDoctor,
    uploadId,
    register,
    resendOtp,
    verifyOtp,
    resetPassword,
    getNationalities
}


function login(payload) {
    let data = null;
    let loginVia = null;
    if (payload.type == constants.loginByOTP) {
        loginVia = apiPath.login.viaOTP;
        data = {
            [payload.method]: payload.username
        }
    } else {
        loginVia = apiPath.login.viaPassword
        data = {
            "field_name": payload.method,
            "username": payload.username,
            "password": payload.password,
        }
    }
    return axios({
        method: loginVia.method,
        url: loginVia.url,
        data
    })
}
function loginDoctor(payload) {
    let data = {
        "field_name": payload.method,
        "username": payload.username,
        "password": payload.password,
    }
    return axios({
        method: apiPath.login.doctor.method,
        url: apiPath.login.doctor.url,
        data
    })
}
function uploadId(file) {
    let data = new FormData();
    data.append('patient_id', file);
    return axios({
        method: apiPath.register.uploadId.method,
        url: apiPath.register.uploadId.url,
        data
    })
}
function register(data) {
    return axios({
        method: apiPath.register.patient.method,
        url: apiPath.register.patient.url,
        data
    })
}
function resendOtp(data) {
    return axios({
        method: apiPath.loginOtp.resend.method,
        url: apiPath.loginOtp.resend.url,
        data
    })
}
function verifyOtp(data) {
    return axios({
        method: apiPath.loginOtp.verify.method,
        url: apiPath.loginOtp.verify.url,
        data
    })
}
function resetPassword(data) {
    return axios({
        method: apiPath.login.resetPassword.method,
        url: apiPath.login.resetPassword.url,
        data
    })
}
function getNationalities() {
    return axios({
        method: apiPath.register.getNationalities.method,
        url: apiPath.register.getNationalities.url
    })
}