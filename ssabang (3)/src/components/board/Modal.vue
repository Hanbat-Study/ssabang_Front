<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">×</button>
      <img src="@/assets/ssabang-logo.png" alt="Ssabang Logo" class="modal-logo" />
      <h3>싸피를 위한 방 구하기!</h3>
      <p>무료로 이용해보세요!</p>
      <div class="modal-buttons">
        <button @click="goToLogin" class="login-button">로그인 하러가기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  emits: ['close'],
  setup(_, { emit }) {
    const router = useRouter();

    const goToLogin = () => {
      emit('close');
      router.push({ name: 'login' });
    };

    const closeModal = () => {
      emit('close');
    };

    return {
      goToLogin,
      closeModal
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 40px 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-logo {
  width: 100px;
  margin-bottom: 20px;
}

h3 {
  margin-bottom: 15px;
}

p {
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  justify-content: center;
}

.login-button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>
