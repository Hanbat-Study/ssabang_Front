<template>
  <div id="signup">
    <header>
      <h1>회원정보 입력</h1>
    </header>
    <div>
      <p>싸방 서비스 이용을 위해 아래 정보를 입력해주세요.</p>
    </div>
    <form @submit.prevent="submitForm">
      <div>
        <p>이메일</p>
        <input
          autocomplete="off"
          type="text"
          name="email"
          placeholder="이메일 주소 입력"
          v-model="email"
          @blur="checkEmail"
          :disabled="emailDisabled"
          class="cJIIHX"
        />
        <button @click.prevent="checkEmailAndShowVerification" class="btnCertification">
          인증 코드 받기
        </button>
      </div>
      <div v-if="showVerification">
        <p>인증번호</p>
        <input
          autocomplete="off"
          type="text"
          name="verification"
          placeholder="인증 번호 입력"
          v-model="verification"
          class="cJIIHX"
        />
        <button
          @click.prevent="verifyCode"
          class="btnCertification marginRight"
          :disabled="verifyDisabled"
        >
          인증하기
        </button>
        <button
          @click.prevent="resetEmail"
          class="btnCertification marginRight"
          :disabled="resetDisabled"
        >
          재발급하기
        </button>
        <span v-if="timeLeft > 0"
          >{{ Math.floor(timeLeft / 60) }}:{{ ("0" + (timeLeft % 60)).slice(-2) }}</span
        >
      </div>
      <div>
        <p>성별</p>
        <select name="gender" class="cJIIHX" v-model="gender">
          <option value="" selected disabled>성별 선택</option>
          <option value="MAN">남성</option>
          <option value="WOMAN">여성</option>
        </select>
      </div>
      <div>
        <p>캠퍼스</p>
        <select name="campus" class="cJIIHX" v-model="campus">
          <option value="" selected disabled>캠퍼스 선택</option>
          <option value="SEOUL">서울</option>
          <option value="DAEJEON">대전</option>
          <option value="GWANGJU">광주</option>
          <option value="GUMI">구미</option>
          <option value="BOOULGYEONG">부울경</option>
        </select>
      </div>
      <div>
        <button type="submit" class="signupBtn">회원가입</button>
      </div>
    </form>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      verification: "",
      gender: "",
      campus: "",
      showVerification: false,
      verified: false,
      emailDisabled: false,
      resetDisabled: false,
      timer: null,
      timeLeft: 0,
    };
  },
  methods: {
    startTimer() {
      this.timeLeft = 180;
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.stopTimer();
          Swal.fire({
            icon: "error",
            title: "시간 만료",
            text: "시간이 만료되었습니다. 인증번호를 다시 요청해주세요.",
            confirmButtonText: "확인",
          });
        }
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    resetEmail() {
      if (this.resetDisabled) {
        return;
      }
      this.showVerification = false;
      this.emailDisabled = false;
      this.email = "";
      this.verification = "";
      this.resetDisabled = false;
    },
    validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
      return re.test(String(email).toLowerCase());
    },
    async submitForm() {
      if (!this.verified) {
        Swal.fire({
          icon: "error",
          title: "인증 필요",
          text: "인증번호를 인증해주세요.",
          confirmButtonText: "확인",
        });
        return;
      }
      if (!this.gender) {
        Swal.fire({
          icon: "warning",
          title: "성별 선택",
          text: "성별을 선택해주세요.",
          confirmButtonText: "확인",
        });
        return;
      }
      if (!this.campus) {
        Swal.fire({
          icon: "warning",
          title: "캠퍼스 선택",
          text: "캠퍼스를 선택해주세요.",
          confirmButtonText: "확인",
        });
        return;
      }

      const oauthLoginResponse = JSON.parse(localStorage.getItem("OauthLoginResponse") || "{}");

      const formData = {
        email: oauthLoginResponse.email,
        name: oauthLoginResponse.name,
        oauthServerType: oauthLoginResponse.oauthServerType,
        gender: this.gender,
        campus: this.campus,
      };
      try {
        await axios.post("/user/signup", formData, {
          withCredentials: true,
        });

        localStorage.setItem("isFirst", true);

        Swal.fire({
          icon: "success",
          title: "회원가입 완료!",
          text: "싸방과 함께 싸피 준비해요!",
          confirmButtonText: "확인",
        });

        this.$router.replace("/");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "오류 발생",
          text: "회원가입 중 문제가 발생했습니다. 다시 시도해주세요.",
          confirmButtonText: "확인",
        });
        console.error("Signup error:", error);
      }
    },
    checkEmailAndShowVerification() {
      if (this.emailDisabled) {
        return;
      }
      if (this.validateEmail(this.email)) {
        console.log(1);
        this.showVerification = true;
        this.emailDisabled = true;

        axios
          .post(
            "/email",
            {
              email: this.email,
            },
            {
              timeout: 10000,
            }
          )
          .then((response) => {
            this.startTimer();
            console.log(response.data);
            Swal.fire({
              title: "성공!",
              text: "인증 코드가 발급되었습니다.",
              icon: "success",
              confirmButtonText: "확인",
            });
          })
          .catch((error) => {
            console.error("Error posting email: ", error);
            Swal.fire({
              title: "오류!",
              text: "이메일 전송에 실패했습니다.",
              icon: "error",
              confirmButtonText: "닫기",
            });
          });
      } else {
        Swal.fire({
          title: "경고!",
          text: "유효하지 않은 이메일입니다.",
          icon: "warning",
          confirmButtonText: "다시 시도",
        });
      }
    },

    async verifyCode() {
      try {
        const response = await axios.post("/email/code", {
          email: this.email,
          code: this.verification,
        });

        this.verified = true;
        this.resetDisabled = true;
        this.verifyDisabled = true;
        this.stopTimer();
        this.timeLeft = 0;
        this.timer = null;
        this.showVerification = false;

        Swal.fire({
          title: "성공!",
          text: "인증번호가 확인되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
      } catch (error) {
        console.error("Verification error:", error);

        Swal.fire({
          title: "실패!",
          text: "인증에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "다시 시도",
        });
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

p {
  font-weight: 700;
}

form {
  padding-top: 48px;
}

header {
  padding-bottom: 28px;
  border-bottom: 1px solid rgb(245, 245, 245);
}

#signup {
  width: 476px;
  margin: 0 auto;
  border: 1px solid rgb(245, 245, 245);
  transition: padding 250ms ease-in-out 0s;
  padding: 68px;
  min-height: 100%;
}

.cJIIHX {
  width: 100%;
  height: 45px;
  color: rgb(34, 34, 34);
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  padding: 0px 16px;
  border: 1px solid rgb(237, 237, 237);
  border-radius: 2px;
  background-color: rgb(255, 255, 255);
  transition: all 150ms ease-out 0s;
  user-select: none;
}

.btnCertification {
  background-color: #007bff;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  margin: 10px 0 0;
}

.btnCertification:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.signupBtn {
  flex: 0 0 auto;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  padding: 0px 16px;
  color: rgb(255, 255, 255);
  border: 0px;
  border-radius: 2px;
  transition: all 150ms ease-out 0s;
  cursor: pointer;
  height: 56px;
  font-size: 14px;
  line-height: 24px;
  font-weight: 700;
  background-color: rgb(50, 108, 249);
  margin: 50px 0 0;
}

.signupBtn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.marginRight {
  margin-right: 10px;
}
</style>
