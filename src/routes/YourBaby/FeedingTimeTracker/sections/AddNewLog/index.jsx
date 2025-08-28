import Modal from "../../../../../components/Modal";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";


const Select = ({ options, className }) => {
  return (
    <select className={`border rounded-lg p-2 ${className}`}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const Radio = ({ options, name, value, onChange }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              flex items-center gap-2 p-3 rounded-lg border transition
              ${isSelected ? "border-[var(--text-primary)] bg-neutral-50" : "border-gray-300 bg-white hover:border-gray-400"}
            `}
          >
            {option.colorCode && (
              <div
                className="w-5 h-5 rounded-full border"
                style={{ backgroundColor: option.colorCode }}
              />
            )}
            <span className="text-xs text-left">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const AddNewLog = ({ toggleAddLog, handleToggleAddLog, handleSaveChange }) => {
  const [logDate, setLogDate] = useState('');
  const [logTime, setLogTime] = useState('');
  const [logType, setLogType] = useState('');
  const [logColor, setLogColor] = useState('');

  const handleSave = () => {

    if (!logDate || !logTime || !logType || !logColor) {
      const mapError = {
        logDate: 'Please select a date.',
        logTime: 'Please select a time.',
        logType: 'Please select a poop type.',
        logColor: 'Please select a poop color.',
      };
      const firstErrorKey = Object.keys(mapError).find(key => !eval(key));
      toast.error(mapError[firstErrorKey]);
      return;
    }

    const newLog = {
      id: uuidv4(),
      date: logDate,
      time: logTime,
      color: logColor,
      type: logType,
    };

    handleSaveChange(newLog);

    setLogDate('');
    setLogTime('');
    setLogType('');
    setLogColor('');
    handleToggleAddLog();
  };

  return (
    <Modal open={toggleAddLog} onOpenChange={handleToggleAddLog} title="Add New Diaper Change">
      <section className="mb-4">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4>Date</h4>
            <input
              type="date"
              className="w-full border rounded-lg p-2"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
            />
          </div>
          <div>
            <h4>Time</h4>
            <input
              type="time"
              className="w-full border rounded-lg p-2"
              value={logTime}
              required
              onChange={(e) => setLogTime(e.target.value)}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <h4>Poop Type</h4>
            <Radio
              options={POOP_TYPES}
              name="poopType"
              value={logType}
              onChange={setLogType}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <h4>Poop Color</h4>
            <Radio
              options={POOP_COLORS}
              name="poopColor"
              value={logColor}
              onChange={setLogColor}
            />
          </div>
        </div>
      </section>
      <section className="flex justify-end gap-4">
        <button
          onClick={handleToggleAddLog}
          className="px-4 py-2 border border-[var(--text-primary)] rounded hover:shadow-md"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[var(--text-primary)] text-white rounded hover:shadow-md"
        >
          Save Record
        </button>
      </section>
    </Modal>
  );
}