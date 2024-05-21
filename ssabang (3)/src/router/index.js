import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../views/MainPage.vue";
import MapPage from "../views/MapPage.vue";
import BoardPage from "../views/BoardPage.vue";
import BoardDetail from "../components/board/BoardDetail.vue";
import BoardList from "../components/board/BoardList.vue";
import BoardWrite from "../components/board/BoardWrite.vue";
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";
import AuthCallback from "../components/login/AuthCallback.vue";
import UserView from "../views/UserView.vue";
import RoomDetail from "../views/RoomDetail.vue";
import FavoriteRooms from "../views/FavoriteRooms.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: MainPage,
  },
  {
    path: "/map",
    name: "map",
    component: MapPage,
    props: (route) => ({
      type: route.query.type,
      id: parseInt(route.query.id),
      latitude: parseFloat(route.query.latitude),
      longitude: parseFloat(route.query.longitude),
      name: route.query.name,
      zoom: parseInt(route.query.zoom),
    }),
  },
  {
    path: "/room/detail/:id",
    name: "RoomDetail",
    component: RoomDetail,
    props: (route) => ({
      favoriteRoom: route.query.favoriteRoom ? JSON.parse(route.query.favoriteRoom) : null,
    }),
  },
  {
    path: "/board",
    component: BoardPage,
    children: [
      {
        path: "",
        name: "board",
        component: BoardList,
      },
      {
        path: "detail/:id",
        name: "boardDetail",
        component: BoardDetail,
        props: (route) => ({
          favoriteRoom: route.query.favoriteRoom ? JSON.parse(route.query.favoriteRoom) : null,
        }),
      },
      {
        path: "write",
        name: "boardWrite",
        component: BoardWrite,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
  },
  {
    path: "/login/:loginOauthServerType(.*)",
    name: "AuthCallback",
    component: AuthCallback,
  },
  {
    path: "/user",
    name: "userprofile",
    component: UserView,
  },
  {
    path: "/favorites",
    name: "FavoriteRooms",
    component: FavoriteRooms,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
