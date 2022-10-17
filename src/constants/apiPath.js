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
        getDepartments: getApiObject("get", "departments"),
    },

    loginOtp: {
        resend: getApiObject("post", "otp/send"),
        verify: getApiObject("post", "otp/verify"),
    },

    appointment: {
        upcoming: (id) => getApiObject("get", "appointments/upcoming?" + id),
        clinics: getApiObject("get", "clinics"),
        specialities: getApiObject("get", "specialities"),
        findDoctors: (speciality, date, clinic) => {
            let queryString = '?';
            if (speciality) {
                queryString += "speciality_id=" + speciality;
            }
            if (date) {
                queryString += (queryString != "?" ? '&' : '') + "date=" + date;
            }
            if (clinic) {
                queryString += (queryString != "?" ? '&' : '') + "clinic_id=" + clinic;
            }
            if (queryString == "?") {
                queryString = '';
            }
            return getApiObject("get", "users/doctors" + queryString);
        },
        fetchTimeslots: (doctor, date) => getApiObject("get", "timeslots?doctor_id=" + doctor + (date ? "&date=" + date : '')),
        createAppointment: getApiObject("post", "appointments"),
        updateAppointment: (id) => getApiObject("patch", "appointments/" + id),
        cancelAppointment: (id) => getApiObject("delete", "appointments/" + id),
        todayAppointment: (id) => getApiObject("get", "appointments/today?doctor_id=" + id),
        ratePhysician: (id) => getApiObject("patch", "doctor/rating/" + id),
        fetchAppointmentHistory: (patient_id, doctor_id) => getApiObject("get", "appointments/history?patient_id=" + patient_id + "&doctor_id=" + doctor_id),
    },

    promotions: {
        assigned: getApiObject("get", "promotions/assigned"),
        apply: getApiObject("post", "promotions/apply"),
    },

    reports: {
        getAppointmentHistory: (id) => getApiObject("get", "appointments/history?patient_id=" + id),
        getMedications: (id) => getApiObject("get", "medications?appointment_id=" + id),
        getReminderSlots: getApiObject("get", "reminder-slots"),
        setReminder: (id) => getApiObject("patch", "medications/" + id),
        appointmentWithReports: (id, type) => getApiObject("get", "appointments/reports?patient_id=" + id + "&type=" + type),
    },

    user: {
        updateProfile: (id) => getApiObject("patch", "users/" + id),
        getProfile: (profile) => getApiObject("get", "auth/" + profile + "/profile"),
        getProfileById: (id) => getApiObject("get", "users/?id=" + id)
    },

    patient: {
        criticalCare: (id) => getApiObject("get", "users?physician_id=" + id + "&is_critical_care=1"),
        inPatients: (id) => getApiObject("get", "users?physician_id=" + id + "&is_inpatient=1"),
    },

    insurance: {
        addNew: getApiObject("post", "insurances"),
        fetch: (id) => getApiObject("get", "insurances?patient_id=" + id + "&sort=-id"),
    },

    healthEducation: {
        fetch: getApiObject("get", "health-education"),
        details: (id) => getApiObject("get", "health-education/" + id),
    },

    servicesPackages: {
        fetch: getApiObject("get", "packages"),
        details: (id) => getApiObject("get", "health-education/" + id),
    },

    familyMembers: {
        fetch: getApiObject("get", "family-members"),
        add: getApiObject("post", "family-members/add"),
    }
};