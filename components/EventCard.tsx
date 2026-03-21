import type { RassemblementEvent } from '@/lib/calendar'
import { formatDate, isGratuit } from '@/lib/calendar'

function cleanTitle(t: string) {
  return t.replace(/^[^\w\u00C0-\u024F\s\-\(\)]+\s*/g, '').trim()
}

function getTag(event: RassemblementEvent): { label: string; bg: string; color: string } {
  const title = event.title.toLowerCase()
  const desc = (event.description || '').toLowerCase()
  const isCar = event.type === 'car'

  if (title.includes('rallye') || title.includes('rally'))
    return { label: 'Rallye', bg: '#dbeafe', color: '#1e40af' }
  if (title.includes('bourse'))
    return { label: 'Bourse', bg: '#ede9fe', color: '#5b21b6' }
  if (title.includes('balade') || desc.includes('balade') || desc.includes('roadbook'))
    return { label: 'Balade', bg: '#dcfce7', color: '#166534' }
  if (title.includes('randonnée') || title.includes('rando'))
    return { label: 'Randonnée', bg: '#dcfce7', color: '#166534' }
  if (title.includes('meeting') || title.includes('expo') || title.includes('salon'))
    return { label: 'Exposition', bg: '#fef9c3', color: '#854d0e' }
  if (!isCar)
    return { label: 'Balade moto', bg: '#ffe4e6', color: '#9f1239' }
  return { label: 'Rassemblement', bg: '#fef3c7', color: '#92400e' }
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
  const accentColor = isCar ? '#9a7520' : '#a03010'

  return (
    <article
      onClick={onClick}
      style={{
        background: '#faf7f0',
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform .2s, box-shadow .2s',
        animation: `fadeUp .45s ${Math.min(index * 35, 350)}ms backwards`,
        position: 'relative',
        borderLeft: `3px solid transparent`,
        boxShadow: '0 1px 4px rgba(18,16,14,.07)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = '0 8px 28px rgba(18,16,14,.12)'
        el.style.borderLeftColor = accentColor
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = ''
        el.style.boxShadow = '0 1px 4px rgba(18,16,14,.07)'
        el.style.borderLeftColor = 'transparent'
      }}
    >
      {/* Top color stripe */}
      <div style={{
        height: 2,
        background: isCar
          ? 'linear-gradient(90deg,#9a7520,#c49a30,transparent)'
          : 'linear-gradient(90deg,#a03010,#d04020,transparent)',
      }} />

      {/* Body */}
      <div style={{ padding: '1rem 1.1rem 1rem' }}>

        {/* Meta row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '.5rem',
          marginBottom: '.6rem',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '.57rem',
            fontWeight: 700,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            padding: '.18rem .6rem',
            borderRadius: 2,
            background: tag.bg,
            color: tag.color,
          }}>
            {tag.label}
          </span>
          <span style={{
            fontSize: '.68rem',
            color: '#7a7060',
            fontWeight: 500,
          }}>
            {formatDate(event.date)}{event.time ? ` · ${event.time}` : ''}
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          fontWeight: 400,
          color: '#12100e',
          lineHeight: 1.25,
          marginBottom: '.5rem',
          transition: 'color .2s',
        }}>
          {cleanTitle(event.title)}
        </div>

        {/* Location */}
        <div style={{
          fontSize: '.7rem',
          color: '#7a7060',
          marginBottom: '.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '.3rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#9a7060" style={{ flexShrink: 0 }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          {event.location} · {event.km} km
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem' }}>
          <span style={{
            fontSize: '.65rem',
            fontWeight: 600,
            color: gratuit ? '#166534' : accentColor,
            background: gratuit ? '#dcfce7' : `rgba(${isCar ? '154,117,32' : '160,48,16'},.08)`,
            padding: '.15rem .55rem',
            borderRadius: 2,
            display: 'inline-block',
          }}>
            {event.price || 'Prix à confirmer'}
          </span>
          <span style={{
            fontSize: '.58rem',
            color: 'rgba(122,112,96,.5)',
            letterSpacing: '.05em',
          }}>
            {isCar ? 'Voiture ancêtre' : 'Moto'}
          </span>
        </div>

      </div>
    </article>
  )
}
