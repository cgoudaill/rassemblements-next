import { getAllEvents } from '@/lib/calendar-server'
import ClientPage from '@/components/ClientPage'

export const revalidate = 21600

export default async function Home() {
  const events = await getAllEvents()
  const updatedAt = new Date().toLocaleDateString('fr-BE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
  return <ClientPage events={events} updatedAt={updatedAt} />
}
