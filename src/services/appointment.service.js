import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const appointmentService = {
    getUpcomingAppointemnts,
    getClinics,
    getSpecialities,
    findDoctors,
    fetchTimeslots,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getTodayAppointment,
    ratePhysician,
    getAppointmentHistory
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

function getSpecialities() {
    return axios({
        method: apiPath.appointment.specialities.method,
        url: apiPath.appointment.specialities.url
    })
}

function findDoctors(speciality, date, clinic) {
    return axios({
        method: apiPath.appointment.findDoctors(speciality, date, clinic).method,
        url: apiPath.appointment.findDoctors(speciality, date, clinic).url
    })
}

function fetchTimeslots(doctor, date) {
    return axios({
        method: apiPath.appointment.fetchTimeslots(doctor, date).method,
        url: apiPath.appointment.fetchTimeslots(doctor, date).url
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

function updateAppointment(id, timeslot, mrn_number, type, date) {
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

function ratePhysician(id, rating) {
    return axios({
        method: apiPath.appointment.ratePhysician(id).method,
        url: apiPath.appointment.ratePhysician(id).url,
        data: { rating }
    })
}

function getAppointmentHistory(patient_id, doctor_id) {
    return axios({
        method: apiPath.appointment.fetchAppointmentHistory(patient_id, doctor_id).method,
        url: apiPath.appointment.fetchAppointmentHistory(patient_id, doctor_id).url
    })
}
