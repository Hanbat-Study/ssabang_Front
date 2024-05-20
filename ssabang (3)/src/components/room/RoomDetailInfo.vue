<template>
  <div class="room-detail-info" v-if="room">
    <div class="section">
      <h2>가격정보</h2>
      <div class="detail-item">
        <strong>월세</strong>
        <p>{{ room.price_title }}</p>
      </div>
      <div class="detail-item">
        <strong>관리비</strong>
        <p>{{ room.maintenance_cost_str }}</p>
      </div>
      <div class="detail-item">
        <strong>주차가능여부</strong>
        <p>{{ room.parking_str }}</p>
      </div>
      <div class="detail-item">
        <strong>한달 예상 주거비용</strong>
        <p class="blue-text">{{ room.month_total_cost_str }} ({{ room.month_total_str }})</p>
      </div>
    </div>
    <div class="section">
      <h2>상세정보</h2>
      <div class="detail-item">
        <strong>방종류</strong>
        <p>{{ room.room_type_main_str }}</p>
      </div>
      <div class="detail-item">
        <strong>해당층/건물층</strong>
        <p>{{ room.room_floor_str }} / {{ room.building_floor_str }}</p>
      </div>
      <div class="detail-item">
        <strong>전용면적</strong>
        <p>
          {{ isSquareMeters ? room.room_size + "m²" : convertToPyeong(room.room_size) + "평" }}
          <button @click="toggleMeasurement">
            {{ isSquareMeters ? "평으로 보기" : "m²로 보기" }}
          </button>
        </p>
      </div>
      <div class="detail-item">
        <strong>방 수/욕실 수</strong>
        <p>{{ room.beds_num }}개 / {{ room.bath_num }}개</p>
      </div>
      <div class="detail-item">
        <strong>방향</strong>
        <p>{{ room.direction_str }} ({{ room.direction_measurement_base_type_str }} 기준)</p>
      </div>
      <div class="detail-item">
        <strong>난방종류</strong>
        <p>{{ room.heating }}</p>
      </div>
      <div class="detail-item">
        <strong>엘레베이터</strong>
        <p>{{ room.elevator_str }}</p>
      </div>
      <div class="detail-item">
        <strong>총 주차대수</strong>
        <p>총 {{ room.parking_num }}대</p>
      </div>
      <div class="detail-item">
        <strong>입주가능일</strong>
        <p>{{ room.moving_date }}</p>
      </div>
      <div class="detail-item">
        <strong>건축물용도</strong>
        <p>{{ room.building_use_types_str[0] }}</p>
      </div>
      <div class="detail-item">
        <strong>{{ room.building_approval_type_str }}</strong>
        <p>{{ room.building_approval_date_str }}</p>
      </div>
      <div class="detail-item">
        <strong>최초등록일</strong>
        <p>{{ room.saved_time_str }}</p>
      </div>
    </div>
    <div class="section">
      <h2>옵션</h2>
      <ul class="option-container">
        <li v-for="option in room.room_options" :key="option.seq" class="option-item">
          <div class="option-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M25 34H23V40H25V34Z" fill="#434343"></path>
            </svg>
          </div>
          <p class="option-name">{{ option.name }}</p>
        </li>
      </ul>
    </div>
    <div class="section">
      <h2>보안/안전시설</h2>
      <ul class="option-container">
        <li v-for="safety in room.safeties" :key="safety.seq" class="option-item">
          <div class="option-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M25 34H23V40H25V34Z" fill="#434343"></path>
            </svg>
          </div>
          <p class="option-name">{{ safety.name }}</p>
        </li>
      </ul>
    </div>
    <div class="section">
      <h2>위치 및 주변시설</h2>
      <p>{{ nearData.address }}</p>
      <button class="show-markers-button" @click="toggleMarkers">
        <img src="@/assets/bus.png" alt="Bus Icon" class="bus-icon" />
        {{ markersVisible ? "위치 가리기" : "위치 보이기" }}
      </button>
      <naver-map
        style="width: 80%; height: 40vh"
        :mapOptions="mapOptions"
        :initLayers="initLayers"
        @onLoad="onLoadMap"
      >
      </naver-map>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { NaverMap } from "vue3-naver-maps";
import axios from "axios";

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
});

const nearData = ref({});
const markersVisible = ref(false);
const map = ref(null);
const isSquareMeters = ref(true);

const mapOptions = ref({
  center: new naver.maps.LatLng(37.3595704, 127.105399),
  zoom: 15,
});

const initLayers = ["background", "layer"];

const fetchNearData = async (roomId) => {
  const response = await axios.get(
    `https://www.dabangapp.com/api/3/room/near?api_version=3.0.1&call_type=web&room_id=${roomId}&version=1`
  );
  nearData.value = response.data;
  console.log("Fetched near data:", nearData.value);

  if (nearData.value.random_location) {
    mapOptions.value.center = new naver.maps.LatLng(
      nearData.value.random_location[1],
      nearData.value.random_location[0]
    );
    if (map.value) {
      map.value.setCenter(mapOptions.value.center);
      drawCircle(nearData.value.random_location);
    }
  }
};

onMounted(() => {
  if (props.room && props.room.id) {
    fetchNearData(props.room.id);
  }
});

