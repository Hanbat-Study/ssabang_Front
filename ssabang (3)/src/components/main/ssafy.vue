<template>
  <div class="quick-links-container">
    <h2 class="quick-links-title">싸피 정보 몽땅!</h2>
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
        { name: '홈페이지', url: 'https://www.ssafy.com/ksp/jsp/swp/swpMain.jsp', icon: '/public/ssafy.jpg' },
        { name: '유튜브', url: 'https://www.youtube.com/channel/UC_XI3ByFO1uZIIH-g-zJZiw/featured', icon: '/public/youtube.png' },
        { name: '인스타그램', url: 'https://www.instagram.com/hellossafy/', icon: '/public/instagram.png' },
        { name: '카카오톡 채녈', url: 'https://pf.kakao.com/_Vhxoxnxb', icon: '/public/kakaotalk.svg' }
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
