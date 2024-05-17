<template>
  <div class="board-section">
    <div class="boards" v-if="paginatedBoards.length > 0">
      <div
        v-for="board in paginatedBoards"
        :key="board.boardId"
        @click="goToBoardDetail(board.boardId)"
        class="board-item"
      >
        <h4>{{ board.title }}</h4>
        <p>
          {{ board.content.length > 50 ? board.content.substring(0, 50) + "..." : board.content }}
        </p>
        <div class="footer-info">
          <div class="comments-container">
            <img src="../../assets/댓글.png" alt="댓글 아이콘" />
            <span class="comments-count">{{ board.commentCount }}</span>
          </div>
          <span class="date">{{ board.createAt }}</span>
        </div>
      </div>
    </div>
    <div v-esle>
      <lottie-player
        src="https://lottie.host/3add4552-2bb3-49ae-9833-614b4c31305a/vBfIPXviPZ.json"
        background="transparent"
        speed="1"
        style="width: 500px; height: 500px"
        loop
        autoplay
      ></lottie-player>
      <h1>게시물이 없습니다.</h1>
    </div>
    <Pagination
      v-if="totalPages > 1"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @change-page="fetchData"
    />
    <Modal v-if="showModal" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Pagination from "./Pagination.vue";
import { getBoards, getBoardsByUser } from "@/api/board";
import { useRouter } from "vue-router";
import Modal from "./Modal.vue";

const router = useRouter();

const boards = ref([]);
const currentPage = ref(1);
const itemsPerPage = 6;
const showModal = ref(false); //로그인 했다고 가정

const paginatedBoards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return boards.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(boards.value.length / itemsPerPage));

const fetchData = async (page) => {
  currentPage.value = page;
  console.log(currentPage.value);
  getBoards(
    (response) => {
      boards.value = response.data.data.map((board) => ({
        boardId: board.boardId,
        title: board.title,
        content: board.content,
        createAt: board.createAt,
        commentCount: board.commentCount,
        userId: board.userId,
        name: board.name,
        email: board.email,
      }));
    },
    (error) => {
      console.error(error);
    }
  );
};

const goToBoardDetail = (id) => {
  // const isLoggedIn = localStorage.getItem('isFirst') === 'true';
  // if (isLoggedIn) {
  router.push({ name: "boardDetail", params: { id } });
  // } else {
  //   showModal.value = true;
  //   console.log('Modal should be visible now:', showModal.value);

  // }
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  const isFirst = JSON.parse(localStorage.getItem("isFirst"));
  showModal.value = !isFirst;
  fetchData(currentPage.value);

  const script = document.createElement("script");
  script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
  script.async = true;
  document.head.appendChild(script);
});
</script>

<style scoped>
.board-section {
  width: 80%;
  max-width: 1000px;
  margin: auto;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
}

.boards {
  width: 100%;
}

.board-item {
  background: white;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
}

.board-item:hover {
  background-color: #eaeaea;
}

h4 {
  font-size: 1.25rem;
  margin-bottom: 15px;
  margin-top: 0;
}

p {
  font-size: 0.85rem;
  color: #333;
  margin-bottom: 15px;
}

.footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comments-container {
  display: flex;
  align-items: center;
}

.comments-container img {
  width: 15px;
  height: 15px;
  margin-right: 3px;
}

.date {
  font-size: 0.9rem;
  color: #666;
}

.comments-count {
  font-size: 0.85rem;
  color: #555;
}

.pagination-container {
  width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  text-align: center; /* 수평 가운데 정렬 */
  line-height: 1.5; /* 수직 가운데 정렬 */
  height: 100px; /* h2 요소의 높이 */
  display: flex; /* 요소를 행으로 표시 */
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
}
</style>
