import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const reportService = {
    getAppointmentsWithReports,
    getReportsWithAppointments
}

function getAppointmentsWithReports(id, type) {
    return axios({
        method: apiPath.reports.appointmentWithReports(id, type).method,
        url: apiPath.reports.appointmentWithReports(id, type).url,
    })
}

function getReportsWithAppointments(id) {
    return axios({
        method: apiPath.reports.reportsWithAppointments(id).method,
        url: apiPath.reports.reportsWithAppointments(id).url,
    })
}