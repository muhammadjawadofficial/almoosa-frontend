import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const appointmentService = {
    getUpcomingAppointemnts,
    getClinics,
    getSpecialities,
    findDoctors
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