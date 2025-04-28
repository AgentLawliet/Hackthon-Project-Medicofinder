// File: js/auth/provider-login.js
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { db, doc, getDoc, auth, googleProvider } from "../firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const googleLoginBtn = document.getElementById("googleLoginBtn");
  const responseDiv = document.getElementById("response");

  if (!loginForm || !googleLoginBtn || !responseDiv) {
    console.error("One or more DOM elements not found:", { loginForm, googleLoginBtn, responseDiv });
    return;
  }

  const showMessage = (message, isSuccess = false) => {
    responseDiv.innerHTML = `<p style="color:${isSuccess ? "green" : "red"};">${message}</p>`;
  };

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const providerDoc = await getDoc(doc(db, "providers", user.uid));
      if (!providerDoc.exists()) {
        showMessage("❌ Please register first.");
        return;
      }

      showMessage("✅ Logged in! Loading...", true);
      setTimeout(() => window.location.href = "resources.html", 1000);
    } catch (error) {
      console.error(error);
      showMessage("❌ Wrong email or password.");
    }
  });

  googleLoginBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const providerDoc = await getDoc(doc(db, "providers", user.uid));
      if (!providerDoc.exists()) {
        showMessage("❌ Please register first.");
        return;
      }

      showMessage("✅ Logged in! Loading...", true);
      setTimeout(() => window.location.href = "providers.html", 1000);
    } catch (error) {
      console.error(error);
      showMessage("❌ Google login failed. Try again.");
    }
  });
});
