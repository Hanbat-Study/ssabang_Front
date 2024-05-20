<template>
  <div class="room-info-card" v-if="room">
    <div class="room-header">
      <span class="room-id">매물번호 {{ room.seq }}</span>
      <i class="fas fa-expand-alt"></i>
    </div>
    <div class="room-main">
      <h2 class="price-title geihtM">월세 {{ room.price_title }}</h2>
      <p class="recent-views">최근 7일 매물 조회 수{{ room.view_count_a_week }}회</p>
    </div>
    <div class="room-details jFQIaI">
      <div class="detail-item">
        <img src="@/assets/home.png" alt="Room Type" />
        <span>{{ room.room_type_main_str }}</span>
      </div>
      <div class="detail-item">
        <img src="@/assets/square.png" alt="Size" />
        <span>{{ room.room_size }}m²</span>
      </div>
      <div class="detail-item">
        <img src="@/assets/elevator.png" alt="Floor" />
        <span>{{ room.room_floor_str }}/{{ room.building_floor_str }}</span>
      </div>
      <div class="detail-item">
        <img src="@/assets/bill.png" alt="Maintenance" />
        <span>{{ room.maintenance_cost_str }}</span>
      </div>
    </div>
    <div class="room-info jFQIaI">
      <div class="info-item">
        <strong>방/욕실:</strong> <span>{{ room.beds_num }}개/{{ room.bath_num }}개</span>
      </div>
      <div class="info-item">
        <strong>위치:</strong> <span>{{ room.full_jibun_address_str }}</span>
      </div>
    </div>
    <div class="room-footer">
      <button class="contact-button" @click="$emit('show-contact-modal')">
        공인중개사 연락하기
      </button>
      <button class="favorite-button" @click.stop="toggleFavorite(room)">
        <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            :fill="room.isFavorite ? 'red' : 'none'"
            :stroke="room.isFavorite ? 'red' : 'black'"
            stroke-width="2"
          />
        </svg>
      </button>
    </div>
  </div>
  <div v-else>loading...</div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  props: {
    room: {
      type: Object,
      required: true,
    },
    roomDetails: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const isLoggedIn = ref(JSON.parse(localStorage.getItem("isFirst")) || false);
    const favoriteRooms = ref({});

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
          room.isFavorite = false;
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
          room.isFavorite = true;
        }
      } catch (error) {
        console.error("Error toggling favorite status:", error);
      }
    };

    return {
      isLoggedIn,
      toggleFavorite,
    };
  },
};
</script>

<style scoped>
.room-info-card {
  width: 330px;
  padding: 32px;
  background: #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #dfdfdf;
  border-radius: 2px;
  position: relative;
  font-family: "Arial", sans-serif;
  font-size: 16px;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.room-id {
  font-size: 14px;
  color: #666;
  border: 1px solid #ddd;
  padding: 4px 12px;
  border-radius: 4px;
}

.room-main {
  margin-bottom: 16px;
}

.price-title {
  font-size: 24px;
  line-height: 38px;
  letter-spacing: -0.5px;
  color: #222;
  font-weight: bold;
}

.recent-views {
  font-size: 14px;
  color: #999;
}

.room-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 24px;
  padding-bottom: 24px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-item img {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.room-info {
  margin-top: 24px;
  padding-bottom: 24px;
  font-size: 16px;
  line-height: 26px;
}

.info-item {
  font-size: 20px;
  line-height: 26px;
  margin-bottom: 8px;
}

.info-item strong {
  font-weight: bold;
  color: #333;
}

.room-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.contact-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 14px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 23px;
}

.favorite-button {
  background-color: transparent;
  border: black;
  cursor: pointer;
  margin-right: 30px;
}

.favorite-button svg {
  width: 35px;
  height: 35px;
}

.favorite-button svg path {
  fill: none;
  stroke: black;
  stroke-width: 2;
}

.favorite-button svg path.favorited {
  fill: red;
  stroke: red;
}
</style>
