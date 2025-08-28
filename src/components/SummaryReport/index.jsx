import React from 'react';
import dayjs from 'dayjs';

const SummaryReport = ({ gender, babyName, kickData, babyPoopLogs }) => {
  const today = dayjs();
  const startDate = kickData.length
    ? dayjs(kickData.reduce((earliest, curr) =>
      dayjs(curr.id).isBefore(dayjs(earliest.id)) ? curr : earliest
    ).id)
    : dayjs();

  const totalKicks = kickData.length;
  const daysTracked = Math.max(1, today.diff(startDate, 'day') + 1);
  const avgKicks = (totalKicks / daysTracked).toFixed(0);
  const lastKick = kickData[kickData.length - 1];

  const recentRemarks = [...kickData]
    .filter(k => k.remarks)
    .sort((a, b) => dayjs(b.id) - dayjs(a.id))
    .slice(0, 5);

  const mapGender = {
    'boy': '👦🏻',
    'girl': '👧🏻'
  }

  const poopToday = babyPoopLogs.filter(
    (log) => dayjs(log.date).isSame(today, 'day')
  );

  const latestPoop = [...babyPoopLogs].sort((a, b) =>
    dayjs(`${b.date} ${b.time}`, 'YYYY-MM-DD HH:mm').diff(
      dayjs(`${a.date} ${a.time}`, 'YYYY-MM-DD HH:mm')
    )
  )[0];

  return (
    <>
      <div className="bg-[var(--primary)] text-black p-4 md:p-8 max-w-4xl mx-auto rounded-xl tracking-tight">
        <h1 className="font-bold mb-6 text-left tracking-tight">{mapGender[gender]} Baby Summary Report</h1>
        <h2 className="mb-4 text-left">Section A: Baby Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          <div className="p-4 bg-[var(--background)] rounded-xl">
            <h3>Baby Name</h3>
            <h4 className="capitalize">{babyName}</h4>
          </div>

          <div className="p-4 bg-[var(--background)] rounded-xl">
            <h3>Baby Weight</h3>
            <h4>3.43 kg</h4>
          </div>
        </div>

        <hr className='mb-6' />

        <h2 className="text-xl mb-4 text-left">Section B: Kicks Count</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          <div className="p-4 bg-[var(--background)] rounded-xl">
            <h3>Total Kicks</h3>
            <h4>{totalKicks} kicks</h4>
            <h5>
              Tracked over <strong>{daysTracked}</strong> day{daysTracked > 1 ? 's' : ''}
            </h5>
          </div>

          <div className="p-4 bg-[var(--background)] rounded-xl">
            <h3>Average Kicks / Day</h3>
            <h4>{avgKicks} kick{avgKicks > 1 ? 's' : ''}</h4>
          </div>

          <div className="p-4 bg-[var(--background)] rounded-xl">
            <h3>Last Kick</h3>
            <h4>
              {lastKick ? dayjs(lastKick.id).format('MMM D, h:mm A') : 'N/A'}
            </h4>
            <h5>
              {dayjs(lastKick.id).format('dddd')}
            </h5>
          </div>

          <div className="p-4 bg-[var(--background)] rounded-xl md:col-span-3">
            <h3 className="font-semibold mb-2">Recent Remarks</h3>
            {recentRemarks.length > 0 ? (
              <ul className="list-disc ml-5 space-y-1">
                {recentRemarks.map((kick, i) => (
                  <li key={i}>
                    <strong>{dayjs(kick.id).format('MMM D')}:</strong> {kick.remarks}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No remarks recorded.</p>
            )}
          </div>
        </div>

        <hr className='mb-6' />

        <h2 className="text-xl mb-4 text-left">Section C: Baby Poop</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[var(--background)] rounded-xl">
            <h3>Poop Today</h3>
            <h4>{poopToday.length} time{poopToday.length !== 1 ? 's' : ''}</h4>
          </div>

          <div className="col-span-2 p-4 bg-[var(--background)] rounded-xl">
            <h3>Latest Diaper Change</h3>
            {latestPoop ? (
              <>
                <h4>
                  {dayjs(`${latestPoop.date} ${latestPoop.time}`, 'YYYY-MM-DD HH:mm').format(
                    'DD/MM/YYYY hh:mm A'
                  )}
                </h4>
                <h5>
                  Type: {latestPoop.type} | Color: {latestPoop.color}
                </h5>
              </>
            ) : (
              <p className="text-gray-600">No diaper changes recorded yet.</p>
            )}
          </div>
        </div>
      </div >
    </>
  );
};

export default SummaryReport;
