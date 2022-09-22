import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const medicationService = {
    getAppointmentHistory,
    getMedications,
    getReminderSlots
}

function getAppointmentHistory(id) {
    return axios({
        method: apiPath.reports.getAppointmentHistory(id).method,
        url: apiPath.reports.getAppointmentHistory(id).url,
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