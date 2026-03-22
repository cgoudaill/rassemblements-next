import { getAllEvents } from '@/lib/calendar-server'
import ClientPage from '@/components/ClientPage'

export const revalidate = 1

export default async function Home() {
  const events = await getAllEvents()
  const updatedAt = new Date().toLocaleDateString('fr-BE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
  return <ClientPage events={events} updatedAt={updatedAt} />
}
// force revalidate Sam 21 mar 2026 21:14:14 CET
