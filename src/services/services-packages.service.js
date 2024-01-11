import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const servicesPackagesService = {
    fetchPackages,
    fetchPackageDetails,
    fetchBookedPackages,
}

function fetchPackages() {
    return axios({
        method: apiPath.servicesPackages.fetch.method,
        url: apiPath.servicesPackages.fetch.url,
    })
}
function fetchPackageDetails(id) {
    return axios({
        method: apiPath.servicesPackages.details(id).method,
        url: apiPath.servicesPackages.details(id).url,
    })
}
function fetchBookedPackages() {
    return axios({
        method: apiPath.servicesPackages.fetchBookedPackges.method,
        url: apiPath.servicesPackages.fetchBookedPackges.url,
    })
}