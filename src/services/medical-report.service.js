import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const medicalReportsService = {
    fetchSickLeaveReports,
    downloadSickLeave,
    checkDischargeSummaryAvailability
}

function fetchSickLeaveReports(query) {
    return axios({
        method: apiPath.medicalReports.fetchSickLeaves(query).method,
        url: apiPath.medicalReports.fetchSickLeaves(query).url
    })
}
function checkDischargeSummaryAvailability(query) {
    return axios({
        method: apiPath.medicalReports.checkDischargeSummaryAvailability(query).method,
        url: apiPath.medicalReports.checkDischargeSummaryAvailability(query).url
    })
}
function downloadSickLeave(en, type, query) {
    return axios({
        method: apiPath.medicalReports.fetchSickLeaves(en, type, query).method,
        url: apiPath.medicalReports.fetchSickLeaves(en, type, query).url
    })
}
