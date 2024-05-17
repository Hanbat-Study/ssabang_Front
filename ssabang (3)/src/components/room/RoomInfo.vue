<template>
    <div class="room-info">
      <p>{{ room.seq }}</p>
      <p>{{ room.price_title }}</p>
      <p>{{ room.room_type_main_str }}, {{ room.room_size }}m², {{ room.room_floor_str }}/{{ room.building_floor_str }}, {{ room.maintenance_cost_str }}</p>
      <p>방:욕실:{{ room.beds_num }}/{{ room.bath_num }}</p>
      <p>위치: {{ room.full_jibun_address_str }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      room: Object
    }
  }
  </script>
  
  <style>
  .room-info {
    margin-bottom: 20px;
  }
  </style>
  