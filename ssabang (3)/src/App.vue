<template>
  <div id="app">
    <Header />
    <router-view class="content-view" /> <!-- 스타일 클래스 추가 -->
    <Footer />
  </div>
</template>

<script>
import Header from './components/header/Header.vue';
import Footer from './components/footer/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

/* .content-view에 대한 스타일 */
.content-view {
  min-height: 80vh; /* 최소 높이를 화면의 80%로 설정 */
  background-color: #f8f9fa; /* 배경 색상 설정 */}
</style>
