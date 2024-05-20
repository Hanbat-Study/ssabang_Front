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
      <li v-for="board in content" :key="board.boardId" @click="goToBoardDetail(board.boardId)">
        <div>{{ truncateText(board.title, 20) }}</div>
        <div class="date">{{ formatDate(board.createAt) }}</div>
      </li>
    </ul>
    <ul v-if="currentView === 'comments' && content.length">
      <li
        v-for="comment in content"
        :key="comment.commentId"
        @click="goToBoardDetail(comment.boardId)"
      >
        <div>{{ truncateText(comment.content, 20) }}</div>
        <div class="date">{{ formatDate(comment.createAt) }}</div>
      </li>
    </ul>
    <div v-if="!content.length">
      <p>활동을 시작해보세요!</p>
    </div>

    <Pagination
      v-if="totalPages > 1"
      :total-pages="totalPages"
      :current-page="currentPage"
      @change-page="handleChangePage"
    />
  </div>
</template>

<script>
import Pagination from "./Pagination.vue";
import { getBoardsByUser } from "@/api/board";
import { getCommentsByUser } from "@/api/comment";
import { useRouter } from "vue-router";

export default {
  components: {
    Pagination,
  },
  props: {
    comments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      totalPages: 1,
      currentPage: 1,
      content: [],
      currentView: "boards",
    };
  },
  watch: {
    comments(newVal) {
      if (newVal.length > 0) {
        if (this.currentView === "comments") {
          this.fetchData("comments");
          console.log(123123);
        } else {
          this.fetchData("boards");
        }
      }
    },
  },
  methods: {
    async fetchData(type, page = 1) {
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
        await getBoardsByUser(successCallback, errorCallback);
      } else if (type === "comments") {
        await getCommentsByUser(successCallback, errorCallback);
      } else {
        this.content = [];
      }
    },
    handleChangePage(page) {
      this.fetchData(this.currentView, page);
    },
    goToBoardDetail(id) {
      this.$router.push({ name: "boardDetail", params: { id } });
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
  text-align: left;
  cursor: pointer;
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
