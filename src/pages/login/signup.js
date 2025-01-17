import axios from "axios";

window.onload = function () {
  const signupNickname = document.querySelector("#signupNickname"); //닉네임 input
  const signupEmail = document.querySelector("#signupEmail"); //이메일 input
  const signupPassword = document.querySelector("#signupPassword"); //비밀번호 input
  const confirmPassword = document.querySelector("#confirmPassword"); //비밀 번호 확인 input
  const emailDuplicationBtn = document.querySelector("#emailDuplicationBtn"); //이메일 중복 확인 버튼
  const passwordBtn = document.querySelector("#passwordBtn"); // 비밀번호 보이게 눈 표시 버튼
  const confirmPasswordBtn = document.querySelector("#confirmPasswordBtn"); //비밀번호 확인 눈 표시 버튼
  const signupBtn = document.querySelector("#signupBtn");
  const passwordErr = document.querySelector("#passwordErr"); // 비밀번호 오류 결과
  const emailErr = document.querySelector("#emailErr"); //이메일 오류 결과
  const eyeOnImg = document.querySelectorAll(
    ".signup-form_button-password_cover",
  );
  let duplicationEmail = false;

  // 이메일 유효성 검사
  function emailVaild(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  //비밀번호 유효성 검사

  function passwordValid(password) {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  }
  //------------------------------------------------------------
  // 이메일 중복확인 버튼 누를경우 검사
  emailDuplicationBtn.addEventListener("click", async e => {
    e.preventDefault();
    const email = signupEmail.value;
    try {
      const response = await axios.get("https://11.fesp.shop/users/email", {
        params: {
          email: email,
        },
        headers: {
          "Content-Type": "application/json",
          "client-id": "vanilla02", // 서버 클라이언트 ID
        },
      });
      //db에 이메일이 이미 있음
      if (response.data.ok === 1) {
        emailErr.innerHTML = "사용 가능한 이메일 입니다";
        duplicationEmail = true;
      }
    } catch (error) {
      if (error.response.status === 409) {
        emailErr.innerHTML =
          "이미 사용중인 이메일입니다. 다른 이메일을 입력해주세요.";
        duplicationEmail = false;
      } else if (error.response.status === 422) {
        emailErr.innerHTML =
          "잘못된 이메일 형식입니다. 이메일을 올바르게 입력해주세요";
        duplicationEmail = false;
      }
    }
  });

  //--------------------------------------------------------------
  //회원가입 버튼 클릭 할 경우 유효성 검증과 회원가입
  signupBtn.addEventListener("click", async e => {
    e.preventDefault();
    const email = signupEmail.value;
    const nickname = signupNickname.value;
    const password = signupPassword.value;
    const passwordConfirm = confirmPassword.value;

    //입력 여부 유효성 검사
    //로그인처럼 어느부분이 비었는지 알려주려면
    //경우의수가 너무 많아서 한꺼번에 처리함
    if (!email || !nickname || !password || !passwordConfirm) {
      alert("모든 입력칸을 채워주세요");
      return;
    } else if (!emailVaild(email)) {
      alert("유효한 이메일을 입력하세요");
      return;
    } else if (!passwordValid(password)) {
      passwordErr.innerHTML = "대소문자, 숫자 조합 8자 이상이어야 합니다.";
      return;
    } else if (password !== passwordConfirm) {
      passwordErr.innerHTML = "비밀번호가 일치하지 않습니다";
      return;
    } else if (!duplicationEmail) {
      alert("이메일 중복검사를 확인해주세요");
      return;
    }

    //회원가입 요청
    try {
      const response = await axios.post(
        "https://11.fesp.shop/users",
        {
          email: email,
          name: nickname,
          password: password,
          type: "user",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "client-id": "vanilla02", // 서버 클라이언트 ID
          },
        },
      );
      console.log(response.data.ok);

      //회원가입 성공시에  로그인 화면으로 이동
      if (response.data.ok === 1) {
        alert("회원가입에 성공하셨습니다. 로그인 페이지로 이동합니다");
        console.log(response.data.ok);
        window.location.href = "/src/pages/login/login.html";
      }
    } catch (error) {
      alert("회원가입에 실패하였습니다");
      console.log(error.response.data);
    }
  });

  //비밀번호 눈알 버튼 클릭 하면 내용 보이게
  passwordBtn.addEventListener("click", () => {
    if (signupPassword.type === "password") {
      signupPassword.type = "text";
      eyeOnImg[0].src = "/assets/icons/ic-eye-on.svg";
    } else {
      signupPassword.type = "password";
      eyeOnImg[0].src = "/assets/icons/ic-eye-off.svg";
    }
  });

  //비밀번호 확인 눈알 버튼 클릭 하면 내용 보이게
  confirmPasswordBtn.addEventListener("click", () => {
    if (confirmPassword.type === "password") {
      confirmPassword.type = "text";
      eyeOnImg[1].src = "/assets/icons/ic-eye-on.svg";
    } else {
      confirmPassword.type = "password";
      eyeOnImg[1].src = "/assets/icons/ic-eye-off.svg";
    }
  });
};
