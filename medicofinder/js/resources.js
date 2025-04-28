import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from "./firebase-config.js";
import { fetchProviderResources, getResourceById, updateResource, deleteResource } from "./resource-service.js";

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

// UI elements
const resourcesList = document.getElementById("resourcesList");
const addNewResourceBtn = document.getElementById("addNewResourceBtn");
const buttonGroup = document.querySelector(".button-group"); // Reference to the new button group

// Redirect to add resource page
addNewResourceBtn.addEventListener("click", () => {
  window.location.href = "providers.html"; // Corrected to match the add/edit form page
});

// Fetch and display provider's resources horizontally
async function fetchAndDisplayResources() {
  const user = auth.currentUser;
  if (!user) return;

  const result = await fetchProviderResources(user.uid);
  resourcesList.innerHTML = "";

  if (!result.success) {
    resourcesList.innerHTML += `<p class="error">❌ Error loading resources: ${result.error}</p>`;
    return;
  }

  if (result.resources.length === 0) {
    resourcesList.innerHTML += "<p>No resources found.</p>";
    return;
  }

  // Remove inline styles to rely on CSS
  resourcesList.style.display = "";
  resourcesList.style.flexWrap = "";
  resourcesList.style.gap = "";

  result.resources.forEach((resource) => {
    const resourceItem = document.createElement("div");
    resourceItem.className = "resource-item";
    resourceItem.innerHTML = `
      <p>Type: ${resource.type}</p>
      <p>Quantity: ${resource.quantity}</p>
      <p>Location: ${resource.localArea}, ${resource.city}</p>
      <p>Contact: ${resource.contact}</p>
      ${resource.bloodGroup ? `<p>Blood Group: ${resource.bloodGroup}</p>` : ""}
      ${resource.equipmentType ? `<p>Equipment Type: ${resource.equipmentType}</p>` : ""}
      ${resource.medicineName ? `<p>Medicine Name: ${resource.medicineName}</p>` : ""}
      <button class="edit-btn" onclick="editResource('${resource.id}')">Edit</button>
      <button class="delete-btn" onclick="deleteResource('${resource.id}')">Delete</button>
    `;
    resourcesList.appendChild(resourceItem);
  });
}

// Edit a resource (redirect to add-resource page with pre-filled form)
window.editResource = async function(docId) {
  const result = await getResourceById(docId);
  if (result.success) {
    const data = result.data;
    // Store data in sessionStorage to pass to add-resource page
    sessionStorage.setItem("editResource", JSON.stringify(data));
    window.location.href = "providers.html"; // Corrected to match the add/edit form page
  } else {
    alert(`Error: ${result.error}`);
  }
};

// Delete a resource
window.deleteResource = async function(docId) {
  if (confirm("Are you sure you want to delete this resource?")) {
    const result = await deleteResource(docId);
    if (result.success) {
      alert("Resource deleted successfully!");
      fetchAndDisplayResources();
    } else {
      alert(`Error: ${result.error}`);
    }
  }
};

// Load resources when page loads
auth.onAuthStateChanged((user) => {
  if (user) {
    fetchAndDisplayResources();
  }
});