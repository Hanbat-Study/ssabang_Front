<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: currentPage <= 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">이전</a>
      </li>
      <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">다음</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.$emit('change-page', page);
      }
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.page-item {
  margin: 0 2px;
}

.page-link {
  display: block;
  padding: 3px 6px;
  color: #007bff;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s;
}

.page-link:hover {
  color: #0056b3;
}

.page-item.disabled .page-link {
  color: #ccc;
  pointer-events: none;
  cursor: not-allowed;
}

.page-item.active .page-link {
  font-weight: bold;
  color: #0056b3;
}
</style>
