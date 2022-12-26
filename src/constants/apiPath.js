let basePath = process.env.VUE_APP_API_BASE_URL;

let getApiObject = (method, url, version = "v1", pre = basePath) => {
    return { method, url: pre + "api/" + version + "/" + url };
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
        getNationalities: getApiObject("get", "nationalities", 'v2', process.env.VUE_APP_API_V2_BASE_URL),
        getDepartments: getApiObject("get", "departments"),
        medicalFile: getApiObject("post", "auth/patient/register", "v2", process.env.VUE_APP_API_V2_BASE_URL),
    },

    loginOtp: {
        resend: getApiObject("post", "otp/send"),
        verify: getApiObject("post", "otp/verify"),
    },

    appointment: {
        upcoming: (id) => getApiObject("get", "appointments/upcoming?" + id, "v2", process.env.VUE_APP_API_V2_BASE_URL),
        clinics: getApiObject("get", "clinics", "v2", process.env.VUE_APP_API_V2_BASE_URL),
        specialities: getApiObject("get", "specialities", "v2", process.env.VUE_APP_API_V2_BASE_URL),
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
            return getApiObject("get", "users/doctors" + queryString, "v2", process.env.VUE_APP_API_V2_BASE_URL);
        },
        fetchTimeslots: (doctor, date) => getApiObject("get", "timeslots?doctor_id=" + doctor + (date ? "&date=" + date : ''), "v2", process.env.VUE_APP_API_V2_BASE_URL),
        createAppointment: getApiObject("post", "appointments", "v2", process.env.VUE_APP_API_V2_BASE_URL),
        updateAppointment: (id) => getApiObject("patch", "appointments/" + id),
        cancelAppointment: (id) => getApiObject("delete", "appointments/" + id),
        todayAppointment: (id) => getApiObject("get", "appointments/today?doctor_id=" + id, 'v2', process.env.VUE_APP_API_V2_BASE_URL),
        ratePhysician: (id) => getApiObject("patch", "doctor/rating/" + id),
        fetchAppointmentHistory: (patient_id, doctor_id) => getApiObject("get", "appointments/history?patient_id=" + patient_id + "&doctor_id=" + doctor_id, "v2", process.env.VUE_APP_API_V2_BASE_URL),
    },

    promotions: {
        assigned: getApiObject("get", "promotions/assigned"),
        apply: getApiObject("post", "promotions/apply"),
    },

    timeline: {
        details: (id) => getApiObject("get", "timelines?appointment_id=" + id),
    },

    reports: {
        getAppointmentHistory: (id) => getApiObject("get", "appointments/history?patient_id=" + id, "v2", process.env.VUE_APP_API_V2_BASE_URL),
        getAppointmentMedication: (id) => getApiObject("get", "appointments/with-medications?patient_id=" + id, "v2", process.env.VUE_APP_API_V2_BASE_URL),
        getMedications: (id) => getApiObject("get", "medications?appointment_id=" + id, "v2", process.env.VUE_APP_API_V2_BASE_URL),
        getReminderSlots: getApiObject("get", "reminder-slots"),
        setReminder: (id) => getApiObject("patch", "medications/" + id),
        appointmentWithReports: (id, type) => getApiObject("get", "appointments/reports?patient_id=" + id + "&type=" + type, "v2", process.env.VUE_APP_API_V2_BASE_URL),
        reportsWithAppointments: (id) => getApiObject("get", "reports?appointment_id=" + id, "v2", process.env.VUE_APP_API_V2_BASE_URL),
    },

    user: {
        updateProfile: (id) => getApiObject("patch", "users/" + id, "v2", process.env.VUE_APP_API_V2_BASE_URL),
        getProfile: (profile) => getApiObject("get", "auth/" + profile + "/profile", (profile == 'doctor' ? 'v1' : "v2"), profile == 'doctor' ? process.env.VUE_APP_API_BASE_URL : process.env.VUE_APP_API_V2_BASE_URL),
        getProfileById: (id) => getApiObject("get", "users/?id=" + id)
    },

    patient: {
        criticalCare: (id) => getApiObject("get", "users?physician_id=" + id + "&is_critical_care=1"),
        inPatients: (id) => getApiObject("get", "users/inpatient?physician_id=" + id, "v2", process.env.VUE_APP_API_V2_BASE_URL),
    },

    insurance: {
        addNew: getApiObject("post", "insurances"),
        servies: getApiObject("get", "insurances/services", "v2", process.env.VUE_APP_API_V2_BASE_URL),
        fetch: (id) => getApiObject("get", "insurances?patient_id=" + id + "&sort=-id", "v2", process.env.VUE_APP_API_V2_BASE_URL),
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