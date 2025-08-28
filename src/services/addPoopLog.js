import { doc, collection, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const addPoopLog = async (userid, newLog) => {
  if (!userid) {
    console.error("No user logged in");
    return;
  }

  try {
    const userRef = doc(collection(db, 'users'), userid);
    const docSnap = await getDoc(userRef);

    let updatedLogs = [];

    if (docSnap.exists()) {
      const existingLogs = docSnap.data().babyPoopLogs || [];
      updatedLogs = [...existingLogs, newLog];
    } else {
      updatedLogs = [newLog];
    }

    await setDoc(userRef, { babyPoopLogs: updatedLogs }, { merge: true });

    console.log("Poop log added successfully");
  } catch (error) {
    console.error("Error adding poop log: ", error);
  }
};
