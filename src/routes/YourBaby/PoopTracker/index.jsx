import { useState } from "react";
import { Header } from "./sections";
import { PoopTracker } from "./sections/PoopTracker";
import { AddNewLog } from "./sections/AddNewLog";
import { RecentLogs } from "./sections/RecentLogs";
import { useBaby } from "../../../Context/BabyContext"

export default function Page() {

  const { babyPoopLogs, handleAddNewPoopLog, handleDeletePoopLog } = useBaby();

  console.log("babyPoopLogs", babyPoopLogs);

  const [toggleAddLog, setToggleAddLog] = useState(false);

  const handleToggleAddLog = () => {
    setToggleAddLog(prev => !prev);
  }

  const handleSaveChange = (data) => {
    console.log("handleSaveChange", data);
    handleAddNewPoopLog(data);
  }

  console.log("updated babyPoopLogs", babyPoopLogs);

  return <PoopTracker>
    <Header handleToggleAddLog={handleToggleAddLog} />
    <RecentLogs recentLogs={babyPoopLogs} deleteRecord={handleDeletePoopLog} />
    <AddNewLog
      toggleAddLog={toggleAddLog}
      handleToggleAddLog={handleToggleAddLog}
      handleSaveChange={handleSaveChange}
    />
  </PoopTracker>
}