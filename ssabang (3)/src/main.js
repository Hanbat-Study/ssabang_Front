import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { createNaverMap } from "vue3-naver-maps";
import { getCookie, setCookie, deleteCookie } from "@/utils/cookieUtils";
import VueScrollTo from "vue-scrollto";
import "./assets/global.css"; // 글로벌 스타일 시트 추가

window.Kakao.init("eeaf9c970276a533c2df6ac32f1c0c28");

const app = createApp(App);
app.use(createNaverMap, {
  clientId: "sie9imzgzj",
  subModules: ["geocoder"],
});

const axiosInstance = axios.create({
  timeout: 5000,
});
axios.defaults.baseURL = "http://192.168.120.64:8080/api";
app.config.globalProperties.$axios = axiosInstance;

// 응답 인터셉터
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      const refreshToken = getCookie("SSABANG_REFRESH_TOKEN");

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${axios.defaults.baseURL}/refresh`,
            { refreshToken },
            { withCredentials: true }
          );
          setCookie("SSABANG_TOKEN", data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.log("Unauthorized, redirect to login");
          deleteCookie("SSABANG_TOKEN");
          deleteCookie("SSABANG_REFRESH_TOKEN");
          router.push({ name: "login" }); // 로그인 페이지로 리디렉션
        }
      } else {
        console.log("Unauthorized, redirect to login");
        deleteCookie("SSABANG_TOKEN");
        deleteCookie("SSABANG_REFRESH_TOKEN");
        router.push({ name: "login" }); // 로그인 페이지로 리디렉션
      }
    } else if (error.response && error.response.status === 403) {
      console.log("Forbidden, redirect to login");
      deleteCookie("SSABANG_TOKEN");
      deleteCookie("SSABANG_REFRESH_TOKEN");
      router.push({ name: "login" }); // 로그인 페이지로 리디렉션
    }
    return Promise.reject(error);
  }
);

app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("lottie-");
app.use(router);
app.use(VueScrollTo);
app.mount("#app");
