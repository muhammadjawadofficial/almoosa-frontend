let getApiObject = (method, url, version = "v1", pre = null) => {
    let versionKey = version.toUpperCase();
    let envKey = 'VUE_APP_API_' + versionKey + '_BASE_URL';
    let baseUrl = pre || process.env[envKey];
    // baseUrl = "http://172.16.247.126:3000/";
    // baseUrl = "http://172.16.245.252:3000/";
    // baseUrl = "http://localhost:3000/";
    return { method, url: baseUrl + "api/" + version + "/" + url };
}

export const apiPath = {
    //Login
    login: {
        doctor: getApiObject("post", "auth/doctor/login", "v2"),
        viaPassword: getApiObject("post", "auth/patient/login"),
        viaOTP: getApiObject("post", "otp/send", "v1", process.env.VUE_APP_API_V2_BASE_URL),
        verifyOTP: getApiObject("post", "otp/verify"),
        resetPassword: getApiObject("post", "password/reset"),
        changePassword: getApiObject("post", "password/change")
    },

    register: {
        patient: getApiObject("post", "auth/patient/register"),
        uploadId: getApiObject("post", "mediafiles/upload"),
        getNationalities: getApiObject("get", "nationalities", 'v2'),
        getNationalitiesV1: getApiObject("get", "nationalities"),
        getDepartments: getApiObject("get", "departments"),
        medicalFile: getApiObject("post", "auth/patient/register", "v2"),
    },

    loginOtp: {
        resend: getApiObject("post", "otp/send"),
        verify: getApiObject("post", "otp/verify", "v2"),
    },

    appointment: {
        upcoming: (id) => getApiObject("get", "appointments/upcoming?" + id, "v2"),
        clinics: getApiObject("get", "clinics", "v2"),
        homeHealthcare: getApiObject("get", "clinics/home-health-care", "v2" ),
        subspecialities : (id) => getApiObject("get", "specialities/sub/" + id, 'v2'),
        clinicsV1: getApiObject("get", "clinics"),
        specialities: (query) => getApiObject("get", "specialities/parent" + query, "v2"),
        specialitiesV1: getApiObject("get", "specialities"),
        symptomsSpecialitiesV1: getApiObject("get", "specialities/selected-questions"),
        findDoctors: (speciality, clinic, bookingType, currentLang) => {
            let queryString = '?';
            if (speciality) {
                queryString += "speciality_id=" + speciality;
            }
            if (clinic) {
                queryString += (queryString != "?" ? '&' : '') + "clinic_id=" + clinic;
            }
            if (bookingType) {
                queryString += (queryString != "?" ? '&' : '') + "appointment_type=" + bookingType.toUpperCase();
            }
            if (currentLang) {
                queryString += (queryString != "?" ? '&' : '') + "language=" + currentLang.toUpperCase();
            }
            if (queryString == "?") {
                queryString = '';
            }
            return getApiObject("get", "users/doctors" + queryString, "v2");
        },
        fetchTimeslots: (doctor, date, type, location_id) => getApiObject("get", "timeslots/by-location?doctor_id=" + doctor + (date ? "&dated=" + date : '') + (type ? "&type=" + type : '') + (location_id ? "&location_id=" + location_id : ''), "v2"),
        fetchMonthAvailability:(doctor, type, location_id, month, year)=>  getApiObject("get", "appointments/doctor/calendar?doctor_id=" + doctor +  (type ? "&appointment_type=" + type : '')+ (location_id ? "&location_id=" + location_id : '') + (month ? "&month=" + month : '') + (year ? "&year=" + year : '') , "v2"),
        createAppointment: getApiObject("post", "appointments", "v2"),
        updateAppointment: getApiObject("post", "appointments/reschedule", "v2"),
        cancelAppointment: getApiObject("post", "appointments/cancel", "v2"),
        todayAppointment: (id) => getApiObject("get", "appointments/today?doctor_id=" + id, 'v2'),
        doctorRating: (id) => getApiObject("get", "user-ratings/summary/" + id, 'v1'),
        currentDoctorRating: (query) => getApiObject("get", "user-ratings" + query),
        ratePhysician: getApiObject("post", "user-ratings"),
        fetchAppointmentHistory: (patient_id, doctor_id) => getApiObject("get", "appointments/history?mrn_number=" + patient_id + "&doctor_id=" + doctor_id, "v2"),
        createPayment: getApiObject("post", "payments/create", "v2"),
        initializePayment: getApiObject("post", "payments/initialize", "v2"),
        getInstructions: (query) => getApiObject("get", "system-settings" + query),
        getNearestAvailability: getApiObject("post", "appointments/nearest-availability", "v2"),
        getPaymentsTypes: (query) =>
            getApiObject("get", "payments/tamara/options" + query, "v1"),
        getTamaraUrl: getApiObject("post", "payments/tamara/checkout", "v1"),
        oneStepCheckout: getApiObject("post", "payments/one-step-checkout/step-one"),
        joinTeleConsultation: getApiObject("post", "tele-consultation/token"),
        ringPatient: getApiObject("post", "tele-consultation/ring"),
    },

    promotions: {
        assigned: (query) => getApiObject("get", "promotions/assigned" + query, "v2"),
        apply: getApiObject("post", "promotions/apply", "v2"),
        removePromo: getApiObject("post", "promotions/clear", "v2"),
    },

    timeline: {
        sessions: (id) => getApiObject("get", "timelines?mrn_number=" + id, "v2"),
        details: (mrn, id) => getApiObject("get", "timelines/details?mrn_number=" + mrn + "&id=" + id, "v2"),
    },

    reports: {
        getAppointmentHistory: (id) => getApiObject("get", "appointments/history?mrn_number=" + id, "v2"),
        getAppointmentMedication: (id) => getApiObject("get", "appointments/with-medications?mrn_number=" + id, "v2"),
        getMedications: (id) => getApiObject("get", "medications?appointment_id=" + id + "&is_active=2", "v2"),
        getMedicationReminders: (id) => getApiObject("get", "medications?appointment_id=" + id),
        getMedicationRequest: (id) => getApiObject("get", "medication-refills?medication_id=" + id),
        getReminderSlots: getApiObject("get", "reminder-slots"),
        updateReminder: (id) => getApiObject("patch", "medications/" + id),
        createMedication: getApiObject("post", "medications"),
        medicationRequest: getApiObject("post", "medication-refills"),
        appointmentWithReports: (id, type) => getApiObject("get", "appointments/reports?mrn_number=" + id + "&type=" + type, "v2"),
        reportsWithAppointments: (id) => getApiObject("get", "reports?appointment_id=" + id, "v2"),
    },

    user: {
        updateProfile: (id) => getApiObject("patch", "users/" + id, "v2"),
        updateV1Profile: (id) => getApiObject("patch", "users/" + id),
        getProfile: (profile, mrn) => getApiObject("get", "auth/" + profile + "/profile?mrn_number=" + mrn, (profile == 'doctor' ? 'v1' : "v2")),
        getDoctorProfile: (id) => getApiObject("get", "users?id=" + id),
        getProfileById: (id) => getApiObject("get", "users?id=" + id),
        getWalletAmount: (id) => getApiObject("get", "payments/wallet?mrn_number=" + id, "v2"),
        getBanner: (query) => getApiObject("get", "banner" + query),
        getServiceBaseRate: getApiObject("post", "payments/service/rate", "v2"),
        getPaymentAmount: getApiObject("post", "payments/amount", "v2"),
        changeLanguage: getApiObject("post", "user/change-language"),
        logout: getApiObject("post", "user/logout"),
        fetchNotifications: (query) => getApiObject("get", "notifications/fetch" + query),
        markAllAsRead: getApiObject("patch", "notifications/read"),
        fetchNotificationsSetting: (id) => getApiObject("get", "notification-config/" + id),
        updateNotificationSetting: (id) => getApiObject("patch", "notification-config/" + id),
        redeemLoyaltyPoints: getApiObject("post", "payments/redeem-loyalty-points", "v2"),
        getPartialPayments: (query) => getApiObject("get", "payments/partial" + query),
    },

    patient: {
        criticalCare: (query) => getApiObject("get", "reports/highcare" + query, "v2"),
        inPatients: (id) => getApiObject("get", "users/inpatient?doctor_id=" + id, "v2"),
    },

    insurance: {
        addNew: getApiObject("post", "insurances"),
        services: (id) => getApiObject("get", "insurances/services?mrn_number=" + id, "v2"),
        fetch: (id, type) => getApiObject("get", "insurances?mrn_number=" + id + "&type=" + type + "&sort=-id", "v2"),
        fetchByLocation: (id, type, appointment_id) => getApiObject("get", "insurances/location?mrn_number=" + id + "&type=" + type + "&appointment_id=" + appointment_id + "&sort=-id", "v2"),
    },

    healthEducation: {
        fetch: getApiObject("get", "health-education"),
        details: (id) => getApiObject("get", "health-education/" + id),
    },

    servicesPackages: {
        fetch: getApiObject("get", "packages"),
        details: (id) => getApiObject("get", "health-education/" + id),
        fetchBookedPackges: getApiObject("get", "booked-packages/patient/booked"),
        fetchBookedPackgesByPackageId: (query) => getApiObject("get", "booked-packages/patient/booked/package" + query),
        addBookedPackageTerms: getApiObject("post", "booked-package-terms"),
        bookedPackageTermsDownloadLink: (id) => getApiObject("get", "booked-package-terms/downloadLink/" + id),
        deletePackage: (id) => getApiObject("delete", "booked-packages/" + id),
    },
    symptomsChecker: {
        postData: getApiObject("post", "sc-survey"),
        fetch: (id) => getApiObject("get", "symptoms?" + id),
        fetchAgeConditions: (id) => getApiObject("get", "symptom-options-age/speciality/" + id),
        getSymptom: (id) => getApiObject("get", "sc-survey/" + id),
    },
    familyMembers: {
        fetchRelations: getApiObject("get", "family-member-relation/get/all", "v2"),
        fetch: (query) => getApiObject("get", "family-members/get/all" + query, "v2"),
        add: getApiObject("post", "family-members/add", "v2"),
        delete: (query) => getApiObject("delete", "family-members/delete" + query, "v2"),
    },

    cmsPages: {
        fetch: (query) => getApiObject("get", "cms-content" + query),
        cmsContentFields: (id) => getApiObject("get", "cms-content-fields/" + id),
    },

    freeAppointmentPromo: {
        fetchActive: (query) => getApiObject("get", "free-appointment-promo/get/active" + query),
    },

    systemConfig: {
        fetchSystemConfig: (query) => getApiObject("get", "system-settings" + query),
        encryptMrn: (mrn) => getApiObject("get", "encrypt/" + mrn),
    },

    medicalReports: {
        fetchSickLeaves: (query) => getApiObject("get", "medical-reports/sick-leaves" + query),
        fetchDetailMedical: (query) => getApiObject("get", "medical-reports/detail-medical" + query),
        fetchDetailMedicalReportRequest: (query) => getApiObject("get", "detail-medical-report-request" + query),
        createDetailMedicalReportRequest: getApiObject("post", "detail-medical-report-request"),
        checkDischargeSummaryAvailability: (query) => getApiObject("get", "medical-reports/is-discharge-summary-available" + query),
        download: (en, type, query) => getApiObject("get", `medical-reports/download/${en}/${type}` + query),
    },
};