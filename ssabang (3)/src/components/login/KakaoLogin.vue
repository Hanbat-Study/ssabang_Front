<template>
    <div class="login">
        <p>{{ accessToken }}</p>
        <a @click="socialLogin">
            <img src="src/assets/kakao_login_large_wide.png"/>
        </a>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
  name: 'UserLogin',
  data () {
    return {
        accessToken: ''
    }
  },
  methods: {
    socialLogin: function(){
        var ref = this;
        const scope = "profile_nickname,account_email"
        window.Kakao.Auth.login({
            scope,
            success: () => {
                ref.drinkyLogin();
            },
            fail: (err) => {
                console.log(err)
                alert("카카오 서비스 이용을 할 수 없습니다")
            }
        })
    },
    drinkyLogin: function(){
        var params = { kakaoAccessToken: window.Kakao.Auth.getAccessToken() }
        var ref = this;
        axios.get( "/drinky/api/v1/kakao/login",{params})
        .then((response) => {
            ref.accessToken = response.data.value
        })
        .catch((error)=>{
            console.log(error)
            ref.kakaoLogout()
            alert("서버가 아파요 ㅜㅜ")
        })
    },
    kakaoLogout: function(){
        if(window.Kakao.Auth.getAccessToken()){
            window.Kakao.Auth.logout(function(){
                console.log("logout...")
            })
        }
    }
  }
  }
  </script>