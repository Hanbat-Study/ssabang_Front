import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { createNaverMap } from "vue3-naver-maps";

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

app.use(router);
app.mount("#app");
