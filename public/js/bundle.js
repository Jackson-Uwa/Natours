const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 3000);
};

// import axios from "axios";
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
      alert("Logged In Successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

const form = document.querySelector(".form-login");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://127.0.0.1:8000/api/v1/users/update-me",
      data: {
        name,
        email,
      },
    });

    if (res.data.status === "success") {
      alert("Data Updated Successfully");
    }
  } catch (err) {
    alert("Error updating data");
  }
};

const userForm = document.querySelector(".user-data");
if (userForm) {
  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    updateData(name, email);
  });
}

const updatePwd = async (currentPassword, password, confirmPassword) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://127.0.0.1:8000/api/v1/users/update-my-password",
      data: {
        currentPassword,
        password,
        confirmPassword,
      },
    });

    if (res.data.status === "success") {
      alert("Password Updated Successfully");
    }
  } catch (err) {
    alert("Error updating password");
  }
};

const userPwd = document.querySelector(".user-password");
if (userPwd) {
  userPwd.addEventListener("submit", (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("password-confirm").value;

    updatePwd(currentPassword, password, confirmPassword);
  });
}

const signup = async (name, email, password, confirmPassword, photo) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        confirmPassword,
        photo,
      },
    });
    if (res.data.status === "success") {
      alert("User signed up successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

const signForm = document.querySelector(".form-sign-up");
if (signForm) {
  signForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    const photo = document.getElementById("photo").value;

    signup(name, email, password, confirmPassword, photo);
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
    } catch (err) {
      alert("Error Logging Out");
    }
  });
}
