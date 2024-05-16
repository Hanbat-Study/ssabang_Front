import { localAxios } from "@/util/http-commons";

const local = localAxios();

function getFavortieRooms(success, fail) {
  local.get(`/favorite-room`).then(success).catch(fail);
}

function createFavoriteRoom(success, fail) {
  local.post(`/favorite-room`).then(success).catch(fail);
}

function deleteFavoriteRoom(favoriteRoomId, success, fail) {
  local.delete(`/favorite-room/${favoriteRoomId}`).then(success).catch(fail);
}

export {
    getFavortieRooms,
    createFavoriteRoom,
    deleteFavoriteRoom,
};