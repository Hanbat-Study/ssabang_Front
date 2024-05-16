<template>
  <header class="app-header">
    <div class="left-container">
      <div class="logo-container">
        <img
          src="../../assets/ssabang-logo.png"
          alt="ssabang logo"
          @click="goToMain"
          width="100px"
          height="80px"
          style="cursor: pointer"
        />
      </div>
      <!-- 검색 컨테이너가 맵 페이지일 때만 보여집니다 -->
      <div class="search-bar" v-if="isMapPage">
        <input
          type="text"
          v-model="keyword"
          placeholder="지역,지하철,대학 입력"
          @keyup.enter="performSearch"
        />
        <button @click="performSearch">
          <img src="../../assets/search.png" alt="Search" />
        </button>
      </div>
    </div>
    <div class="nav-and-auth">
      <div class="nav-links">
        <div v-if="isLoggedIn">
          <router-link to="/campus" class="nav-link">캠퍼스 보기</router-link>
          <a href="/favorites" class="nav-link">관심목록</a>
        </div>
        <router-link to="/board" class="nav-link">싸방게시판</router-link>
        <a href="/chat" class="nav-link" @click.prevent="openChatRoom">오픈채팅방</a>
      </div>
      <div v-if="isLoggedIn">
        <div class="dropdown" @click="toggleDropdown">
          <button class="dropdown-toggle">{{ userName }}님</button>
          <transition name="fade">
            <ul v-if="isOpen" class="dropdown-menu">
              <li @click="goToMyPage">마이페이지</li>
              <li @click="logout">로그아웃</li>
            </ul>
          </transition>
        </div>
      </div>
      <div v-else>
        <button class="auth-button" @click="handleAuth">로그인/회원가입</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSearch } from "../../services/useSearch.js";
import axios from "axios";
import Swal from "sweetalert2";

const { keyword, searchResult, searchDetails, searchKeyword } = useSearch();
const router = useRouter();
const route = useRoute();

const userProfile = ref(null);
const userName = ref(null);

const isLoggedIn = ref(false); // Example for authentication state
const isOpen = ref(false);
const isMapPage = computed(() => route.name === "map");

function updateUserProfile() {
  const profile = JSON.parse(localStorage.getItem("OauthLoginResponse"));
  userProfile.value = profile;
  userName.value = profile ? profile.name : null;
  isLoggedIn.value = JSON.parse(localStorage.getItem("isFirst")); // profile이 있으면 true, 없으면 false로 설정합니다.
  console.log(localStorage.getItem("isFirst"));
}

onMounted(() => {
  updateUserProfile();
});

watchEffect(() => {
  updateUserProfile();
});

router.beforeEach((to, from, next) => {
  updateUserProfile();
  next();
});

const performSearch = async () => {
  await searchKeyword();
  if (searchResult.value && searchDetails.value.location) {
    console.log("result:", JSON.stringify(searchDetails.value, null, 2));
    router.push({
      name: "map",
      query: {
        type: searchDetails.value.type,
        id: searchDetails.value.id,
        latitude: searchDetails.value.location[1],
        longitude: searchDetails.value.location[0],
        name: searchDetails.value.name,
        zoom: searchDetails.value.zoom,
      },
    });
  } else {
    console.error("검색 결과가 없습니다.");
  }
};

const logout = async () => {
  try {
    const response = await axios.post("user/logout", null, {
      withCredentials: true,
    });

    if (response.status === 200) {
      localStorage.removeItem("userProfile");
      localStorage.removeItem("loginOauthServerType");
      localStorage.removeItem("OauthLoginResponse");
      localStorage.removeItem("isFirst");
      if (route.path === "/") {
        window.location.reload();
      } else {
        router.replace("/");
      }
    }
  } catch (error) {
    console.error("로그아웃 요청을 보내는 도중 에러가 발생했습니다.", error);
  }
};

const goToMain = () => {
  router.replace("/");
};

const handleAuth = () => {
  router.push("/login");
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const goToMyPage = () => {
  router.push("/user");
};

const openChatRoom = () => {
  Swal.fire({
    title: "오픈 채팅방 선택",
    input: "select",
    inputOptions: {
      서울: "서울",
      대전: "대전",
      광주: "광주",
      부울경: "부울경",
      구미: "구미",
      "12기 준비": "12기 준비",
    },
    inputPlaceholder: "캠퍼스를 선택하세요",
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value) {
          const chatRoomLinks = {
            서울: "https://open.kakao.com/o/gPsA7UYf",
            대전: "https://open.kakao.com/o/gcS87UYf",
            광주: "https://open.kakao.com/o/g0vhnVYf",
            부울경: "https://open.kakao.com/o/g3fNnVYf",
            구미: "https://open.kakao.com/o/gJdEOHjg",
            "12기 준비": "https://open.kakao.com/o/gQYSpD9",
          };
          window.location.href = chatRoomLinks[value];
        } else {
          resolve("도시를 선택해 주세요.");
        }
      });
    },
  });
};
</script>

<style>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
}

.left-container {
  display: flex;
  align-items: center;
}

.logo-container {
  margin-right: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  width: 250px; /* 적절한 너비 설정 */
}

.search-bar input[type="text"] {
  flex-grow: 1;
  padding: 8px 10px;
  border: 2px solid #ccc;
  border-radius: 20px;
  background-color: #ffffff;
}

.search-bar button {
  margin-left: -40px; /* 버튼을 인풋과 겹치게 */
  border: none;
  background: none;
  cursor: pointer;
}

.search-bar button img {
  width: 24px;
  height: 24px;
}

.nav-and-auth {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 10px 15px;
  transition: color 0.3s, background-color 0.3s;
}

.nav-link:hover,
.nav-link:focus {
  color: #0056b3;
  background-color: #eef4fa;
}

.auth-button {
  padding: 10px 20px;
  margin-left: 20px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.auth-button:hover {
  background-color: #0056b3;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  width: 115px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-toggle:hover {
  background-color: #0056b3;
}

.dropdown-menu {
  width: 115px;
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #007bff; /* 배경색을 흰색으로 변경 */
  border: 1px solid #007bff; /* 테두리 색상을 회색으로 변경 */
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
  z-index: 1;
}

.dropdown-menu li {
  padding: 10px;
  cursor: pointer;
  color: white;
  text-align: center;
}

.dropdown-menu li:hover {
  background-color: #007bff !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
