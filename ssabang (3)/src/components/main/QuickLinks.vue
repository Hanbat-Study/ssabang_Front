<template>
  <div class="quick-links-container">
    <h2 class="quick-links-title">유용한 정보 몽땅!</h2>
    <div class="quick-links">
      <a v-for="link in links" :key="link.name" :href="link.url" target="_blank" class="quick-link">
        <img :src="link.icon" :alt="link.name" />
        <span>{{ link.name }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        { name: '정부24바로가기', url: 'https://www.gov.kr/portal/main/nologin', icon: 'public/gov.png' },
        { name: 'HUG 바로가기', url: 'https://www.khug.or.kr/index.jsp', icon: 'public/hug.png' },
        { name: '온통 청년 바로가기', url: 'https://www.youthcenter.go.kr/main.do', icon: 'public/youth-logo.webp' },
        { name: '자취 백과사전 ', url: 'https://drive.google.com/file/d/1avyMk4ExMPesaMydurg7PEghXr2i9GKT/view?usp=sharing', icon: 'public/dic.png' }
      ]
    };
  }
}
</script>

<style>
.quick-links-container {
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(118, 114, 114, 0.1);
}

.quick-links-title {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 15px;
}

.quick-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.quick-link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  text-decoration: none;
  transition: background-color 0.3s;
}

.quick-link:hover {
  background-color: #e0e0e0;
}

.quick-link img {
  margin-right: 15px; /* Increased spacing between the image and text */
  width: 40px;
  height: 40px;
}

.quick-link span {
  flex: 1;
  padding: 0 20px;
  color: #333;
  text-align: center;
  font-size: 16px;
}
</style>
