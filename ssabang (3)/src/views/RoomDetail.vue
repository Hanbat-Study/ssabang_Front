<template>
  <div class="home-detail-view">
    <div class="image-slider-container">
      <ImageSlider :images="roomDetails.image_list" />
    </div>
    <div class="details-container">
      <div class="left-component">
        <!-- <RoomInfo :room="roomDetails.room" /> -->
      </div>
      <div class="right-component">
        <!-- <AgentInfo :agent="roomDetails.agent" /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import ImageSlider from "@/components/room/ImageSlider.vue";
import RoomInfo from "@/components/room/RoomInfo.vue";
import AgentInfo from "@/components/room/AgentInfo.vue";

const route = useRoute();
const roomDetails = ref({});

const fetchRoomDetails = async () => {
  const response = await axios.get(
    `https://www.dabangapp.com/api/3/new-room/detail?api_version=3.0.1&call_type=web&room_id=${route.params.id}&version=1`
  );
  roomDetails.value = response.data;
};

onMounted(fetchRoomDetails);
</script>

<style scoped>
.home-detail-view {
  display: flex;
  flex-direction: column;
  padding: 40px 0px 0px;
  /* 패딩 추가 */
}

.image-slider-container {
  width: 100%;
  padding-bottom: 20px;
  /* 이미지 아래 패딩 추가 */
}

.details-container {
  display: flex;
  justify-content: space-between;
}

.left-component {
  flex: 2;
  margin-right: 20px;
}

.right-component {
  flex: 1;
  margin-top: 20px;
}
</style>
