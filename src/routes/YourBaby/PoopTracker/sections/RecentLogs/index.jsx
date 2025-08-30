import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { Filter, LucideBean, LucideCalendar, LucideChevronLeftCircle, LucideChevronRightCircle, LucideDroplets, LucideTrash2, LucideX } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

export default function DateFilterPopover({ selectedDate, onChange }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-2 inline-flex items-center space-x-4 rounded-lg border shadow-sm hover:bg-gray-100">
          <Filter className="size-5" />
        </button>
      </Popover.Trigger>

      <Popover.Content
        className="p-3 bg-white rounded-lg shadow-md border w-60"
        sideOffset={6}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium inline-flex space-x-2 items-center"><LucideCalendar size={20} /> <span className="ml-1/2">Select Date</span></label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm w-full"
          />
        </div>

        {selectedDate && ( /* For remove filter when date selected */
          <div className="mt-4 text-left">
            <button
              className="text-xs text-red-500 inline-flex items-center hover:underline"
              onClick={() => onChange("")}
            >
              <LucideX size={18} />
              <span className="ml-1">Remove Filter</span>
            </button>
          </div>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}


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

  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
      const dateA = dayjs(`${a.date} ${a.time}`, "YYYY-MM-DD HH:mm");
      const dateB = dayjs(`${b.date} ${b.time}`, "YYYY-MM-DD HH:mm");
      return dateB - dateA;
    });
  }, [filteredLogs]);

  const totalPages = Math.ceil(sortedLogs.length / pageSize);

  const currentPageLogs = useMemo(() => {
    return sortedLogs.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [sortedLogs, currentPage, pageSize]);

  const handleDateChange = (value) => {
    setSelectedDate(value);
    setCurrentPage(1);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Logs</h2>
        <DateFilterPopover
          selectedDate={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {currentPageLogs.length === 0 && !selectedDate && (
          <p className="text-sm">No records available. Click on "Add New Diaper Change" to add.</p>
        )}
        {currentPageLogs.length > 0 &&
          <p className="text-sm">{filteredLogs.length} time(s) diaper change.</p>
        }
        {currentPageLogs.length === 0 ? (
          <p className="text-sm">No records for this date.</p>
        ) : (
          currentPageLogs.map(({ id, date, time, type, color, notes }, i) => {
            const formattedTime = dayjs(
              `${date} ${time}`,
              "YYYY-MM-DD HH:mm"
            ).format("hh:mm A");
            const formattedDate = dayjs(date).format("DD/MM/YYYY (dddd)");
            const colorObj = POOP_COLORS.find((c) => c.value === color);

            const typeObj = POOP_TYPES.find((t) => t.value === type);

            return (
              <div
                key={i}
                className="flex flex-row flex-1 justify-between border p-4 rounded-xl text-center md:text-left items-center"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-4">
                  {/* Date & Time */}
                  <div className="flex flex-row gap-1 md:flex-col">
                    <p className="font-medium text-left">{formattedDate}</p>
                    <p className="font-medium text-left">{formattedTime}</p>
                  </div>

                  {/* Color */}
                  <div className="flex items-center justify-start md:justify-center space-x-2">
                    <div
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: colorObj?.colorCode || "#ccc" }}
                    />
                    <p className="font-medium">{color}</p>
                  </div>

                  {/* Type */}
                  <div className="flex items-center justify-start md:justify-center space-x-2">
                    {typeObj?.icons}
                    <p className="font-medium">{type}</p>
                  </div>

                  {/* Notes - only show if exists */}
                  <div className="">
                    {notes ? (
                      <p className="text-left line-clamp-2">{notes}</p>
                    ) : (
                      <p className="text-left italic">-</p>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <div className="flex justify-center md:justify-end">
                  <button
                    className="md:px-8 text-red-500 text-sm inline-flex items-center font-medium"
                    onClick={() => deleteRecord(id)}
                  >
                    <LucideTrash2 className="size-5 mr-1" />
                    <span className="inline">Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ✅ Pagination controls */}
      {
        totalPages > 1 && (
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
              <LucideChevronRightCircle className="size-8" />
            </button>
          </div>
        )
      }
    </section >
  );
};
