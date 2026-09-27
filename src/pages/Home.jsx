import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../api/client'
import PageTitle from '../components/PageTitle'
import RoomCard from '../components/RoomCard'
import Spinner from '../components/Spinner'

const steps = [
  {
    title: 'Browse the shelf',
    text: 'Search by name, then narrow the list with amenities, floor, or price until the room fits the work.',
  },
  {
    title: 'Pick the hour',
    text: 'Choose today or a later date, then a start and end on the hour. The total updates before you confirm.',
  },
  {
    title: 'Keep the plan',
    text: 'The reservation stays under My Bookings. Cancel it while the date is still today or later.',
  },
]

const reasons = [
  'The price is settled before you confirm. The total is the hours you chose times the hourly rate.',
  'A confirmed booking blocks that room for the same hours, so two people cannot hold one slot.',
  'List a room you manage, then change the photo, the rate, or the amenities when the details change.',
  'Cancel from My Bookings while the reservation date is still today or later.',
]

export default function Home() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState('')

  useEffect(() => {
    let ignore = false
    api
      .get('/rooms/latest')
      .then(({ data }) => {
        if (!ignore) setRooms(data)
      })
      .catch((error) => {
        if (!ignore) setFailed(errorMessage(error, 'Rooms could not be loaded.'))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div>
      <PageTitle title="StudyNook – Home" />
      <section className="wrap grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <p className="eyebrow">University library rooms</p>
          <h1 className="display mt-4">Find Your Perfect Study Room</h1>
          <p className="prose-copy mt-6 max-w-xl">
            Browse and book quiet, private study rooms in your library. List your own room and earn.
          </p>
          <div className="mt-8">
            <Link to="/rooms" className="btn btn-primary">Explore Rooms</Link>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1400&q=80"
            alt="A quiet university library reading room"
            className="aspect-[4/5] w-full rounded-[28px] object-cover"
          />
          <div className="card absolute bottom-6 left-4 max-w-[14rem] p-4 sm:left-6">
            <p className="eyebrow">Open desks</p>
            <p className="mt-2 font-serif text-2xl">From $3/hr</p>
          </div>
        </div>
      </section>

      <section className="wrap pb-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">On the shelf</p>
            <h2 className="section-title mt-2">Available Study Rooms</h2>
            <p className="prose-copy mt-3">The latest rooms added to the library.</p>
          </div>
          <Link to="/rooms" className="text-link">See all rooms</Link>
        </div>
        {loading ? <Spinner label="Loading rooms" /> : null}
        {!loading && failed ? <p className="prose-copy">{failed}</p> : null}
        {!loading && !failed && rooms.length === 0 ? (
          <p className="prose-copy">No study rooms have been listed yet.</p>
        ) : null}
        {!loading && !failed && rooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room, index) => (
              <RoomCard key={room._id} room={room} index={index} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="wrap py-16">
          <p className="eyebrow">The path</p>
          <h2 className="section-title mt-2">How a booking works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="card p-6">
                <span className="font-serif text-3xl text-[var(--brass)]">0{index + 1}</span>
                <h3 className="mt-4 font-serif text-2xl">{step.title}</h3>
                <p className="prose-copy mt-3 text-base">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Why it holds</p>
          <h2 className="section-title mt-2">A room you can count on</h2>
          <ul className="mt-6 space-y-4">
            {reasons.map((reason) => (
              <li key={reason} className="flex gap-3 text-[var(--muted)] leading-7">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--brass)]" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
        <img
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=80"
          alt="Wooden shelves of books in a library"
          className="aspect-[5/4] w-full rounded-[28px] object-cover"
        />
      </section>
    </div>
  )
}
