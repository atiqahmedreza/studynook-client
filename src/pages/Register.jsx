import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api, { errorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { passwordError } from '../lib/format'
import AuthShell from '../components/AuthShell'
import GoogleButton from '../components/GoogleButton'
import PageTitle from '../components/PageTitle'

export default function Register() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const ruleError = passwordError(password)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    if (ruleError) return
    const form = new FormData(event.currentTarget)
    setPending(true)
    try {
      const { data } = await api.post('/auth/register', {
        name: form.get('name'),
        email: form.get('email'),
        photo: form.get('photo'),
        password,
      })
      toast.success(data.message)
      navigate('/login')
    } catch (error) {
      toast.error(errorMessage(error, 'Could not create the account'))
    } finally {
      setPending(false)
    }
  }

  async function handleGoogle(accessToken) {
    const { data } = await api.post('/auth/google', { accessToken })
    setUser(data.user)
    navigate('/', { replace: true })
  }

  return (
    <AuthShell>
      <PageTitle title="StudyNook – Register" />
      <h1 className="page-title">Register</h1>
      <p className="prose-copy mt-3">Create an account with a photo link, then sign in.</p>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label>
          <span className="field-label">Name</span>
          <input className="field" name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          <span className="field-label">Email</span>
          <input className="field" name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span className="field-label">Photo URL</span>
          <input className="field" name="photo" type="url" placeholder="https://" required />
        </label>
        <label>
          <span className="field-label">Password</span>
          <input
            className="field"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            <li>{password.length >= 6 ? '✓' : '•'} At least 6 characters</li>
            <li>{/[A-Z]/.test(password) ? '✓' : '•'} At least one uppercase letter</li>
            <li>{/[a-z]/.test(password) ? '✓' : '•'} At least one lowercase letter</li>
          </ul>
          {submitted && ruleError ? <p className="field-error">{ruleError}</p> : null}
        </label>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? 'Creating account…' : 'Register'}
        </button>
      </form>
      <div className="mt-3">
        <GoogleButton onToken={handleGoogle} />
      </div>
      <p className="mt-5 text-sm text-[var(--muted)]">
        Already have an account? <Link className="text-link" to="/login">Login</Link>
      </p>
    </AuthShell>
  )
}
