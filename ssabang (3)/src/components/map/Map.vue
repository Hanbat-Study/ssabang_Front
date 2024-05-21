<template>
  <button class="show-markers-button" @click="toggleMarkers">
    <img src="@/assets/bus.png" alt="Bus Icon" class="bus-icon" />
    {{ markersVisible ? "셔틀 위치 가리기" : "셔틀 위치 보이기" }}
  </button>
  <naver-map
    style="width: 100%; height: 80vh"
    :mapOptions="mapOptions"
    :initLayers="initLayers"
    @onLoad="onLoadMap"
    @mouseover="removeHighlightCircle"
  >
    <NaverMarker
      v-if="type === 'ssafy'"
      :latitude="markerPosition.lat"
      :longitude="markerPosition.lng"
      :htmlIcon="markerIcon"
    />
  </naver-map>
</template>

<script setup>
import { ref, reactive, watch, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NaverMap, NaverMarker } from "vue3-naver-maps";
import axios from "axios";
import busRoutes from "@/data/busRoutes.js";
import campusIcon from "../../assets/campus.png";

const emit = defineEmits(["update:center", "regionClick"]);
const props = defineProps({
  latitude: Number,
  longitude: Number,
  type: String,
  id: Number,
  zoom: Number,
});

const map = ref(null);
const currentCircle = ref(null);
const currentPolygons = ref([]);
const activePolygon = ref(null); // 활성화된 폴리건을 추적
const hoverPolygon = ref(null); // 호버된 폴리건을 추적
const initialLoadComplete = ref(false);
const markersVisible = ref(false);
const regions = ref([]);
const markers = [];
const infoWindows = [];
const clusterMarkers = [];
let activeCluster = null;

const route = useRoute();
const router = useRouter();

const mapOptions = reactive({
  center: new naver.maps.LatLng(props.latitude || 37.51347, props.longitude || 127.041722),
  zoom: props.zoom || 14,
  zoomControl: false,
  zoomControlOptions: { position: "TOP_RIGHT" },
});

const initLayers = ["BACKGROUND", "BACKGROUND_DETAIL", "POI_KOREAN", "TRANSIT", "ENGLISH"];

const markerPosition = reactive({
  lat: props.latitude,
  lng: props.longitude,
});

const markerIcon = {
  content: `<img src="${campusIcon}" style="width:32px;height:32px;" />`,
  size: new naver.maps.Size(32, 32),
  anchor: new naver.maps.Point(16, 32),
};

const highlightLocation = inject("highlightLocation");
const clearHighlight = inject("clearHighlight");

function removeHighlightCircle() {
  if (currentCircle.value) {
    currentCircle.value.setMap(null);
    currentCircle.value = null;
  }
}

function removePolygons() {
  currentPolygons.value.forEach((polygon) => polygon.setMap(null));
  currentPolygons.value = [];
}

function clearActivePolygon() {
  if (activePolygon.value) {
    activePolygon.value.setMap(null);
    activePolygon.value = null;
  }
}

function clearHoverPolygon() {
  if (hoverPolygon.value) {
    hoverPolygon.value.setMap(null);
    hoverPolygon.value = null;
  }
}

