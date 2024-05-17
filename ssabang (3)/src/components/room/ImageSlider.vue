<template>
  <div class="slider" v-if="images && images.length > 0">
    <div class="slides">
      <!-- 첫 번째 이미지 -->
      <div class="slide first-slide" v-if="images.length > 0">
        <img :src="images[0].prefix_url + images[0].id" alt="Slide 1" />
      </div>
      <!-- 나머지 네 이미지 -->
      <div class="grid-slides" v-if="images.length > 1">
        <div v-for="(image, index) in images.slice(1, 5)" :key="index" class="grid-slide">
          <img :src="image.prefix_url + image.id" alt="'Slide ' + (index + 2)" />
        </div>
      </div>
    </div>
    <button class="view-all-btn" @click="showAllImages">사진 모두 보기</button>
    <!-- 모달창 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div class="modal-slider">
          <div v-for="(image, index) in images" :key="index" class="modal-slide">
            <img :src="image.prefix_url + image.id" alt="'Full Slide ' + (index + 1)" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 이미지가 없거나 로딩 중일 때 메시지 -->
  <div v-else>이미지를 로딩 중입니다...</div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    showAllImages() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
.slider {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.slides {
  display: flex;
  height: auto;
}

.first-slide img,
.grid-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.first-slide {
  width: 50%;
  height: auto;
}

.grid-slides {
  width: 50%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.grid-slide {
  width: 100%;
  height: 100%;
}

.view-all-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 10px 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
  z-index: 100;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  position: relative;
  width: 80%;
  max-width: 800px;
  background: white;
  padding: 20px;
}

.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
}

.modal-slider {
  display: flex;
  flex-direction: column;
}

.modal-slide {
  margin-bottom: 10px;
}
</style>
