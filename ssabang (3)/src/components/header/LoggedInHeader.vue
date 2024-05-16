<template>
    <div class="header">
      <span>Welcome, User!</span>
      <button @click="$emit('logout')">Logout</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "LoggedInHeader"
  }
  </script>
  
  <style>
  /* Styling for the logged-in header */
  .header span {
    margin-right: 10px;
  }
  .header button {
    margin-left: auto;
  }
  </style>
  