import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api, { errorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import AuthShell from '../components/AuthShell'
import GoogleButton from '../components/GoogleButton'
import PageTitle from '../components/PageTitle'
import Spinner from '../components/Spinner'

export default function Login() {
  const { user, loading, setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  if (loading) {
    return (
      <div className="wrap py-12">
        <Spinner label="Checking your session" />
      </div>
    )
  }
  if (user) return <Navigate to={from} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      const { data } = await api.post('/auth/login', {
        email: form.get('email'),
        password: form.get('password'),
      })
      setUser(data.user)
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(errorMessage(error, 'Invalid email or password'))
    }
  }

  async function handleGoogle(accessToken) {
    const { data } = await api.post('/auth/google', { accessToken })
    setUser(data.user)
    navigate(from, { replace: true })
  }

  return (
    <AuthShell>
      <PageTitle title="StudyNook – Login" />
      <h1 className="page-title">Login</h1>
      <p className="prose-copy mt-3">Use the email you registered with, or continue with Google.</p>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label>
          <span className="field-label">Email</span>
          <input className="field" name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span className="field-label">Password</span>
          <input className="field" name="password" type="password" autoComplete="current-password" required />
        </label>
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
      <div className="mt-3">
        <GoogleButton onToken={handleGoogle} />
      </div>
      <p className="mt-5 text-sm text-[var(--muted)]">
        Don't have an account? <Link className="text-link" to="/register">Register</Link>
      </p>
    </AuthShell>
  )
}
