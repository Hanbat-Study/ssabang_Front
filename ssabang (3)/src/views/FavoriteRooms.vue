<template>
  <div class="favorite-rooms">
    <h1>관심목록</h1>
    <div class="tabs">
      <button @click="setCurrentTab('favorites')" :class="{ active: currentTab === 'favorites' }">
        찜한 방
      </button>
      <button @click="setCurrentTab('recent')" :class="{ active: currentTab === 'recent' }">
        최근 본 방
      </button>
    </div>
    <div v-if="currentTab === 'favorites' && !rooms.length" class="no-rooms">
      <p>찜한 방이 없습니다.</p>
      <p>살고 싶은 방을 발견하면 찜 해주세요!</p>
    </div>
    <div v-if="currentTab === 'recent' && !rooms.length" class="no-rooms">
      <p>최근 본 방이 없습니다.</p>
      <p>방을 클릭하면 최근 본 방으로 저장됩니다!</p>
    </div>
    <div v-else class="rooms-container">
      <FavoriteRoom
        v-for="room in rooms"
        :key="room.favoriteRoomId || room.roomId"
        :room="room"
        @toggleFavorite="toggleFavorite"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import FavoriteRoom from "@/components/room/FavoriteRoom.vue";

export default {
  components: {
    FavoriteRoom,
  },
  setup() {
    const rooms = ref([]);
    const currentTab = ref("favorites");

    const fetchData = async () => {
      try {
        if (currentTab.value === "favorites") {
          const response = await axios.get("/favorite-room", { withCredentials: true });
          rooms.value = response.data.data;
        } else if (currentTab.value === "recent") {
          rooms.value = JSON.parse(localStorage.getItem("recentRooms")) || [];
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    const setCurrentTab = async (tab) => {
      currentTab.value = tab;
      await fetchData();
    };

    const toggleFavorite = (room) => {
      room.isFavorite = !room.isFavorite;
      if (currentTab.value === "favorites" && !room.isFavorite) {
        rooms.value = rooms.value.filter((r) => r.favoriteRoomId !== room.favoriteRoomId);
      } else {
        // 실제 API 호출 로직
      }
    };

    onMounted(async () => {
      await fetchData();
    });

    return {
      rooms,
      currentTab,
      setCurrentTab,
      toggleFavorite,
    };
  },
};
</script>

<style scoped>
.favorite-rooms {
  max-width: 1500px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
  border: none;
  background: none;
  transition: color 0.3s, border-bottom 0.3s;
}

.tabs button.active,
.tabs button:hover {
  color: #0056b3;
  border-bottom: 2px solid #0056b3;
}

.no-rooms {
  margin-top: 20px;
}

.rooms-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>
