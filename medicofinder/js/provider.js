import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from "./firebase-config.js";
import { addResource, updateResource } from "./resource-service.js";

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

// Form and UI elements
const form = document.getElementById("providerForm");
const responseDiv = document.getElementById("response");
const submitBtn = document.getElementById("submitBtn");

// Reference to dynamic elements
const typeInput = document.getElementById("type");
const bloodOptions = document.getElementById("bloodOptions");
const bloodGroupInput = document.getElementById("bloodGroup");
const equipmentOptions = document.getElementById("equipmentOptions");
const equipmentTypeInput = document.getElementById("equipmentType");
const medicineNameField = document.getElementById("medicineNameField");
const medicineNameInput = document.getElementById("medicineName");

// Track edit mode
let isEditMode = false;
let currentDocId = null;

// Dynamic behavior for showing/hiding conditional fields
typeInput.addEventListener("change", () => {
  const selectedType = typeInput.value.toLowerCase();
  bloodOptions.style.display = selectedType === "blood" ? "block" : "none";
  bloodGroupInput.toggleAttribute("required", selectedType === "blood");
  equipmentOptions.style.display = selectedType === "equipment" ? "block" : "none";
  equipmentTypeInput.toggleAttribute("required", selectedType === "equipment");
  medicineNameField.style.display = selectedType === "medicine" ? "block" : "none";
  medicineNameInput.toggleAttribute("required", selectedType === "medicine");
});

// Collect form data
function collectFormData() {
  const type = typeInput.value.trim().toLowerCase();
  const quantity = parseInt(document.getElementById("quantity").value.trim());
  const localArea = document.getElementById("localArea").value.trim();
  const city = document.getElementById("city").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const providerId = auth.currentUser.uid;

  let resourceData = {
    type,
    quantity,
    localArea: localArea.toLowerCase(),
    city: city.toLowerCase(),
    contact,
    providerId
  };

  if (type === "blood") {
    resourceData.bloodGroup = bloodGroupInput.value.trim() || null;
  } else if (type === "equipment") {
    resourceData.equipmentType = equipmentTypeInput.value.trim() || null;
  } else if (type === "medicine") {
    resourceData.medicineName = medicineNameInput.value.trim() || null;
  }

  return resourceData;
}

// Reset form
function resetForm() {
  form.reset();
  bloodOptions.style.display = "none";
  equipmentOptions.style.display = "none";
  medicineNameField.style.display = "none";
  isEditMode = false;
  currentDocId = null;
}

// Load edit data if coming from resources page
window.addEventListener("load", () => {
  const editData = sessionStorage.getItem("editResource");
  if (editData) {
    const data = JSON.parse(editData);
    typeInput.value = data.type;
    document.getElementById("quantity").value = data.quantity;
    document.getElementById("localArea").value = data.localArea;
    document.getElementById("city").value = data.city;
    document.getElementById("contact").value = data.contact;
    typeInput.dispatchEvent(new Event("change"));
    if (data.bloodGroup) bloodGroupInput.value = data.bloodGroup;
    if (data.equipmentType) equipmentTypeInput.value = data.equipmentType;
    if (data.medicineName) medicineNameInput.value = data.medicineName;
    isEditMode = true;
    currentDocId = data.id;
    sessionStorage.removeItem("editResource");
  }
});

// Form submission logic
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const resourceData = collectFormData();
  if (isEditMode) {
    const result = await updateResource(currentDocId, resourceData);
    if (result.success) {
      responseDiv.innerHTML = `<p class="success">✅ Resource updated successfully!</p>`;
      resetForm();
      window.location.href = "resources.html";
    } else {
      responseDiv.innerHTML = `<p class="error">❌ Error: ${result.error}</p>`;
    }
  } else {
    const result = await addResource(resourceData);
    if (result.success) {
      responseDiv.innerHTML = `<p class="success">✅ Resource submitted successfully!</p>`;
      resetForm();
      window.location.href = "resources.html";
    } else {
      responseDiv.innerHTML = `<p class="error">❌ Error: ${result.error}</p>`;
    }
  }
});