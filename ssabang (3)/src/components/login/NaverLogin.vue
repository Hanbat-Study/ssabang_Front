<template>
    <div>
      <!-- 네이버 로그인 버튼 노출 영역 -->
      <div id="naver_id_login"></div>
    </div>
  </template>
  <script>
  // 네이버 개발자센터에서 어플리케이션 등록 시 발급된 값
  const clientId = "eqj7T13SdsHAhjitFbRE";
  
  export default {
    components: {},
    data() {
      return {};
    },
    mounted() {
      this.naverLogin = new window.naver_id_login(
        clientId,
        "http://localhost:3000/login/naver"  // 개발자센터에서 등록한 Callback URL
      );
      var state = this.naverLogin.getUniqState();
      this.naverLogin.setButton("white", 2, 40); // 버튼설정
      this.naverLogin.setDomain("http://localhost:3000");
      this.naverLogin.setState(state);
      //this.naverLogin.setPopup(); // 팝업 여부
      this.naverLogin.init_naver_id_login();
    },
  };
  </script>