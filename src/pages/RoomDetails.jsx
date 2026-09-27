import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api, { errorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { END_SLOTS, START_SLOTS } from '../data/options'
import { capacityLabel, hourly, isOwner, money, todayLocalISO } from '../lib/format'
import Modal from '../components/Modal'
import OwnerControls from '../components/OwnerControls'
import PageTitle from '../components/PageTitle'
import Spinner from '../components/Spinner'

export default function RoomDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [note, setNote] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setMissing(false)
    api
      .get(`/rooms/${id}`)
      .then(({ data }) => {
        if (!ignore) setRoom(data)
      })
      .catch((error) => {
        if (!ignore) setMissing(error?.response?.status === 404)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [id])

  const endOptions = useMemo(
    () => END_SLOTS.filter((slot) => startTime && slot > startTime),
    [startTime]
  )
  const hours = startTime && endTime ? Number(endTime.slice(0, 2)) - Number(startTime.slice(0, 2)) : 0
  const total = hours > 0 && room ? hours * room.hourlyRate : 0

  async function confirmBooking(event) {
    event.preventDefault()
    setPending(true)
    try {
      const { data } = await api.post('/bookings', {
        roomId: room._id,
        date,
        startTime,
        endTime,
        note,
      })
      toast.success(data.message)
      setBookingOpen(false)
      setDate('')
      setStartTime('')
      setEndTime('')
      setNote('')
      const refreshed = await api.get(`/rooms/${room._id}`)
      setRoom(refreshed.data)
    } catch (error) {
      toast.error(errorMessage(error, 'Could not book this room'))
    } finally {
      setPending(false)
    }
  }

  if (loading) {
    return (
      <div className="wrap py-10">
        <PageTitle title="StudyNook – Room" />
        <Spinner label="Loading room" />
      </div>
    )
  }

  if (missing || !room) {
    return (
      <div className="wrap py-16 text-center">
        <PageTitle title="StudyNook – Room" />
        <h1 className="page-title">Room not found</h1>
        <p className="prose-copy mt-3">That listing is no longer on the shelf.</p>
        <Link to="/rooms" className="btn btn-primary mt-6">Back to rooms</Link>
      </div>
    )
  }

  const owner = isOwner(user, room)

  return (
    <div className="wrap py-12">
      <PageTitle title={`StudyNook – ${room.name}`} />
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <img src={room.image} alt={room.name} className="aspect-[16/9] w-full rounded-[28px] object-cover" />
          <h1 className="page-title mt-6">{room.name}</h1>
          <p className="prose-copy mt-4 max-w-3xl">{room.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(room.amenities || []).map((amenity) => (
              <span key={amenity} className="chip">{amenity}</span>
            ))}
          </div>
        </div>
        <aside className="card h-fit p-6">
          <p className="eyebrow">Booking count</p>
          <p className="mt-2 font-serif text-5xl">{room.bookingCount || 0}</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Floor</dt><dd>{room.floor}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Capacity</dt><dd>{capacityLabel(room.capacity)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Hourly rate</dt><dd>{hourly(room.hourlyRate)}</dd></div>
          </dl>
          {room.owner?.name ? (
            <p className="mt-5 text-sm text-[var(--muted)]">Listed by {room.owner.name}</p>
          ) : null}
          <div className="mt-6">
            {user ? (
              <button type="button" className="btn btn-primary w-full" onClick={() => setBookingOpen(true)}>Book Now</button>
            ) : (
              <Link to="/login" state={{ from: location }} className="btn btn-primary w-full">Login to Book</Link>
            )}
          </div>
          {owner ? (
            <div className="mt-4">
              <OwnerControls
                room={room}
                onUpdated={setRoom}
                onDeleted={() => navigate('/my-listings')}
              />
            </div>
          ) : null}
        </aside>
      </div>

      <Modal open={bookingOpen} title="Book this room" onClose={() => setBookingOpen(false)}>
        <form className="grid gap-4" onSubmit={confirmBooking}>
          <label>
            <span className="field-label">Date</span>
            <input className="field" type="date" min={todayLocalISO()} value={date} onChange={(event) => setDate(event.target.value)} required />
          </label>
          <label>
            <span className="field-label">Start time</span>
            <select
              className="field"
              value={startTime}
              required
              onChange={(event) => {
                setStartTime(event.target.value)
                setEndTime('')
              }}
            >
              <option value="">Choose a start</option>
              {START_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </label>
          <label>
            <span className="field-label">End time</span>
            <select className="field" value={endTime} required disabled={!startTime} onChange={(event) => setEndTime(event.target.value)}>
              <option value="">Choose an end</option>
              {endOptions.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </label>
          <p className="text-sm text-[var(--muted)]">
            {hours > 0
              ? `${hours} ${hours === 1 ? 'hour' : 'hours'} × ${hourly(room.hourlyRate)}`
              : 'Select a start and end time to see the total.'}
          </p>
          <p className="font-serif text-3xl">Total {money(total)}</p>
          <label>
            <span className="field-label">Special note</span>
            <textarea className="field min-h-24" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional note for your own record" />
          </label>
          <button className="btn btn-primary" type="submit" disabled={pending || hours < 1}>
            {pending ? 'Booking…' : 'Confirm Booking'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
