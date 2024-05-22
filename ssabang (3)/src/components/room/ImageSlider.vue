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
          <img :src="image.prefix_url + image.id" :alt="'Slide ' + (index + 2)" />
        </div>
      </div>
    </div>
    <div class="view-all-btn-container">
      <button class="view-all-btn" @click="$emit('show-modal')">사진 모두 보기</button>
    </div>
  </div>
  <!-- 이미지가 없거나 로딩 중일 때 메시지 -->
  <!-- <div v-else>이미지를 로딩 중입니다...</div> -->
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.slider {
  position: relative;
  width: 1300px;
  height: 500px;
  margin: auto;
}

.slides {
  display: flex;
  height: auto;
}

.first-slide img {
  width: 100%;
  height: 510px; /* 높이 직접 지정 */
  object-fit: cover;
}

.grid-slide img {
  width: 100%;
  height: 250px; /* 높이 직접 지정 */
  object-fit: cover;
}

.first-slide {
  width: 50%;
  height: auto; /* 높이 자동 조절 */
}

.grid-slides {
  width: 50%;
  height: auto; /* 높이 자동 조절 */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 5px;
}

.grid-slide {
  width: 100%;
  height: auto; /* 높이 자동 조절 */
}

.view-all-btn-container {
  display: flex;
  justify-content: right;
  margin-top: -60px;
}

.view-all-btn {
  padding: 10px 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
}
</style>
