import { Link } from 'react-router-dom'
import PageTitle from '../components/PageTitle'

export default function About() {
  return (
    <div className="wrap py-12">
      <PageTitle title="StudyNook – About" />
      <p className="eyebrow">The desk</p>
      <h1 className="page-title mt-2">About StudyNook</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <p className="prose-copy">
            StudyNook is for library rooms that already have a person responsible for them. That person lists the room. Anyone with an account can reserve an open hour.
          </p>
          <h2 className="section-title">What a listing includes</h2>
          <p className="prose-copy">
            Each room shows its floor, how many people it holds, the hourly rate, and the amenities inside, from a whiteboard to a quiet zone. The booking count rises each time a reservation is confirmed.
          </p>
          <h2 className="section-title">How a clash is stopped</h2>
          <p className="prose-copy">
            Before a booking is saved, StudyNook checks confirmed reservations for that room and date. Overlapping hours are refused. A booking that ends at 12:00 still leaves 12:00 open for the next reader.
          </p>
        </div>
        <aside className="card h-fit p-6">
          <h2 className="font-serif text-2xl">Contact</h2>
          <p className="prose-copy mt-3">Write or call the desk if a listed room needs a correction you cannot make yourself.</p>
          <p className="mt-4"><a className="text-link" href="mailto:desk@studynook.library">desk@studynook.library</a></p>
          <p className="mt-2"><a className="text-link" href="tel:+15550142200">(555) 014-2200</a></p>
          <Link to="/rooms" className="btn btn-primary mt-6">Explore Rooms</Link>
        </aside>
      </div>
    </div>
  )
}
