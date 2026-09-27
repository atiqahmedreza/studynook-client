import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetails from './pages/RoomDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import AddRoom from './pages/AddRoom'
import MyListings from './pages/MyListings'
import MyBookings from './pages/MyBookings'
import About from './pages/About'
import NotFound from './pages/NotFound'

function AnimatedRoutes() {
  const location = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function AppShell() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <AnimatedRoutes />
          </Layout>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3200,
              style: {
                background: 'var(--surface)',
                color: 'var(--ink)',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                fontFamily: 'Outfit, sans-serif',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default function App() {
  const googleId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!googleId) return <AppShell />
  return (
    <GoogleOAuthProvider clientId={googleId}>
      <AppShell />
    </GoogleOAuthProvider>
  )
}
