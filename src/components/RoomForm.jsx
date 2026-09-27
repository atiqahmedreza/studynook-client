import { useState } from 'react'
import { AMENITIES } from '../data/options'

const emptyRoom = {
  name: '',
  description: '',
  image: '',
  floor: '',
  capacity: '',
  hourlyRate: '',
  amenities: [],
}

function validImage(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function RoomForm({ initial, submitLabel, onSubmit }) {
  const [form, setForm] = useState({ ...emptyRoom, ...initial, amenities: initial?.amenities || [] })
  const [imageError, setImageError] = useState('')
  const [pending, setPending] = useState(false)

  function update(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function toggleAmenity(amenity) {
    setForm((current) => {
      const has = current.amenities.includes(amenity)
      return {
        ...current,
        amenities: has ? current.amenities.filter((item) => item !== amenity) : [...current.amenities, amenity],
      }
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validImage(form.image.trim())) {
      setImageError('Paste an image link that starts with http or https.')
      return
    }
    setImageError('')
    setPending(true)
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        floor: form.floor.trim(),
        capacity: Number(form.capacity),
        hourlyRate: Number(form.hourlyRate),
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label>
        <span className="field-label">Room name</span>
        <input className="field" name="name" value={form.name} onChange={update} required />
      </label>
      <label>
        <span className="field-label">Description</span>
        <textarea className="field min-h-32" name="description" value={form.description} onChange={update} required />
      </label>
      <label>
        <span className="field-label">Image URL</span>
        <input className="field" name="image" type="url" placeholder="https://" value={form.image} onChange={update} required />
        {imageError ? <p className="field-error">{imageError}</p> : null}
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label>
          <span className="field-label">Floor</span>
          <input className="field" name="floor" placeholder="3rd Floor" value={form.floor} onChange={update} required />
        </label>
        <label>
          <span className="field-label">Capacity</span>
          <input className="field" name="capacity" type="number" min="1" max="100" step="1" placeholder="4" value={form.capacity} onChange={update} required />
        </label>
        <label>
          <span className="field-label">Hourly rate (USD)</span>
          <input className="field" name="hourlyRate" type="number" min="0.01" step="0.01" placeholder="5" value={form.hourlyRate} onChange={update} required />
        </label>
      </div>
      <fieldset>
        <legend className="field-label">Amenities</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
      </fieldset>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
