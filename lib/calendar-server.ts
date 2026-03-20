import { google } from 'googleapis'
import type { RassemblementEvent, EventType } from './calendar'

const WATERLOO: [number, number] = [50.7142, 4.3960]

const COORDS_DB: Record<string, [number, number]> = {
  'comblain': [50.481, 5.586], 'flemalle': [50.577, 5.452], 'flémalle': [50.577, 5.452],
  'ath': [50.630, 3.777], 'gesves': [50.388, 5.058], 'mouscron': [50.745, 3.217],
  'gilly': [50.407, 4.462], 'rumes': [50.544, 3.303], 'hondschoote': [50.978, 2.584],
  'ardres': [50.860, 1.990], 'mons': [50.454, 3.952], 'peronne': [50.633, 3.551],
  'péronne': [50.633, 3.551], 'arras': [50.291, 2.777], 'harmignies': [50.412, 3.967],
  'gembloux': [50.561, 4.711], 'leernes': [50.360, 4.457], 'hotton': [50.266, 5.446],
  'floreffe': [50.429, 4.758], 'jalhay': [50.539, 5.976], 'dour': [50.399, 3.779],
  'saint-ghislain': [50.455, 3.819], 'le roeulx': [50.508, 4.109],
  'neufchateau': [49.849, 5.425], 'neufchâteau': [49.849, 5.425],
  'stoumont': [50.401, 5.803], 'langemark': [50.900, 2.917],
  'verviers': [50.589, 5.865], 'denee': [50.292, 4.750], 'denée': [50.292, 4.750],
  'carlsbourg': [49.953, 5.235], 'bellefontaine': [49.702, 5.380],
  'mettet': [50.325, 4.661], 'wavre': [50.722, 4.599], 'ans': [50.676, 5.503],
  'wattrelos': [50.700, 3.221], 'nivelles': [50.598, 4.329], 'temploux': [50.473, 4.761],
  'horimetz': [50.559, 3.787], 'attert': [49.750, 5.783], 'heron': [50.548, 5.053],
  'héron': [50.548, 5.053], 'peruwelz': [50.509, 3.595], 'péruwelz': [50.509, 3.595],
  'fourmies': [50.018, 4.056], 'welkenraedt': [50.658, 5.968],
  'houffalize': [50.128, 5.786], 'aywaille': [50.470, 5.677],
  'libramont': [49.920, 5.380], 'francorchamps': [50.437, 5.971],
  'spa': [50.492, 5.867], 'braine': [50.660, 4.390], 'tancremont': [50.530, 5.860],
  'bastogne': [50.001, 5.716], 'binche': [50.409, 4.168], 'trooz': [50.570, 5.680],
  'theux': [50.530, 5.820], 'frameries': [50.410, 3.900], 'chimay': [50.046, 4.326],
  'gedinne': [49.986, 4.961], 'blaregnies': [50.395, 3.920],
}

function guessCoords(location: string): [number, number] {
  const loc = location.toLowerCase()
  for (const [key, coords] of Object.entries(COORDS_DB)) {
    if (loc.includes(key)) return coords
  }
  return [50.5, 4.5]
}

function distKm(coords: [number, number]): number {
  const R = 6371
  const lat1 = WATERLOO[0] * Math.PI / 180
  const lon1 = WATERLOO[1] * Math.PI / 180
  const lat2 = coords[0] * Math.PI / 180
  const lon2 = coords[1] * Math.PI / 180
  const a = Math.sin((lat2 - lat1) / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

async function fetchCalendarEvents(calendarId: string, type: EventType): Promise<RassemblementEvent[]> {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  })
  const calendar = google.calendar({ version: 'v3', auth })
  const now = new Date()
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
  const res = await calendar.events.list({
    calendarId, timeMin: now.toISOString(),
    timeMax: endOfYear.toISOString(),
    singleEvents: true, orderBy: 'startTime', maxResults: 250,
  })
  const seen = new Set<string>()
  return (res.data.items || []).filter(e => {
    if (e.recurringEventId) {
      if (seen.has(e.recurringEventId)) return false
      seen.add(e.recurringEventId)
    }
    return true
  }).map(e => {
    const location = e.location || 'Belgique'
    const coords = guessCoords(location)
    const description = e.description || ''
    const priceMatch = description.match(/Prix\s*:\s*([^\n]+)/i)
    const price = priceMatch ? priceMatch[1].trim() : 'Non précisé'
    return {
      id: e.id || '',
      title: (e.summary || '').replace(/^[🏍️🚗]\s*/, ''),
      date: e.start?.date || e.start?.dateTime?.split('T')[0] || '',
      time: e.start?.dateTime ? e.start.dateTime.split('T')[1]?.substring(0, 5) : '',
      location, description: description.replace(/Source\s*:.*$/gim, '').trim(),
      price, coords, type, gcalLink: e.htmlLink || '', km: distKm(coords),
    }
  })
}

export async function getAllEvents(): Promise<RassemblementEvent[]> {
  try {
    const [carEvents, motoEvents] = await Promise.all([
      fetchCalendarEvents(process.env.CALENDAR_VOITURES || '', 'car'),
      fetchCalendarEvents(process.env.CALENDAR_MOTOS || '', 'moto'),
    ])
    return [...carEvents, ...motoEvents].sort((a, b) => a.date.localeCompare(b.date))
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return []
  }
}
