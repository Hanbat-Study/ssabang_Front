<template>
  <div class="board-container">
    <div class="profile-section">
      <UserProfile />
      <UserActivities v-if="isLoggedIn" />
    </div>
    <div class="board-section">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import UserProfile from "../components/board/UserProfile.vue";
import UserActivities from "../components/board/UserActivities.vue";

export default {
  components: {
    UserProfile,
    UserActivities,
  },
  setup() {
    const isLoggedIn = ref(false);

    onMounted(() => {
      const isFirst = JSON.parse(localStorage.getItem("isFirst"));
      isLoggedIn.value = isFirst;
    });

    return {
      isLoggedIn,
    };
  },
};
</script>

<style>
.board-container {
  max-width: 1500px;
  margin: auto;
  display: flex;
  justify-content: space-between;
}

.profile-section {
  width: 35%;
  height: 500px;
}

.board-section {
  width: 70%;
}
</style>
