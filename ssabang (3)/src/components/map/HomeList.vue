<template>
  <div class="home-list">
    <div v-for="room in rooms" :key="room.id" class="home-card"
         @click="goToRoom(room.id)"
         @mouseover="highlightLocation(room.location)"
         @mouseout="clearHighlight()">
      <div class="home-image">
        <img :src="room.img_url" alt="Room image">
      </div>
      <div class="home-details">
        <h3>{{ room.price_title }} - {{ room.selling_type_str }}</h3>
        <p>{{ room.room_type_str }} - {{ room.room_desc2 }}</p>
        <p>{{ room.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rooms: Array
  },
  emits: ['highlightLocation', 'clearHighlight'],
  methods: {
    goToRoom(id) {
      this.$router.push(`/room-details/${id}`);
    },
    highlightLocation(location) {
      this.$emit('highlightLocation', location);
    },
    clearHighlight() {
      this.$emit('clearHighlight');
    }
  }
}
</script>


<style scoped>
.home-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.home-card {
  display: flex;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.home-card:hover {
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.home-image img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.home-details {
  padding: 8px;
  flex-grow: 1;
}
</style>