watch(
  highlightLocation,
  (newLocation) => {
    if (newLocation) {
      removeHighlightCircle();
      currentCircle.value = new naver.maps.Circle({
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
  },
  { immediate: true }
);

watch(
  () => clearHighlight.value,
  (newVal) => {
    if (newVal) {
      removeHighlightCircle();
      clearHighlight.value = false;
    }
  }
);

async function drawPolygon(type, id) {
  try {
    const response = await axios.get(`https://d2pi55cyzoqmrc.cloudfront.net/geojson/${type}/${id}`);
    const data = response.data;

    clearActivePolygon();

    const createPolygon = (coordinates, fillColor, strokeColor) => {
      const paths = coordinates.map((part) =>
        part.map((point) => new naver.maps.LatLng(point[1], point[0]))
      );
      const polygon = new naver.maps.Polygon({
        map: map.value,
        paths: paths,
        fillColor: fillColor,
        fillOpacity: 0.15,
        strokeColor: strokeColor,
        strokeOpacity: 1,
        strokeWeight: 2,
      });
      activePolygon.value = polygon; // 활성화된 폴리건을 추적
    };

    if (data.type === "Polygon") {
      createPolygon(data.coordinates, "#1ba885", "#1BA885");
    } else if (data.type === "MultiPolygon") {
      data.coordinates.forEach((polygonCoordinates) => {
        createPolygon(polygonCoordinates, "#8782ea", "#8782EA");
      });
    }
  } catch (error) {
    console.error("Failed to load polygon data:", error);
  }
}

async function drawPolygonByRegion(geojsonUrl, isHover = false) {
  try {
    const response = await axios.get(geojsonUrl);
    const data = response.data;

    if (isHover) {
      clearHoverPolygon();
    } else {
      clearActivePolygon();
    }

    const createPolygon = (coordinates) => {
      const paths = coordinates.map((part) =>
        part.map((point) => new naver.maps.LatLng(point[1], point[0]))
      );
      const polygon = new naver.maps.Polygon({
        map: map.value,
        paths: paths,
        fillColor: isHover ? "#4d6fd3" : "#3798FF",
        fillOpacity: isHover ? 0.15 : 0.25,
        strokeColor: "#4d6fd3",
        strokeOpacity: 1,
        strokeWeight: 2,
        strokeLineCap: "round",
        strokeLineJoin: "round",
      });
      if (isHover) {
        hoverPolygon.value = polygon;
      } else {
        activePolygon.value = polygon;
      }
    };

    if (data.type === "Polygon") {
      createPolygon(data.coordinates);
    } else if (data.type === "MultiPolygon") {
      data.coordinates.forEach((polygonCoordinates) => {
        createPolygon(polygonCoordinates);
      });
    }
  } catch (error) {
    console.error("Failed to load polygon data:", error);
  }
}

const createMarkersForRoute = (route) => {
  route.coordinates.forEach((coord, index) => {
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(coord[0], coord[1]),
      map: markersVisible.value ? map.value : null, // 초기에는 마커를 숨김
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

    markers.push(marker);
    infoWindows.push(infoWindow);
  });
};

const toggleMarkers = () => {
  markersVisible.value = !markersVisible.value;
  markers.forEach((marker) => {
    marker.setMap(markersVisible.value ? map.value : null);
  });
  if (!markersVisible.value) {
    infoWindows.forEach((infoWindow) => infoWindow.close());
  }
};

async function fetchRegions(center, zoom) {
  const lng1 = center.lng() - 0.0085;
  const lng2 = center.lng() + 0.0085;
  const lat1 = center.lat() - 0.0074;
  const lat2 = center.lat() + 0.0074;

  try {
    const response = await axios.get(
      `https://www.dabangapp.com/api/3/marker/new-multi-room?api_version=3.0.1&call_type=web&filters=%7B%22multi_room_type%22%3A%5B0%2C2%5D%2C%22selling_type%22%3A%5B0%2C1%2C2%5D%2C%22deposit_range%22%3A%5B0%2C999999%5D%2C%22price_range%22%3A%5B0%2C999999%5D%2C%22trade_range%22%3A%5B0%2C999999%5D%2C%22maintenance_cost_range%22%3A%5B0%2C999999%5D%2C%22room_size%22%3A%5B0%2C999999%5D%2C%22supply_space_range%22%3A%5B0%2C999999%5D%2C%22room_floor_multi%22%3A%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C-1%2C0%5D%2C%22division%22%3Afalse%2C%22duplex%22%3Afalse%2C%22room_type%22%3A%5B%5D%2C%22use_approval_date_range%22%3A%5B0%2C999999%5D%2C%22parking_average_range%22%3A%5B0%2C999999%5D%2C%22household_num_range%22%3A%5B0%2C999999%5D%2C%22parking%22%3Afalse%2C%22short_lease%22%3Afalse%2C%22full_option%22%3Afalse%2C%22elevator%22%3Afalse%2C%22balcony%22%3Afalse%2C%22safety%22%3Afalse%2C%22pano%22%3Afalse%2C%22is_contract%22%3Afalse%2C%22deal_type%22%3A%5B0%2C1%5D%7D&location=%5B%5B${lng1}%2C${lat1}%5D%2C%5B${lng2}%2C${lat2}%5D%5D&page=1&version=1&zoom=${zoom}`
    );

    const data = response.data.regions;

    clusterMarkers.forEach((marker) => marker.setMap(null)); // Remove existing markers
    clusterMarkers.length = 0; // Clear the array

    regions.value = data.map((region) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(region.center[1], region.center[0]),
        map: map.value,
        icon: createClusterIcon(region.count),
      });
      clusterMarkers.push(marker);

      // 클러스터 마커에 마우스를 올리면 폴리건 표시
      naver.maps.Event.addListener(marker, "mouseover", () => {
        if (marker !== activeCluster) {
          drawPolygonByRegion(region.geojson, true); // Draw hover polygon
        }
      });

      // 마우스를 떼면 호버 폴리건 제거
      naver.maps.Event.addListener(marker, "mouseout", () => {
        if (marker !== activeCluster) {
          clearHoverPolygon();
        }
      });

      naver.maps.Event.addListener(marker, "click", () => {
        emit("regionClick", region.code); // Emit the region code
        drawPolygonByRegion(region.geojson); // Draw active polygon
        changeClusterIconStyle(marker); // Change the icon style on click
      });
      return {
        code: region.code,
        count: region.count,
        center: region.center,
      };
    });
  } catch (error) {
    console.error("Failed to fetch regions:", error);
  }
}

