<template>
    <div v-if="visible" class="modal">
      <div class="modal-content">
        <slot></slot>
        <button @click="close">닫기</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: Boolean
    },
    methods: {
      cslose() {
        this.$emit('update:visible', false);
      }
    }
  }
  </script>
  
  <style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
  }
  </style>
  