export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3" role="status">
      <div className="spinner" />
      <p className="text-sm text-[var(--muted)]">{label}</p>
    </div>
  )
}
