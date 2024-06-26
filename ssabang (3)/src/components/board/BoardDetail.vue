<template>
  <div class="board-detail-container">
    <div class="content-box">
      <div class="header">
        <h1>{{ board.title }}</h1>
        <div class="actions-container" v-if="board.isHost && !editMode" ref="dropdownRef">
          <img
            src="../../assets/more_vert.png"
            alt="More Options"
            @click="toggleDropdown"
            class="more-options-icon"
          />
          <div class="dropdown" v-if="showDropdown">
            <button @click="enterEditMode">
              수정하기
              <img src="../../assets/edit.png" alt="Edit" class="dropdown-icon" />
            </button>
            <button @click="confirmDeleteBoard" class="delete-button">
              삭제하기
              <img src="../../assets/delete.png" alt="Delete" class="dropdown-icon" />
            </button>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <span class="board-date">작성일: {{ board.createAt }}</span>
      </div>

      <div class="board-content">
        <div v-if="editMode" class="edit-board-container">
          <textarea
            v-model="editBoardContent"
            placeholder="내용을 수정하세요..."
            class="edit-textarea"
          ></textarea>
        </div>
        <div v-else>
          {{ board.content }}
        </div>
      </div>
      <div v-if="board.imageUrl" class="board-image">
        <img
          :src="board.imageUrl"
          alt="Board Image"
          @click="showImageModal(board.imageUrl)"
          style="cursor: pointer"
        />
      </div>
      <div v-if="editMode" class="edit-buttons-container">
        <button @click="cancelEdit" class="cancel-button">취소</button>
        <button @click="editBoardHandler" class="save-button">저장</button>
      </div>
    </div>
    <CommentSection
      :comments="board.commentList"
      @add-comment="addCommentHandler"
      @edit-comment="editCommentHandler"
      @delete-comment="deleteCommentHandler"
    />
    <div class="back-button-container">
      <button @click="goToListPage" class="back-button">목록으로</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import CommentSection from "./CommentSection.vue";
import { useClickOutside } from "@/services/useClickOutside";
import { createComment, updateComment, deleteComment } from "@/api/comment"; // import your API functions
import { updateBoard, deleteBoard, getBoardDetail } from "@/api/board";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();

const emit = defineEmits(["commentListUpdated"]);

const board = ref({
  title: "",
  content: "",
  imageUrl: "",
  commentHost: {
    name: "",
  },
  isHost: false,
  commentList: [],
});

const showDropdown = ref(false);
const dropdownRef = ref(null); // reference for the dropdown
const editMode = ref(false);
const editBoardTitle = ref("");
const editBoardContent = ref("");

// api 호출
const fetchBoardDetails = async () => {
  const boardId = parseInt(route.params.id, 10);
  getBoardDetail(
    route.params.id,
    (response) => {
      board.value = response.data.data;
    },
    (error) => {
      console.error("Error fetching board details:", error);
    }
  );
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};
useClickOutside(dropdownRef, () => {
  showDropdown.value = false;
});

//board 관련 api
const enterEditMode = () => {
  editMode.value = true;
  editBoardTitle.value = board.value.title;
  editBoardContent.value = board.value.content;
  showDropdown.value = false;
};

