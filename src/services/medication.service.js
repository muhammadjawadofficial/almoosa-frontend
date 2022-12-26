import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const medicationService = {
    getAppointmentHistory,
    getAppointmentMedication,
    getMedications,
    getReminderSlots,
    setReminder
}

function getAppointmentHistory(id) {
    return axios({
        method: apiPath.reports.getAppointmentHistory(id).method,
        url: apiPath.reports.getAppointmentHistory(id).url,
    })
}
function getAppointmentMedication(id) {
    return axios({
        method: apiPath.reports.getAppointmentMedication(id).method,
        url: apiPath.reports.getAppointmentMedication(id).url,
    })
}
function getMedications(id) {
    return axios({
        method: apiPath.reports.getMedications(id).method,
        url: apiPath.reports.getMedications(id).url,
    })
}
function getReminderSlots() {
    return axios({
        method: apiPath.reports.getReminderSlots.method,
        url: apiPath.reports.getReminderSlots.url,
    })
}
function setReminder(id, data) {
    return axios({
        method: apiPath.reports.setReminder(id).method,
        url: apiPath.reports.setReminder(id).url,
        data
    })
}