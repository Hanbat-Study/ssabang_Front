<template>
  <div>
    <div class="content">
      <HomeList :rooms="properties" />
      <Map
        :latitude="latitude"
        :longitude="longitude"
        :type="type"
        :id="id"
        :zoom="zoom"
        :center="mapCenter"
      />
    </div>
  </div>
</template>

<script>
import HomeList from "../components/map/HomeList.vue";
import Map from "../components/map/Map.vue";
import axios from "axios";
import { ref, watch, onMounted } from "vue";

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
    const mapCenter = ref({ lat: props.latitude, lng: props.longitude });

    // 필터 값을 고정으로 설정
    // const filters = {
    //   multi_room_type: [0, 2],
    //   selling_type: [0],
    //   deposit_range: [0, 999999],
    //   price_range: [0, 999999],
    //   trade_range: [0, 999999],
    //   maintenance_cost_range: [0, 999999],
    //   room_size: [0, 999999],
    //   supply_space_range: [0, 999999],
    //   room_floor_multi: [1, 2, 3, 4, 5, 6, 7, -1, 0],
    //   division: false,
    //   duplex: false,
    //   room_type: [],
    //   use_approval_date_range: [0, 999999],
    //   parking_average_range: [0, 999999],
    //   household_num_range: [0, 999999],
    //   parking: false,
    //   short_lease: false,
    //   full_option: false,
    //   elevator: false,
    //   balcony: false,
    //   safety: false,
    //   pano: false,
    //   is_contract: false,
    //   deal_type: [0, 1]
    // };

    // API 호출 함수
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
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    // 감시자를 설정하여 props 변경 시 API를 다시 호출
    watch([() => props.id, () => props.type, () => props.zoom], fetchProperties, {
      immediate: true,
    });

    return { properties, mapCenter };
  },
};
</script>

<style>
.content {
  display: flex;
  justify-content: space-between;
}
</style>
