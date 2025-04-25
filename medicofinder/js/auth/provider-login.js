// File: js/auth/provider-login.js
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from "../firebase-config.js";  // shared config

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // ✅ Successful login
      window.location.href = "../providers.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});