watch(
  () => props.room,
  (newRoom) => {
    if (newRoom && newRoom.id) {
      fetchNearData(newRoom.id);
    }
  }
);

watch(markersVisible, (newVal) => {
  if (map.value) {
    addMarkers();
  }
});

const toggleMarkers = () => {
  markersVisible.value = !markersVisible.value;
};

const onLoadMap = (mapObject) => {
  map.value = mapObject;
  if (nearData.value.safety && nearData.value.safety.length > 0) {
    addMarkers();
  }
  drawCircle(nearData.value.random_location);
};

const addMarkers = () => {
  if (nearData.value.safety && nearData.value.safety.length > 0) {
    console.log("Adding markers for safety POIs:", nearData.value.safety);
    const cctvIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C13.1 2 14 2.9 14 4V6C14 7.1 13.1 8 12 8H8C6.9 8 6 7.1 6 6V4C6 2.9 6.9 2 8 2H12ZM19 6H20V8H19V6ZM19 10H20V12H19V10ZM16 4H17V6H16V4ZM16 8H17V10H16V8ZM16 12H17V14H16V12ZM8 10H12V14H8V10ZM8 16H12V20H8V16ZM4 8H5V10H4V8ZM4 4H5V6H4V4ZM4 12H5V14H4V12ZM12 14H8V18H12V14ZM4 16H5V18H4V16Z" fill="#000000"/></svg>`;
    const cafeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6H20V8H18V11C18 14.87 14.87 18 11 18C7.13 18 4 14.87 4 11V8H2V6H16ZM12 18H10V20H12V18ZM14 20H8V22H14V20Z" fill="#000000"/></svg>`;

    // Adding CCTV markers
    const cctvData = nearData.value.safety.find((item) => item.query === "CCTV");
    console.log("CCTV Data:", cctvData);
    if (cctvData && cctvData.pois) {
      cctvData.pois.forEach((location) => {
        console.log("Adding CCTV marker:", location);
        new naver.maps.Marker({
          position: new naver.maps.LatLng(location.location[1], location.location[0]),
          map: markersVisible.value ? map.value : null,
          icon: {
            content: cctvIcon,
            anchor: new naver.maps.Point(12, 12),
          },
        });
      });
    }

    // Adding Cafe markers
    const cafeData = nearData.value.convenience.find((item) => item.query === "CE7");
    console.log("Cafe Data:", cafeData);
    if (cafeData && cafeData.pois) {
      cafeData.pois.forEach((location) => {
        console.log("Adding Cafe marker:", location);
        new naver.maps.Marker({
          position: new naver.maps.LatLng(location.location[1], location.location[0]),
          map: markersVisible.value ? map.value : null,
          icon: {
            content: cafeIcon,
            anchor: new naver.maps.Point(12, 12),
          },
        });
      });
    }
  }
};

const drawCircle = (newLocation) => {
  if (newLocation) {
    new naver.maps.Circle({
      map: map.value,
      center: new naver.maps.LatLng(newLocation[1], newLocation[0]),
      radius: 100,
      fillColor: "blue",
      fillOpacity: 0.15,
      strokeColor: "blue",
      strokeOpacity: 1,
      strokeWeight: 2,
    });
  }
};

const toggleMeasurement = () => {
  isSquareMeters.value = !isSquareMeters.value;
};

const convertToPyeong = (squareMeters) => {
  const pyeong = squareMeters * 0.3025;
  return pyeong.toFixed(2);
};
</script>

<style scoped>
.room-detail-info {
  font-family: "Arial", sans-serif;
  margin-left: 20%;
  border-radius: 8px;
  width: 700px;
}

.section {
  margin-bottom: 60px;
}

h2 {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 20px;
  /* 폰트 크기 키움 */
}

.detail-item strong {
  font-weight: 700;
  color: rgb(34, 34, 34);
  width: 200px;
  /* 동일한 너비 설정 */
}

.detail-item p {
  font-size: 20px;
  /* 폰트 크기 키움 */
  line-height: 26px;
  font-weight: 400;
  color: rgb(34, 34, 34);
  flex-grow: 1;
  /* 남은 공간 차지 */
}

.detail-item + .detail-item {
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
  margin-top: 12px;
}

.blue-text {
  color: #007bff;
}

button {
  margin-left: 20px;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
}

button:hover {
  background-color: #0056b3;
}

.option-container {
  display: grid;
  grid-template-columns: repeat(9, minmax(0px, 1fr));
  gap: 24px 16px;
}

.option-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.option-icon {
  margin-bottom: 8px;
}

.option-name {
  font-size: 16px;
  color: rgb(34, 34, 34);
}

.show-markers-button {
  position: absolute;
  top: 10vh;
  right: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  z-index: 1000;
  display: flex;
  align-items: center;
}

.show-markers-button img.bus-icon {
  margin-right: 8px;
  width: 24px;
  height: 24px;
}

.show-markers-button:hover {
  background: #f0f0f0;
}

.info-window {
  font-family: Arial, sans-serif;
  padding: 15px;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  background: #fff;
  border-radius: 5px;
  position: relative;
}

.info-window h4 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
}

.info-window p {
  margin: 5px 0;
  color: #555;
}

.info-window::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-60%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 10px 0 10px;
  border-color: #fff transparent transparent transparent;
}
</style>
