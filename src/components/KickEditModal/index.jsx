import { useState } from 'react'
import Modal from '../Modal'

export default function KickEditModal({ kick, onSave }) {
  const [date, setDate] = useState(kick.date)
  const [time, setTime] = useState(kick.time)
  const [remark, setRemark] = useState(kick.remark || '')

  const handleSave = () => {
    onSave({ ...kick, date, time, remark })
  }

  return (
    <Modal
      trigger={<button className="text-blue-500 underline">Edit</button>}
      title="Edit Kick Record"
      footer={
        <>
          <button className="px-4 py-2 rounded bg-gray-200" as="button" type="button" onClick={() => { }}>
            Cancel
          </button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSave}>
            Save
          </button>
        </>
      }
    >
      <label className="flex flex-col text-sm">
        Date
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </label>
      <label className="flex flex-col text-sm">
        Time
        <input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </label>
      <label className="flex flex-col text-sm">
        Remark
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </label>
    </Modal>
  )
}
