import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../views/MainPage.vue';
import MapPage from '../views/MapPage.vue'; 
import BoardPage from '../views/BoardPage.vue';
import BoardDetail from '../views/BoardDetail.vue';
import BoardWrite from '../views/BoardWrite.vue';
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignUpView.vue';
import AuthCallback from '../components/login/AuthCallback.vue'
import UserView from '../views/UserView.vue';

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainPage
  },
  {
    path: '/map',
    name: 'map',
    component: MapPage,
    props: (route) => ({
      type: route.query.type,
      id: parseInt(route.query.id),
      latitude: parseFloat(route.query.latitude),
      longitude: parseFloat(route.query.longitude),
      name: route.query.name,
      zoom: parseInt(route.query.zoom)
    })
  },
  {
    path: '/board',
    name: 'board',
    component: BoardPage
  },
  {
    path: '/board/detail/:id',
    name: 'boardDetail',
    component: BoardDetail
  },
  {
    path: '/board/write',
    name: 'boardWrite',
    component:BoardWrite
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
},
{
    path: '/signup',
    name: 'signup',
    component: SignUpView,
},
{
    path: '/login/:loginOauthServerType(.*)',
    name: 'AuthCallback',
    component: AuthCallback,
},
{
    path: '/user',
    name: 'userprofile',
    component: UserView,
},

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;