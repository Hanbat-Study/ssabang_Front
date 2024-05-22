<template>
  <div class="home-detail-view" :class="{ 'modal-open': showModal || showContactModal }">
    <div class="image-slider-container">
      <ImageSlider :images="roomDetails.image_list" @show-modal="handleShowModal" />
    </div>
    <div class="details-container">
      <div class="left-component">
        <RoomDetailInfo :room="roomDetails.room" />
      </div>
      <div class="right-component">
        <RoomInfo
          :room="roomDetails.room"
          :favoriteRoom="favoriteRoom"
          @show-contact-modal="showContactModal = true"
        />
      </div>
    </div>
    <div v-if="showContactModal" class="modal-overlay">
      <div class="agent-info-modal">
        <div class="modal-header">
          <h2>연락처 보기</h2>
          <h2 class="close" @click="showContactModal = false">&times;</h2>
        </div>
        <AgentInfo :agent="roomDetails.agent" />
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content image-slider-modal">
        <div class="modal-header">
          <img src="@/assets/24px.svg" alt="닫기" class="close" @click="showModal = false" />
        </div>
        <div class="modal-slider">
          <img
            src="@/assets/Property 1=CaretCircleLeft_hover.svg"
            alt="이전 이미지"
            class="swiper-button-prev"
            @click="prevImage"
          />
          <div
            class="image-list"
            :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
          >
            <div v-for="(image, index) in roomDetails.image_list" :key="index" class="modal-slide">
              <img :src="image.prefix_url + image.id" class="slide-image" alt="Slide Image" />
            </div>
          </div>
          <img
            src="@/assets/Property 1=CaretCircleRight_hover.svg"
            alt="다음 이미지"
            class="swiper-button-next"
            @click="nextImage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import ImageSlider from "@/components/room/ImageSlider.vue";
import RoomInfo from "@/components/room/RoomInfo.vue";
import AgentInfo from "@/components/room/AgentInfo.vue";
import RoomDetailInfo from "@/components/room/RoomDetailInfo.vue";

const route = useRoute();
const roomDetails = ref({});
const showModal = ref(false);
const showContactModal = ref(false);
const currentImageIndex = ref(0);
const favoriteRoom = ref(route.query.favoriteRoom ? JSON.parse(route.query.favoriteRoom) : null);

const fetchRoomDetails = async () => {
  const response = await axios.get(
    `https://www.dabangapp.com/api/3/new-room/detail?api_version=3.0.1&call_type=web&room_id=${route.params.id}&version=1`
  );
  roomDetails.value = response.data;
};

const handleShowModal = () => {
  showModal.value = true;
};

const prevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + roomDetails.value.image_list.length) %
    roomDetails.value.image_list.length;
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % roomDetails.value.image_list.length;
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
  width: 75%;
  margin: 0 auto;
  padding: 20px 0;
  padding-bottom: 20px;
  position: relative;
}

.details-container {
  display: flex;
  justify-content: space-between;
}

.left-component {
  flex: 2;
  margin-right: 10px;
}

.right-component {
  flex: 1;
  margin-top: 20px;
  position: sticky;
  top: 0;
  height: calc(100vh - 60px);
  margin-right: 100px;
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
  width: 1000px;
  height: 700px;
  background: white;
  padding: 16px;
  overflow-y: auto;
  border-radius: 8px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.modal-header .close {
  width: 30px;
  cursor: pointer;
  margin-left: auto;
}

.agent-info-modal {
  position: relative;
  width: 30%;
  height: 45%;
  background: white;
  padding: 16px;
  overflow-y: auto;
  border-radius: 8px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.agent-info-modal .close {
  position: static;
}

.agent-info-modal .close {
  position: static;
}

.modal-slider {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-list {
  display: flex;
  flex-direction: row;
  transition: transform 0.5s ease-in-out;
  width: 100%;
}

.modal-slide {
  width: 100%;
  height: 600px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.slide-image {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.swiper-button-prev,
.swiper-button-next {
  width: 48px;
  height: 48px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background-color: rgba(34, 34, 34, 0.7);
  color: white;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-button-prev {
  left: -5px;
}

.swiper-button-next {
  right: -5px;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.slide-leave-active {
  position: absolute;
}
</style>
