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
      <div id="root">
        <h2 class="title">File Upload</h2>
        <hr />
        <div class="contents">
          <div class="upload-box">
            <div id="drop-file" class="drag-file" ref="dropArea">
              <img
                src="https://img.icons8.com/pastel-glyph/2x/image-file.png"
                alt="파일 아이콘"
                class="image"
              />
              <p class="message">Drag files to upload</p>
              <img src="" alt="미리보기 이미지" class="preview" />
            </div>
            <label class="file-label" for="chooseFile">Choose File</label>
            <input
              class="file"
              id="chooseFile"
              type="file"
              @change="onFileChange($event)"
              accept="image/png, image/jpeg, image/gif"
            />
          </div>
        </div>
      </div>
      <button type="submit" class="submit-button">작성하기</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  setup(props, context) {
    const title = ref("");
    const content = ref("");
    const router = useRouter();
    const selectedFile = ref(null);
    const previewUrl = ref(null);
    const imageUrl = ref("");
    const dropArea = ref(null);

    const onFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedFile.value = file;
        const reader = new FileReader();
        reader.onload = () => {
          uploadFile(file);
          previewUrl.value = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        selectedFile.value = null;
        previewUrl.value = null;
      }
    };

    const uploadFile = (file) => {
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("/images", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("파일 업로드 성공:", response);
          imageUrl.value = response.data.data.imageUrl;
        })
        .catch((error) => {
          console.error("파일 업로드 에러:", error);
        });
    };

    const submitForm = async () => {
      const postData = {
        title: title.value,
        content: content.value,
        image: imageUrl.value,
      };

      try {
        const response = await axios.post("/board", postData, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        Swal.fire({
          title: "성공!",
          text: "게시글이 성공적으로 생성되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        }).then(() => {
          console.log(response.data.data.boardId);
          context.emit(
            "commentListUpdated",
            "createBoard" + response.data.data.boardId + response.data.data.content
          );
          router.push({ name: "board" }).then(() => {
            // window.location.reload();
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

    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const highlight = (e) => {
      preventDefaults(e);
      if (dropArea.value) {
        dropArea.value.classList.add("highlight");
      }
    };

    const unhighlight = (e) => {
      preventDefaults(e);
      if (dropArea.value) {
        dropArea.value.classList.remove("highlight");
      }
    };

    const handleDrop = (e) => {
      unhighlight(e);
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    };

    const handleFiles = (files) => {
      const fileArray = [...files];
      fileArray.forEach(previewFile);
    };

    const previewFile = (file) => {
      console.log(file);
      renderFile(file);
    };

    const renderFile = (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        previewUrl.value = reader.result;
        selectedFile.value = file;
        uploadFile(file);
      };
    };

    const addDropListeners = () => {
      if (dropArea.value) {
        dropArea.value.addEventListener("dragover", highlight);
        dropArea.value.addEventListener("dragleave", unhighlight);
        dropArea.value.addEventListener("drop", handleDrop);
      } else {
        console.error("dropArea가 null입니다.");
      }
    };

    onMounted(() => {
      addDropListeners();
    });

    return {
      title,
      content,
      selectedFile,
      previewUrl,
      imageUrl,
      onFileChange,
      submitForm,
      dropArea,
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
  height: 90%;
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
  position: relative;
  bottom: 40px;
  margin-top: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.submit-button:hover {
  background: #0056b3;
}

#root {
  width: 100%;
  margin: 0 auto;
  max-width: 800px;
}

.title {
  text-align: center;
}

.contents {
  display: flex;
  flex-direction: row;
  margin-top: 30px;
}
.contents .upload-box {
  width: 100%;
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.contents .upload-box .drag-file {
  position: relative;
  width: 100%;
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 3px dashed #dbdbdb;
}
.contents .upload-box .drag-file.highlight {
  border: 3px dashed red;
}
.contents .upload-box .drag-file .image {
  width: 40px;
}
.contents .upload-box .drag-file .message {
  margin-bottom: 0;
}
.contents .upload-box .drag-file .preview {
  display: none;
  position: absolute;
  left: 0;
  height: 0;
  width: 100%;
  height: 100%;
}
.contents .upload-box .file-label {
  margin-top: 30px;
  background-color: #5b975b;
  color: #fff;
  text-align: center;
  padding: 10px 0;
  width: 65%;
  border-radius: 6px;
  cursor: pointer;
}
.contents .upload-box .file {
  display: none;
}

@media (max-width: 700px) {
  .contents {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
  }
  .contents .upload-box {
    width: 100%;
    box-sizing: border-box;
    margin-right: 0;
  }
  .contents .upload-box .drag-file {
    height: 150px;
  }
  .contents .files {
    width: 100%;
    box-sizing: border-box;
    margin-right: 0;
    overflow: initial;
  }
}
</style>
