<template>
  <div class="board-detail-container">
    <h1>{{ board.title }}</h1>
    <h1>이게 제목</h1>
    <p>{{ board.content }}</p>
    <p>이게 내용</p>
    <div v-if="board.isHost">
      <button @click="editBoard">수정하기</button>
      <button @click="deleteBoard">삭제하기</button>
    </div>
    <h3>댓글</h3>
    <ul>
      <li v-for="comment in board.commentList" :key="comment.commentId">
        {{ comment.content }} - {{ comment.createAt }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();

const board = ref({
  title: "",
  content: "",
  isHost: false,
  commentList: [],
});

const fetchBoardDetails = async () => {
  try {
    const response = await axios.get(`/api/board/details/${route.params.id}`);
    board.value = response.data;
  } catch (error) {
    console.error("Error fetching board details:", error);
  }
};

const editBoard = () => {
  router.push({ name: "boardWrite", params: { id: route.params.id } });
};

const deleteBoard = async () => {
  try {
    await axios.delete(`/api/board/${route.params.id}`);
    alert("게시글이 삭제되었습니다.");
    router.push({ name: "board" });
  } catch (error) {
    console.error("Error deleting board:", error);
  }
};

onMounted(() => {
  fetchBoardDetails();
});
</script>

<style scoped>
.board-detail-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
h1,
h3 {
  color: #333;
}
p {
  margin: 20px 0;
  line-height: 1.6;
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
button {
  margin-right: 10px;
  padding: 10px 20px;
  background: #007bff;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
</style>
