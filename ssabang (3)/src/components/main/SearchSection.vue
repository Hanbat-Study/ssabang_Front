<template>
  <section class="search-section">
    <h1>어떤 집을 찾고 계세요?</h1>
    <div class="search-container">
      <input type="text" placeholder="원하시는 지역명, 지하철역을 입력해주세요" v-model="keyword" @keyup.enter="performSearch">
      <button @click="performSearch">
        <img src="../../assets/search.png" alt="Search" />
      </button>
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router';
import { useSearch } from '../../services/useSearch.js'; // 이 경로는 실제 프로젝트에 맞게 조정하세요

export default {
  setup() {
    const { keyword, searchResult, searchDetails, searchKeyword } = useSearch();
    const router = useRouter();
    const performSearch = async () => { 
      await searchKeyword();
      if (searchResult.value && searchDetails.value.location) {
        console.log('result:', JSON.stringify(searchDetails.value, null, 2));
        // 데이터를 라우터 쿼리로 전달하기
        router.push({ 
          name: 'map', 
          query: { 
            type: searchDetails.value.type,
            id: searchDetails.value.id,
            latitude: searchDetails.value.location[1],
            longitude: searchDetails.value.location[0],
            name: searchDetails.value.name,
            zoom: searchDetails.value.zoom
          } 
        });

      } else {
        console.error('검색 결과가 없습니다.');
      }
    };

    return {
      keyword,
      performSearch
    };
  }
}
</script>


<style>
.search-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: url('../../assets/bg.jpg') no-repeat center center;
  background-size: cover;
  height: 300px;
  width: 100%; /* This should cover the full width of the container */
  box-sizing: border-box;
}

.search-section h1 {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 20px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

.search-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: url('../../assets/bg.jpg') no-repeat center center;
  background-size: cover;
  height: 300px;
  width: 100%; /* This should cover the full width of the container */
  box-sizing: border-box;
}

.search-section h1 {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 20px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

.search-container input[type="text"] {
  flex-grow: 1;
  padding: 12px 46px 12px 20px; /* Right padding increased to not overlap the button */
  font-size: 1.25rem;
  border: 2px solid #ddd;
  border-radius: 5px 0 0 5px; /* Only rounded on the left */
  box-sizing: border-box;
  outline: none;
  
}

.search-container button {
  padding: 0;
  margin-left: -46px; /* Negative margin to overlap the button on the input */
  height: 100%;
  background-color: #007BFF;
  border: none;
  border-radius: 0 5px 5px 0; /* Completing the radius on the right */
  cursor: pointer;
}

.search-container button img {
  width: 24px;
  height: 24px;
  padding: 13px; /* Padding inside the button to increase the clickable area */
}

.search-container button:hover {
  background-color: #0056b3;
}

.search-container button:hover {
  background-color: #0056b3;
}
</style>