const createClusterIcon = (count) => {
  return {
    content: `<div class="cluster-icon">${count}</div>`,
    size: new naver.maps.Size(54, 54),
    anchor: new naver.maps.Point(27, 27),
  };
};

const changeClusterIconStyle = (marker) => {
  const element = marker.getElement().querySelector(".cluster-icon");
  element.classList.add("active");
  element.style.backgroundColor = "white";
  element.style.color = "blue";
  if (activeCluster && activeCluster !== marker) {
    const activeElement = activeCluster.getElement().querySelector(".cluster-icon");
    activeElement.classList.remove("active");
    activeElement.style.backgroundColor = "rgba(50, 108, 249, 0.8)";
    activeElement.style.color = "white";
  }
  activeCluster = marker;
};

const onLoadMap = (mapObject) => {
  map.value = mapObject;

  map.value.addListener("center_changed", () => {
    if (initialLoadComplete.value) {
      const center = map.value.getCenter();
      const zoomLevel = map.value.getZoom();
      emit("update:center", { lat: center.lat(), lng: center.lng(), zoom: zoomLevel });
      fetchRegions(center, zoomLevel);
      removePolygons(); // Remove polygons on map center change
      clearActivePolygon();
    }
  });

  initialLoadComplete.value = true;
  updateMapBasedOnRoute();
  busRoutes.forEach(createMarkersForRoute);
  fetchRegions(map.value.getCenter(), map.value.getZoom());

  // Add click event to the map to close info windows
  naver.maps.Event.addListener(map.value, "click", () => {
    infoWindows.forEach((infoWindow) => infoWindow.close());
  });
};

const updateMapBasedOnRoute = () => {
  removeHighlightCircle();
  const { type, id, latitude, longitude, zoom } = route.query;
  if (map.value && latitude && longitude) {
    map.value.setCenter(new naver.maps.LatLng(parseFloat(latitude), parseFloat(longitude)));
    map.value.setZoom(parseInt(zoom) || 14);
    if (type && id) {
      drawPolygon(type, id);
    }
  }
};

watch(
  () => [props.latitude, props.longitude, props.zoom, route.query],
  () => {
    updateMapBasedOnRoute();
  },
  { immediate: true }
);

watch(
  () => [props.latitude, props.longitude, props.zoom],
  () => {
    if (map.value) {
      map.value.setCenter(new naver.maps.LatLng(props.latitude, props.longitude));
      map.value.setZoom(props.zoom);
      fetchRegions(map.value.getCenter(), map.value.getZoom());
    }
  },
  { immediate: true }
);
</script>

<style>
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

.show-markers-button {
  position: absolute;
  top: 13vh;
  left: 25vw;
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

.cluster-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border: 1px solid rgb(50, 108, 249);
  border-radius: 50%;
  background-color: rgba(50, 108, 249, 0.8);
  color: white;
  font-weight: bold;
}

.cluster-icon.active {
  background-color: white;
  color: blue;
  border-color: blue;
}
</style>
