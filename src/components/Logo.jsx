import { Link } from 'react-router-dom'

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 text-xl text-[var(--ink)] no-underline ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 24c0-8 4.2-12 10-12s10 4 10 12" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M16 12v12M6 24h20" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
      <span className="font-serif tracking-tight">StudyNook</span>
    </Link>
  )
}
