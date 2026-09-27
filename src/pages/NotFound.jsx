import { Link } from 'react-router-dom'
import PageTitle from '../components/PageTitle'

export default function NotFound() {
  return (
    <div className="wrap py-20 text-center">
      <PageTitle title="StudyNook – Page Not Found" />
      <p className="eyebrow">Missing page</p>
      <h1 className="page-title mt-3">Page not found</h1>
      <p className="prose-copy mx-auto mt-4 max-w-md">This shelf is empty. The address you opened is not part of StudyNook.</p>
      <Link to="/" className="btn btn-primary mt-8">Back to Home</Link>
    </div>
  )
}
