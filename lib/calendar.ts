export type EventType = 'car' | 'moto'

export interface RassemblementEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  price: string
  coords: [number, number]
  type: EventType
  gcalLink: string
  km: number
}

export function formatDate(dateStr: string): string {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
    'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
  const dt = new Date(dateStr + 'T12:00:00')
  return `${days[dt.getDay()]} ${dt.getDate()} ${months[dt.getMonth()]}`
}

export function isGratuit(price: string): boolean {
  return price?.toLowerCase().includes('gratuit') ?? false
}
