import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const reportService = {
    getAppointmentsWithReports
}

function getAppointmentsWithReports(id, type) {
    return axios({
        method: apiPath.reports.appointmentWithReports(id, type).method,
        url: apiPath.reports.appointmentWithReports(id, type).url,
    })
}