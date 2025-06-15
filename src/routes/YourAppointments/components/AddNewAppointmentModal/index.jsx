import { useState } from "react";
import Modal from "../../../../components/Modal";
import { useAppointment } from "../../../../Context/AppointmentsContext";
import { v4 as uuidv4 } from "uuid";
import { Loader } from "../../../../components/Loader";
import toast from "react-hot-toast";

export const AddNewAppointmentModal = ({ trigger }) => {
  
  const { addAppointment } = useAppointment();
  
  const [form, setForm] = useState({
    date: "",
    appointmentTime: "",
    endTime: "",
    location: "",
    purpose: "",
    doctor: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      if(!form.date || !form.purpose) throw new Error('Please do not leave field blank');

      const newAppointment = {
        id: uuidv4(),
        ...form,
        createdAt: Date.now(),
      };
      addAppointment(newAppointment);

      setForm({
        date: "",
        appointmentTime: "",
        endTime: "",
        location: "",
        purpose: "",
        doctor: "",
        notes: "",
      });

      toast.success("Appointment added successfully.");
      setOpen(false)
    } catch (error) {
      console.error("Failed to add appointment:", error);
      toast.error("Something when wrong, please try again.")
    } finally {
      setLoading(false);
    }
  };

  const defaultInputDiv = `flex flex-col my-1`;
  const defaultInputClass = `py-3 px-4 rounded-xl border`;

  return (
    <Modal
      trigger={trigger}
      title="Set Your Appointment"
      footer={null}
      open={open}
      onOpenChange={setOpen}
      
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm font-[Inter] px-4">
        <div className="grid grid-cols-2 gap-4">
        <div className={defaultInputDiv}>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className={defaultInputClass}
            placeholder="Select your date"
          />
        </div>
          <div className={defaultInputDiv}>
            <label>Time</label>
            <input
              type="time"
              name="appointmentTime"
              value={form.appointmentTime}
              onChange={handleChange}
              required
              className={defaultInputClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-[3fr_2fr] gap-4">
          <div className={defaultInputDiv}>
            <label>Location</label>
            <input type="text" name="location" placeholder="Hospital Tanah Merah" value={form.location} onChange={handleChange} required className={defaultInputClass} />
          </div>
          <div className={defaultInputDiv}>
            <label>Doctor name</label>
            <input type="text" name="doctor" placeholder="Dr Abu Abdullah Mohammad Ibn Musa al-Khawarizmi" value={form.doctor} onChange={handleChange} className={defaultInputClass} />
          </div>
        </div>
        <div className={defaultInputDiv}>
          <label>Purpose of appointment</label>
          <input type="text" name="purpose" placeholder="Pregnancy checkup week 29" value={form.purpose} onChange={handleChange} required className={defaultInputClass} />
        </div>
        <div className={defaultInputDiv}>
          <label>Remarks</label>
          <textarea name="notes" placeholder="Blood screening, sugar water, iron booster etc." value={form.notes} onChange={handleChange} className={defaultInputClass} rows={4} />
        </div>

        <button type="submit" disabled={loading} className="self-end py-3 px-4 rounded-xl border hover:opacity-80 active-95 transition tracking-tighter">
          {loading ? <Loader /> : "ADD APPOINTMENT"}
        </button>
      </form>
    </Modal>
  );
};
