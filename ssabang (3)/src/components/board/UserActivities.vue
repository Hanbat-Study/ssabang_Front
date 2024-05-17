<template>
  <div class="user-activity">
    <div class="tabs">
      <span @click="fetchData('boards')" :class="{ active: currentView === 'boards' }"
        >내 글 보기</span
      >
      <span @click="fetchData('comments')" :class="{ active: currentView === 'comments' }"
        >내 댓글 보기</span
      >
    </div>

    <ul v-if="currentView === 'boards' && content.length">
      <li v-for="board in content" :key="board.boardId">
        <router-link :to="`/board/detail/${board.boardId}`" class="content-link">
          <div>{{ truncateText(board.title, 20) }}</div>
          <div class="date">{{ formatDate(board.createAt) }}</div>
        </router-link>
      </li>
    </ul>
    <ul v-if="currentView === 'comments' && content.length">
      <li v-for="comment in content" :key="comment.commentId">
        <router-link :to="`/board/detail/${comment.boardId}`" class="content-link">
          <div>{{ truncateText(comment.content, 20) }}</div>
          <div class="date">{{ formatDate(comment.createAt) }}</div>
        </router-link>
      </li>
    </ul>
    <div v-if="!content.length">
      <p>활동을 시작해보세요!</p>
    </div>

    <Pagination
      v-if="totalPages > 1"
      :total-pages="totalPages"
      :current-page="currentPage"
      @change-page="fetchData(currentView, $event)"
    />
  </div>
</template>

<script>
import Pagination from "./Pagination.vue";
import { getBoardsByUser } from "@/api/board"; // API 함수 import
import { getCommentsByUser } from "@/api/comment"; // API 함수 import

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      totalPages: 1,
      currentPage: 1,
      content: [],
      currentView: "boards", // 기본값을 'boards'로 설정
    };
  },
  methods: {
    // fetchData(type, page = 1) {
    //   this.currentView = type;
    //   // 더미 데이터 사용
    //   const itemsPerPage = 7;
    //   if (type === 'boards') {
    //     const allBoards = [
    //       { boardId: 1, title: 'Vue.js 프로젝트', createAt: '2024-01-01' },
    //       { boardId: 2, title: 'JavaScript 학습', createAt: '2024-01-02' },
    //       { boardId: 3, title: 'React 프로젝트', createAt: '2024-01-03' },
    //       { boardId: 4, title: 'Angular 학습', createAt: '2024-01-04' },
    //       { boardId: 5, title: 'Svelte 프로젝트', createAt: '2024-01-05' },
    //       { boardId: 6, title: 'Node.js 학습', createAt: '2024-01-06' },
    //       { boardId: 7, title: 'Express.js 프로젝트', createAt: '2024-01-07' },
    //       { boardId: 8, title: 'MongoDB 학습', createAt: '2024-01-08' },
    //       { boardId: 9, title: 'GraphQL 프로젝트', createAt: '2024-01-09' },
    //       { boardId: 10, title: 'Docker 학습', createAt: '2024-01-10' },
    //       { boardId: 11, title: 'Kubernetes 프로젝트', createAt: '2024-01-11' },
    //       { boardId: 12, title: 'Python 학습', createAt: '2024-01-12' },
    //       { boardId: 13, title: 'Django 프로젝트', createAt: '2024-01-13' },
    //       { boardId: 14, title: 'Flask 학습', createAt: '2024-01-14' },
    //       { boardId: 15, title: 'Java 학습', createAt: '2024-01-15' },
    //       { boardId: 16, title: 'Spring 프로젝트', createAt: '2024-01-16' },
    //       { boardId: 17, title: 'MySQL 학습', createAt: '2024-01-17' },
    //       { boardId: 18, title: 'PostgreSQL 프로젝트', createAt: '2024-01-18' },
    //       { boardId: 19, title: 'Redis 학습', createAt: '2024-01-19' },
    //       { boardId: 20, title: 'Elasticsearch 프로젝트', createAt: '2024-01-20' },
    //     ];
    //     this.totalPages = Math.ceil(allBoards.length / itemsPerPage);
    //     this.content = allBoards.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    //   } else if (type === 'comments') {
    //     const allComments = [
    //       { commentId: 1, content: 'Vue.js가 정말 재밌어요!', createAt: '2024-01-03', boardId: 1 },
    //       { commentId: 2, content: 'JavaScript 문제 해결', createAt: '2024-01-04', boardId: 2 },
    //       { commentId: 3, content: 'React의 Hooks는 정말 유용해요.', createAt: '2024-01-05', boardId: 3 },
    //       { commentId: 4, content: 'Angular의 의존성 주입이 흥미롭네요.', createAt: '2024-01-06', boardId: 4 },
    //       { commentId: 5, content: 'Svelte의 반응성 시스템이 마음에 들어요.', createAt: '2024-01-07', boardId: 5 },
    //       { commentId: 6, content: 'Node.js의 이벤트 루프를 이해했어요.', createAt: '2024-01-08', boardId: 6 },
    //       { commentId: 7, content: 'Express.js로 REST API를 만들었어요.', createAt: '2024-01-09', boardId: 7 },
    //       { commentId: 8, content: 'MongoDB의 NoSQL 접근 방식이 흥미로워요.', createAt: '2024-01-10', boardId: 8 },
    //       { commentId: 9, content: 'GraphQL의 쿼리 언어가 편리해요.', createAt: '2024-01-11', boardId: 9 },
    //       { commentId: 10, content: 'Docker로 컨테이너를 만들어봤어요.', createAt: '2024-01-12', boardId: 10 },
    //     ];
    //     this.totalPages = Math.ceil(allComments.length / itemsPerPage);
    //     this.content = allComments.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    //   } else {
    //     this.content = [];
    //   }

    // },
    //API 호출
    fetchData(type, page = 1) {
      this.currentView = type;
      const itemsPerPage = 7;
      this.content = [];
      const successCallback = (response) => {
        const allItems = response.data.data;
        this.totalPages = Math.ceil(allItems.length / itemsPerPage);
        this.content = allItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        this.currentPage = page;
      };
      const errorCallback = (error) => {
        console.error("Error fetching data: ", error);
      };

      if (type === "boards") {
        console.log("boards");
        getBoardsByUser(successCallback, errorCallback);
      } else if (type === "comments") {
        console.log("comments");
        getCommentsByUser(successCallback, errorCallback);
      } else {
        this.content = [];
      }
    },
    handleChangePage(page) {
      this.fetchData(this.currentView, page);
    },

    truncateText(text, maxLength) {
      if (!text) return "";
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.fetchData(this.currentView);
  },
};
</script>

<style scoped>
.user-activity {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  margin-top: 20px;
  margin-left: 30px;
  text-align: center;
  max-height: 400px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 30px;
}

.tabs span {
  cursor: pointer;
  font-size: 1.2rem;
}

.tabs .active {
  font-weight: bold;
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

a {
  text-decoration: none;
  color: #000;
}

a:hover {
  text-decoration: underline;
}

.content-link {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.date {
  font-size: 0.8rem;
  color: #666;
}
</style>
