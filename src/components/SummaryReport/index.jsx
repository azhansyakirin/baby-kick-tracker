import React from 'react';
import dayjs from 'dayjs';

const SummaryReport = ({ gender, babyName, kickData }) => {
  const today = dayjs();
  const startDate = kickData.length
    ? dayjs(kickData.reduce((earliest, curr) =>
      dayjs(curr.id).isBefore(dayjs(earliest.id)) ? curr : earliest
    ).id)
    : dayjs();

  const totalKicks = kickData.length;
  const daysTracked = Math.max(1, today.diff(startDate, 'day') + 1);
  const avgKicks = (totalKicks / daysTracked).toFixed(1);
  const lastKick = kickData[kickData.length - 1];

  const recentRemarks = [...kickData]
    .filter(k => k.remarks)
    .sort((a, b) => dayjs(b.id) - dayjs(a.id))
    .slice(0, 5);

  const mapGender = {
    'boy': '👦',
    'girl': '👧'
  }

  return (
    <>
      <div className="bg-white text-black p-8 mt-6 max-w-4xl mx-auto rounded-xl tracking-tight font-sans">
        <h1 className="text-3xl font-bold mb-6 text-center tracking-tight">{mapGender[gender]} Baby Kick Report</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-100 rounded-xl">
            <h2 className="text-lg font-semibold">Baby Name</h2>
            <p className="text-xl font-bold">{babyName}</p>
            <p className="text-sm text-gray-700 mt-2">
              Tracking from <strong>{startDate.format('MMM D')}</strong> to <strong>{today.format('MMM D')}</strong>
            </p>
          </div>

          <div className="p-4 bg-pink-100 rounded-xl">
            <h2 className="text-lg font-semibold">Total Kicks</h2>
            <p className="text-3xl font-bold">{totalKicks}</p>
          </div>

          <div className="p-4 bg-green-100 rounded-xl">
            <h2 className="text-lg font-semibold">Average Kicks / Day</h2>
            <p className="text-3xl font-bold">{avgKicks}</p>
          </div>

          <div className="p-4 bg-yellow-100 rounded-xl">
            <h2 className="text-lg font-semibold">Last Kick</h2>
            <p className="text-xl font-bold">
              {lastKick ? dayjs(lastKick.id).format('MMM D, h:mm A') : 'N/A'}
            </p>
          </div>

          <div className="p-4 bg-purple-100 rounded-xl md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Recent Remarks</h2>
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
      </div>
    </>
  );
};

export default SummaryReport;
