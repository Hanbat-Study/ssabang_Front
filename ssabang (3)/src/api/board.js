import { localAxios } from "@/utils/http-commons";
import axios from "axios";

const local = localAxios();

// function createBoard(success, fail) {
//   local.Post(`/board`).then(success).catch(fail);
// }

// async function createBoard(board, success, fail) {
//   try {
//     const response = await axios.post(`/board`, board, { withCredentials: true });
//     success(response);
//   } catch (error) {
//     fail(error);
//   }
// }

function createBoard(board, success, fail) {
  axios.post(`/board`, board, { withCredentials: true }).then(success).catch(fail);
}

async function getBoardDetail(boardId, success, fail) {
  try {
    const response = await axios.get(`/board/${boardId}`, { withCredentials: true });
    success(response);
  } catch (error) {
    fail(error);
  }
}

async function deleteBoard(boardId, success, fail) {
  try {
    const response = await axios.delete(`/board/${boardId}`, { withCredentials: true });
    success(response);
  } catch (error) {
    fail(error);
  }
}

async function updateBoard(boardId, board, success, fail) {
  try {
    const response = await axios.patch(`/board/${boardId}`, board, { withCredentials: true });
    success(response);
  } catch (error) {
    fail(error);
  }
}

async function getBoardsByUser(success, fail) {
  try {
    const response = await axios.get("/board/mine", { withCredentials: true });
    success(response);
  } catch (error) {
    fail(error);
  }
}

async function getBoards(success, fail) {
  try {
    const response = await axios.get(`/board/list`, { withCredentials: true });
    success(response);
  } catch (error) {
    fail(error);
  }
}

export { createBoard, getBoardDetail, getBoardsByUser, updateBoard, deleteBoard, getBoards };
