import { db, collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc } from "./firebase-config.js";

// Add a new resource to Firestore
export async function addResource(resourceData) {
  try {
    const docRef = await addDoc(collection(db, "resources"), resourceData);
    return { success: true, id: docRef.id };
  } catch (err) {
    console.error("Error adding resource: ", err);
    return { success: false, error: err.message };
  }
}

// Fetch resources for a specific provider
export async function fetchProviderResources(providerId) {
  try {
    const q = query(collection(db, "resources"), where("providerId", "==", providerId));
    const querySnapshot = await getDocs(q);
    const resources = [];
    querySnapshot.forEach((doc) => {
      resources.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, resources };
  } catch (err) {
    console.error("Error fetching resources: ", err);
    return { success: false, error: err.message };
  }
}

// Fetch a single resource by ID
export async function getResourceById(docId) {
  try {
    const docRef = doc(db, "resources", docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: "Resource not found" };
  } catch (err) {
    console.error("Error fetching resource: ", err);
    return { success: false, error: err.message };
  }
}

// Update an existing resource
export async function updateResource(docId, updatedData) {
  try {
    const docRef = doc(db, "resources", docId);
    await updateDoc(docRef, updatedData);
    return { success: true };
  } catch (err) {
    console.error("Error updating resource: ", err);
    return { success: false, error: err.message };
  }
}

// Delete a resource
export async function deleteResource(docId) {
  try {
    const docRef = doc(db, "resources", docId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    console.error("Error deleting resource: ", err);
    return { success: false, error: err.message };
  }
}