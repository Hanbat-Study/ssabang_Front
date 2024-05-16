<template>
  <naver-map
    style="width: 100%; height: 80vh"
    :mapOptions="mapOptions"
    :initLayers="initLayers"
    @onLoad="onLoadMap"
    @highlightLocation="addHighlightCircle"
    @clearHighlight="removeHighlightCircle"
  >
  </naver-map>
</template>

<script setup>
import { ref, reactive, watch, toRefs } from "vue";
import { useRoute } from 'vue-router';
import { NaverMap } from "vue3-naver-maps";
import axios from 'axios';

const props = defineProps({
  latitude: Number,
  longitude: Number,
  type: String,
  id: Number,
  zoom: Number
});

const map = ref(null);
const currentCircle = ref(null);
const currentPolygons = ref([]); // Initialize as an empty array

const route = useRoute();

const mapOptions = reactive({
  latitude: props.latitude || 37.51347,
  longitude: props.longitude || 127.041722,
  zoom: props.zoom || 14,
  zoomControl: false,
  zoomControlOptions: { position: "TOP_RIGHT" }
});

const initLayers = ["BACKGROUND", "BACKGROUND_DETAIL", "POI_KOREAN", "TRANSIT", "ENGLISH"];

async function drawPolygon(type, id) {
  try {
    const response = await axios.get(`https://d2pi55cyzoqmrc.cloudfront.net/geojson/${type}/${id}`);
    const data = response.data;

    // Clear previous polygons
    currentPolygons.value.forEach(polygon => polygon.setMap(null));
    currentPolygons.value = [];

    const createPolygon = (coordinates, fillColor, strokeColor) => {
      // Map each part of the coordinates to a new LatLng object
      const paths = coordinates.map(part => part.map(point => new naver.maps.LatLng(point[1], point[0])));
      const polygon = new naver.maps.Polygon({
        map: map.value,
        paths: paths,
        fillColor: fillColor,
        fillOpacity: 0.15,
        strokeColor: strokeColor,
        strokeOpacity: 1,
        strokeWeight: 2
      });
      currentPolygons.value.push(polygon);
    };

    if (data.type === 'Polygon') {
      createPolygon(data.coordinates, '#1ba885', '#1BA885'); // Single polygon
    } else if (data.type === 'MultiPolygon') {
      // Handle each polygon in the MultiPolygon
      data.coordinates.forEach(polygonCoordinates => {
        createPolygon(polygonCoordinates, '#8782ea', '#8782EA'); // Each polygon in MultiPolygon
      });
    }
  } catch (error) {
    console.error('Failed to load polygon data:', error);
  }
}


const onLoadMap = (mapObject) => {
  map.value = mapObject;
  updateMapBasedOnRoute();
};

const updateMapBasedOnRoute = () => {
  const { type, id, latitude, longitude, zoom } = route.query;

  if (map.value && latitude && longitude) {
    map.value.setCenter(new naver.maps.LatLng(parseFloat(latitude), parseFloat(longitude)));
    map.value.setZoom(parseInt(zoom) || 14);
    if (type && id) {
      drawPolygon(type, id);
    }
  }
};

watch(() => [props.latitude, props.longitude, props.zoom, route.query], () => {
  updateMapBasedOnRoute();
}, { immediate: true });
</script>
