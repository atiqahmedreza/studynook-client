import { useEffect, useState } from 'react'
import api, { errorMessage } from '../api/client'
import { AMENITIES } from '../data/options'
import PageHeader from '../components/PageHeader'
import PageTitle from '../components/PageTitle'
import RoomCard from '../components/RoomCard'
import Spinner from '../components/Spinner'

const emptyDraft = { search: '', floor: '', minRate: '', maxRate: '' }

export default function Rooms() {
  const [draft, setDraft] = useState(emptyDraft)
  const [applied, setApplied] = useState(emptyDraft)
  const [amenities, setAmenities] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setApplied(draft), 300)
    return () => clearTimeout(timer)
  }, [draft])

  useEffect(() => {
    const min = applied.minRate
    const max = applied.maxRate
    if (min !== '' && max !== '' && Number(min) > Number(max)) {
      setNotice('Minimum rate cannot be higher than the maximum.')
      setRooms([])
      setLoading(false)
      return undefined
    }

    const params = {}
    if (applied.search.trim()) params.search = applied.search.trim()
    if (applied.floor.trim()) params.floor = applied.floor.trim()
    if (min !== '') params.minRate = min
    if (max !== '') params.maxRate = max
    if (amenities.length) params.amenities = amenities.join(',')

    let ignore = false
    setLoading(true)
    setNotice('')
    api
      .get('/rooms', { params })
      .then(({ data }) => {
        if (!ignore) setRooms(data)
      })
      .catch((error) => {
        if (!ignore) {
          setRooms([])
          setNotice(errorMessage(error, 'Rooms could not be loaded.'))
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [applied, amenities])

  function updateDraft(event) {
    const { name, value } = event.target
    setDraft((current) => ({ ...current, [name]: value }))
  }

  function toggleAmenity(amenity) {
    setAmenities((current) => (
      current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity]
    ))
  }

  const filtersActive = applied.search || applied.floor || applied.minRate || applied.maxRate || amenities.length

  return (
    <div className="wrap py-12">
      <PageTitle title="StudyNook – Available Rooms" />
      <PageHeader
        eyebrow="The full shelf"
        title="Available Rooms"
        text="Search by name, then filter by what is in the room, which floor it is on, and what it costs per hour."
      />
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit p-5">
          <label>
            <span className="field-label">Search by room name</span>
            <input className="field" name="search" value={draft.search} onChange={updateDraft} placeholder="Search rooms" />
          </label>
          <fieldset className="mt-5">
            <legend className="field-label">Amenities</legend>
            <div className="grid gap-2">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                  {amenity}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="mt-5 block">
            <span className="field-label">Floor</span>
            <input className="field" name="floor" value={draft.floor} onChange={updateDraft} placeholder="3rd Floor" />
          </label>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <label>
              <span className="field-label">Min $/hr</span>
              <input className="field" name="minRate" type="number" min="0" step="1" value={draft.minRate} onChange={updateDraft} />
            </label>
            <label>
              <span className="field-label">Max $/hr</span>
              <input className="field" name="maxRate" type="number" min="0" step="1" value={draft.maxRate} onChange={updateDraft} />
            </label>
          </div>
          {filtersActive ? (
            <button
              type="button"
              className="btn btn-ghost mt-5 w-full"
              onClick={() => {
                setDraft(emptyDraft)
                setApplied(emptyDraft)
                setAmenities([])
              }}
            >
              Clear filters
            </button>
          ) : null}
        </aside>
        <div>
          {loading ? <Spinner label="Loading rooms" /> : null}
          {!loading && notice ? <p className="prose-copy">{notice}</p> : null}
          {!loading && !notice && rooms.length === 0 ? <p className="prose-copy">No rooms found</p> : null}
          {!loading && !notice && rooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, index) => (
                <RoomCard key={room._id} room={room} index={index} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
