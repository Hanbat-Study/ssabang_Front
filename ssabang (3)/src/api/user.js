import { localAxios } from "@/util/http-commons";

const local = localAxios();

function signUp(success, fail) {
  local.post(`/user/signup`).then(success).catch(fail);
}

function logOut(success, fail) {
  local.post(`/user/logout`).then(success).catch(fail);
}

function getUserProfile(success, fail) {
  local.get(`/user`).then(success).catch(fail);
}

function updateUserProfile(success, fail) {
    local.patch(`/user`).then(success).catch(fail);
  }

export {
    signUp,
    logOut,
    getUserProfile,
    updateUserProfile,
};