<template>
  <div class="main-view">
    <QuickLinks />
    <NewsLinks />
    <ssafy />
  </div>
</template>

<script>
import QuickLinks from './QuickLinks.vue';
import NewsLinks from './NewsLinks.vue';
import ssafy from './ssafy.vue';

export default {
  components: {
    QuickLinks,
    NewsLinks,
    ssafy
  }
}
</script>

<style>
.main-view {
  display: flex;
  flex-direction: row; /* 가로 방향으로 요소를 나열 */
  align-items: stretch; /* 자식 요소의 높이를 동일하게 맞춤 */
  justify-content: space-between; /* 요소 사이에 균등 간격을 둠 */
  padding: 20px;
  width: 100%; /* 전체 너비 사용 */
}

/* 각 자식 컴포넌트에 공통적으로 적용될 스타일 */
.main-view > * {
  flex: 1; /* 각 자식 요소가 동등하게 공간을 차지하도록 함 */
  margin: 0 10px; /* 요소 사이의 마진을 추가 */
  background-color: #f9f9f9; /* 배경색 설정 */
  padding: 20px; /* 내부 패딩 설정 */
  border-radius: 8px; /* 경계선 둥글게 처리 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 박스 그림자 효과 */
  overflow: hidden; /* 내부 컨텐츠가 넘칠 경우 숨김 처리 */
}

/* 공통 헤더 스타일 */
.main-view h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px; /* 헤더 아래 마진 */
  color: #333; /* 텍스트 색상 */
  text-align: center; /* 텍스트 중앙 정렬 */
}
</style>

