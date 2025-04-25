// File: js/auth/provider-register.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from "../firebase-config.js"; // reuses your config

document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Registration successful!");
      window.location.href = "provider-login.html"; // redirect to login
    })
    .catch((error) => {
      alert("Registration failed: " + error.message);
    });
});
