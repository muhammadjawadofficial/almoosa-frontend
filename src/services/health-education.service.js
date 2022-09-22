import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const healthEducationService = {
    fetchHealthEducations,
    fetchHealthEducationsDetails
}

function fetchHealthEducations() {
    return axios({
        method: apiPath.healthEducation.fetch.method,
        url: apiPath.healthEducation.fetch.url,
    })
}
function fetchHealthEducationsDetails(id) {
    return axios({
        method: apiPath.healthEducation.details(id).method,
        url: apiPath.healthEducation.details(id).url,
    })
}