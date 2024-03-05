import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const servicesPackagesService = {
  fetchPackages,
  fetchPackageDetails,
  fetchBookedPackages,
  fetchBookedPackagesByPackageId,
  postBookedPackageTerms,
  fetchBookedPackageTermsDownloadLink,
};

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
function fetchBookedPackagesByPackageId() {
  return axios({
    method: apiPath.servicesPackages.fetchBookedPackgesByPackageId.method,
    url: apiPath.servicesPackages.fetchBookedPackgesByPackageId.url,
  })
}
function postBookedPackageTerms(data) {
  return axios({
    method: apiPath.servicesPackages.addBookedPackageTerms.method,
    url: apiPath.servicesPackages.addBookedPackageTerms.url,
    data,
  });
}
function fetchBookedPackageTermsDownloadLink(id) {
  return axios({
    method: apiPath.servicesPackages.bookedPackageTermsDownloadLink(id).method,
    url: apiPath.servicesPackages.bookedPackageTermsDownloadLink(id).url,
  });
}