import { localAxios } from "@/utils/http-commons";
import axios from "axios";

const local = localAxios();

// function listArticle(param, success, fail) {
//   local.get(`/board`, { params: param }).then(success).catch(fail);
// }

// function detailArticle(articleno, success, fail) {
//   local.get(`/board/${articleno}`).then(success).catch(fail);
// }

async function createComment(boardId, content, success, fail) {
  try {
    const response = await axios.post(`/comment/${boardId}`, content, { withCredentials: true });
    success(response);
  } catch (error) {
    fail(error);
  }
}

// function getModifyArticle(articleno, success, fail) {
//   local.get(`/board/modify/${articleno}`).then(success).catch(fail);
// }

async function updateComment(commentId, content, success, fail) {
  try {
    const response = await axios.patch(
      `/comment/${commentId}`,
      { content: content },
      { withCredentials: true }
    );
    success(response);
  } catch (error) {
    fail(error);
  }
}

async function deleteComment(commentId, success, fail) {
  try {
    const response = await axios.delete(`/comment/${commentId}`, { withCredentials: true });
    success(response);
  } catch (error) {
    fail(error);
  }
}

async function getCommentsByUser(success, fail) {
  try {
    const response = await axios.get("/comment/mine", { withCredentials: true });
    success(response);
  } catch (error) {
    fail(error);
  }
}

export { createComment, updateComment, deleteComment, getCommentsByUser };
