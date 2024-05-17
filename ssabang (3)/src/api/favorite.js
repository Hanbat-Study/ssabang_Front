import { localAxios } from "@/utils/http-commons";
import axios from "axios";

const local = localAxios();

function getFavoriteRooms(success, fail) {
  local.get(`/favorite-room`).then(success).catch(fail);
}

async function addFavoriteRoom(room, success, fail) {
  try {
    const response = await axios.post(`/favorite-room`, room, { withCredentials: true });
    success(response);
  } catch (error) {
    fail(error);
  }
}

function deleteFavoriteRoom(favoriteRoomId, success, fail) {
  local.delete(`/favorite-room/${favoriteRoomId}`).then(success).catch(fail);
}

export { getFavoriteRooms, addFavoriteRoom, deleteFavoriteRoom };
