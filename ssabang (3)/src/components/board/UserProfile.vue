<template>
  <div class="user-profile">
    <div v-if="isLoggedIn">
      <!-- 프로필 내용 -->
      <div class="profile-header">
        <img src="@/assets/account_circle.png" alt="User Avatar" class="user-avatar" />
        <div class="profile-info">
          <h2>{{ name }}</h2>
          <p>{{ email }}</p>
          <p>{{ campus }} 캠퍼스</p>
        </div>
      </div>
      <div class="write-post-container">
        <button @click="goToWriteBoard" class="write-post-button">글쓰기</button>
      </div>
    </div>
    <div v-else class="login-prompt">
      <p class="login-text">로그인이 필요합니다</p>
      <button @click="goToLogin">무료로 이용해보세요!</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(false); // 로그인 상태를 확인하는 변수

    const campus = ref("");
    const email = ref("");
    const name = ref("");

    const goToLogin = () => {
      router.push({ name: "login" });
    };
    const goToWriteBoard = () => {
      router.push({ name: "boardWrite" });
    };

    onMounted(async () => {
      const isFirst = JSON.parse(localStorage.getItem("isFirst"));
      isLoggedIn.value = isFirst;

      if (isFirst) {
        try {
          const response = await axios.get("/user", { withCredentials: true });
          name.value = response.data.data.name;
          email.value = response.data.data.email;
          switch (response.data.data.campus) {
            case "SEOUL":
              campus.value = "서울";
              break;
            case "DAEJEON":
              campus.value = "대전";
              break;
            case "GWANGJU":
              campus.value = "광주";
              break;
            case "GUMI":
              campus.value = "구미";
              break;
            case "BOOULGYEONG":
              campus.value = "부울경";
              break;
            default:
              campus.value = response.data.data.campus;
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    });

    return {
      isLoggedIn,
      campus,
      email,
      name,
      goToLogin,
      goToWriteBoard,
    };
  },
};
</script>

<style scoped>
.user-profile {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  margin-top: 20px;
  margin-left: 30px;
  text-align: center;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info {
  text-align: left;
  margin-top: 15px;
}

.profile-info h2 {
  margin: 0;
  font-size: 1.6rem;
}

.profile-info p {
  margin: 5px 0;
  font-size: 1.1rem;
  color: #666;
}

.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.login-text {
  text-decoration: underline;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.login-prompt button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-prompt button:hover {
  background: #0056b3;
}

.write-post-container {
  margin-top: 20px;
}

.write-post-button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.write-post-button:hover {
  background: #0056b3;
}
</style>
