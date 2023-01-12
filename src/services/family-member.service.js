import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const familyMemberService = {
    fetchFamilyMembers,
    addFamilyMember
}

function fetchFamilyMembers() {
    return axios({
        method: apiPath.familyMembers.fetch.method,
        url: apiPath.familyMembers.fetch.url,
    })
}

function addFamilyMember(data) {
    return axios({
        method: apiPath.familyMembers.add.method,
        url: apiPath.familyMembers.add.url,
        data
    })
}