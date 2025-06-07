import { useState } from 'react';
import { Icons } from '../../components/Icons';

export const YourAppointments = () => {
  const [panelData, setPanelData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fakeAppointment = [
    {
      id: 'fegh-3423-wegs-213v',
      date: 'Wednesday, 28 June 2025',
      location: 'KK P18',
      purpose: 'Jumpa Doctor',
      notes: 'Routine check-up. Discuss blood pressure & fetal movement.',
      doctor: 'Dr. Siti Nurhaliza',
      startTime: '10:00 AM',
      endTime: '10:45 AM',
    },
    {
      id: 'fegh-3423-wegs-215v',
      date: 'Thursday, 29 June 2025',
      location: 'Hospital Putrajaya',
      purpose: 'Ambik darah',
      notes: 'Routine check-up. Discuss blood pressure & fetal movement.',
      doctor: 'Dr. Ahmad Al Farabi',
      startTime: '10:00 AM',
      endTime: '10:45 AM',
    },
  ]

  function loadDataToPanel(item) {
    const data = fakeAppointment.find(index=> index.id === item)
    setPanelData(data);
  }

  return (
    <div id="appointment-page" className="relative my-4 grid md:grid-cols-[3fr_1fr] grid-cols-1 gap-4 font-[Inter]">

      {/* Appointment List */}
      <div className="flex flex-col gap-2">
        {fakeAppointment.map(({ id, date, location, purpose, notes, doctor, startTime, endTime }, index) => (
          <div
            key={id}
            onClick={() => {
              setSelectedIndex(id);
              loadDataToPanel(id);

              if (window.innerWidth < 768) {
                setDrawerOpen(true);
              }
            }}
            className={`grid grid-cols-[auto_1fr_auto] md:grid-cols-[0.5fr_1fr_3fr_0.5fr] items-center gap-4 py-4 px-4 rounded-xl border shadow-sm transition cursor-pointer active:scale-[.98]
              ${selectedIndex === index
                ? 'bg-gray-50 border-[var(--primary)]'
                : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'}
            `}
          >
            <div className="flex justify-center items-center border-r md:border-gray-300 pr-4">
              <div className="grid content-center items-center font-[Rubik] text-center">
                <p className="text-sm md:text-md">WED</p>
                <p className="text-xl md:text-3xl font-bold">28</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-col md:items-center md:gap-4 text-sm">
              <div className="">
                <span className="text-sm">
                  {startTime} – {endTime}
                </span>
              </div>
              <div className="font-medium text-gray-700">{location}</div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-sm">
              <div className="text-gray-600">{purpose}</div>
            </div>
            <div className="hidden md:flex justify-end">
              <button className="text-[var(--text-primary)]">
                <Icons name="expand" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Side Panel - Desktop only */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg p-6 space-y-4">
        {panelData ? (
          <>
            <div className="text-xl font-semibold border-b pb-2">{panelData.date}</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Icons name="calendar" className="w-4 h-4" />
                <span>{panelData.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="map-pin" className="w-4 h-4" />
                <span>{panelData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="stethoscope" className="w-4 h-4" />
                <span>{panelData.purpose}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="user" className="w-4 h-4" />
                <span>{panelData.doctor}</span>
              </div>
              <div className="pt-4 text-gray-600">{panelData.notes}</div>
            </div>
          </>
        ) : (
          <div className="text-gray-500 italic text-center mt-10 text-sm">
            Select an appointment to view details
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6 shadow-lg max-h-[80vh] overflow-y-auto md:hidden transition-transform animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold text-lg">{panelData?.date}</div>
              <button onClick={() => setDrawerOpen(false)}>
                <Icons name="x" className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Icons name="calendar" className="w-4 h-4" />
                <span>{panelData?.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="map-pin" className="w-4 h-4" />
                <span>{panelData?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="stethoscope" className="w-4 h-4" />
                <span>{panelData?.purpose}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="user" className="w-4 h-4" />
                <span>Dr. {panelData?.doctor}</span>
              </div>
              <div className="pt-2 text-gray-600">{panelData?.notes}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
