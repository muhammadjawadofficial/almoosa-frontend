import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const medicalReportsService = {
    fetchSickLeaveReports,
    fetchDetailMedicalReports,
    fetchDetailMedicalReportRequest,
    createDetailMedicalReportRequest,
    downloadSickLeave,
    checkDischargeSummaryAvailability
}

function fetchSickLeaveReports(query) {
    return axios({
        method: apiPath.medicalReports.fetchSickLeaves(query).method,
        url: apiPath.medicalReports.fetchSickLeaves(query).url
    })
}
function fetchDetailMedicalReports(query) {
    return axios({
        method: apiPath.medicalReports.fetchDetailMedical(query).method,
        url: apiPath.medicalReports.fetchDetailMedical(query).url
    })
}
function fetchDetailMedicalReportRequest(query) {
    return axios({
        method: apiPath.medicalReports.fetchDetailMedicalReportRequest(query).method,
        url: apiPath.medicalReports.fetchDetailMedicalReportRequest(query).url
    })
}
function createDetailMedicalReportRequest(data) {
    return axios({
        method: apiPath.medicalReports.createDetailMedicalReportRequest.method,
        url: apiPath.medicalReports.createDetailMedicalReportRequest.url,
        data
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
