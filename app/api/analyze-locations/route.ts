import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export const dynamic = 'force-dynamic'

// ⚠️ Doit rester synchronisé avec lib/calendar-server.ts (même DB, même logique).
const FALLBACK: [number, number] = [50.5, 4.5]

const COORDS_DB: Record<string, [number, number]> = {
  'braine-le-comte': [50.609, 4.139], 'braine-l\'alleud': [50.683, 4.371],
  'la louvière': [50.476, 4.187], 'la louviere': [50.476, 4.187],
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
  'carlsbourg': [49.953, 5.235],
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
  'marloie': [50.197, 5.323],
  'visé': [50.738, 5.700], 'vise': [50.738, 5.700],
  'florennes': [50.252, 4.607],
  'geer': [50.687, 5.190], 'wanze': [50.535, 5.211], 'hamois': [50.339, 5.150],
  'couvin': [50.053, 4.494],
  'oignies-en-thiérache': [49.989, 4.793], 'oignies': [49.989, 4.793],
  'momignies': [50.029, 4.169],
  'cognelée': [50.512, 4.892], 'cognelee': [50.512, 4.892],
  'lesve': [50.358, 4.788], 'remouchamps': [50.480, 5.700], 'stavelot': [50.395, 5.929],
  'ronquières': [50.610, 4.225], 'ronquieres': [50.610, 4.225], 'tournai': [50.607, 3.389],
  'honnelles': [50.342, 3.834], 'fayt-le-franc': [50.342, 3.834],
  'harchies': [50.481, 3.690], 'bruxelles': [50.847, 4.353], 'brussel': [50.847, 4.353],
  'engis': [50.582, 5.398],
  'arlon': [49.683, 5.816],
  'ittre': [50.643, 4.264],
  'cerfontaine': [50.158, 4.413],
  'beaumont': [50.236, 4.240],
  'huy': [50.519, 5.239],
  'amay': [50.546, 5.309],
  'malmedy': [50.426, 6.028], 'bévercé': [50.448, 6.030], 'beverce': [50.448, 6.030],
  'quiévrain': [50.405, 3.687], 'quievrain': [50.405, 3.687],
  'franchimont': [50.197, 4.583],
  'veulen': [50.770, 5.300], 'heers': [50.752, 5.297],
  'attre': [50.585, 3.832],
}

const POSTAL_DB: Record<string, [number, number]> = {
  '5555': [49.934, 5.001], // Bellefontaine (Bièvre)
  '6730': [49.702, 5.380], // Bellefontaine (Tintigny, Gaume)
}

function guessCoords(location: string): { coords: [number, number]; matchedBy: string } {
  const loc = location.toLowerCase()
  const cp = loc.match(/\b(\d{4})\b/)
  if (cp && POSTAL_DB[cp[1]]) return { coords: POSTAL_DB[cp[1]], matchedBy: `cp:${cp[1]}` }
  for (const [key, coords] of Object.entries(COORDS_DB)) {
    if (loc.includes(key)) return { coords, matchedBy: `name:${key}` }
  }
  return { coords: FALLBACK, matchedBy: 'fallback' }
}

function getCalendar() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  })
  return google.calendar({ version: 'v3', auth })
}

async function analyzeCalendar(calendarId: string, label: string) {
  const calendar = getCalendar()
  const now = new Date()
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
  const res = await calendar.events.list({
    calendarId, timeMin: now.toISOString(), timeMax: endOfYear.toISOString(),
    singleEvents: true, orderBy: 'startTime', maxResults: 250,
  })
  const items = res.data.items || []
  return items.map(e => {
    const hasLocation = Boolean(e.location && e.location.trim())
    const location = e.location?.trim() || ''
    const { coords, matchedBy } = guessCoords(location || 'Belgique')
    const isFallback = coords[0] === FALLBACK[0] && coords[1] === FALLBACK[1]
    return {
      calendar: label,
      id: e.id || '',
      title: (e.summary || '').replace(/^[🏍️🚗]\s*/, ''),
      date: e.start?.date || e.start?.dateTime?.split('T')[0] || '',
      location: hasLocation ? location : null,
      coords, matchedBy,
      problem: !hasLocation ? 'missing_location' : isFallback ? 'fallback_coords' : null,
    }
  })
}

export async function GET() {
  try {
    if (!process.env.CALENDAR_VOITURES || !process.env.CALENDAR_MOTOS) {
      return NextResponse.json({ error: 'Calendar env vars manquantes' }, { status: 500 })
    }
    const [cars, motos] = await Promise.all([
      analyzeCalendar(process.env.CALENDAR_VOITURES, 'voitures'),
      analyzeCalendar(process.env.CALENDAR_MOTOS, 'motos'),
    ])
    const all = [...cars, ...motos]
    const problems = all.filter(e => e.problem)
    const byProblem = {
      missing_location: problems.filter(e => e.problem === 'missing_location'),
      fallback_coords: problems.filter(e => e.problem === 'fallback_coords'),
    }
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      summary: {
        total: all.length,
        ok: all.length - problems.length,
        problems: problems.length,
        missing_location: byProblem.missing_location.length,
        fallback_coords: byProblem.fallback_coords.length,
      },
      problems: byProblem,
      all,
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('analyze-locations error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'unknown' },
      { status: 500 },
    )
  }
}
