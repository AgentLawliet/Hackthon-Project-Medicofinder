// Importing Firebase Authentication and Firestore functions
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth, db, collection, addDoc } from "./firebase-config.js"; // Adjust if your path is different

// Logout functionality
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Successfully logged out.");
      window.location.href = "provider-login.html";
    })
    .catch((error) => {
      console.error("Logout Error:", error);
      alert("Failed to log out.");
    });
});

// Form submission functionality for adding resources
const form = document.getElementById("providerForm");
const responseDiv = document.getElementById("response");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collecting form data
  const name = document.getElementById("name").value.trim();
  const quantity = parseInt(document.getElementById("quantity").value.trim());
  const type = document.getElementById("type").value.trim() || "N/A";
  const localArea = document.getElementById("localArea").value.trim();
  const city = document.getElementById("city").value.trim();
  const contact = document.getElementById("contact").value.trim();

  // Validation check for required fields
  if (!name || isNaN(quantity) || !localArea || !city || !contact) {
    responseDiv.innerHTML = `<p style="color:red;">❌ Please fill all required fields correctly.</p>`;
    return;
  }

  try {
    // Add data to Firestore 'resources' collection
    await addDoc(collection(db, "resources"), {
      name,
      quantity,
      type,
      localArea: localArea.toLowerCase(),
      city: city.toLowerCase(),
      contact
    });
    responseDiv.innerHTML = `<p style="color:green;">✅ Resource submitted successfully!</p>`;
    form.reset(); // Reset the form after submission
  } catch (err) {
    responseDiv.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
  }
});
