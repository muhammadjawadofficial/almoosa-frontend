import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedAppointment: null,
        booking: {
            type: null,
            speciality: null,
            clinic: null,
            date: null,
            timeslot: null,
            startTime: null,
            endTime: null,
            amount: null,
            doctor: null,
            nearestDate: null
        },
        paymentObject: {
            currency: null,
            amount: null,
            appointment_id: null,
            method: null,
            payableAmount: null
        },
        doctorsList: null,
        isReschedule: false,
        teleConsultation: null
    },
    actions: {
        resetBookAppointment({ commit }, data) {
            commit('RESET_BOOK_APPOINTMENT', data || {
                type: null,
                speciality: null,
                clinic: null,
                date: null,
                startTime: null,
                endTime: null,
                amount: "100",
                doctor: null,
                nearestDate: null
            })
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
        setBookingTimeslot({ commit }, data) {
            commit('SET_BOOKING_TIMESLOT', data)
        },
        setBookingStartTime({ commit }, data) {
            commit('SET_BOOKING_START_TIME', data)
        },
        setBookingEndTime({ commit }, data) {
            commit('SET_BOOKING_END_TIME', data)
        },
        setBookingDoctor({ commit }, data) {
            commit('SET_BOOKING_DOCTOR', data)
        },
        setBookingAmount({ commit }, data) {
            commit('SET_BOOKING_AMOUNT', data)
        },
        setDoctorsList({ commit }, data) {
            commit('SET_DOCTORS_LIST', data)
        },
        setIsReschedule({ commit }, data) {
            commit('SET_IS_RESCHEDULE', data)
        },
        setPaymentObject({ commit }, data) {
            commit('SET_PAYMENT_OBJECT', data)
        },
        setBookingNearestDate({ commit }, data) {
            commit('SET_BOOKING_NEAREST_DATE', data)
        },
        setTeleConsultation({ commit }, data) {
            commit('SET_TELE_CONSULTATION', data)
        },
    },
    mutations: {
        RESET_BOOK_APPOINTMENT(state, booking) {
            Vue.set(state, 'booking', booking)
        },
        SET_SELECTED_APPOINTMENT(state, selectedAppointment) {
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
        SET_BOOKING_TIMESLOT(state, timeslot) {
            Vue.set(state.booking, 'timeslot', timeslot)
        },
        SET_BOOKING_START_TIME(state, startTime) {
            state.booking.startTime = startTime;
        },
        SET_BOOKING_END_TIME(state, endTime) {
            state.booking.endTime = endTime;
        },
        SET_BOOKING_DOCTOR(state, doctor) {
            state.booking.doctor = doctor;
        },
        SET_BOOKING_AMOUNT(state, amount) {
            state.booking.amount = amount;
            state.booking.payableAmount = amount;
        },
        SET_DOCTORS_LIST(state, doctorsList) {
            Vue.set(state, 'doctorsList', doctorsList)
        },
        SET_IS_RESCHEDULE(state, isReschedule) {
            state.isReschedule = isReschedule;
        },
        SET_PAYMENT_OBJECT(state, paymentObject) {
            Vue.set(state, 'paymentObject', paymentObject)
        },
        SET_BOOKING_NEAREST_DATE(state, nearestDate) {
            state.booking.nearestDate = nearestDate;
        },
        SET_TELE_CONSULTATION(state, teleConsultation) {
            state.teleConsultation = teleConsultation;
        }
    },
    getters: {
        getSelectedAppointment: (state) => state.selectedAppointment,
        getBookingMethod: (state) => state.booking.type,
        getBookingSpeciality: (state) => state.booking.speciality,
        getBookingClinic: (state) => state.booking.clinic,
        getBookingDate: (state) => state.booking.date,
        getBookingTimeslot: (state) => state.booking.timeslot,
        getBookingStartTime: (state) => state.booking.startTime,
        getBookingEndTime: (state) => state.booking.endTime,
        getBookingDoctor: (state) => state.booking.doctor,
        getBookingAmount: (state) => state.booking.amount,
        getDoctorsList: (state) => state.doctorsList,
        getIsReschedule: (state) => state.isReschedule,
        getPaymentObject: (state) => state.paymentObject,
        getBookingNearestDate: (state) => state.booking.nearestDate,
        getTeleConsultation: (state) => state.teleConsultation,
    }
};