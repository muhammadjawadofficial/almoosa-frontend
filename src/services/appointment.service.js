import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const appointmentService = {
    getUpcomingAppointemnts,
    getClinics,
    getClinicsV1,
    getSpecialities,
    getSpecialitiesV1,
    getSymptomsSpecialitiesV1,
    findDoctors,
    fetchTimeslots,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getTodayAppointment,
    ratePhysician,
    getAppointmentHistory,
    createPayment,
    initializePayment,
    getAppointmentInstructions,
    getNearestAvailability,
    fetchPaymentsTypes,
    fetchTamaraUrl,
    getSymptomsSpecialitiesSuggested,
    oneStepCheckout,
    joinTeleConsultation,
    ringPatient
}

function getUpcomingAppointemnts(id) {
    return axios({
        method: apiPath.appointment.upcoming(id).method,
        url: apiPath.appointment.upcoming(id).url
    })
}

function getClinics() {
    return axios({
        method: apiPath.appointment.clinics.method,
        url: apiPath.appointment.clinics.url
    })
}

function getClinicsV1() {
    return axios({
        method: apiPath.appointment.clinicsV1.method,
        url: apiPath.appointment.clinicsV1.url
    })
}

function getSpecialities(query) {
    return axios({
        method: apiPath.appointment.specialities(query).method,
        url: apiPath.appointment.specialities(query).url
    })
}

function getSpecialitiesV1() {
    return axios({
        method: apiPath.appointment.specialitiesV1.method,
        url: apiPath.appointment.specialitiesV1.url
    })
}
function getSymptomsSpecialitiesV1() {
    return axios({
        method: apiPath.appointment.specialitiesV1.method,
        url: apiPath.appointment.specialitiesV1.url
    })
}
function findDoctors(speciality, date, clinic, bookingType, currentLang) {
    return axios({
        method: apiPath.appointment.findDoctors(speciality, date, clinic, bookingType, currentLang).method,
        url: apiPath.appointment.findDoctors(speciality, date, clinic, bookingType, currentLang).url
    })
}

function fetchTimeslots(doctor, date, type, location_id) {
    return axios({
        method: apiPath.appointment.fetchTimeslots(doctor, date, type, location_id).method,
        url: apiPath.appointment.fetchTimeslots(doctor, date, type, location_id).url
    })
}

function createAppointment(type, patient, doctor, date, timeslot, amount, promo) {
    let data = {
        "slot_id": timeslot.id,
        "mrn_number": patient.mrn_number,
        "type": type,
        "is_rescheduled": 0,
        "reschedule_app_id": null
    }
    if (promo) {
        if (promo == 'points') {
            data.use_loyality = true;
        } else {
            data.use_loyality = false;
            data.promo_code = promo;
        }
    }
    return axios({
        method: apiPath.appointment.createAppointment.method,
        url: apiPath.appointment.createAppointment.url,
        data
    })
}

function updateAppointment(id, timeslot, mrn_number, type) {
    let data = {
        "old_app_id": id,
        "slot_id": timeslot.id,
        "mrn_number": mrn_number,
        "type": type
    }
    return axios({
        method: apiPath.appointment.updateAppointment.method,
        url: apiPath.appointment.updateAppointment.url,
        data
    })
}

function cancelAppointment(id) {
    return axios({
        method: apiPath.appointment.cancelAppointment.method,
        url: apiPath.appointment.cancelAppointment.url,
        data: {
            "appointment_id": id
        }
    })
}

function getTodayAppointment(id) {
    return axios({
        method: apiPath.appointment.todayAppointment(id).method,
        url: apiPath.appointment.todayAppointment(id).url,
    })
}

function ratePhysician(rating) {
    return axios({
        method: apiPath.appointment.ratePhysician.method,
        url: apiPath.appointment.ratePhysician.url,
        data: rating
    })
}

function getAppointmentHistory(patient_id, doctor_id) {
    return axios({
        method: apiPath.appointment.fetchAppointmentHistory(patient_id, doctor_id).method,
        url: apiPath.appointment.fetchAppointmentHistory(patient_id, doctor_id).url
    })
}

function createPayment(data) {
    return axios({
        method: apiPath.appointment.createPayment.method,
        url: apiPath.appointment.createPayment.url,
        data
    })
}

function initializePayment(data) {
    return axios({
        method: apiPath.appointment.initializePayment.method,
        url: apiPath.appointment.initializePayment.url,
        data
    })
}

function getAppointmentInstructions(query) {
    return axios({
        method: apiPath.appointment.getInstructions(query).method,
        url: apiPath.appointment.getInstructions(query).url
    })
}

function getNearestAvailability(payload) {
    return axios({
        method: apiPath.appointment.getNearestAvailability.method,
        url: apiPath.appointment.getNearestAvailability.url,
        data: payload
    })
}
function fetchPaymentsTypes(query) {
    return axios({
        method: apiPath.appointment.getPaymentsTypes(query).method,
        url: apiPath.appointment.getPaymentsTypes(query).url,
    });
}
function fetchTamaraUrl(data) {
    return axios({
        method: apiPath.appointment.getTamaraUrl.method,
        url: apiPath.appointment.getTamaraUrl.url,
        data,
    });
}
function oneStepCheckout(data) {
    return axios({
        method: apiPath.appointment.oneStepCheckout.method,
        url: apiPath.appointment.oneStepCheckout.url,
        data,
    });
}
function getSymptomsSpecialitiesSuggested() {
    return axios({
        method: apiPath.appointment.symptomsSpecialitiesV1.method,
        url: apiPath.appointment.symptomsSpecialitiesV1.url
    })
}
function joinTeleConsultation(data) {
    return axios({
        method: apiPath.appointment.joinTeleConsultation.method,
        url: apiPath.appointment.joinTeleConsultation.url,
        data
    })
}
function ringPatient(data) {
    return axios({
        method: apiPath.appointment.ringPatient.method,
        url: apiPath.appointment.ringPatient.url,
        data
    })
}