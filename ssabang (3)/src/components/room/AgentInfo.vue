<template>
    <div class="agent-info">
      <h3>{{ agent.name }}</h3>
      <p @click="openMoreInfo">{{ truncatedGreeting }}</p>
      <Modal v-model:visible="moreInfoVisible">
        <p>{{ agent.greetings }}</p>
      </Modal>
      <button @click="openContactInfo">연락처보기</button>
      <Modal v-model:visible="contactInfoVisible">
        <div>
          <img :src="agent.profile_url" alt="Profile Image" class="profile-image">
          <div>
            <p>{{ agent.name }}</p>
            <p>{{ agent.address }}</p>
            <p>대표명: {{ agent.facename }}</p>
            <p>중개등록번호: {{ agent.reg_id }}</p>
            <p>대표번호: {{ agent.agent_tel }}</p>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script>
  import Modal from './Modal.vue';
  
  export default {
    components: {
      Modal
    },
    props: {
      agent: Object
    },
    data() {
      return {
        moreInfoVisible: false,
        contactInfoVisible: false
      };
    },
    computed: {
      truncatedGreeting() {
        return this.agent.greetings.length > 50 ? this.agent.greetings.substring(0, 47) + '...' : this.agent.greetings;
      }
    },
    methods: {
      openMoreInfo() {
        this.moreInfoVisible = true;
      },
      openContactInfo() {
        this.contactInfoVisible = true;
      }
    }
  }
  </script>
  
  <style>
  .agent-info .profile-image {
    width: 60px;
    height: 60px;
    border-radius: 30px;
  }
  </style>
  