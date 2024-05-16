<template>
  <div class="user-profile">
    <h3>{{ userProfile.name }}</h3>
    <p>{{ userProfile.email }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userProfile: {
        name: '',
        email: ''
      }
    };
  },
  mounted() {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      this.userProfile = JSON.parse(storedProfile);
    }
  }
}
</script>

<style>
.user-profile {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 10px 0 0 10px;
}
</style>
