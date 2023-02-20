import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const medicationService = {
    getAppointmentHistory,
    getAppointmentMedication,
    getMedications,
    getMedicationDetails,
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
function getMedicationDetails(id) {
    return axios({
        method: apiPath.reports.getMedicationReminders(id).method,
        url: apiPath.reports.getMedicationReminders(id).url,
    })
}
function getReminderSlots() {
    return axios({
        method: apiPath.reports.getReminderSlots.method,
        url: apiPath.reports.getReminderSlots.url,
    })
}
function setReminder(data) {
    return axios({
        method: apiPath.reports.setReminder.method,
        url: apiPath.reports.setReminder.url,
        data
    })
}