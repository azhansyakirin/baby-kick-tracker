import dayjs from "dayjs"

export const YourJourney = () => {
  return (
    <div id="journey-page">
      <div className="grid grid-rows-1 md:grid-cols-4 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <div className="rounded-lg shadow-md p-4 bg-white">
            <img key={i} className="w-full object-contain rounded-md" src="/bb-smol.jpg" />
            <div className="py-1">
              <label className="float-left text-sm italic font-[Inter]">First 28 weeks</label>
              <time className="float-right text-sm italic font-[Rubik]">{dayjs().format("DD/MM/YYYY")}</time>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}