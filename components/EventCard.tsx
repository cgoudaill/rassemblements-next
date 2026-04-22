import type { RassemblementEvent } from '@/lib/calendar'
import { formatDate, isGratuit } from '@/lib/calendar'

function cleanTitle(t: string) {
  return t.replace(/^[^\w\u00C0-\u024F\s\-\(\)]+\s*/g, '').trim()
}

function getTag(event: RassemblementEvent): { label: string; color: string; border: string } {
  const title = event.title.toLowerCase()
  const desc = (event.description || '').toLowerCase()
  const isCar = event.type === 'car'

  if (title.includes('rallye') || title.includes('rally'))
    return { label: 'Rallye',        color: '#1a4aff', border: '#1a4aff' }
  if (title.includes('bourse'))
    return { label: 'Bourse',        color: '#7b21b6', border: '#7b21b6' }
  if (title.includes('balade') || desc.includes('balade') || desc.includes('roadbook'))
    return { label: 'Balade',        color: '#186a35', border: '#186a35' }
  if (title.includes('randonnée') || title.includes('rando'))
    return { label: 'Randonnée',     color: '#186a35', border: '#186a35' }
  if (title.includes('meeting') || title.includes('expo') || title.includes('salon'))
    return { label: 'Exposition',    color: '#854d0e', border: '#854d0e' }
  if (!isCar)
    return { label: 'Balade moto',   color: 'var(--red)', border: 'var(--red)' }
  return   { label: 'Rassemblement', color: 'var(--ink-muted)', border: 'var(--rule)' }
}

function getDayNumber(dateStr: string): string {
  const d = new Date(dateStr)
  return String(d.getDate()).padStart(2, '0')
}

interface Props {
  event: RassemblementEvent
  index: number
  onClick: () => void
}

export default function EventCard({ event, index, onClick }: Props) {
  const isCar = event.type === 'car'
  const gratuit = isGratuit(event.price)
  const tag = getTag(event)
  const day = getDayNumber(event.date)

  return (
    <article
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid var(--rule)',
        padding: '1.4rem 1.5rem 1.3rem',
        cursor: 'pointer',
        transition: 'background .15s',
        animation: `fadeUp .4s ${Math.min(index * 30, 300)}ms backwards`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff' }}
    >
      {/* Chiffre watermark */}
      <div style={{
        position: 'absolute', top: '.8rem', right: '1rem',
        fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: '4.5rem', lineHeight: 1,
        color: 'var(--rule)',
        pointerEvents: 'none', userSelect: 'none',
        zIndex: 0,
      }}>{day}</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Type + tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.65rem', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '.3rem',
            fontFamily: 'var(--font-mono)', fontSize: '.54rem',
            letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--ink-muted)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
              background: isCar ? 'var(--ink)' : 'var(--red)',
            }} />
            {isCar ? 'Voiture ancienne' : 'Moto'}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '.52rem',
            letterSpacing: '.14em', textTransform: 'uppercase',
            padding: '.12rem .5rem',
            border: `1px solid ${tag.border}`,
            color: tag.color,
          }}>{tag.label}</span>
        </div>

        {/* Titre */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.12rem', fontWeight: 700,
          color: 'var(--ink)', lineHeight: 1.2,
          marginBottom: '.7rem',
        }}>
          {cleanTitle(event.title)}
        </h3>

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', marginBottom: '.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.7rem', color: 'var(--ink-mid)' }}>
            <span style={{ color: 'var(--ink-muted)', fontSize: '.8rem' }}>📅</span>
            {formatDate(event.date)}{event.time ? ` · ${event.time}` : ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.7rem', color: 'var(--ink-mid)' }}>
            <span style={{ color: 'var(--ink-muted)', fontSize: '.8rem' }}>📍</span>
            {event.location} · {event.km} km
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '.8rem', borderTop: '1px solid var(--rule)',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '.65rem', letterSpacing: '.05em',
            color: gratuit ? '#166534' : 'var(--ink)',
          }}>
            {event.price || 'Prix à confirmer'}
          </span>
          <span style={{ fontSize: '.85rem', color: 'var(--red)', opacity: 0, transition: 'opacity .15s' }}
            className="card-arrow">→</span>
        </div>
      </div>
    </article>
  )
}
