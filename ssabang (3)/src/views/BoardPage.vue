<template>
  <div class="board-container">
    <div class="profile-section">
      <UserProfile />
      <UserActivities />
    </div>
    <div class="board-section">
      <BoardList />
    </div>
  </div>
</template>

<script>
import UserProfile from '../components/board/UserProfile.vue';
import UserActivities from '../components/board/UserActivities.vue';
import BoardList from '../components/board/BoardList.vue';

export default {
  components: {
    UserProfile,
    UserActivities,
    BoardList
  }
}
</script>

<style>
.board-container {
  display: flex;
  justify-content: space-between;
}
.profile-section {
  width: 28%;
}
.board-section {
  width: 70%;
}
</style>
