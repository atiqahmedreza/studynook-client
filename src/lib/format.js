export function clip(text, length = 100) {
  const value = String(text || '').trim()
  if (value.length <= length) return value
  return `${value.slice(0, length).trimEnd()}…`
}

export function money(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '$0'
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`
}

export function hourly(value) {
  return `${money(value)}/hr`
}

export function capacityLabel(capacity) {
  const count = Number(capacity) || 0
  return `${count} ${count === 1 ? 'person' : 'people'}`
}

export function todayLocalISO() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDate(iso) {
  if (!iso) return ''
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function passwordError(password) {
  if (!password || password.length < 6) return 'Password must be at least 6 characters.'
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter.'
  return ''
}

export function isOwner(user, room) {
  if (!user || !room?.owner) return false
  const ownerId = room.owner._id || room.owner
  return String(ownerId) === String(user.id)
}
