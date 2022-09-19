import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const patientService = {
    fetchCriticalCare
}

function fetchCriticalCare() {
    return axios({
        method: apiPath.patient.criticalCare().method,
        url: apiPath.patient.criticalCare().url,
    })
}