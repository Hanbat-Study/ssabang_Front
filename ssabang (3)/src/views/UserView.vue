<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  setup() {
    const loggedInSocial = ref("");
    const campus = ref("");
    const email = ref("");
    const gender = ref("");
    const name = ref("");
    const isModalVisible = ref(false);

    onMounted(async () => {
      try {
        const response = await axios.get("/user", { withCredentials: true });
        console.log("User data:", response.data.data.name);
        loggedInSocial.value = response.data.data.oauthServerType;
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
        email.value = response.data.data.email;
        gender.value =
          response.data.data.gender === "MAN"
            ? "남성"
            : response.data.data.gender === "WOMAN"
            ? "여성"
            : "기타";

        name.value = response.data.data.name;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });

    const socialImage = computed(() => {
      switch (loggedInSocial.value) {
        case "KAKAO":
          return "src/assets/Name=Kakao.svg";
        case "NAVER":
          return "src/assets/Name=Naver.svg";
        case "GOOGLE":
          return "src/assets/Name=Google.svg";
      }
    });

    function showModal() {
      Swal.fire({
        title: "캠퍼스 변경",
        input: "select",
        inputOptions: {
          서울: "서울",
          대전: "대전",
          광주: "광주",
          구미: "구미",
          부울경: "부울경",
        },
        inputPlaceholder: "캠퍼스 선택",
        showCancelButton: true,
        confirmButtonText: "변경",
        cancelButtonText: "취소",
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value) {
              resolve();
            } else {
              resolve("캠퍼스를 선택해주세요.");
            }
          });
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          updateCampus(result.value);
        }
      });
    }

    function updateCampus(selectedCampus) {
      let campusCode;

      switch (selectedCampus) {
        case "서울":
          campusCode = "SEOUL";
          break;
        case "대전":
          campusCode = "DAEJEON";
          break;
        case "광주":
          campusCode = "GWANGJU";
          break;
        case "구미":
          campusCode = "GUMI";
          break;
        case "부울경":
          campusCode = "BOOULGYEONG";
          break;
        default:
          console.error("잘못된 캠퍼스 이름입니다.");
          return;
      }

      axios
        .patch("/user", { campus: campusCode }, { withCredentials: true })
        .then((response) => {
          console.log("캠퍼스 정보가 성공적으로 변경되었습니다.", response);
          campus.value = selectedCampus;
        })
        .catch((error) => {
          console.error("캠퍼스 정보 변경 중 오류가 발생했습니다.", error);
        });
    }

    function hideModal() {
      isModalVisible.value = false;
    }

    return {
      loggedInSocial,
      socialImage,
      campus,
      name,
      gender,
      email,
      isModalVisible,
      showModal,
      hideModal,
    };
  },
};
</script>


<template>
  <div id="profile">
    <header>
      <h1>마이페이지</h1>
    </header>
    <ul>
      <li>
        <div>
          <h2>연결된 소셜계정</h2>
        </div>
        <div>
          <img
            :src="socialImage"
            alt="소셜 로고"
            style="width: 32px; height: 32px"
          />
        </div>
      </li>
      <li>
        <div>
          <h2>이메일</h2>
        </div>
        <div>
          <p>{{ email }}</p>
        </div>
      </li>
      <li>
        <div>
          <h2>이름</h2>
        </div>
        <div>
          <p>{{ name }}</p>
        </div>
      </li>
      <li>
        <div>
          <h2>성별</h2>
        </div>
        <div>
          <p>{{ gender }}</p>
        </div>
      </li>
      <li>
        <div>
          <h2>캠퍼스</h2>
        </div>
        <div @click="showModal" style="cursor: pointer">
          <p>{{ campus }}</p>
          <img
            src="@/assets/Arrow Icon.svg"
            style="width: 20px; height: 20px; margin-left: 8px"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

#profile {
  width: 500px;
  margin: 0 auto;
  border: 1px solid rgb(245, 245, 245);
  transition: padding 250ms ease-in-out 0s;
  padding: 68px;
  min-height: 100%;
}

ul {
  list-style-type: none;
}

h2 {
  color: rgb(34, 34, 34);
  font-size: 16px;
  line-height: 16px;
  font-weight: 700;
}

li {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 16px 0px;
}

p {
  color: rgb(101, 101, 101);
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
}

header {
  text-align: center;
}

#profile ul li div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>