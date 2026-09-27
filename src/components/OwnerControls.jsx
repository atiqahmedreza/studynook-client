import { useState } from 'react'
import toast from 'react-hot-toast'
import api, { errorMessage } from '../api/client'
import Modal from './Modal'
import RoomForm from './RoomForm'

export default function OwnerControls({ room, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(false)

  async function save(form) {
    try {
      const { data } = await api.put(`/rooms/${room._id}`, form)
      toast.success(data.message)
      setEditing(false)
      onUpdated?.(data.room)
    } catch (error) {
      toast.error(errorMessage(error, 'Could not update the room'))
    }
  }

  async function remove() {
    setPendingDelete(true)
    try {
      const { data } = await api.delete(`/rooms/${room._id}`)
      toast.success(data.message)
      setDeleting(false)
      onDeleted?.()
    } catch (error) {
      toast.error(errorMessage(error, 'Could not delete the room'))
    } finally {
      setPendingDelete(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn btn-ghost" onClick={() => setEditing(true)}>Edit</button>
      <button type="button" className="btn btn-danger" onClick={() => setDeleting(true)}>Delete</button>
      <Modal open={editing} title="Edit room" onClose={() => setEditing(false)}>
        <RoomForm
          initial={room}
          submitLabel="Save changes"
          onSubmit={save}
        />
      </Modal>
      <Modal open={deleting} title="Delete this room?" onClose={() => setDeleting(false)}>
        <p className="prose-copy">This permanently removes the listing and any bookings tied to it.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => setDeleting(false)}>Keep room</button>
          <button type="button" className="btn btn-danger" onClick={remove} disabled={pendingDelete}>
            {pendingDelete ? 'Deleting…' : 'Delete room'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
