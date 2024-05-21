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
      <naver-map
        style="width: 80%; height: 40vh"
        :mapOptions="mapOptions"
        :initLayers="initLayers"
        @onLoad="onLoadMap"
      ></naver-map>
      <div class="map-marker-buttons">
        <!-- <button class="show-marker-button" @click="toggleCCTVMarkers">
          <img src="@/assets/cctv.png" alt="CCTV Icon" class="icon" />
          {{ cctvMarkersVisible ? 'CCTV 위치 가리기' : 'CCTV 위치 보기' }}
        </button>
        <button class="show-marker-button" @click="toggleCafeMarkers">
          <img src="@/assets/cafe.png" alt="Cafe Icon" class="icon" />
          {{ cafeMarkersVisible ? '카페 위치 가리기' : '카페 위치 보기' }}
        </button> -->
        <button class="show-marker-button" @click="toggleBusMarkers">
          <img src="@/assets/bus-stop.png" alt="Bus Icon" class="icon" />
          {{ busMarkersVisible ? "셔틀 위치 가리기" : "셔틀 위치 보기" }}
        </button>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { NaverMap } from "vue3-naver-maps";
import axios from "axios";
import busRoutes from "@/data/busRoutes.js";

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
});

const nearData = ref({});
const cctvMarkersVisible = ref(false);
const cafeMarkersVisible = ref(false);
const busMarkersVisible = ref(false);
const map = ref(null);
const isSquareMeters = ref(true);
const cctvMarkers = [];
const cafeMarkers = [];
const busMarkers = [];
const infoWindows = [];

const mapOptions = ref({
  center: new naver.maps.LatLng(37.3595704, 127.105399),
  zoom: 15,
  minZoom: 15,
  maxZoom: 15,
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

const toggleCCTVMarkers = () => {
  cctvMarkersVisible.value = !cctvMarkersVisible.value;
  cctvMarkers.forEach((marker) => {
    console.log(marker);
    marker.setMap(cctvMarkersVisible.value ? map.value : null);
  });
  console.log("CCTV Markers Toggled:", cctvMarkersVisible.value);
};

const toggleCafeMarkers = () => {
  cafeMarkersVisible.value = !cafeMarkersVisible.value;
  cafeMarkers.forEach((marker) => {
    console.log(marker);
    marker.setMap(cafeMarkersVisible.value ? map.value : null);
  });
  if (!cafeMarkersVisible.value) cafeMarkers.value = [];
  console.log("Cafe Markers Toggled:", cafeMarkersVisible.value);
};

const toggleBusMarkers = () => {
  busMarkersVisible.value = !busMarkersVisible.value;
  busMarkers.forEach((marker) => {
    marker.setMap(busMarkersVisible.value ? map.value : null);
  });
  if (!busMarkersVisible.value) {
    infoWindows.forEach((infoWindow) => infoWindow.close());
  }
  console.log("Bus Markers Toggled:", busMarkersVisible.value);
};

const onLoadMap = (mapObject) => {
  map.value = mapObject;
  if (nearData.value.safety && nearData.value.safety > 0) {
    console.log("addmarkers");
    addMarkers();
  }
  drawCircle(nearData.value.random_location);
  busRoutes.forEach(createMarkersForRoute);
};
const addMarkers = () => {
  console.log(nearData.value);
  if (nearData.value.safety && nearData.value.safety.length > 0) {
    console.log("Adding markers for safety POIs:", nearData.value.safety);
    const cctvIcon = {
      content: `<img src="@/assets/cctv.png" alt="CCTV Icon" style="width: 24px; height: 24px;" />`,
      anchor: new naver.maps.Point(12, 12),
    };
    const cafeIcon = {
      content: `<img src="@/assets/cafe.png" alt="Cafe Icon" style="width: 24px; height: 24px;" />`,
      anchor: new naver.maps.Point(12, 12),
    };

    // Adding CCTV markers
    const cctvData = nearData.value.safety.find((item) => item.query === "CCTV");
    if (cctvData && cctvData.pois) {
      console.log("CCTV Data:", cctvData);
      cctvData.pois.forEach((location) => {
        console.log("Adding CCTV marker:", location);
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(location.location[1], location.location[0]),
          map: cctvMarkersVisible.value ? map.value : null,
          icon: cctvIcon,
          zIndex: 100,
        });
        cctvMarkers.push(marker);
      });
    }

    // Adding Cafe markers
    const cafeData = nearData.value.convenience.find((item) => item.query === "CE7");
    console.log("Cafe Data:", cafeData);
    if (cafeData && cafeData.pois) {
      cafeData.pois.forEach((location) => {
        console.log("Adding Cafe marker:", location);
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(location.location[1], location.location[0]),
          map: cafeMarkersVisible.value ? map.value : null,
          icon: cafeIcon,
          zIndex: 100,
        });
        cafeMarkers.push(marker);
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

const createMarkersForRoute = (route) => {
  route.coordinates.forEach((coord, index) => {
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(coord[0], coord[1]),
      map: busMarkersVisible.value ? map.value : null,
      icon: {
        content: `<div style="background-color: ${route.color}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; position: absolute;">${route.id}</span>
        </div>`,
        anchor: new naver.maps.Point(15, 15),
      },
      zIndex: 100,
    });

    const infoWindow = new naver.maps.InfoWindow({
      content: `<div class="info-window">
        <h4>${route.name}</h4>
        <p>타는 시간: ${route.times[index % route.times.length]}</p>
        <p>장소: ${route.locations[index % route.locations.length]}</p>
      </div>`,
    });

    naver.maps.Event.addListener(marker, "click", () => {
      infoWindow.open(map.value, marker);
    });

    busMarkers.push(marker);
    infoWindows.push(infoWindow);
  });
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

.map-marker-buttons {
  display: flex;
  justify-content: left;
  margin-top: 10px;
}

.show-marker-button {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
}

.show-marker-button img.icon {
  margin-right: 8px;
  width: 24px;
  height: 24px;
}

.show-marker-button:hover {
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
