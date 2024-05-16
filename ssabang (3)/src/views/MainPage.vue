<template>
  <main>
    <SearchSection />
    <LinkSection />
  </main>
</template>

<script>
import SearchSection from '../components/main//SearchSection.vue';
import LinkSection from '../components/main/LinkSection.vue';

export default {
  components: {
    SearchSection,
    LinkSection
  }
}
</script>

<style>
/* Styling for the main container can go here */
</style>
