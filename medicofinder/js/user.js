import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

const areaInput = document.getElementById("areaInput");
const typeInput = document.getElementById("typeInput");
const bloodTypeInput = document.getElementById("bloodTypeInput");
const equipmentTypeInput = document.getElementById("equipmentTypeInput");
const medicineNameInput = document.getElementById("medicineNameInput");
const quantityInput = document.getElementById("quantityInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

// Toggle dynamic fields based on resource type
typeInput.addEventListener("change", () => {
    const bloodOptions = document.getElementById("bloodOptions");
    const equipmentOptions = document.getElementById("equipmentOptions");
    const medicineNameField = document.getElementById("medicineNameField");

    const selectedType = typeInput.value.toLowerCase();
    bloodOptions.style.display = selectedType === "blood" ? "block" : "none";
    equipmentOptions.style.display = selectedType === "equipment" ? "block" : "none";
    medicineNameField.style.display = selectedType === "medicine" ? "block" : "none";
});

// Search functionality
searchBtn.addEventListener("click", async () => {
    resultsDiv.innerHTML = "Searching...";

    // Collect inputs
    const areaSearch = areaInput.value.trim().toLowerCase();
    const typeSearch = typeInput.value.trim().toLowerCase();
    const bloodTypeSearch = bloodTypeInput.value.trim().toUpperCase();
    const equipmentTypeSearch = equipmentTypeInput.value.trim().toLowerCase();
    const medicineNameSearch = medicineNameInput.value.trim().toLowerCase();
    const quantitySearch = parseInt(quantityInput.value.trim());

    try {
        const resourcesRef = collection(db, "resources");
        let results = [];

        // Base query with type and resource-specific filters
        let resourceQuery = query(resourcesRef);
        if (typeSearch) {
            resourceQuery = query(resourceQuery, where("type", "==", typeSearch));
            if (typeSearch === "blood" && bloodTypeSearch) {
                resourceQuery = query(resourceQuery, where("bloodGroup", "==", bloodTypeSearch));
            }
            if (typeSearch === "equipment" && equipmentTypeSearch) {
                resourceQuery = query(resourceQuery, where("equipmentType", "==", equipmentTypeSearch));
            }
            if (typeSearch === "medicine" && medicineNameSearch) {
                resourceQuery = query(resourceQuery, where("medicineName", "==", medicineNameSearch));
            }
        }

        // Fetch initial results based on type and resource-specific filters
        const querySnapshot = await getDocs(resourceQuery);

        // Filter by location (localArea or city) with case-insensitive matching
        if (areaSearch) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const localAreaMatch = data.localArea && data.localArea.toLowerCase() === areaSearch;
                const cityMatch = data.city && data.city.toLowerCase() === areaSearch;
                if (localAreaMatch || cityMatch) {
                    results.push({ ...data, docId: doc.id, isLocalAreaMatch: localAreaMatch });
                }
            });

            // Sort results to prioritize localArea matches
            results.sort((a, b) => b.isLocalAreaMatch - a.isLocalAreaMatch);
        } else {
            // If no area search, include all results
            querySnapshot.forEach((doc) => {
                results.push({ ...doc.data(), docId: doc.id, isLocalAreaMatch: false });
            });
        }

        // Filter results based on quantity
        const filteredResults = [];
        results.forEach((data) => {
            if (!isNaN(quantitySearch) && (data.quantity || 0) < quantitySearch) return;
            filteredResults.push(data);
        });

        // Display results
        filteredResults.length > 0
            ? displayResults(filteredResults)
            : (resultsDiv.innerHTML = "<p>No matching resources found.</p>");
    } catch (error) {
        console.error("Error fetching resources:", error);
        resultsDiv.innerHTML = `<p style="color:red;">❌ Error fetching resources: ${error.message}</p>`;
    }
});

// Function to display results
function displayResults(docs) {
    const html = docs.map((doc) => `
        <div class="result-card">
            <h3>${doc.name || "Available Resource"}</h3>
            <p>Type: ${doc.type}</p>
            <p>Quantity: ${doc.quantity}</p>
            ${doc.type === "blood" ? `<p>Blood Group: ${doc.bloodGroup || "N/A"}</p>` : ""}
            ${doc.type === "equipment" ? `<p>Equipment Type: ${doc.equipmentType || "N/A"}</p>` : ""}
            ${doc.type === "medicine" ? `<p>Medicine Name: ${doc.medicineName || "N/A"}</p>` : ""}
            <p>Location: ${doc.localArea}, ${doc.city}</p>
            <p>Contact: ${doc.contact || "Not provided"}</p>
        </div>
    `).join('');
    resultsDiv.innerHTML = html;
}