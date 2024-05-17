<template>
  <div class="home-list">
    <div v-if="isLoading" class="loading-container">
      <img src="../../assets/loading.gif" alt="Loading..." />
    </div>
    <div v-else>
      <div
        v-for="room in rooms"
        :key="room.id"
        class="home-card"
        @click="goToRoom(room.id)"
        @mouseover="highlightLocation(room.location)"
        @mouseout="clearHighlight()"
      >
        <div class="home-image">
          <img :src="room.img_url" alt="Room image" loading="lazy" />
        </div>
        <button class="favorite-icon" @click.stop="toggleFavorite(room)">
          <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              :d="heartPath"
              :fill="room.isFavorite ? 'red' : 'none'"
              :stroke="room.isFavorite ? 'none' : 'black'"
              stroke-width="2"
            />
          </svg>
        </button>
        <div class="home-details">
          <h3>{{ room.selling_type_str }} {{ room.price_title }}</h3>
          <p>{{ room.room_type_str }}</p>
          <p>{{ room.room_desc2 }}</p>
          <p>{{ truncatedTitle(room.title) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  props: {
    rooms: Array,
    isLoading: Boolean,
  },
  emits: ["highlightLocation", "clearHighlight"],
  setup(props) {
    const router = useRouter();
    const isLoggedIn = ref(JSON.parse(localStorage.getItem("isFirst")) || false);
    const favoriteRooms = ref({});
    const heartPath =
      "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

    const toggleFavorite = async (room) => {
      if (!isLoggedIn.value) {
        router.push({ name: "login" });
        return;
      }

      const isFavorite = favoriteRooms.value[room.id];
      try {
        if (isFavorite) {
          await axios.delete(`/favorite-room/${room.id}`, { withCredentials: true });
          favoriteRooms.value = { ...favoriteRooms.value, [room.id]: false };
          room.isFavorite = false; // 반응형 데이터 업데이트
          console.log("Room removed from favorites.");
        } else {
          const favoriteRoom = {
            imgUrl: room.img_url,
            priceTitle: room.price_title,
            roomDesc2: room.room_desc2,
            title: room.title,
            roomId: room.id,
            roomTypeStr: room.room_type_str,
            complexName: room.complex_name,
          };

          await axios.post("/favorite-room", favoriteRoom, { withCredentials: true });
          favoriteRooms.value = { ...favoriteRooms.value, [room.id]: true };
          room.isFavorite = true; // 반응형 데이터 업데이트
          console.log("Room added to favorites.");
        }
      } catch (error) {
        console.error("Error toggling favorite status:", error);
      }
    };

    onMounted(() => {
      fetchFavoriteStatus();
    });

    const fetchFavoriteStatus = async () => {
      try {
        const responses = await Promise.all(
          props.rooms.map((room) =>
            axios.get(`/favorite-room/check/${room.id}`, { withCredentials: true })
          )
        );
        const favoriteStatus = {};
        responses.forEach((response, index) => {
          favoriteStatus[props.rooms[index].id] = response.data.data.isFavorite;
          props.rooms[index].isFavorite = response.data.data.isFavorite; // 반응형 데이터 업데이트
        });
        favoriteRooms.value = favoriteStatus;
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    watch(() => props.rooms, fetchFavoriteStatus, { deep: true, immediate: true });

    return {
      isLoggedIn,
      toggleFavorite,
      heartPath,
      fetchFavoriteStatus,
      favoriteRooms,
    };
  },
  methods: {
    goToRoom(id) {
      this.$router.push(`/room/detail/${id}`);
      this.saveRecentRoom(id);
    },
    saveRecentRoom(id) {
      const recentRooms = JSON.parse(localStorage.getItem("recentRooms")) || [];
      const roomIndex = recentRooms.findIndex((room) => room.id === id);
      if (roomIndex !== -1) {
        recentRooms.splice(roomIndex, 1);
      }
      recentRooms.unshift(this.rooms.find((room) => room.id === id));
      if (recentRooms.length > 50) {
        recentRooms.pop();
      }
      localStorage.setItem("recentRooms", JSON.stringify(recentRooms));
    },
    highlightLocation(location) {
      this.$emit("highlightLocation", location);
    },
    clearHighlight() {
      this.$emit("clearHighlight");
    },
    truncatedTitle(title) {
      return title.length > 16 ? title.slice(0, 16) + "..." : title;
    },
  },
};
</script>

<style scoped>
.home-list {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 80vh;
  overflow-y: auto;
  gap: 10px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.home-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px;
  transition: background-color 0.2s;
  position: relative;
}

.home-card:hover {
  background-color: #f5f5f5;
}

.home-image img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-right: 20px;
}

.home-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.home-details h3,
.home-details p {
  margin: 4px 0;
}

.home-details p {
  font-size: 14px;
}

.favorite-icon {
  position: absolute;
  top: 10px;
  left: 100px;
  background: none;
  border: none;
  cursor: pointer;
}

.heart-icon {
  width: 24px;
  height: 24px;
}
</style>
