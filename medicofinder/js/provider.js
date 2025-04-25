import { db, collection, addDoc } from './firebase-config.js';

const form = document.getElementById("providerForm");
const responseDiv = document.getElementById("response");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value.trim());
    const type = document.getElementById("type").value.trim() || "N/A";
    const localArea = document.getElementById("localArea").value.trim();
    const city = document.getElementById("city").value.trim();
    const contact = document.getElementById("contact").value.trim();

    if (!name || isNaN(quantity) || !localArea || !city || !contact) {
        responseDiv.innerHTML = `<p style="color:red;">❌ Please fill all required fields correctly.</p>`;
        return;
    }

    try {
        await addDoc(collection(db, "resources"), {
            name,
            quantity,
            type,
            localArea: localArea.toLowerCase(),
            city: city.toLowerCase(),
            contact
        });
        responseDiv.innerHTML = `<p style="color:green;">✅ Resource submitted successfully!</p>`;
        form.reset();
    } catch (err) {
        responseDiv.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
    }
});
