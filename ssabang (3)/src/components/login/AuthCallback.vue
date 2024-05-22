<template>
  <div class="centeredImage">
    <!-- <img src="@/assets/drawing-2802.gif" alt="이미지 설명" /> -->
    <lottie-player
      src="https://lottie.host/19ad20b0-4254-4981-893f-fa7e7e047f58/wdbOpNtJqM.json"
      background="transparent"
      speed="1"
      style="width: 500px; height: 500px"
      loop
      autoplay
    ></lottie-player>
  </div>
</template>

<script>
import { onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    onMounted(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const type = localStorage.getItem("loginOauthServerType");

      if (code) {
        try {
          const response = await axios.post(
            "/login",
            {
              oauthServerType: type,
              code: code,
            },
            {
              withCredentials: true,
            }
          );
          console.log("Login successful:", response.data);
          localStorage.setItem("OauthLoginResponse", JSON.stringify(response.data.data));
          const isFirst = response.data.data.isFirst;
          localStorage.setItem("isFirst", !isFirst);
          if (isFirst) {
            router.replace("/signup");
          } else {
            localStorage.setItem("userProfile", JSON.stringify(response.data.data));
            router.replace("/");
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      }
    });
  },
};
</script>

<style scoped>
.centeredImage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

img {
  max-width: 50%;
  height: auto;
}
</style>
