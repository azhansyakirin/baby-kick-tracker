export const Table = ({ kicks }) => {
  if (!kicks || kicks.length === 0) {
    return <div className="text-center p-4 text-xl font-[Chilanka]">No kicks recorded yet. Start with tapping 'Foot' icon.</div>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-md font-[Chilanka] font-normal">
        <thead className="">
          <tr>
            <th className="px-4 py-2 border-b">Count</th>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Day</th>
            <th className="px-4 py-2 border-b">Time</th>
          </tr>
        </thead>
        <tbody>
          {kicks.map((kick, index) => (
            <tr key={kick.id || index} className="text-center">
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b">{kick.date}</td>
              <td className="px-4 py-2 border-b">{kick.day}</td>
              <td className="px-4 py-2 border-b last:rounded-bt-xl">{kick.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
