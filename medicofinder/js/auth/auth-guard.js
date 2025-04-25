// File: js/auth/auth-guard.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from "../firebase-config.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // ❌ User not logged in
    window.location.href = "provider-login.html";
  } else {
    console.log("✅ Authenticated user:", user.email);
  }
});
