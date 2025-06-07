import SummaryReport from "../../components/SummaryReport"
import { useBaby } from "../../Context/BabyContext"

export const YourBaby = () => {
  const { babyName, babyGender, kicks } = useBaby();

  return (
    <div id="baby-page">
      <SummaryReport
        gender={babyGender}
        babyName={babyName}
        kickData={kicks}
      />
    </div>
  )
}