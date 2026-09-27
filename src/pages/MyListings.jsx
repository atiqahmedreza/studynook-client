import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../api/client'
import OwnerControls from '../components/OwnerControls'
import PageHeader from '../components/PageHeader'
import PageTitle from '../components/PageTitle'
import RoomCard from '../components/RoomCard'
import Spinner from '../components/Spinner'

export default function MyListings() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let ignore = false
    api
      .get('/rooms/mine')
      .then(({ data }) => {
        if (!ignore) setRooms(data)
      })
      .catch((error) => {
        if (!ignore) setNotice(errorMessage(error, 'Listings could not be loaded.'))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="wrap py-12">
      <PageTitle title="StudyNook – My Listings" />
      <PageHeader
        eyebrow="Rooms you listed"
        title="My Listings"
        text="Edit a listing, remove it, or open it to see how readers book it."
      />
      {loading ? <Spinner label="Loading your listings" /> : null}
      {!loading && notice ? <p className="prose-copy">{notice}</p> : null}
      {!loading && !notice && rooms.length === 0 ? (
        <div className="card p-8">
          <p className="prose-copy">You have not listed a room yet.</p>
          <Link to="/add-room" className="btn btn-primary mt-5">Add Room</Link>
        </div>
      ) : null}
      {!loading && rooms.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <div key={room._id} className="flex h-full flex-col gap-3">
              <RoomCard room={room} index={index} />
              <OwnerControls
                room={room}
                onUpdated={(updated) => setRooms((current) => current.map((item) => item._id === updated._id ? updated : item))}
                onDeleted={() => setRooms((current) => current.filter((item) => item._id !== room._id))}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
