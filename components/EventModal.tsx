import type { RassemblementEvent } from '@/lib/calendar'
import { formatDate, isGratuit } from '@/lib/calendar'

const CarSVGLarge = () => (
  <svg width="200" height="110" viewBox="0 0 88 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 34 L18 18 Q20 14 25 14 L63 14 Q68 14 70 18 L80 34 Q83 35 83 38 L83 44 Q83 46 81 46 L74 46 Q72 46 72 44 L72 40 L16 40 L16 44 Q16 46 14 46 L7 46 Q5 46 5 44 L5 38 Q5 35 8 34Z"
      fill="rgba(154,117,32,.2)" stroke="rgba(154,117,32,.6)" strokeWidth="1.5"/>
    <circle cx="22" cy="41" r="7" fill="rgba(154,117,32,.15)" stroke="rgba(154,117,32,.55)" strokeWidth="1.5"/>
    <circle cx="22" cy="41" r="3.5" fill="rgba(154,117,32,.35)"/>
    <circle cx="66" cy="41" r="7" fill="rgba(154,117,32,.15)" stroke="rgba(154,117,32,.55)" strokeWidth="1.5"/>
    <circle cx="66" cy="41" r="3.5" fill="rgba(154,117,32,.35)"/>
    <path d="M26 14 L32 22 L56 22 L62 14" stroke="rgba(154,117,32,.45)" strokeWidth="1" fill="none"/>
    <path d="M36 22 L38 14" stroke="rgba(154,117,32,.3)" strokeWidth="1"/>
    <path d="M50 22 L52 14" stroke="rgba(154,117,32,.3)" strokeWidth="1"/>
  </svg>
)

const MotoSVGLarge = () => (
  <svg width="160" height="100" viewBox="0 0 72 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="40" r="9" fill="rgba(160,48,16,.12)" stroke="rgba(160,48,16,.55)" strokeWidth="1.5"/>
    <circle cx="18" cy="40" r="4" fill="rgba(160,48,16,.35)"/>
    <circle cx="54" cy="40" r="9" fill="rgba(160,48,16,.12)" stroke="rgba(160,48,16,.55)" strokeWidth="1.5"/>
    <circle cx="54" cy="40" r="4" fill="rgba(160,48,16,.35)"/>
    <path d="M18 31 L18 22 Q18 18 22 16 L38 12 Q44 10 48 14 L58 24 Q62 28 60 32 L54 32 L18 31Z"
      fill="rgba(160,48,16,.18)" stroke="rgba(160,48,16,.55)" strokeWidth="1.5"/>
    <path d="M18 31 L54 32" stroke="rgba(160,48,16,.45)" strokeWidth="1.5"/>
    <path d="M38 12 L40 31" stroke="rgba(160,48,16,.3)" strokeWidth="1"/>
    <path d="M52 18 L58 24" stroke="rgba(160,48,16,.4)" strokeWidth="1.2"/>
  </svg>
)

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
        background: 'rgba(12,10,8,.75)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn .2s ease',
      }}
    >
      <div style={{
        background: '#faf7f0',
        border: '1px solid #ccc0a0',
        borderRadius: 4,
        maxWidth: 580,
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        position: 'relative',
        animation: 'scaleIn .28s ease',
        boxShadow: '0 24px 64px rgba(12,10,8,.35)',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '.85rem', right: '.85rem',
          background: 'rgba(12,10,8,.55)', border: 'none',
          color: '#f0ece3', width: 30, height: 30,
          borderRadius: '50%', cursor: 'pointer',
          fontSize: '.85rem', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        {/* Icon header */}
        <div style={{
          height: 210,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: isCar
            ? 'linear-gradient(145deg,#f5eed5,#e8dbb8,#d4c48a)'
            : 'linear-gradient(145deg,#f5ded5,#e8c4b0,#d4906a)',
        }}>
          {isCar ? <CarSVGLarge /> : <MotoSVGLarge />}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 50%, rgba(12,10,8,.4) 100%)',
          }} />
        </div>

        {/* Color stripe */}
        <div style={{
          height: 3,
          background: isCar
            ? 'linear-gradient(90deg,#9a7520,#c49a30,transparent)'
            : 'linear-gradient(90deg,#a03010,#d04020,transparent)',
        }} />

        {/* Content */}
        <div style={{ padding: '1.4rem 1.65rem 1.7rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '.3rem',
            fontSize: '.62rem', fontWeight: 500, letterSpacing: '.13em',
            textTransform: 'uppercase', padding: '.14rem .58rem', borderRadius: 2,
            marginBottom: '.5rem',
            background: isCar ? '#f2e4b8' : '#f5ddd5',
            color: isCar ? '#9a7520' : '#a03010',
            border: `1px solid ${isCar ? 'rgba(154,117,32,.2)' : 'rgba(160,48,16,.2)'}`,
          }}>
            {isCar ? '🚗 Voiture ancêtre' : '🏍️ Moto'}
          </div>

          <div style={{ fontSize: '.72rem', color: '#7a7060', marginBottom: '.4rem', letterSpacing: '.04em' }}>
            {formatDate(event.date)}{event.time ? ` · ${event.time}` : ''}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.65rem', fontWeight: 300,
            color: '#12100e', lineHeight: 1.2, marginBottom: '1rem',
          }}>
            {event.title}
          </h2>

          {/* Sections */}
          {[
            { label: '📍 Lieu', value: event.location },
            event.time ? { label: '🕐 Horaire', value: event.time } : null,
            { label: '💶 Prix', value: event.price },
            { label: '📏 Distance depuis Waterloo', value: `${event.km} km` },
            event.description ? { label: 'ℹ️ Détails', value: event.description, pre: true } : null,
          ].filter(Boolean).map((section, i) => section && (
            <div key={i} style={{
              borderTop: '1px solid #ccc0a0',
              paddingTop: '.65rem', marginTop: '.65rem',
            }}>
              <div style={{
                fontSize: '.6rem', textTransform: 'uppercase',
                letterSpacing: '.13em', color: '#7a7060', marginBottom: '.2rem',
              }}>
                {section.label}
              </div>
              <div style={{
                fontSize: section.pre ? '.8rem' : '.86rem',
                color: section.pre ? '#7a7060' : '#2a2520',
                lineHeight: section.pre ? 1.7 : 1.55,
                whiteSpace: section.pre ? 'pre-line' : 'normal',
              }}>
                {section.value}
              </div>
            </div>
          ))}

          {/* CTA */}
          <a
            href={event.gcalLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '.5rem',
              padding: '.58rem 1.15rem', borderRadius: 2,
              textDecoration: 'none', fontSize: '.78rem', fontWeight: 500,
              marginTop: '1rem', letterSpacing: '.04em',
              background: isCar ? '#9a7520' : '#a03010',
              color: isCar ? '#f5eed8' : '#fde8de',
              transition: '.18s',
            }}
          >
            📅 Voir dans Google Calendar
          </a>
        </div>
      </div>
    </div>
  )
}
