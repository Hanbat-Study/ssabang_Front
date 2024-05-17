import { localAxios } from "@/utils/http-commons";
import axios from "axios";

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

async function getUserCampus(success, fail) {
  try {
    const response = await axios.get(`/user/campus`, { withCredentials: true });
    success(response);
  } catch (error) {
    fail(error);
  }
}

function updateUserProfile(success, fail) {
  local.patch(`/user`).then(success).catch(fail);
}

export { signUp, logOut, getUserProfile, getUserCampus, updateUserProfile };
