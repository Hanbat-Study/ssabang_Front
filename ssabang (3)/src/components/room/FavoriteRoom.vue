<template>
  <div class="room-card" @click="navigateToDetailPage(roomId)">
    <div class="image-container">
      <img :src="room.img_url" alt="Room image" class="room-image" />
      <button class="favorite-icon" @click.stop="toggleFavorite(room)">
        <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            :d="heartPath"
            :fill="isFavorite ? 'red' : 'none'"
            :stroke="isFavorite ? 'none' : 'black'"
            stroke-width="2"
          />
        </svg>
      </button>
    </div>
    <div class="room-details">
      <h3>{{ room.title }}</h3>
      <p>방 가격 : {{ room.price_title }}</p>
      <p>방 타입 : {{ room.room_type_str }}</p>
      <p>방 설명 : {{ room.room_desc2 }}</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  props: {
    room: Object,
  },
  setup(props, { emit }) {
    const router = useRouter();
    const isFavorite = ref(false);

    const heartPath =
      "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

    const toggleFavorite = (room) => {
      if (isFavorite.value) {
        axios
          .delete(`/favorite-room/${roomId}`, { withCredentials: true })
          .then((response) => {
            isFavorite.value = false;
            emit("toggleFavorite", room);
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response?.data?.reason || "Something went wrong!",
            });
          });
      } else {
        axios
          .post(
            `/favorite-room`,
            {
              imgUrl: room.img_url,
              priceTitle: room.price_title,
              roomDesc2: room.room_desc2,
              title: room.title,
              roomId: roomId,
              roomTypeStr: room.room_type_str,
              complexName: room.complex_name,
            },
            { withCredentials: true }
          )
          .then((response) => {
            isFavorite.value = true;
            emit("toggleFavorite", room);
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response?.data?.reason || "Something went wrong!",
            });
          });
      }
    };

    const camelToSnake = (str) => {
      return str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
    };

    const snakeCaseRoom = {};
    for (const key in props.room) {
      snakeCaseRoom[camelToSnake(key)] = props.room[key];
    }

    const navigateToDetailPage = (roomId) => {
      router.push({
        path: `/room/detail/${roomId}`,
        query: { favoriteRoom: JSON.stringify(props.room) },
      });
    };

    const roomId = props.room.roomId ? props.room.roomId : props.room.id;

    onMounted(() => {
      axios
        .get(`/favorite-room/check/${roomId}`, { withCredentials: true })
        .then((response) => {
          isFavorite.value = response.data.data.isFavorite; // API 응답으로 isFavorite 상태 업데이트
        })
        .catch((error) => console.error(error));
    });

    return {
      heartPath,
      isFavorite,
      toggleFavorite,
      room: snakeCaseRoom,
      navigateToDetailPage,
      roomId,
    };
  },
};
</script>

<style scoped>
.room-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  max-width: 300px;
  text-align: left;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.image-container {
  position: relative;
}

.room-image {
  width: 300px; /* 이미지를 부모 요소의 가로폭에 맞춰 조절합니다. */
  height: 200px; /* 이미지의 세로 크기를 자동으로 조절합니다. */
  border-radius: 8px;
}

.favorite-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
}

.heart-icon {
  width: 24px;
  height: 24px;
}

.room-details {
  margin-top: 10px;
}

.room-details h3 {
  margin: 0 0 10px;
  font-size: 1.2rem;
  color: #333;
}

.room-details p {
  margin: 0 0 5px;
  color: #555;
  font-size: 0.9rem;
}
</style>
