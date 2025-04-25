import { db, collection, getDocs, query, where } from './firebase-config.js';

const areaInput = document.getElementById("areaInput");
const nameInput = document.getElementById("nameInput");
const quantityInput = document.getElementById("quantityInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

searchBtn.addEventListener("click", async () => {
    const areaSearch = areaInput.value.trim().toLowerCase();
    const nameSearch = nameInput.value.trim().toLowerCase();
    const quantitySearch = parseInt(quantityInput.value.trim());

    resultsDiv.innerHTML = "Searching...";

    const resourcesRef = collection(db, "resources");

    // Priority 1: localArea → city fallback
    let results = [];
    if (areaSearch) {
        const localQuery = query(resourcesRef, where("localArea", "==", areaSearch));
        const localSnapshot = await getDocs(localQuery);

        if (!localSnapshot.empty) {
            results = localSnapshot.docs;
        } else {
            const cityQuery = query(resourcesRef, where("city", "==", areaSearch));
            const citySnapshot = await getDocs(cityQuery);
            results = citySnapshot.docs;
        }
    } else {
        // If no area, fallback to full collection
        const allDocs = await getDocs(resourcesRef);
        results = allDocs.docs;
    }

    // Apply name and quantity filters if needed
    if (nameSearch || !isNaN(quantitySearch)) {
        results = results.filter(doc => {
            const data = doc.data();
            const matchName = nameSearch ? data.name.toLowerCase().includes(nameSearch) : true;
            const matchQuantity = !isNaN(quantitySearch) ? data.quantity >= quantitySearch : true;
            return matchName && matchQuantity;
        });
    }

    if (results.length > 0) {
        displayResults(results);
    } else {
        resultsDiv.innerHTML = "<p>No matching resources found.</p>";
    }
});

function displayResults(docs) {
    const html = docs.map(doc => {
        const res = doc.data();
        return `
            <div class="resource-card">
                <h3>${res.name}</h3>
                <p>Quantity: ${res.quantity}</p>
                <p>Type: ${res.type}</p>
                <p>Location: ${res.localArea}, ${res.city}</p>
                <p><strong>Contact:</strong> ${res.contact || 'Not Provided'}</p>
            </div>
        `;
    }).join('');
    resultsDiv.innerHTML = html;
}
