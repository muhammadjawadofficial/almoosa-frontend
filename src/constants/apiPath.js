let basePath = process.env.VUE_APP_API_BASE_URL + "api/v1/";

let getApiObject = (method, url, pre = basePath) => {
    return { method, url: pre + url };
}

export const apiPath = {
    //Login
    login: {
        viaPassword: getApiObject("post", "auth/patient/login"),
        viaOTP: getApiObject("post", "otp/send"),
        verifyOTP: getApiObject("post", "otp/verify"),
        resetPassword: getApiObject("post", "password/reset")
    },

    register: {
        patient: getApiObject("post", "auth/patient/register"),
        uploadId: getApiObject("post", "mediafiles/upload"),
        getNationalities: getApiObject("get", "nationalities"),
    },

    loginOtp: {
        resend: getApiObject("post", "otp/send"),
        verify: getApiObject("post", "otp/verify"),
    },

    appointment: {
        upcoming: (id) => getApiObject("get", "appointments/upcoming?patient_id=" + id),
    },
};