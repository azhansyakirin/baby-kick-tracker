import { useState } from 'react'
import Modal from '../Modal'
import * as Dialog from '@radix-ui/react-dialog'

export const Table = ({ kicks = [], onEditKick, onDeleteKick }) => {
  const [selectedKick, setSelectedKick] = useState(null)
  const [editedTime, setEditedTime] = useState('')
  const [editedRemarks, setEditedRemarks] = useState('')

  const handleTriggerClick = (kick) => {
    setSelectedKick(kick)
    setEditedTime(kick.time)
    setEditedRemarks(kick.remarks || '')
  }

  const handleSave = () => {
    if (!selectedKick) return
    const updatedKick = {
      ...selectedKick,
      time: editedTime,
      remarks: editedRemarks,
    }
    onEditKick(updatedKick)
    setSelectedKick(null) // Close modal by unsetting selectedKick
  }

  if (!kicks.length) {
    return (
      <div className="text-center p-4 text-xl font-[Chilanka]">
        No kicks recorded yet. Start with tapping 'Foot' icon.
      </div>
    )
  }

  return (
    <table className="min-w-full font-[Chilanka] font-normal">
      <thead>
        <tr className="bg-[var(--text-primary)] text-white">
          <th className="px-4 py-2 border-b">Count</th>
          <th className="px-4 py-2 border-b">Date (Day)</th>
          <th className="px-4 py-2 border-b">Time</th>
          <th className="px-4 py-2 border-b hidden md:table-cell">Remarks</th>
          <th className="px-4 py-2 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {kicks.map((kick, index) => (
          <tr key={kick.id || index} className="text-center">
            <td className="px-4 py-2 border-b">{index + 1}</td>
            <td className="px-4 py-2 border-b">{kick.date} ({kick.day})</td>
            <td className="px-4 py-2 border-b">{kick.time}</td>
            <td className="px-4 py-2 border-b hidden md:table-cell remarks-cell">{kick.remarks || '-'}</td>
            <td className="px-4 py-2 border-b">
              <Modal
                title={<div className='inline-flex gap-2'><img src="/feet-dark.webp" className='size-6' />Edit Kick Entry</div>}
                trigger={
                  <button
                    onClick={() => handleTriggerClick(kick)}
                    className="text-[var(--text-primary)] underline text-sm cursor-pointer"
                  >
                    Edit
                  </button>
                }
                footer={
                  <>
                    <button
                      onClick={() => {
                        onDeleteKick(kick.id)
                        setSelectedKick(null)
                      }}
                      className="px-4 py-1 border bg-red-500 text-white hover:bg-white hover:text-red-600 hover:border-red-600 cursor-pointer rounded mr-auto"
                    >
                      Delete
                    </button>
                    <Dialog.Close asChild>
                      <button
                        onClick={() => setSelectedKick(null)}
                        className="px-3 py-1 border border-[var(--text-primary)] hover:shadow-md cursor-pointer rounded"
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <button
                        onClick={handleSave}
                        disabled={editedRemarks.length > 150}
                        className={`px-4 py-1 rounded text-white cursor-pointer 
    ${editedRemarks.length > 150
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-[var(--text-primary)] hover:shadow-md'}
  `}
                      >
                        Save
                      </button>
                    </Dialog.Close>
                  </>
                }
              >
                <div>
                  <label className="text-sm font-semibold block mb-1">Index</label>
                  <p>{index + 1}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1">Date (Day)</label>
                  <p>{kick.date} ({kick.day})</p>
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1">Time</label>
                  <input
                    type="text"
                    value={editedTime}
                    onChange={(e) => setEditedTime(e.target.value)}
                    className="w-full px-2 py-1 rounded border"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1">Remarks</label>
                  <textarea
                    value={editedRemarks}
                    onChange={(e) => {
                      if (e.target.value.length <= 150) {
                        setEditedRemarks(e.target.value)
                      }
                    }}
                    className="w-full px-2 py-1 rounded border"
                  />
                  <div className="text-right text-xs text-gray-400">
                    {editedRemarks.length} / 150
                  </div>
                </div>
              </Modal>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
