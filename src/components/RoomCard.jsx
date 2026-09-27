import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { capacityLabel, clip, hourly } from '../lib/format'

export default function RoomCard({ room, index = 0 }) {
  const reduce = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const shown = (room.amenities || []).slice(0, 3)
  const extra = (room.amenities || []).length - shown.length

  return (
    <motion.article
      className="card flex h-full flex-col overflow-hidden"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: reduce ? 0 : index * 0.04 }}
      whileHover={reduce ? undefined : { y: -4 }}
    >
      {failed ? (
        <div className="flex aspect-[16/10] items-end bg-[var(--forest-deep)] p-4 text-[#f6f1e6]">
          <span className="font-serif text-2xl">{room.name}</span>
        </div>
      ) : (
        <img
          src={room.image}
          alt={room.name}
          className="aspect-[16/10] w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-2xl tracking-tight">{room.name}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{clip(room.description)}</p>
        <div className="mt-4 space-y-1 text-sm">
          <p>{room.floor}</p>
          <p>{capacityLabel(room.capacity)}</p>
          <p>{hourly(room.hourlyRate)}</p>
        </div>
        <div className="mt-4 flex min-h-7 flex-wrap gap-2">
          {shown.map((amenity) => (
            <span key={amenity} className="chip">{amenity}</span>
          ))}
          {extra > 0 ? <span className="chip">+{extra} more</span> : null}
        </div>
        <Link to={`/rooms/${room._id}`} className="btn btn-primary mt-auto w-full">View Details</Link>
      </div>
    </motion.article>
  )
}
