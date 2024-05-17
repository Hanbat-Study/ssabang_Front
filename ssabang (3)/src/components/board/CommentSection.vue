<template>
  <div class="comment-section">
    <div class="comment-info">
      <h4>댓글</h4>
      <img src="../../assets/댓글.png" alt="댓글 아이콘" />
      <span>{{ comments.length }}</span>
    </div>
    <ul>
      <li v-for="comment in paginatedComments" :key="comment.commentId">
        <div class="comment-header">
          <div class="comment-content">
            <div v-if="editMode === comment.commentId" class="edit-comment-container">
              <textarea
                v-model="editCommentContent"
                placeholder="댓글을 수정하세요..."
                class="edit-textarea"
              ></textarea>
              <div class="edit-buttons">
                <button @click="cancelEdit" class="cancel-button">취소</button>
                <button @click="updateComment(comment.commentId)" class="save-button">저장</button>
              </div>
            </div>
            <div v-else>
              {{ comment.content }}
            </div>
          </div>
          <div
            v-if="comment.isHost && editMode !== comment.commentId"
            ref="dropdownRef"
            class="actions-container"
          >
            <img
              src="../../assets/more_vert.png"
              alt="More Options"
              @click="toggleDropdown(comment.commentId)"
              class="more-options-icon"
            />
            <div class="dropdown" v-if="showDropdown === comment.commentId" ref="dropdown">
              <button @click="enterEditMode(comment.commentId, comment.content)">
                수정하기
                <img src="../../assets/edit.png" alt="Edit" class="dropdown-icon" />
              </button>
              <button @click="confirmDeleteComment(comment.commentId)" class="delete-button">
                삭제하기
                <img src="../../assets/delete.png" alt="Delete" class="dropdown-icon" />
              </button>
            </div>
          </div>
        </div>
        <div class="comment-date">{{ comment.createdAt }}</div>
      </li>
    </ul>
    <Pagination
      v-if="totalPages > 1"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @change-page="changePage"
    />
    <div class="comment-form">
      <textarea
        v-model="newComment"
        placeholder="댓글을 입력하세요..."
        class="new-comment-textarea"
      ></textarea>
      <button @click="submitComment" class="submit-comment-button">댓글 추가</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import Pagination from "./Pagination.vue";
import Swal from "sweetalert2";

const props = defineProps({
  comments: Array,
});

const emits = defineEmits(["add-comment", "edit-comment", "delete-comment"]);

const newComment = ref("");
const currentPage = ref(1);
const commentsPerPage = 5;
const showDropdown = ref(null); // ID of the comment with visible dropdown
const dropdownRefs = ref([]); // References for all dropdowns
const editMode = ref(null); // ID of the comment being edited
const editCommentContent = ref(""); // Content of the comment being edited

// Watch comments to update total pages when comments change
watch(
  () => props.comments.length,
  () => {
    currentPage.value = 1;
  }
);

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * commentsPerPage;
  const end = start + commentsPerPage;
  return props.comments.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(props.comments.length / commentsPerPage);
});

const submitComment = () => {
  if (newComment.value.trim() !== "") {
    emits("add-comment", {
      content: newComment.value,
    });
    newComment.value = ""; // 입력 필드 초기화
    currentPage.value = totalPages.value; // 새로운 댓글이 추가되면 마지막 페이지로 이동
  }
};

const toggleDropdown = (id) => {
  showDropdown.value = showDropdown.value === id ? null : id;
};

const enterEditMode = (id, content) => {
  editMode.value = id;
  editCommentContent.value = content;
  showDropdown.value = null;
};

const updateComment = (id) => {
  emits("edit-comment", { id, content: editCommentContent.value });
  editMode.value = null;
  editCommentContent.value = "";
};

const confirmDeleteComment = (id) => {
  Swal.fire({
    title: "댓글을 삭제하시겠습니까?",
    text: "삭제된 댓글은 복구할 수 없습니다!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "네, 삭제하겠습니다!",
    cancelButtonText: "아니요, 취소합니다.",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteComment(id);
      Swal.fire("삭제됨!", "댓글이 성공적으로 삭제되었습니다.", "success");
    }
  });
};

const deleteComment = (id) => {
  console.log(id);
  emits("delete-comment", id);
  showDropdown.value = null;
};

const cancelEdit = () => {
  editMode.value = null;
  editCommentContent.value = "";
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const clickOutside = (event) => {
  dropdownRefs.value.forEach((dropdown) => {
    if (dropdown && !dropdown.contains(event.target)) {
      showDropdown.value = null;
    }
  });
};

onMounted(() => {
  window.addEventListener("click", clickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", clickOutside);
});
</script>

<style scoped>
.comment-section {
  margin-top: 20px;
}

.comment-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.comment-info img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.comment-form {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}

.new-comment-textarea {
  flex: 1;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: none;
  height: 40px;
}

.submit-comment-button {
  padding: 10px 20px;
  background: #007bff;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  height: 40px;
}

.submit-comment-button:hover {
  background: #0056b3;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-content {
  word-break: break-word;
  white-space: pre-wrap;
  flex: 1;
  margin-right: 10px;
}

.comment-date {
  font-size: 0.85rem;
  color: #666;
  margin-top: 5px;
}

.actions-container {
  position: relative;
}

.more-options-icon {
  width: 20px;
  height: 20px;
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

.edit-comment-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.edit-textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  box-sizing: border-box;
  height: 120px; /* 더 넓게 설정 */
}

.edit-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
</style>
