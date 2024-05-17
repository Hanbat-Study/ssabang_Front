<template>
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
import { ref, reactive, watch, toRefs, inject } from "vue";
import { useRoute } from "vue-router";
import { NaverMap, NaverMarker } from "vue3-naver-maps";
import axios from "axios";
//import campusIcon from "../../assets/campus.png";

const emit = defineEmits(["update:center"]);
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
const initialLoadComplete = ref(false);

const route = useRoute();

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
  //content: `<img src="${campusIcon}" style="width:32px;height:32px;" />`,
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

    currentPolygons.value.forEach((polygon) => polygon.setMap(null));
    currentPolygons.value = [];

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
      currentPolygons.value.push(polygon);
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

const onLoadMap = (mapObject) => {
  map.value = mapObject;
  map.value.addListener("center_changed", () => {
    if (initialLoadComplete.value) {
      const center = map.value.getCenter();
      const zoomLevel = map.value.getZoom();
      currentPolygons.value.forEach((polygon) => polygon.setMap(null));
      currentPolygons.value = [];
      emit("update:center", { lat: center.lat(), lng: center.lng(), zoom: zoomLevel });
    }
  });
  initialLoadComplete.value = true;
  updateMapBasedOnRoute();
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
    }
  },
  { immediate: true }
);
</script>
