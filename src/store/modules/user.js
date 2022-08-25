import Vue from "vue";

export default {
    namespaced: true,
    state: {
        loading: false,
        otp: "",
        userId: "",
        authState: "",
        selectedAppointment: null,
        booking: {
            type: null,
            speciality: null,
            clinic: null,
            date: null,
            startTime: null,
            endTime: null,
            amount: null,
            doctor: null,
        },
        doctorsList: null
    },
    actions: {
        setLoading({ commit }, data) {
            commit('SET_LOADING', data)
        },
        setOtp({ commit }, data) {
            commit('SET_OTP', data)
        },
        setUserId({ commit }, data) {
            commit('SET_USER_ID', data)
        },
        setAuthState({ commit }, data) {
            commit('SET_AUTH_STATE', data)
        },
        setSelectedAppointment({ commit }, data) {
            commit('SET_SELECTED_APPOINTMENT', data)
        },
        setBookingMethod({ commit }, data) {
            commit('SET_BOOKING_METHOD', data)
        },
        setBookingSpeciality({ commit }, data) {
            commit('SET_BOOKING_SPECIALITY', data)
        },
        setBookingClinic({ commit }, data) {
            commit('SET_BOOKING_CLINIC', data)
        },
        setBookingDate({ commit }, data) {
            commit('SET_BOOKING_DATE', data)
        },
        setBookingDoctor({ commit }, data) {
            commit('SET_BOOKING_DOCTOR', data)
        },
        setDoctorsList({ commit }, data) {
            commit('SET_DOCTORS_LIST', data)
        },
    },
    mutations: {
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_OTP(state, otp) {
            state.otp = otp;
        },
        SET_USER_ID(state, userId) {
            state.userId = userId;
        },
        SET_AUTH_STATE(state, authState) {
            state.authState = authState;
        },
        SET_SELECTED_APPOINTMENT(state, selectedAppointment) {
            // state.selectedAppointment = selectedAppointment;
            Vue.set(state, 'selectedAppointment', selectedAppointment)
        },
        SET_BOOKING_METHOD(state, bookingMethod) {
            state.booking.type = bookingMethod;
        },
        SET_BOOKING_SPECIALITY(state, speciality) {
            state.booking.speciality = speciality;
        },
        SET_BOOKING_CLINIC(state, clinic) {
            state.booking.clinic = clinic;
        },
        SET_BOOKING_DATE(state, date) {
            state.booking.date = date;
        },
        SET_BOOKING_DOCTOR(state, doctor) {
            state.booking.doctor = doctor;
        },
        SET_DOCTORS_LIST(state, doctorsList) {
            state.doctorsList = doctorsList;
        },
    },
    getters: {
        getLoading: (state) => state.loading,
        getOtp: (state) => state.otp,
        getUserId: (state) => state.userId,
        getAuthState: (state) => state.authState,
        getSelectedAppointment: (state) => state.selectedAppointment,
        getBookingMethod: (state) => state.booking.type,
        getBookingSpeciality: (state) => state.booking.speciality,
        getBookingClinic: (state) => state.booking.clinic,
        getBookingDate: (state) => state.booking.date,
        getBookingDoctor: (state) => state.booking.doctor,
        getDoctorsList: (state) => state.doctorsList,
    }
};