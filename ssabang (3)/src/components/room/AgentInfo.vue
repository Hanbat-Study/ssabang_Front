<template>
  <div class="agent-info" v-if="agent">
    <div class="agent-header">
      <img :src="imageUrl" alt="Profile Image" class="profile-image" />
      <div class="agent-details">
        <h3>{{ agent.name }}</h3>
        <p>{{ agent.address }}</p>
      </div>
    </div>
    <div class="agent-contact-info">
      <p><strong>대표명:</strong> {{ agent.facename }}</p>
      <p><strong>중개등록번호:</strong> {{ agent.reg_id }}</p>
      <p><strong>대표번호:</strong> {{ agent.agent_tel }}</p>
    </div>
    <div class="agent-phone">
      <img src="@/assets/phone.png" alt="Phone Icon" class="phone-icon" />
      <p class="phone-number">
        <strong>{{ agent.agent_tel }}</strong>
      </p>
      <p class="contact-instruction">
        중개사무소에 연락하여 방문일을 예약하세요.<br />다방에서 보고 연락한다고 말씀하시면,<br />더욱
        빠른 예약이 가능합니다.
      </p>
    </div>
    <!-- <button class="contact-button">문자문의</button> -->
  </div>
  <div v-else>loading...</div>
</template>

<script>
export default {
  props: {
    agent: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // 초기 이미지 URL 설정
      // imageUrl: "@/assets/free-icon-user-848043.png",
      imageUrl:
        "https://github.com/Hanbat-Study/algorithm/assets/92250144/e8959b06-055b-4dde-9a0d-ecff8fe62d1b",
    };
  },
  mounted() {
    // 컴포넌트가 마운트되었을 때, 조건에 따라 이미지 URL 업데이트
    if (this.agent.profile_url !== "https://dabang-prod-profile-image.s3.amazonaws.com/") {
      this.imageUrl = this.agent.profile_url;
    }
  },
};
</script>

<style scoped>
.agent-info {
  width: 100%;
  padding: 16px;
  font-family: "Arial", sans-serif;
  box-sizing: border-box;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.agent-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.profile-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 16px;
  object-fit: cover;
}

.agent-details h3 {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.agent-details p {
  font-size: 16px;
  color: #666;
  margin: 4px 0 0;
}

.agent-contact-info {
  margin-bottom: 16px;
  font-size: 16px;
  color: #666;
}

.agent-contact-info p {
  margin: 8px 0;
}

.agent-phone {
  margin-bottom: 16px;
  text-align: center;
  color: #007bff;
}

.agent-phone .phone-number {
  font-size: 20px;
  font-weight: bold;
  margin: 8px 0;
}

.agent-phone .contact-instruction {
  font-size: 14px;
  color: #555;
}

.phone-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 4px;
}

.contact-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  margin-top: 16px;
}

.contact-button:hover {
  background-color: #0056b3;
}
</style>
