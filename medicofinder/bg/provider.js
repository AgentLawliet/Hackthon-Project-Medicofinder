// Importing Firebase Authentication and Firestore functions
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth, db, collection, addDoc } from "./firebase-config.js";

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

// Reference to dynamic elements
const typeInput = document.getElementById("type");
const bloodOptions = document.getElementById("bloodOptions");
const bloodGroupInput = document.getElementById("bloodGroup");
const equipmentOptions = document.getElementById("equipmentOptions");
const equipmentTypeInput = document.getElementById("equipmentType");
const medicineNameField = document.getElementById("medicineNameField");
const medicineNameInput = document.getElementById("medicineName");

// Dynamic behavior for showing/hiding conditional fields and toggling 'required' attributes
typeInput.addEventListener("change", () => {
  const selectedType = typeInput.value.toLowerCase();
  if (selectedType === "blood") {
    bloodOptions.style.display = "block";
    bloodGroupInput.setAttribute("required", "required");
    equipmentOptions.style.display = "none";
    equipmentTypeInput.removeAttribute("required");
    medicineNameField.style.display = "none";
    medicineNameInput.removeAttribute("required");
  } else if (selectedType === "equipment") {
    bloodOptions.style.display = "none";
    bloodGroupInput.removeAttribute("required");
    equipmentOptions.style.display = "block";
    equipmentTypeInput.setAttribute("required", "required");
    medicineNameField.style.display = "none";
    medicineNameInput.removeAttribute("required");
  } else if (selectedType === "medicine") {
    bloodOptions.style.display = "none";
    bloodGroupInput.removeAttribute("required");
    equipmentOptions.style.display = "none";
    equipmentTypeInput.removeAttribute("required");
    medicineNameField.style.display = "block";
    medicineNameInput.setAttribute("required", "required");
  } else {
    bloodOptions.style.display = "none";
    bloodGroupInput.removeAttribute("required");
    equipmentOptions.style.display = "none";
    equipmentTypeInput.removeAttribute("required");
    medicineNameField.style.display = "none";
    medicineNameInput.removeAttribute("required");
  }
});

// Form submission logic
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collecting form data
  const type = typeInput.value.trim().toLowerCase();
  const quantity = parseInt(document.getElementById("quantity").value.trim());
  const localArea = document.getElementById("localArea").value.trim();
  const city = document.getElementById("city").value.trim();
  const contact = document.getElementById("contact").value.trim();

  let resourceData = {
    type,
    quantity,
    localArea: localArea.toLowerCase(),
    city: city.toLowerCase(),
    contact,
  };

  if (type === "blood") {
    resourceData.bloodGroup = bloodGroupInput.value.trim() || null;
  } else if (type === "equipment") {
    resourceData.equipmentType = equipmentTypeInput.value.trim() || null;
  } else if (type === "medicine") {
    resourceData.medicineName = medicineNameInput.value.trim() || null;
  }

  try {
    const docRef = await addDoc(collection(db, "resources"), resourceData);
    console.log("Document successfully written with ID: ", docRef.id);
    responseDiv.innerHTML = `<p class="success">✅ Resource submitted successfully!</p>`;
    form.reset();

    // Reset visibility of dynamic fields
    bloodOptions.style.display = "none";
    equipmentOptions.style.display = "none";
    medicineNameField.style.display = "none";
  } catch (err) {
    console.error("Error adding document: ", err);
    responseDiv.innerHTML = `<p class="error">❌ Error: ${err.message}</p>`;
  }
});