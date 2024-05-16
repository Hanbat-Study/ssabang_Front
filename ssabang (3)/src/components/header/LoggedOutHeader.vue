<template>
    <div class="header">
      <button @click="$emit('login')">Login</button>
      <button @click="$emit('showSignup')">Sign Up</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "LoggedOutHeader"
  }
  </script>
  
  <style>
  /* Basic styles for buttons */
  .header button {
    margin-right: 10px;
  }
  </style>
  