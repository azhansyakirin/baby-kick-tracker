import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const deletePoopLog = async (userid, logId) => {
  if (!userid) {
    console.error("No user logged in");
    return;
  }

  try {
    const userRef = doc(db, "users", userid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User document does not exist");
      return;
    }

    const currentLogs = userSnap.data().babyPoopLogs || [];

    const updatedLogs = currentLogs.filter((log) => log.id !== logId);

    console.log("Updated Logs after deletion:", updatedLogs);

    await updateDoc(userRef, {
      babyPoopLogs: updatedLogs,
    });

    console.log(`Poop log with id ${logId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting poop log: ", error);
  }
};
