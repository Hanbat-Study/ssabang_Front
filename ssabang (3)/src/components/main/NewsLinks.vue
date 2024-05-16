<template>
    <div class="news-links">
      <h2 class="quick-links-title">최신 뉴스 몽땅!</h2>
      <a v-for="news in newsLinks" :key="news.name" :href="news.url" target="_blank" class="news-link">
        <img :src="news.logo" :alt="news.name" />
        <span>{{ news.name }}</span>
      </a>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newsLinks: [
          { name: '네이버뉴스', logo: 'public/naver.png', url: 'https://news.naver.com/breakingnews/section/101/260' },
          { name: '다음뉴스', logo: 'public/daum.svg', url: 'https://realestate.daum.net/news' },
          { name: '서울경제', logo: 'public/seoul.png', url: 'https://m.sedaily.com/RankAll/GB' },
          { name: '한국경제', logo: 'public/korea.png', url: 'https://www.hankyung.com/realestate' },
          // Add other news logos and links
        ]
      };
    }
  }
  </script>
  
  <style>
  .news-links-container {
    width: 100%;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(118, 114, 114, 0.1);
  }
  
  .news-links-title {
    font-size: 24px;
    color: #333;
    text-align: center;
    margin-bottom: 15px;
  }
  
  .news-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
  }
  
  .news-link {
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
  
  .news-link:hover {
    background-color: #e0e0e0;
  }
  
  .news-link img {
    margin-right: 15px; /* Increased spacing between the image and text */
    width: 40px;
    height: 40px;
  }
  
  .news-link span {
    flex: 1;
    padding: 0 20px;
    color: #333;
    text-align: center;
    font-size: 16px;
  }
  </style>
  
  