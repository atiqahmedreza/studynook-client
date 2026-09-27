import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api, { errorMessage } from '../api/client'
import PageHeader from '../components/PageHeader'
import PageTitle from '../components/PageTitle'
import RoomForm from '../components/RoomForm'

export default function AddRoom() {
  const navigate = useNavigate()

  async function create(form) {
    try {
      const { data } = await api.post('/rooms', form)
      toast.success(data.message)
      navigate('/my-listings')
    } catch (error) {
      toast.error(errorMessage(error, 'Could not add the room'))
    }
  }

  return (
    <div className="wrap py-12">
      <PageTitle title="StudyNook – Add Room" />
      <PageHeader
        eyebrow="Your listing"
        title="Add Room"
        text="Any signed-in reader can list a room they control. You can edit or delete it later."
      />
      <div className="card max-w-3xl p-6 sm:p-8">
        <RoomForm submitLabel="Add room" onSubmit={create} />
      </div>
    </div>
  )
}
