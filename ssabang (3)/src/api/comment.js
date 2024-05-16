import { localAxios } from "@/util/http-commons";

const local = localAxios();

// function listArticle(param, success, fail) {
//   local.get(`/board`, { params: param }).then(success).catch(fail);
// }

// function detailArticle(articleno, success, fail) {
//   local.get(`/board/${articleno}`).then(success).catch(fail);
// }

function createComment(boardId, content, success, fail) {
  console.log("boardjs article", article);
  local.post(`/comment/${boardId}`, content).then(success).catch(fail);
}

// function getModifyArticle(articleno, success, fail) {
//   local.get(`/board/modify/${articleno}`).then(success).catch(fail);
// }

function updateComment(commentId, content, success, fail) {
  local.patch(`/comment/${commentId}`, content).then(success).catch(fail);
}

function deleteComment(commentId, success, fail) {
  local.delete(`/comment/${commentId}`).then(success).catch(fail);
}

function getCommentsByUser(success, fail) {
    local.get(`/board/mine`).then(success).catch(fail);
}

export {
    createComment,
    updateComment,
    deleteComment,
    getCommentsByUser
};