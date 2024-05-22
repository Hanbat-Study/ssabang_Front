// 쿠키에서 특정 쿠키 값을 가져오는 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// 쿠키에 값을 설정하는 함수
function setCookie(name, value, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// 쿠키를 삭제하는 함수
function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

export { getCookie, setCookie, deleteCookie };
