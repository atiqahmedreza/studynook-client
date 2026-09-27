import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { errorMessage } from '../api/client'

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#EA4335" d="M9 7.2v3.5h4.9c-.2 1.2-1.5 3.5-4.9 3.5A5.6 5.6 0 1 1 9 3.4c1.6 0 2.7.7 3.3 1.3l2.2-2.2C13.2 1.1 11.3 0 9 0 4 0 0 4 0 9s4 9 9 9c5.2 0 8.6-3.6 8.6-8.7 0-.6 0-1-.1-1.5H9z" />
    </svg>
  )
}

function GooglePrompt({ onToken }) {
  const [pending, setPending] = useState(false)
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setPending(true)
      try {
        await onToken(tokenResponse.access_token)
      } catch (error) {
        toast.error(errorMessage(error, 'Google sign-in failed'))
      } finally {
        setPending(false)
      }
    },
    onError: () => toast.error('Google sign-in was cancelled or failed.'),
  })

  return (
    <button type="button" className="btn btn-ghost w-full" onClick={() => login()} disabled={pending}>
      <GoogleMark /> Continue with Google
    </button>
  )
}

export default function GoogleButton({ onToken }) {
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        className="btn btn-ghost w-full"
        onClick={() => toast.error('Google sign-in is not configured yet. Use email and password.')}
      >
        <GoogleMark /> Continue with Google
      </button>
    )
  }
  return <GooglePrompt onToken={onToken} />
}
