import { localAxios } from "@/util/http-commons";

const local = localAxios();

// function createBoard(success, fail) {
//   local.Post(`/board`).then(success).catch(fail);
// }


function createBoard(board, success, fail) {
  console.log("boardjs article", board);
  local.post(`/board`, JSON.stringify(board)).then(success).catch(fail);
}

function getBoardDetail(boardId, success, fail) {
  local.get(`/board/${boardId}`).then(success).catch(fail);
}
function deleteBoard(boardId, success, fail) {
  local.delete(`/board/${boardId}`).then(success).catch(fail);
}

function updateBoard(boardId, board, success, fail) {
  local.patch(`/board/${boardId}`, JSON.stringify(board)).then(success).catch(fail);
}

function getBoardsByUser(success, fail) {
  local.get(`/board/mine`).then(success).catch(fail);
}

function getBoards(success, fail) {
  local.get(`/board/list`).then(success).catch(fail);
}



export {
  createBoard,
  getBoardDetail,
  getBoardsByUser,
  updateBoard,
  deleteBoard,
  getBoards
};