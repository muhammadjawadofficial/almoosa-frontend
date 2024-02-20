import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const symptopChecker = {
  fetchSymptoms,
  fetchAgeConditions,
  pData,
  getData,
};

function fetchSymptoms(id) {
  return axios({
    method: apiPath.symptomsChecker.fetch(id).method,
    url: apiPath.symptomsChecker.fetch(id).url,
  });
}
function fetchAgeConditions(id) {
  return axios({
    method: apiPath.symptomsChecker.fetchAgeConditions(id).method,
    url: apiPath.symptomsChecker.fetchAgeConditions(id).url,
  });
}
function pData(data) {
  return axios({
    method: apiPath.symptomsChecker.postData.method,
    url: apiPath.symptomsChecker.postData.url,
    data
  })
}

function getData(id) {
  return axios({
    method: apiPath.symptomsChecker.getSymptom(id).method,
    url: apiPath.symptomsChecker.getSymptom(id).url,
  })
}
