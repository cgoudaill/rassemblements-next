import type { NextRequest } from 'next/server'
import { google } from 'googleapis'

async function getCalendarClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
  return google.calendar({ version: 'v3', auth })
}

const SOURCES = [
  'https://www.old-timer.be/agenda',
  'https://www.veteran.be/fr/agenda',
]

async function fetchPage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RassemblementsBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ''
    const text = await res.text()
    return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 15000)
  } catch { return '' }
}

async function extractEvents(content: string, source: string): Promise<any[]> {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: `Extrait les événements de véhicules anciens en Belgique 2026 de ce texte. Réponds UNIQUEMENT en JSON: {"events": [{"title":"...","date":"2026-MM-DD","location":"...","price":"...","type":"car ou moto","description":"..."}]}. Si rien: {"events":[]}\n\nTEXTE(${source}):\n${content}` }]
      })
    })
    if (!res.ok) return []
    const data = await res.json()
    const parsed = JSON.parse(data.content?.[0]?.text || '{"events":[]}')
    return parsed.events || []
  } catch { return [] }
}

async function addEvent(calendar: any, event: any): Promise<boolean> {
  const calId = event.type === 'moto' ? process.env.CALENDAR_MOTOS! : process.env.CALENDAR_VOITURES!
  try {
    const check = await calendar.events.list({ calendarId: calId, q: event.title.substring(0,30), timeMin: `${event.date}T00:00:00Z`, timeMax: `${event.date}T23:59:59Z`, singleEvents: true })
    if ((check.data.items?.length || 0) > 0) return false
    await calendar.events.insert({ calendarId: calId, requestBody: { summary: event.title, location: event.location, description: `${event.description}\nPrix : ${event.price}\nSource : Bot auto`, start: { date: event.date }, end: { date: event.date } } })
    return true
  } catch { return false }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  const results = { added: 0, errors: 0, events: [] as string[] }
  try {
    const calendar = await getCalendarClient()
    for (const url of SOURCES) {
      const text = await fetchPage(url)
      if (!text) continue
      const events = await extractEvents(text, url)
      for (const ev of events) {
        if (!ev.title || !ev.date) continue
        try {
          const ok = await addEvent(calendar, ev)
          if (ok) { results.added++; results.events.push(`${ev.title} (${ev.date})`) }
        } catch { results.errors++ }
      }
    }
  } catch (err) { results.errors++ }
  return Response.json({ success: true, timestamp: new Date().toISOString(), ...results })
}
