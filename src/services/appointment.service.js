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

function createAppointment(type, patient, doctor, date, start_time, end_time, amount, promo) {
    let data = {
        "patient_id": patient.id,
        "doctor_id": doctor.id,
        "type": type,
        "booked_date": date,
        "start_time": start_time,
        "end_time": end_time,
        "amount": amount
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

function updateAppointment(id, date, start_time, end_time) {
    let data = {
        "booked_date": date,
        "start_time": start_time,
        "end_time": end_time,
    }
    return axios({
        method: apiPath.appointment.updateAppointment(id).method,
        url: apiPath.appointment.updateAppointment(id).url,
        data
    })
}

function cancelAppointment(id) {
    return axios({
        method: apiPath.appointment.cancelAppointment(id).method,
        url: apiPath.appointment.cancelAppointment(id).url,
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
