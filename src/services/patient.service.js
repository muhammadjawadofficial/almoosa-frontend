import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const patientService = {
    fetchCriticalCare,
    fetchInPatients
}

function fetchCriticalCare(id) {
    return axios({
        method: apiPath.patient.criticalCare(id).method,
        url: apiPath.patient.criticalCare(id).url,
    })
}

function fetchInPatients(id) {
    return axios({
        method: apiPath.patient.inPatients(id).method,
        url: apiPath.patient.inPatients(id).url,
    })
}