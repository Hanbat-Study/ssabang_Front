<template>
  <div class="board-section">
    <div class="boards">
      <div v-for="board in paginatedBoards" :key="board.id" @click="goToBoardDetail(board.id)" class="board-item">
        <h4>{{ board.title }}</h4>
        <p>{{ board.content.length > 100 ? board.content.substring(0, 100) + '...' : board.content }}</p>
        <span class="date">{{ board.date }}</span>
      </div>
    </div>
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @change-page="fetchData" />
  </div>
</template>

<script>
import Pagination from './Pagination.vue'; // 가정: Pagination 컴포넌트가 잘 작성되었음

export default {
  components: {
    Pagination
  },
  data() {
    return {
      boards: [
        { id: 1, title: 'Vue.js의 기본', content: 'Vue.js는 진보된 Java', date: '2022-01-01' },
        { id: 2, title: 'Reactive Components', content: '컴포넌트 기반 개발을 촉진하는 Vue의 핵심 기능 중 하나입니다...', date: '2022-01-02' },
        { id: 2, title: 'Reactive Components', content: '컴포넌트 기반 개발을 촉진하는 Vue의 핵심 기능 중 하나입니다...', date: '2022-01-02' },
        { id: 2, title: 'Reactive Components', content: '컴포넌트 기반 개발을 촉진하는 Vue의 핵심 기능 중 하나입니다...', date: '2022-01-02' },
        { id: 2, title: 'Reactive Components', content: '컴포넌트 기반 개발을 촉진하는 Vue의 핵심 기능 중 하나입니다...', date: '2022-01-02' },
        { id: 2, title: 'Reactive Components', content: '컴포넌트 기반 개발을 촉진하는 Vue의 핵심 기능 중 하나입니다...', date: '2022-01-02' },
        { id: 2, title: 'Reactive Components', content: '컴포넌트 기반 개발을 촉진하는 Vue의 핵심 기능 중 하나입니다...', date: '2022-01-02' },
        { id: 2, title: 'Reactive Components', content: '컴포넌트 기반 개발을 촉진하는 Vue의 핵심 기능 중 하나입니다...', date: '2022-01-02' },
        { id: 3, title: 'Advanced Vue Patterns', content: '고급 Vue 패턴은 대규모 애플리케이션을 위한 설계 방법론을 제공합니다...', date: '2022-01-03' }
      ],
      currentPage: 1,
      totalPages: 5
    };
  },
  computed: {
    paginatedBoards() {
      const start = (this.currentPage - 1) * 4;
      return this.boards.slice(start, start + 4);
    }
  },
  methods: {
    fetchData(page) {
      this.currentPage = page;
      // Here you would fetch data from the server
    },
    goToBoardDetail(id) {
      this.$router.push({ name: 'boardDetail', params: { id } });
    }
  }
}
</script>

<style scoped>
.board-section {
  width: 80%;
  max-width: 1000px; /* 최대 너비 설정 */
  margin: auto; /* 자동 마진을 통해 가운데 정렬 */
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 세로 중심으로 자식 요소들 정렬 */
  min-height: 80vh; /* 최소 높이 설정 */
}

.boards {
  width: 100%; /* 게시판 목록 전체 너비를 사용 */
}

.board-item {
  background: white;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
}

.board-item:hover {
  background-color: #eaeaea; /* 호버 효과 */
}

h4 {
  font-size: 1.25rem;
  margin-bottom: 15px; /* 타이틀과 내용 사이의 간격 */
  margin-top: 0; /* 상단 여백 제거 */
}

p {
  font-size: 0.85rem;
  color: #333;
  margin-bottom: 15px; /* 내용과 작성일자 사이 간격 */
}

.date {
  font-size: 0.65rem;
  color: #666;
}

.pagination-container {
  width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  align-items: center;
}
</style>
