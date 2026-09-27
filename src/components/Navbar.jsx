import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Logo from './Logo'

function navClass({ isActive }) {
  return `nav-link ${isActive ? 'nav-link-active' : ''}`
}

function Avatar({ user }) {
  const [failed, setFailed] = useState(false)
  if (!user.photo || failed) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--chip)] text-sm font-semibold">
        {user.name?.[0]?.toUpperCase() || 'S'}
      </span>
    )
  }
  return (
    <img
      src={user.photo}
      alt=""
      className="h-8 w-8 rounded-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}

export default function Navbar() {
  const { user, setUser, loading } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function onPointerDown(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // The local session still ends if the cookie is already gone.
    }
    setUser(null)
    setProfileOpen(false)
    toast.success('Logged out')
    navigate('/')
  }

  const links = (
    <>
      <NavLink to="/" end className={navClass}>Home</NavLink>
      <NavLink to="/rooms" className={navClass}>Rooms</NavLink>
      {user ? (
        <>
          <NavLink to="/add-room" className={navClass}>Add Room</NavLink>
          <NavLink to="/my-listings" className={navClass}>My Listings</NavLink>
          <NavLink to="/my-bookings" className={navClass}>My Bookings</NavLink>
        </>
      ) : null}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {links}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          {loading ? <span className="hidden h-9 w-24 lg:block" /> : null}
          {!loading && !user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <NavLink to="/login" className="btn btn-ghost btn-small">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-small">Register</NavLink>
            </div>
          ) : null}
          {!loading && user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() => setProfileOpen((open) => !open)}
              >
                <Avatar user={user} />
                <span className="max-w-[8rem] truncate">{user.name}</span>
              </button>
              {profileOpen ? (
                <div role="menu" className="card absolute right-0 mt-2 w-56 p-2">
                  <p className="px-3 py-2 text-sm text-[var(--muted)]">{user.email}</p>
                  <NavLink to="/my-listings" className="block rounded-xl px-3 py-2 no-underline hover:bg-[var(--chip)]" role="menuitem">My Listings</NavLink>
                  <NavLink to="/my-bookings" className="block rounded-xl px-3 py-2 no-underline hover:bg-[var(--chip)]" role="menuitem">My Bookings</NavLink>
                  <button type="button" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-[var(--chip)]" onClick={logout}>Logout</button>
                </div>
              ) : null}
            </div>
          ) : null}
          <button
            type="button"
            className="btn btn-ghost btn-small lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </div>
      </div>
      {menuOpen ? (
        <nav className="wrap flex flex-col gap-3 pb-4 lg:hidden" aria-label="Mobile">
          {links}
          {!loading && !user ? (
            <>
              <NavLink to="/login" className="btn btn-ghost">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary">Register</NavLink>
            </>
          ) : null}
          {user ? (
            <button type="button" className="btn btn-ghost" onClick={logout}>Logout</button>
          ) : null}
        </nav>
      ) : null}
    </header>
  )
}
