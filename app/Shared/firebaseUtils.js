import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";  // Make sure the path is correct

export const getUserIdByEmail = async (email) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id; // Get Firestore auto-generated document ID
    } else {
      console.warn("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

// Function to search pins by tags
export const searchPinsByTag = async (tagQuery) => {
  try {
    // Format the query for case-insensitive search
    const formattedQuery = tagQuery.toLowerCase().trim();
    
    // Get all pins from Firestore
    const pinsRef = collection(db, "meinterest-post");
    const querySnapshot = await getDocs(pinsRef);
    
    // Filter pins that have matching tags
    const results = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(pin => {
        // Check if pin has tags and if any tag includes the search query
        if (!pin.tags || !Array.isArray(pin.tags)) return false;
        
        return pin.tags.some(tag => 
          tag.toLowerCase().includes(formattedQuery)
        );
      });
    
    return results;
  } catch (error) {
    console.error("Error searching pins by tag:", error);
    throw error;
  }
};