<template>
  <div class="tem">
    <div>
      <span @click="fetchData('boards')" :class="{active: currentView === 'boards'}">내 글 보기</span>
      <span @click="fetchData('comments')" :class="{active: currentView === 'comments'}">내 댓글 보기</span>
    </div>

    <ul v-if="currentView === 'boards'">
      <li v-for="board in content" :key="board.id">
        <router-link :to="`/board/${board.id}`">{{ post.title }} - {{ post.date }}</router-link>
      </li>
    </ul>
    <ul v-if="currentView === 'comments'">
      <li v-for="comment in content" :key="comment.id">
        <router-link :to="`/comment/${comment.id}`">{{ comment.content }} - {{ comment.date }}</router-link>
      </li>
    </ul>

    <pagination
      :total-pages="totalPages"
      :current-page="currentPage"
      @change-page="fetchData(currentView)"
    />
  </div>
</template>


<script>
import axios from 'axios';
import Pagination from './Pagination.vue';

export default {
  components: {
    Pagination
  },
  data() {
    return {
      totalPages: 0,
      currentPage: 0,
      content: [],
      currentView: ''
    };
  },
  methods: {
    // fetchData(type, page = 0) {
    //   this.currentView = type;
    //   const endpoint = type === 'posts' ? '/api/board/mine/posts' : '/api/board/mine/comments';
    //   axios.get(`${endpoint}?page=${page}&size=10`)
    //     .then(response => {
    //       const { totalPages, number, content } = response.data;
    //       this.totalPages = totalPages;
    //       this.currentPage = number;
    //       this.content = content;
    //     })
    //     .catch(error => {
    //       console.error("Error fetching data: ", error);
    //     });
    // }
    fetchData(type) {
      this.currentView = type;
      if (type === 'boards') {
        this.content = [
          { id: 1, title: "Vue.js 프로젝트", date: "2024-01-01" },
          { id: 2, title: "JavaScript 학습", date: "2024-01-02" }
        ];
      } else {
        this.content = [
          { id: 1, content: "Vue.js가 정말 재밌어요!", date: "2024-01-03" },
          { id: 2, content: "JavaScript 문제 해결", date: "2024-01-04" }
        ];
      }
    }
  },
  mounted() {
    //this.fetchData('posts');
    this.fetchData(this.currentView);
  }
}
</script>


<style>
.tem {
  margin: 15px 0 0 15px;
}

.active {
  font-weight: bold;
  color: blue;
  cursor: pointer;
}
span {
  margin-right: 15px;
}
</style>
