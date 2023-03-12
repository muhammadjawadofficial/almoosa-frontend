import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const medicationService = {
    getAppointmentHistory,
    getAppointmentMedication,
    getMedications,
    getMedicationDetails,
    getMedicationRequest,
    getReminderSlots,
    updateReminder,
    requestMedication,
    createMedicationWithReminder
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
function getMedicationRequest(id) {
    return axios({
        method: apiPath.reports.getMedicationRequest(id).method,
        url: apiPath.reports.getMedicationRequest(id).url,
    })
}
function getReminderSlots() {
    return axios({
        method: apiPath.reports.getReminderSlots.method,
        url: apiPath.reports.getReminderSlots.url,
    })
}
function createMedicationWithReminder(data) {
    return axios({
        method: apiPath.reports.createMedication.method,
        url: apiPath.reports.createMedication.url,
        data
    })
}
function updateReminder(data, id) {
    return axios({
        method: apiPath.reports.updateReminder(id).method,
        url: apiPath.reports.updateReminder(id).url,
        data
    })
}
function requestMedication(data) {
    return axios({
        method: apiPath.reports.medicationRequest.method,
        url: apiPath.reports.medicationRequest.url,
        data
    })
}