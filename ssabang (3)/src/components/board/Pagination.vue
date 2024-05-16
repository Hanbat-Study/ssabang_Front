<!-- Pagination.vue -->
<template>
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage <= 1 }">
          <a class="page-link" href="#" @click="changePage(currentPage - 1)">Previous</a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
          <a class="page-link" href="#" @click="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: Number,
      totalPages: Number
    },
    methods: {
      changePage(page) {
        if (page > 0 && page <= this.totalPages) {
          this.$emit('change-page', page);
        }
      }
    }
  }
  </script>
  
  <style>
  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
  }
  
  .page-item {
    margin: 0 2px;
  }
  
  .page-link {
    display: block;
    padding: 5px 10px;
    color: #007bff;
    text-decoration: none;
  }
  
  .page-item.disabled .page-link,
  .page-item.active .page-link {
    color: #ccc;
  }
  
  .page-item.active .page-link {
    font-weight: bold;
  }
  </style>
  