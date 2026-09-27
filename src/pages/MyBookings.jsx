import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api, { errorMessage } from '../api/client'
import { formatDate, money, todayLocalISO } from '../lib/format'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import PageTitle from '../components/PageTitle'
import Spinner from '../components/Spinner'

function canCancel(booking) {
  return booking.status === 'confirmed' && booking.date >= todayLocalISO()
}

function BookingActions({ booking, onCancel }) {
  if (!canCancel(booking)) return <span className="text-sm text-[var(--muted)]">Closed</span>
  return (
    <button type="button" className="btn btn-danger btn-small" onClick={() => onCancel(booking)}>
      Cancel
    </button>
  )
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [selected, setSelected] = useState(null)
  const [pending, setPending] = useState(false)

  function load() {
    setLoading(true)
    return api
      .get('/bookings/mine')
      .then(({ data }) => {
        setBookings(data)
        setNotice('')
      })
      .catch((error) => setNotice(errorMessage(error, 'Bookings could not be loaded.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let ignore = false
    api
      .get('/bookings/mine')
      .then(({ data }) => {
        if (!ignore) setBookings(data)
      })
      .catch((error) => {
        if (!ignore) setNotice(errorMessage(error, 'Bookings could not be loaded.'))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  async function confirmCancel() {
    setPending(true)
    try {
      const { data } = await api.patch(`/bookings/${selected._id}/cancel`)
      toast.success(data.message)
      setSelected(null)
      await load()
    } catch (error) {
      toast.error(errorMessage(error, 'Could not cancel the booking'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="wrap py-12">
      <PageTitle title="StudyNook – My Bookings" />
      <PageHeader
        eyebrow="Your hours"
        title="My Bookings"
        text="Confirmed reservations can be cancelled while the booking date is today or still ahead."
      />
      {loading ? <Spinner label="Loading your bookings" /> : null}
      {!loading && notice ? <p className="prose-copy">{notice}</p> : null}
      {!loading && !notice && bookings.length === 0 ? (
        <div className="card p-8">
          <p className="prose-copy">You have no bookings yet.</p>
          <Link to="/rooms" className="btn btn-primary mt-5">Explore Rooms</Link>
        </div>
      ) : null}
      {!loading && bookings.length > 0 ? (
        <>
          <div className="grid gap-4 md:hidden">
            {bookings.map((booking) => (
              <article key={booking._id} className="card p-4">
                <div className="flex gap-3">
                  {booking.room?.image ? (
                    <img src={booking.room.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  ) : null}
                  <div>
                    <h2 className="font-serif text-xl">{booking.room?.name || 'Room no longer listed'}</h2>
                    <p className="text-sm text-[var(--muted)]">{formatDate(booking.date)} · {booking.startTime}–{booking.endTime}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className={`badge ${booking.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}`}>{booking.status}</span>
                  <span>{money(booking.totalCost)}</span>
                  <BookingActions booking={booking} onCancel={setSelected} />
                </div>
              </article>
            ))}
          </div>
          <div className="card hidden p-2 md:block">
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {booking.room?.image ? (
                            <img src={booking.room.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                          ) : null}
                          <span>{booking.room?.name || 'Room no longer listed'}</span>
                        </div>
                      </td>
                      <td>{formatDate(booking.date)}</td>
                      <td>{booking.startTime}–{booking.endTime}</td>
                      <td>{money(booking.totalCost)}</td>
                      <td>
                        <span className={`badge ${booking.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td><BookingActions booking={booking} onCancel={setSelected} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}

      <Modal open={Boolean(selected)} title="Cancel this booking?" onClose={() => setSelected(null)}>
        <p className="prose-copy">
          {selected?.room?.name || 'This room'} on {selected ? formatDate(selected.date) : ''} will be marked cancelled.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => setSelected(null)}>Keep booking</button>
          <button type="button" className="btn btn-danger" onClick={confirmCancel} disabled={pending}>
            {pending ? 'Cancelling…' : 'Cancel booking'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
