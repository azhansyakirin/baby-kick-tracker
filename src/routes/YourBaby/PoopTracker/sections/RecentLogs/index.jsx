import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { LucideBean, LucideChevronLeftCircle, LucideChevronRightCircle, LucideDroplet, LucideDroplets, LucideTrash2 } from "lucide-react";

export const RecentLogs = ({ recentLogs, deleteRecord }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const POOP_COLORS = [
    { value: "Light Brown", label: "Light Brown", colorCode: "#A0522D" },
    { value: "Mustard Yellow", label: "Mustard Yellow", colorCode: "#FFDB58" },
    { value: "Dark Green", label: "Dark Green", colorCode: "#006400" },
    { value: "Black", label: "Black", colorCode: "#000000" },
    { value: "Dark Brown", label: "Dark Brown", colorCode: "#654321" },
    { value: "Nearly White", label: "Nearly White", colorCode: "#F5F5DC" },
    { value: "Red", label: "Red", colorCode: "#FF0000" },
  ];

  const POOP_TYPES = [
    { value: "Wet", label: "Wet", icons: <LucideDroplets className="size-6" /> },
    { value: "Dry", label: "Dry", icons: <LucideBean className="size-6" /> },
  ];

  const filteredLogs = useMemo(() => {
    return selectedDate
      ? recentLogs.filter(
        ({ date }) =>
          dayjs(date).format("YYYY-MM-DD") ===
          dayjs(selectedDate).format("YYYY-MM-DD")
      )
      : recentLogs;
  }, [recentLogs, selectedDate]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  const currentPageLogs = useMemo(() => {
    return filteredLogs.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredLogs, currentPage, pageSize]);

  const handleDateChange = (value) => {
    setSelectedDate(value);
    setCurrentPage(1);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Logs</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {currentPageLogs.length === 0 ? (
          <p className="text-sm">No records for this date.</p>
        ) : (
          currentPageLogs.map(({ id, date, time, type, color }, i) => {
            const formattedTime = dayjs(
              `${date} ${time}`,
              "YYYY-MM-DD HH:mm"
            ).format("hh:mm A");
            const formattedDate = dayjs(date).format("DD/MM/YYYY (dddd)");
            const colorObj = POOP_COLORS.find((c) => c.value === color);

            const typeObj = POOP_TYPES.find((t) => t.value === type);

            return (
              <div
                className="grid grid-cols-4 gap-4 border items-center p-4 rounded-xl text-center"
                key={i}
              >
                <div className="text-left">
                  <p className="font-medium">{formattedDate}</p>
                  <p className="font-medium">{formattedTime}</p>
                </div>
                <div className="inline-flex space-x-2 justify-start items-center">
                  <div
                    className="w-5 h-5 rounded-full border"
                    style={{ backgroundColor: colorObj?.colorCode || "#ccc" }}
                  />
                  <p className="font-medium">{color}</p>
                </div>
                <div className="inline-flex space-x-2 justify-center items-center">
                  {typeObj?.icons}
                  <p className="font-medium">{type}</p>
                </div>
                <button
                  className="text-red-500 text-sm inline-flex font-medium mx-auto"
                  onClick={() => deleteRecord(id)}
                >
                  <LucideTrash2 className="size-5 mr-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* ✅ Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            className="disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <LucideChevronLeftCircle className="size-8" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <LucideChevronRightCircle className="size-8"/>
          </button>
        </div>
      )}
    </section>
  );
};
