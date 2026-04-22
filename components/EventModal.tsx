import type { RassemblementEvent } from '@/lib/calendar'
import { formatDate, isGratuit } from '@/lib/calendar'

interface Props {
  event: RassemblementEvent
  onClose: () => void
}

export default function EventModal({ event, onClose }: Props) {
  const isCar = event.type === 'car'
  const gratuit = isGratuit(event.price)

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(17,16,16,.6)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn .2s ease',
      }}
    >
      <div style={{
        background: '#fff',
        border: '1px solid var(--rule)',
        maxWidth: 560, width: '100%',
        maxHeight: '92vh', overflowY: 'auto',
        position: 'relative',
        animation: 'scaleIn .25s ease',
        boxShadow: '0 24px 64px rgba(17,16,16,.2)',
      }}>
        {/* Bouton fermer */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: '1px solid var(--rule)',
          color: 'var(--ink-muted)', width: 30, height: 30,
          cursor: 'pointer', fontSize: '.85rem', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color .15s, color .15s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ink)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)' }}
        >✕</button>

        {/* En-tête */}
        <div style={{
          padding: '2rem 2rem 1.5rem',
          borderBottom: '1px solid var(--rule)',
          background: isCar ? '#fafaf8' : '#fdf8f7',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.6rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '.3rem',
              fontFamily: 'var(--font-mono)', fontSize: '.54rem',
              letterSpacing: '.18em', textTransform: 'uppercase',
              color: isCar ? 'var(--ink-muted)' : 'var(--red)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: isCar ? 'var(--ink)' : 'var(--red)',
              }} />
              {isCar ? 'Voiture ancienne' : 'Moto'}
            </span>
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '.62rem',
            letterSpacing: '.1em', color: 'var(--ink-muted)',
            marginBottom: '.4rem',
          }}>
            {formatDate(event.date)}{event.time ? ` · ${event.time}` : ''}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem', fontWeight: 700,
            color: 'var(--ink)', lineHeight: 1.15,
          }}>
            {event.title}
          </h2>
        </div>

        {/* Corps */}
        <div style={{ padding: '1.5rem 2rem 2rem' }}>
          {[
            { label: 'Lieu',                   value: event.location },
            event.time ? { label: 'Horaire',   value: event.time } : null,
            { label: 'Prix',                   value: event.price || 'Prix à confirmer' },
            { label: 'Distance depuis Waterloo', value: `${event.km} km` },
            event.description ? { label: 'Détails', value: event.description, pre: true } : null,
          ].filter(Boolean).map((s, i) => s && (
            <div key={i} style={{
              borderTop: i === 0 ? 'none' : '1px solid var(--rule)',
              paddingTop: i === 0 ? 0 : '.75rem',
              marginTop: i === 0 ? 0 : '.75rem',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '.55rem',
                letterSpacing: '.18em', textTransform: 'uppercase',
                color: 'var(--ink-muted)', marginBottom: '.2rem',
              }}>{s.label}</div>
              <div style={{
                fontSize: s.pre ? '.8rem' : '.9rem',
                color: s.pre ? 'var(--ink-mid)' : 'var(--ink)',
                lineHeight: s.pre ? 1.7 : 1.5,
                whiteSpace: s.pre ? 'pre-line' : 'normal',
              }}>{s.value}</div>
            </div>
          ))}

          <a href={event.gcalLink} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '.5rem',
              marginTop: '1.5rem', padding: '.55rem 1.2rem',
              background: isCar ? 'var(--ink)' : 'var(--red)',
              color: '#fff', textDecoration: 'none',
              fontSize: '.75rem', fontWeight: 500,
              letterSpacing: '.07em', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '.85'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            📅 Voir dans Google Calendar
          </a>
        </div>
      </div>
    </div>
  )
}
