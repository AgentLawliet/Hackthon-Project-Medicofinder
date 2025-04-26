// File: js/auth/provider-login.js
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { db, doc, getDoc, auth, googleProvider } from "../firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const googleLoginBtn = document.getElementById("googleLoginBtn");
  const responseDiv = document.getElementById("response");

  if (!loginForm || !googleLoginBtn || !responseDiv) {
    console.error("One or more DOM elements not found:", {
      loginForm,
      googleLoginBtn,
      responseDiv
    });
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const providerDoc = await getDoc(doc(db, "providers", user.uid));
      if (!providerDoc.exists()) {
        responseDiv.innerHTML = `<p style="color:red;">❌ Please register first.</p>`;
        return;
      }

      responseDiv.innerHTML = `<p style="color:green;">✅ Logged in! Loading...</p>`;
      setTimeout(() => window.location.href = "providers.html", 1000);
    } catch (error) {
      responseDiv.innerHTML = `<p style="color:red;">❌ Wrong email or password.</p>`;
    }
  });

  googleLoginBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const providerDoc = await getDoc(doc(db, "providers", user.uid));
      if (!providerDoc.exists()) {
        responseDiv.innerHTML = `<p style="color:red;">❌ Please register first.</p>`;
        return;
      }

      responseDiv.innerHTML = `<p style="color:green;">✅ Logged in! Loading...</p>`;
      setTimeout(() => window.location.href = "providers.html", 1000);
    } catch (error) {
      responseDiv.innerHTML = `<p style="color:red;">❌ Google login failed. Try again.</p>`;
    }
  });
});