const editBoardHandler = () => {
  const updatedBoard = {
    title: editBoardTitle.value,
    content: editBoardContent.value,
  };
  updateBoard(
    route.params.id,
    updatedBoard,
    (response) => {
      board.value.title = editBoardTitle.value;
      board.value.content = editBoardContent.value;
      editMode.value = false;
      fetchBoardDetails(); // 게시글 수정 후 페이지 갱신
      emit("commentListUpdated", "editBoard" + route.params.id + editBoardContent.value);
      console.log("Board updated:", response);

      // 수정 완료 모달창 표시
      Swal.fire({
        title: "수정 완료!",
        text: "게시글이 성공적으로 수정되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    },
    (error) => {
      console.error("Error updating board:", error);
    }
  );
};

const confirmDeleteBoard = () => {
  Swal.fire({
    title: "게시글을 삭제하시겠습니까?",
    text: "삭제된 게시글은 복구할 수 없습니다!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "예, 삭제하겠습니다!",
    cancelButtonText: "아니오, 취소합니다.",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteBoardHandler();
      router.push({ name: "board" }).then(() => {
        window.location.reload();
      });
    }
  });
};

const deleteBoardHandler = () => {
  deleteBoard(
    route.params.id,
    () => {
      Swal.fire("삭제 완료!", "게시글이 삭제되었습니다.", "success").then(() => {
        emit("commentListUpdated", "deleteBoard" + route.params.id);
        router.push({ name: "board" }); // 목록 페이지로 리다이렉트
      });
    },
    (error) => {
      console.error("Error deleting board:", error);
      Swal.fire("오류 발생!", "게시글 삭제 중 오류가 발생했습니다.", "error");
    }
  );
};

const cancelEdit = () => {
  editMode.value = false;
  editBoardContent.value = "";
};

// comment 관련 api
const addCommentHandler = (content) => {
  createComment(
    route.params.id,
    content,
    (response) => {
      fetchBoardDetails(); // 댓글 추가 후 페이지 갱신
      emit("commentListUpdated", "add-comment" + response.data.data.commentId);
      console.log(response.data.data.boardId);
    },
    (error) => {
      console.error("Error adding comment:", error);
    }
  );
};
const editCommentHandler = ({ id, content }) => {
  updateComment(
    id,
    content,
    (response) => {
      console.log("Comment updated:", response);
      // SweetAlert2 모달 창 표시
      Swal.fire({
        title: "댓글 수정 완료",
        text: "댓글이 성공적으로 수정되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      }).then(() => {
        fetchBoardDetails(); // 댓글 수정 후 페이지 갱신
        emit("commentListUpdated", "edit-comment" + id + content);
      });
    },
    (error) => {
      console.error("Error updating comment:", error);
      // 오류 발생 시 모달 창 표시
      Swal.fire({
        title: "오류 발생",
        text: "댓글 수정 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  );
};
const deleteCommentHandler = (id) => {
  deleteComment(
    id,
    () => {
      fetchBoardDetails(); // 댓글 삭제 후 페이지 갱신
      emit("commentListUpdated", "delete-comment" + id);
      console.log("Comment deleted:", id);
    },
    (error) => {
      console.error("Error deleting comment:", error);
    }
  );
};

const showImageModal = (imageUrl) => {
  Swal.fire({
    imageUrl: imageUrl,
    imageAlt: "Board Image",
    showCloseButton: true,
    showConfirmButton: false,
    width: "50%",
  });
};

const goToListPage = () => {
  router.push("/board");
};

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchBoardDetails();
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchBoardDetails();
});
</script>

<style scoped>
.board-detail-container {
  max-width: 800px;
  margin: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.content-box {
  padding: 20px;
  height: 80%;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative; /* for positioning the edit buttons */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  margin: 0;
}

.board-content {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin-top: 25px;
  font-size: 1rem;
  max-width: 100%;
}

.board-date {
  display: block;
  color: #666;
}

.actions-container {
  position: relative;
}

.more-options-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 24px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.dropdown button {
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
}

.dropdown button:hover {
  background: #f0f0f0;
}

.dropdown-icon {
  margin-right: 8px;
  width: 15px;
}

.delete-button {
  color: #ea3323;
}

.edit-board-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  box-sizing: border-box;
  height: 250px; /* 더 넓게 설정 */
}

.edit-buttons-container {
  bottom: 10px;
  right: 20px;
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: right;
}

.save-button,
.cancel-button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.save-button:hover,
.cancel-button:hover {
  background: #f0f0f0;
}

span {
  padding-top: 15px;
}

.board-image {
  margin-top: 50px;
  margin-bottom: 30px;
  text-align: left;
}

.board-image img {
  max-width: 70%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.swal2-image-modal .swal2-popup {
  width: auto !important;
  max-width: 80% !important;
}
.swal2-image-modal .swal2-image {
  max-width: 100%;
  height: auto;
}

.back-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.back-button {
  padding: 10px 20px;
  background-color: #007bff; /* Primary button color */
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-button:hover {
  background-color: #0056b3; /* Darker shade for hover effect */
  transform: scale(1.05); /* Slightly larger on hover */
}

.back-button:active {
  background-color: #004085; /* Even darker shade for active state */
  transform: scale(0.98); /* Slightly smaller on active */
}

.back-button:focus {
  outline: none; /* Remove default focus outline */
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5); /* Custom focus outline */
}
</style>
