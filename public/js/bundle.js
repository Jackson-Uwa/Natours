const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", `Logged in successfully`);
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
const loginForm = document.querySelector(".form-login");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // const form = new FormData();
    // form.append("email", document.getElementById("email").value);
    // form.append("password", document.getElementById("password").value);
    login(email, password);
  });
}

const signUp = async (name, email, password, confirmPassword) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        confirmPassword,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", `Signed up successfully`);
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const signForm = document.querySelector(".sign-up");
if (signForm) {
  signForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // const form = new FormData();
    // form.append("name", document.getElementById("name").value);
    // form.append("email", document.getElementById("email").value);
    // form.append("password", document.getElementById("password").value);
    // form.append(
    //   "confirmPassword",
    //   document.getElementById("confirm_password").value
    // );
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    // form.append("photo", document.getElementById("photo").files[0]);
    console.log(name, email, password, confirmPassword);
    signUp(name, email, password, confirmPassword);
  });
}

const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://127.0.0.1:8000/api/v1/users/update-my-password"
        : "http://127.0.0.1:8000/api/v1/users/update-me";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} Updated Successfully`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const userForm = document.querySelector(".user-data");
if (userForm) {
  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    console.log(form);
    updateSettings(form, "data");
  });
}

const userPwd = document.querySelector(".user-password");
if (userPwd) {
  userPwd.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";

    const currentPassword = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("password-confirm").value;

    await updateSettings(
      { currentPassword, password, confirmPassword },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      const res = await axios({
        method: "GET",
        url: "http://127.0.0.1:8000/api/v1/users/logout",
      });
      if ((res.data.status = "success")) location.reload(true);
      showAlert("success", "Logged Out");
    } catch (err) {
      showAlert("error", err.response.data.message);
    }
  });
}
