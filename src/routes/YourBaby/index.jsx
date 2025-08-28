import SummaryReport from "../../components/SummaryReport"
import { useBaby } from "../../Context/BabyContext"
import { LucideArrowUpRightFromSquare } from "lucide-react";
import { Link } from "react-router-dom";

export const YourBaby = () => {
  const { babyName, babyGender, kicks, babyPoopLogs } = useBaby();

  const BABY_FEATURES = [
    { name: 'Baby Kick', icon: '🦶🏻', description: `Count your baby's kick`, link: '/baby/kicks' },
    { name: 'Baby Poop', icon: '💩', description: `Track your baby's poop time and behaviour`, link: '/baby/poops' },
    { name: 'Baby Feeding Time', icon: '🍼', description: `Track your baby's feeding time`, link: '/baby/feeding-time' },
  ];

  return (
    <div id="baby-page">
      <section className="mb-8">
        <SummaryReport
          gender={babyGender}
          babyName={babyName}
          kickData={kicks}
          babyPoopLogs={babyPoopLogs}
        />
      </section>
      <h2>Quicklinks</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BABY_FEATURES.map((feature) => (
          <div
            key={feature.name}
            className="flex flex-col items-center justify-between rounded-2xl border bg-white/5 p-6 shadow-sm transition hover:shadow-md hover:bg-white/10"
          >
            <div className="text-5xl">{feature.icon}</div>
            <h3 className="mt-4 text-lg font-semibold">{feature.name}</h3>
            <p className="mt-2 text-sm text-center">{feature.description}</p>
            {feature.link && (
              <Link
                to={feature.link}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-primary)] hover:underline"
              >
                Explore <LucideArrowUpRightFromSquare className="size-4" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div >
  )
}