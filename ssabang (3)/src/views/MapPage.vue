<template>
  <div>
    <div class="content">
      <HomeList
        :rooms="properties"
        @highlightLocation="handleHighlightLocation"
        @clearHighlight="handleClearHighlight"
      />
      <Map
        :latitude="latitude"
        :longitude="longitude"
        :type="type"
        :id="id"
        :zoom="zoom"
        @update:center="handleCenterChange"
      />
    </div>
  </div>
</template>

<script>
import HomeList from "../components/map/HomeList.vue";
import Map from "../components/map/Map.vue";
import axios from "axios";
import { ref, watch, provide } from "vue";

export default {
  components: {
    HomeList,
    Map,
  },
  props: {
    type: String,
    id: Number,
    latitude: Number,
    longitude: Number,
    zoom: Number,
  },
  setup(props) {
    const properties = ref([]);
    const isLoading = ref(false);
    const mapCenter = ref({ lat: props.latitude, lng: props.longitude });
    const fetchProperties = async () => {
      let url = "";
      // 'region' 타입에 따른 URL 설정
      if (props.type === "region") {
        url = `https://www.dabangapp.com/api/3/room/new-list/multi-room/region?api_version=3.0.1&call_type=web&code=30200111&filters=%7B%22multi_room_type%22%3A%5B0%2C1%2C2%5D%2C%22selling_type%22%3A%5B0%2C1%2C2%5D%2C%22deposit_range%22%3A%5B0%2C999999%5D%2C%22price_range%22%3A%5B0%2C999999%5D%2C%22trade_range%22%3A%5B0%2C999999%5D%2C%22maintenance_cost_range%22%3A%5B0%2C999999%5D%2C%22room_size%22%3A%5B0%2C999999%5D%2C%22supply_space_range%22%3A%5B0%2C999999%5D%2C%22room_floor_multi%22%3A%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C-1%2C0%5D%2C%22division%22%3Afalse%2C%22duplex%22%3Afalse%2C%22room_type%22%3A%5B1%2C2%5D%2C%22use_approval_date_range%22%3A%5B0%2C999999%5D%2C%22parking_average_range%22%3A%5B0%2C999999%5D%2C%22household_num_range%22%3A%5B0%2C999999%5D%2C%22parking%22%3Afalse%2C%22short_lease%22%3Afalse%2C%22full_option%22%3Afalse%2C%22elevator%22%3Afalse%2C%22balcony%22%3Afalse%2C%22safety%22%3Afalse%2C%22pano%22%3Afalse%2C%22is_contract%22%3Afalse%2C%22deal_type%22%3A%5B0%2C1%5D%7D&page=1&version=1&zoom=14`;
      } else {
        url = `https://www.dabangapp.com/api/3/room/new-list/multi-room/${props.type}?api_version=3.0.1&call_type=web&filters=%7B%22multi_room_type%22%3A%5B0%2C2%5D%2C%22selling_type%22%3A%5B0%5D%2C%22deposit_range%22%3A%5B0%2C999999%5D%2C%22price_range%22%3A%5B0%2C999999%5D%2C%22trade_range%22%3A%5B0%2C999999%5D%2C%22maintenance_cost_range%22%3A%5B0%2C999999%5D%2C%22room_size%22%3A%5B0%2C999999%5D%2C%22supply_space_range%22%3A%5B0%2C999999%5D%2C%22room_floor_multi%22%3A%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C-1%2C0%5D%2C%22division%22%3Afalse%2C%22duplex%22%3Afalse%2C%22room_type%22%3A%5B%5D%2C%22use_approval_date_range%22%3A%5B0%2C999999%5D%2C%22parking_average_range%22%3A%5B0%2C999999%5D%2C%22household_num_range%22%3A%5B0%2C999999%5D%2C%22parking%22%3Afalse%2C%22short_lease%22%3Afalse%2C%22full_option%22%3Afalse%2C%22elevator%22%3Afalse%2C%22balcony%22%3Afalse%2C%22safety%22%3Afalse%2C%22pano%22%3Afalse%2C%22is_contract%22%3Afalse%2C%22deal_type%22%3A%5B0%2C1%5D%7D&id=${props.id}&page=1&version=1&zoom=${props.zoom}`;
      }
      try {
        const response = await axios.get(url);
        properties.value = response.data.rooms;
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };
    const fetchPropertiesByLocation = async (latitude, longitude, zoom) => {
      isLoading.value = true;
      let lng1 = longitude - 0.0085;
      let lng2 = longitude + 0.0085;
      let lat1 = latitude - 0.0074;
      let lat2 = latitude + 0.0074;
      let url = `https://www.dabangapp.com/api/3/room/new-list/multi-room/bbox?api_version=3.0.1&call_type=web&filters=%7B%22multi_room_type%22%3A%5B0%2C2%5D%2C%22selling_type%22%3A%5B0%5D%2C%22deposit_range%22%3A%5B0%2C999999%5D%2C%22price_range%22%3A%5B0%2C999999%5D%2C%22trade_range%22%3A%5B0%2C999999%5D%2C%22maintenance_cost_range%22%3A%5B0%2C999999%5D%2C%22room_size%22%3A%5B0%2C999999%5D%2C%22supply_space_range%22%3A%5B0%2C999999%5D%2C%22room_floor_multi%22%3A%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C-1%2C0%5D%2C%22division%22%3Afalse%2C%22duplex%22%3Afalse%2C%22room_type%22%3A%5B%5D%2C%22use_approval_date_range%22%3A%5B0%2C999999%5D%2C%22parking_average_range%22%3A%5B0%2C999999%5D%2C%22household_num_range%22%3A%5B0%2C999999%5D%2C%22parking%22%3Afalse%2C%22short_lease%22%3Afalse%2C%22full_option%22%3Afalse%2C%22elevator%22%3Afalse%2C%22balcony%22%3Afalse%2C%22safety%22%3Afalse%2C%22pano%22%3Afalse%2C%22is_contract%22%3Afalse%2C%22deal_type%22%3A%5B0%2C1%5D%7D&location=%5B%5B${lng1}%2C${lat1}%5D%2C%5B${lng2}%2C${lat2}%5D%5D&page=1&version=1&zoom=${zoom}`;
      try {
        const response = await axios.get(url);
        properties.value = response.data.rooms;
        isLoading.value = false;
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        isLoading.value = false;
      }
    };

    const highlightLocation = ref(null);
    const clearHighlight = ref(false);

    function handleHighlightLocation(location) {
      highlightLocation.value = location;
    }

    function handleClearHighlight() {
      clearHighlight.value = true;
    }
    const handleCenterChange = (centerInfo) => {
      console.log(
        "Center changed to: Latitude:",
        centerInfo.lat,
        "Longitude:",
        centerInfo.lng,
        "Zoom level:",
        centerInfo.zoom
      );
      // 기타 필요한 작업 수행
      fetchPropertiesByLocation(centerInfo.lat, centerInfo.lng, centerInfo.zoom);
    };
    // Props가 변화할 때마다 강조 표시를 제거하고 새로운 데이터를 가져옵니다.
    watch(
      [() => props.id, () => props.type, () => props.zoom],
      () => {
        handleClearHighlight();
        fetchProperties();
      },
      {
        immediate: true,
      }
    );
    provide("highlightLocation", highlightLocation);
    provide("clearHighlight", clearHighlight);
    provide("isLoading", isLoading);
    return {
      properties,
      mapCenter,
      handleHighlightLocation,
      handleClearHighlight,
      handleCenterChange,
      isLoading,
    };
  },
};
</script>

<style>
.content {
  display: flex;
  justify-content: space-between;
}
</style>
