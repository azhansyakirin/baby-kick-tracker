import { doc, getDoc } from "firebase/firestore";
import { db } from '../config/firebase';

export const getPoopLog = async (userid) => {
  if (!userid) {
    console.error("No user logged in");
    return [];
  }

  try {
    const userRef = doc(db, 'users', userid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data().babyPoopLogs || [];
    } else {
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.error("Error getting poop logs: ", error);
    return [];
  }
}