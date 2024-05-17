<template>
  <div class="create-board">
    <h2>새 글 작성</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">제목</label>
        <input type="text" id="title" v-model="title" placeholder="제목을 입력하세요" required />
      </div>
      <div class="form-group">
        <label for="content">내용</label>
        <textarea
          id="content"
          v-model="content"
          rows="10"
          placeholder="내용을 입력하세요"
          required
        ></textarea>
      </div>
      <button type="submit" class="submit-button">작성하기</button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createBoard } from "@/api/board"; // API 함수 import
import Swal from "sweetalert2";

export default {
  setup() {
    const title = ref("");
    const content = ref("");
    const router = useRouter();

    const submitForm = () => {
      const board = {
        title: title.value,
        content: content.value,
      };

      try {
        createBoard(board);
        Swal.fire({
          title: "성공!",
          text: "게시글이 성공적으로 생성되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        }).then(() => {
          router.push({ name: "board" }).then(() => {
            window.location.reload();
          });
        });
      } catch (error) {
        console.error("An error occurred while creating the post.", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while creating the post.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    return {
      title,
      content,
      submitForm,
    };
  },
};
</script>

<style scoped>
.create-board {
  width: 80%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 71vh;
  position: relative;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 1.1rem;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  height: 50px;
}

textarea {
  resize: none;
  height: 350px;
}
.submit-button {
  width: calc(100% - 40px);
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.submit-button:hover {
  background: #0056b3;
}
</style>
