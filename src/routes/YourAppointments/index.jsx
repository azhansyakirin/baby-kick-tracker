import { useState } from 'react';
import { Icons } from '../../components/Icons';
import { useAppointment } from '../../Context/AppointmentsContext';
import { AddNewAppointmentModal } from './components/AddNewAppointmentModal';
import dayjs from 'dayjs';
import clsx from 'clsx';
import Modal from '../../components/Modal';

export const YourAppointments = () => {
  const { appointments } = useAppointment();
  const [panelData, setPanelData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function loadDataToPanel(itemId) {
    const data = appointments.find(app => app.id === itemId);
    setPanelData(data);
  }

  return (
    <div id="appointment-page" className="my-4 grid md:grid-cols-[3fr_2fr] grid-cols-1 gap-4">

      {/* Appointment List */}
      <div className="flex flex-col gap-2">
        {Array.isArray(appointments) && appointments.length > 0 &&
          appointments.map(({ id, date, location, purpose, notes, doctor, startTime, endTime, appointmentTime }) => (
            <div
              key={id}
              onClick={() => {
                setSelectedIndex(id);
                loadDataToPanel(id);
                if (window.innerWidth < 768) setDrawerOpen(true);
              }}
              className={clsx(
                "group grid items-center gap-4 p-4 rounded-2xl border shadow-sm transition cursor-pointer active:scale-[.98]",
                "grid-cols-[auto_1fr_auto]",
                selectedIndex === id
                  ? "bg-gray-50 border-[var(--text-primary)]"
                  : "bg-white border-gray-200 hover:shadow-md hover:border-gray-300"
              )}
            >
              <div className="flex justify-center items-center border-r px-4 text-center text-[Rubik] text-sm font-medium">
                <div>
                  <p>{dayjs(date).format("ddd")}</p>
                  <p className="text-2xl md:text-3xl font-bold">{dayjs(date).format("DD")}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-500 ">
                <div className="inline-flex items-center gap-2">
                  <Icons name="clock" />
                  {appointmentTime || `${startTime} – ${endTime}`}
                </div>
                <div className="inline-flex items-center gap-2">
                  <Icons name="map" />
                  {location}
                </div>
                <div className="inline-flex items-center gap-2">
                  <Icons name="bubble" />
                  {purpose}
                </div>
              </div>

              <div className="hidden md:flex justify-end">
                <button className="text-[var(--text-primary)]">
                  <Icons name="expand" />
                </button>
              </div>
            </div>
          ))
        }
        <AddNewAppointmentModal
          trigger={
            <div
              className="grid items-center gap-4 py-4 px-4 rounded-xl border shadow-sm transition cursor-pointer active:scale-[.98] bg-white hover:bg-gray-50"
            >
              <p className='inline-flex gap-2 flex-1'><Icons name="add" />Add New Appointment</p>
            </div>
          }
        />
      </div>

      {/* Side Panel - Desktop only */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg p-6 space-y-4">
        {panelData ? (
          <>
            <div className="text-xl font-semibold border-b pb-2 tracking-tighter">{dayjs(panelData.date).format('DD-MM-YYYY | dddd')}</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span>{panelData.appointmentTime || `${panelData.startTime} – ${panelData.endTime}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="map" />
                <span>{panelData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="bubble" />
                <span>{panelData.purpose}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="user" />
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
        <Modal open={drawerOpen} onOpenChange={() => setDrawerOpen(prev => !prev)}>
          <div className="fixed inset-0" />
          <div className=" p-1 shadow-lg max-h-[80vh] overflow-y-auto md:hidden transition-transform animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold text-lg">{dayjs(panelData.date).format('DD-MM-YYYY | dddd')}</div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Icons name="clock" /><span>{panelData.appointmentTime || `${panelData.startTime} – ${panelData.endTime}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="map" /><span>{panelData?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="bubble" /><span>{panelData?.purpose}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons name="user" /><span>Dr. {panelData?.doctor}</span>
              </div>
              <div className="pt-2">{panelData?.notes}</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
