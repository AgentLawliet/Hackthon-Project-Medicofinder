import { createUserWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { db, doc, setDoc, auth, googleProvider } from "../firebase-config.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const responseDiv = document.getElementById("response");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "providers", user.uid), {
      email: email,
      createdAt: new Date().toISOString()
    });

    responseDiv.innerHTML = `<p style="color:green;">✅ Registration successful! Redirecting to login...</p>`;
    setTimeout(() => {
      window.location.href = "provider-login.html";
    }, 1000);
  } catch (error) {
    responseDiv.innerHTML = `<p style="color:red;">❌ Registration failed: ${error.message}</p>`;
  }
});

document.getElementById("googleSignUpBtn").addEventListener("click", async () => {
  const responseDiv = document.getElementById("response");

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await setDoc(doc(db, "providers", user.uid), {
      email: user.email,
      createdAt: new Date().toISOString()
    });

    responseDiv.innerHTML = `<p style="color:green;">✅ Registration successful! Redirecting to login...</p>`;
    setTimeout(() => {
      window.location.href = "provider-login.html";
    }, 1000);
  } catch (error) {
    responseDiv.innerHTML = `<p style="color:red;">❌ Google sign-up failed: ${error.message}</p>`;
  }
});