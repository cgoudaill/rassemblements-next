import type { RassemblementEvent } from '@/lib/calendar'
import { formatDate, isGratuit } from '@/lib/calendar'

function cleanTitle(t: string) {
  return t.replace(/^[^\w\u00C0-\u024F\s\-\(\)]+\s*/g, '').trim()
}

const CarSVG = () => (
  <svg width="88" height="52" viewBox="0 0 88 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 34 L18 18 Q20 14 25 14 L63 14 Q68 14 70 18 L80 34 Q83 35 83 38 L83 44 Q83 46 81 46 L74 46 Q72 46 72 44 L72 40 L16 40 L16 44 Q16 46 14 46 L7 46 Q5 46 5 44 L5 38 Q5 35 8 34Z"
      fill="rgba(154,117,32,.18)" stroke="rgba(154,117,32,.55)" strokeWidth="1.5"/>
    <circle cx="22" cy="41" r="7" fill="rgba(154,117,32,.12)" stroke="rgba(154,117,32,.5)" strokeWidth="1.5"/>
    <circle cx="22" cy="41" r="3.5" fill="rgba(154,117,32,.3)"/>
    <circle cx="66" cy="41" r="7" fill="rgba(154,117,32,.12)" stroke="rgba(154,117,32,.5)" strokeWidth="1.5"/>
    <circle cx="66" cy="41" r="3.5" fill="rgba(154,117,32,.3)"/>
    <path d="M26 14 L32 22 L56 22 L62 14" stroke="rgba(154,117,32,.4)" strokeWidth="1" fill="none"/>
    <path d="M36 22 L38 14" stroke="rgba(154,117,32,.3)" strokeWidth="1"/>
    <path d="M50 22 L52 14" stroke="rgba(154,117,32,.3)" strokeWidth="1"/>
  </svg>
)

const MotoSVG = () => (
  <svg width="72" height="52" viewBox="0 0 72 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="40" r="9" fill="rgba(160,48,16,.1)" stroke="rgba(160,48,16,.5)" strokeWidth="1.5"/>
    <circle cx="18" cy="40" r="4" fill="rgba(160,48,16,.3)"/>
    <circle cx="54" cy="40" r="9" fill="rgba(160,48,16,.1)" stroke="rgba(160,48,16,.5)" strokeWidth="1.5"/>
    <circle cx="54" cy="40" r="4" fill="rgba(160,48,16,.3)"/>
    <path d="M18 31 L18 22 Q18 18 22 16 L38 12 Q44 10 48 14 L58 24 Q62 28 60 32 L54 32 L18 31Z"
      fill="rgba(160,48,16,.15)" stroke="rgba(160,48,16,.5)" strokeWidth="1.5"/>
    <path d="M18 31 L54 32" stroke="rgba(160,48,16,.4)" strokeWidth="1.5"/>
    <path d="M38 12 L40 31" stroke="rgba(160,48,16,.3)" strokeWidth="1"/>
    <path d="M52 18 L58 24" stroke="rgba(160,48,16,.35)" strokeWidth="1.2"/>
  </svg>
)

interface Props {
  event: RassemblementEvent
  index: number
  onClick: () => void
}

export default function EventCard({ event, index, onClick }: Props) {
  const isCar = event.type === 'car'
  const gratuit = isGratuit(event.price)

  return (
    <article
      onClick={onClick}
      style={{
        background: '#faf7f0',
        border: '1px solid #ccc0a0',
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform .22s, box-shadow .22s, border-color .22s',
        animation: `fadeUp .45s ${Math.min(index * 35, 350)}ms backwards`,
        position: 'relative',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-5px)'
        el.style.boxShadow = '0 14px 36px rgba(18,16,14,.12)'
        el.style.borderColor = isCar ? '#9a7520' : '#a03010'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = ''
        el.style.boxShadow = ''
        el.style.borderColor = '#ccc0a0'
      }}
    >
      {/* Icon zone */}
      <div style={{
        height: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: isCar
          ? 'linear-gradient(145deg,#f5eed5 0%,#e8dbb8 50%,#d4c48a 100%)'
          : 'linear-gradient(145deg,#f5ded5 0%,#e8c4b0 50%,#d4906a 100%)',
        transition: 'background .3s',
      }}>
        <div style={{ transition: 'transform .4s cubic-bezier(.34,1.56,.64,1)' }}>
          {isCar ? <CarSVG /> : <MotoSVG />}
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 30%, rgba(18,16,14,.15) 100%)',
        }} />
        {/* Type badge */}
        <div style={{
          position: 'absolute', top: '.6rem', left: '.6rem',
          fontSize: '.58rem', fontWeight: 500, letterSpacing: '.12em',
          textTransform: 'uppercase', padding: '.15rem .5rem', borderRadius: 2,
          background: isCar ? 'rgba(154,117,32,.85)' : 'rgba(160,48,16,.85)',
          color: isCar ? '#f5eed8' : '#fde8de',
          backdropFilter: 'blur(6px)',
        }}>
          {isCar ? 'Voiture ancêtre' : 'Moto'}
        </div>
        {/* Distance badge */}
        <div style={{
          position: 'absolute', bottom: '.6rem', right: '.6rem',
          fontSize: '.62rem', color: 'rgba(240,236,227,.85)',
          background: 'rgba(18,16,14,.5)', padding: '.12rem .42rem',
          borderRadius: 2, backdropFilter: 'blur(4px)',
        }}>
          {event.km} km
        </div>
      </div>

      {/* Color stripe */}
      <div style={{
        height: 2,
        background: isCar
          ? 'linear-gradient(90deg,#9a7520,#c49a30,transparent)'
          : 'linear-gradient(90deg,#a03010,#d04020,transparent)',
      }} />

      {/* Body */}
      <div style={{ padding: '.9rem 1rem .95rem' }}>
        <div style={{ fontSize: '.66rem', color: '#7a7060', letterSpacing: '.05em', marginBottom: '.3rem' }}>
          {formatDate(event.date)}{event.time ? ` · ${event.time}` : ''}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.05rem',
          fontWeight: 400,
          color: '#12100e',
          lineHeight: 1.3,
          marginBottom: '.35rem',
        }}>
          {cleanTitle(event.title)}
        </div>
        <div style={{
          fontSize: '.7rem', color: '#7a7060', marginBottom: '.6rem',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          📍 {event.location}
        </div>
        <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '.63rem', padding: '.14rem .48rem', borderRadius: 2,
            background: gratuit ? '#e4efe6' : '#f2e4e0',
            color: gratuit ? '#2d6b3a' : '#8a2c20',
            border: `1px solid ${gratuit ? '#b8d8bc' : '#dbb8b0'}`,
          }}>
            {event.price}
          </span>
        </div>
      </div>
    </article>
  )
}
