import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const familyMemberService = {
    fetchFamilyMemberRelations,
    fetchFamilyMembers,
    addFamilyMember,
    deleteFamilyMember
}

function fetchFamilyMemberRelations() {
    return axios({
        method: apiPath.familyMembers.fetchRelations.method,
        url: apiPath.familyMembers.fetchRelations.url,
    })
}

function fetchFamilyMembers(query = '') {
    return axios({
        method: apiPath.familyMembers.fetch(query).method,
        url: apiPath.familyMembers.fetch(query).url,
    })
}

function addFamilyMember(data) {
    return axios({
        method: apiPath.familyMembers.add.method,
        url: apiPath.familyMembers.add.url,
        data
    })
}

function deleteFamilyMember(data) {
    let query = "?id=" + data.id;
    return axios({
        method: apiPath.familyMembers.delete(query).method,
        url: apiPath.familyMembers.delete(query).url,
        data
    })
}