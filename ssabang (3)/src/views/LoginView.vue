<template>
  <div id="loginform">
    <img id="logo" src="@/assets/result_싸방.png" />
    <h1>
      로그인하시고 <br />
      싸방과 함께 방 찾기 여정을 떠나보세요!
    </h1>
    <div>
      <a @click.prevent="handleLogin('KAKAO', kakaoLoginLink)" alt="kakao login">
        <img class="login-icon" alt="kakao logo" src="@/assets/Type=Kakao.svg" />
      </a>
      <a @click.prevent="handleLogin('NAVER', naverLoginLink)" alt="naver login">
        <img class="login-icon" alt="naver logo" src="@/assets/Type=Naver.svg" />
      </a>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
export default {
  name: "LoginView",
  setup() {
    const kakao_client_id = "67fcf4b58b7e2353ef43cbb92a613625";
    const kakao_redirect_uri = "https://ssabang1.netlify.app/login/kakao";
    const naver_client_id = "eqj7T13SdsHAhjitFbRE";
    const naver_redirect_uri = "https://ssabang1.netlify.app/login/naver";
    const google_client_id =
      "999021316075-clb4c983fqb6ia0da76j7sg1v10i2je3.apps.googleusercontent.com";
    const google_redirect_uri = "https://ssabang1.netlify.app/login/oauth2/code/google";

    const kakaoLoginLink = computed(
      () =>
        `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_client_id}&response_type=code&redirect_uri=${kakao_redirect_uri}`
    );
    const naverLoginLink = computed(
      () =>
        `https://nid.naver.com/oauth2.0/authorize?client_id=${naver_client_id}&response_type=code&redirect_uri=${naver_redirect_uri}&state=UNIQUE_STATE`
    );
    const googleLoginLink = computed(
      () =>
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google_client_id}&redirect_uri=${google_redirect_uri}&response_type=code&scope=profile email`
    );

    const handleLogin = (type, loginLink) => {
      localStorage.setItem("loginOauthServerType", type);
      window.location.href = loginLink;
    };

    const router = useRouter();

    onMounted(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const type = localStorage.getItem("loginOauthServerType");
      console.log("로그인 시도");

      if (code) {
        try {
          console.log("로그인 준비");
          const response = await axios.post("/login", {
            oauthServerType: type,
            code: code,
          });
          console.log("로그인 성공:", response.data);
          localStorage.setItem("userProfile", JSON.stringify(response.data));
          router.replace({ name: "signup" });
        } catch (error) {
          console.error("로그인 에러:", error);
        }
      }
    });

    return {
      kakaoLoginLink,
      naverLoginLink,
      googleLoginLink,
      handleLogin,
    };
  },
};
</script>

<style scoped>
#loginform {
  width: 400px;
  margin: 0 auto;
  border: 1px solid rgb(245, 245, 245);
  padding: 0 68px 80px;
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-icon {
  cursor: pointer;
}

#logo {
  width: 35%;
}

h1 {
  width: 330px;
  color: rgb(34, 34, 34);
  font-size: 20px;
  line-height: 32px;
  font-weight: 700;
  text-align: center;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  padding: 30px 0 20px;
}
</style>
