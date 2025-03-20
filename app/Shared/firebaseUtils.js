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
