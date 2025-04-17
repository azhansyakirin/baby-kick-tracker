export const Table = ({ kicks }) => {
  if (!kicks || kicks.length === 0) {
    return (
      <div className="text-center p-4 text-xl font-[Chilanka]">
        No kicks recorded yet. Start with tapping 'Foot' icon.
      </div>
    );
  }

  return (
    <div className="overflow-x p-4">
      <div className="rounded-md overflow-hidden border-2 border-[var(--text-primary)] shadow-md">
        <table className="min-w-full font-[Chilanka] font-normal">
          <thead>
            <tr className="bg-[var(--text-primary)] text-white">
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
                <td className="px-4 py-2 border-b">{kick.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
