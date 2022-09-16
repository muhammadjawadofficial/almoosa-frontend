let basePath = process.env.VUE_APP_API_BASE_URL + "api/v1/";

let getApiObject = (method, url, pre = basePath) => {
    return { method, url: pre + url };
}

export const apiPath = {
    //Login
    login: {
        doctor: getApiObject("post", "auth/doctor/login"),
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
        upcoming: (id) => getApiObject("get", "appointments/upcoming?" + id),
        clinics: getApiObject("get", "clinics"),
        specialities: getApiObject("get", "specialities"),
        findDoctors: (speciality, date, clinic) => getApiObject("get", "users/doctors?speciality_id=" + speciality + "&date=" + date + (clinic ? "&clinic_id=" + clinic : '')),
        fetchTimeslots: (doctor, date) => getApiObject("get", "timeslots?doctor_id=" + doctor + (date ? "&date=" + date : '')),
        createAppointment: getApiObject("post", "appointments"),
        updateAppointment: (id) => getApiObject("patch", "appointments/" + id),
        cancelAppointment: (id) => getApiObject("delete", "appointments/" + id),
        todayAppointment: (id) => getApiObject("get", "appointments/today?doctor_id=" + id),
        ratePhysician: (id) => getApiObject("patch", "doctor/rating/" + id),
    },

    promotions: {
        assigned: getApiObject("get", "promotions/assigned"),
        apply: getApiObject("post", "promotions/apply"),
    },

    reports: {
        appointmentWithReports: (id, type) => getApiObject("get", "appointments/reports?patient_id=" + id + "&type=" + type),
    },

    user: {
        updateProfile: (id) => getApiObject("patch", "users/" + id)
    },

    patient: {
        criticalCare: (id) => getApiObject("get", "users?physician_id=" + id + "&is_critical_care=1"),
        inPatients: (id) => getApiObject("get", "users?physician_id=" + id + "&is_inpatient=1"),
    },

    insurance: {
        addNew: getApiObject("post", "insurances"),
        fetch: (id) => getApiObject("get", "insurances?patient_id=" + id),
    }
};