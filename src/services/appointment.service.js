import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const appointmentService = {
    getUpcomingAppointemnts,
    getClinics,
    getSpecialities,
    findDoctors,
    fetchTimeslots,
    createAppointment,
    getTodayAppointment
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

function createAppointment(type, patient, doctor, date, start_time, end_time, amount) {
    let data = {
        "patient_id": patient.id,
        "doctor_id": doctor.id,
        "type": type,
        "booked_date": date,
        "start_time": start_time,
        "end_time": end_time,
        "amount": amount
    }
    return axios({
        method: apiPath.appointment.createAppointment.method,
        url: apiPath.appointment.createAppointment.url,
        data
    })
}

function getTodayAppointment(id) {
    return axios({
        method: apiPath.appointment.todayAppointment(id).method,
        url: apiPath.appointment.todayAppointment(id).url,
    })
}