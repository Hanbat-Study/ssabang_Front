<template>
  <div class="home-detail-view" :class="{ 'modal-open': showModal || showContactModal }">
    <div class="image-slider-container">
      <ImageSlider :images="roomDetails.image_list" @show-modal="showModal = true" />
    </div>
    <div class="details-container">
      <div class="left-component">
        <RoomDetailInfo :room="roomDetails.room" />
      </div>
      <div class="right-component">
        <RoomInfo :room="roomDetails.room" @show-contact-modal="showContactModal = true" />
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <div class="modal-slider">
          <div v-for="(image, index) in roomDetails.image_list" :key="index" class="modal-slide">
            <img :src="image.prefix_url + image.id" :alt="'Full Slide ' + (index + 1)" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="showContactModal" class="modal-overlay">
      <div class="modal-content agent-info-modal">
        <div class="modal-header">
          <h2>연락처 보기</h2>
          <h2 class="close" @click="showContactModal = false">&times;</h2>
        </div>
        <AgentInfo :agent="roomDetails.agent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import ImageSlider from "@/components/room/ImageSlider.vue";
import RoomInfo from "@/components/room/RoomInfo.vue";
import AgentInfo from "@/components/room/AgentInfo.vue";
import RoomDetailInfo from "@/components/room/RoomDetailInfo.vue"; // Import RoomDetailInfo component

const route = useRoute();
const roomDetails = ref({});
const showModal = ref(false);
const showContactModal = ref(false);

const fetchRoomDetails = async () => {
  const response = await axios.get(
    `https://www.dabangapp.com/api/3/new-room/detail?api_version=3.0.1&call_type=web&room_id=${route.params.id}&version=1`
  );
  roomDetails.value = response.data;
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    if (showModal.value) {
      showModal.value = false;
    }
    if (showContactModal.value) {
      showContactModal.value = false;
    }
  }
};

onMounted(() => {
  fetchRoomDetails();
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.home-detail-view {
  display: flex;
  flex-direction: column;
  padding: 40px 0px 0px;
  position: relative;
}

.image-slider-container {
  width: 70%;
  margin: 0 auto;
  padding: 20px 0;
  padding-bottom: 20px;
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
  position: sticky;
  top: 0;
  height: calc(100vh - 60px);
  /* 고정 높이 설정 */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 40%;
  max-width: 400px;
  height: 70%;
  max-height: 650px;
  background: white;
  padding: 32px;
  overflow-y: auto;
  border-radius: 8px;
  z-index: 1001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header .close {
  font-size: 24px;
  cursor: pointer;
}

.agent-info-modal .close {
  position: static;
}

.modal-slider {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-slide {
  width: 100%;
}

.modal-slide img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
