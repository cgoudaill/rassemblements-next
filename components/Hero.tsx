'use client'

import { useEffect, useState } from 'react'

interface Stats {
  total: number
  cars: number
  motos: number
  free: number
}

const SLIDES = [
  '/banner2.jpg',
  '/banner1.jpg',
  '/banner3.jpg',
  '/banner5.jpg',
  '/banner6.jpg',
  '/banner4.jpg',
]

export default function Hero({ stats }: { stats: Stats }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      borderBottom: '1px solid var(--rule)',
      minHeight: 520,
    }}>
      <style>{`
        .hs { position: absolute; inset: 0; background-size: cover; background-position: center 35%; opacity: 0; transition: opacity 1.4s ease-in-out; }
        .hs.on { opacity: 1; }
        @media (max-width: 700px) {
          .hero-split { grid-template-columns: 1fr !important; }
          .hero-photo { display: none !important; }
        }
      `}</style>

      {/* Gauche — texte */}
      <div style={{
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)',
        borderRight: '1px solid var(--rule)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '.6rem', letterSpacing: '.28em',
            textTransform: 'uppercase', color: 'var(--red)',
            marginBottom: '1.5rem',
          }}>
            Belgique &amp; environs · Printemps 2026
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)',
            fontWeight: 900, lineHeight: .95,
            color: 'var(--ink)',
            marginBottom: '1.5rem',
          }}>
            Rassem-<br />ble&shy;ments<br />
            <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>&amp; sorties.</em>
          </h1>

          <p style={{
            fontSize: '.9rem', color: 'var(--ink-mid)',
            maxWidth: 420, lineHeight: 1.75,
            borderLeft: '3px solid var(--red)',
            paddingLeft: '1rem',
            marginBottom: '2.5rem',
          }}>
            Voitures de collection et balades moto organisées en Belgique
            et dans les environs. Compilé par Cédric Goudaillier.
          </p>
        </div>

        <div style={{
          display: 'flex', gap: '2.5rem',
          borderTop: '1px solid var(--rule)',
          paddingTop: '1.5rem',
        }}>
          {[
            { n: stats.total, l: 'Événements' },
            { n: stats.cars,  l: 'Voitures' },
            { n: stats.motos, l: 'Motos', accent: true },
            { n: stats.free,  l: 'Gratuits' },
          ].map(({ n, l, accent }) => (
            <div key={l}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.8rem', fontWeight: 700, lineHeight: 1,
                color: accent ? 'var(--red)' : 'var(--ink)',
              }}>{n}</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '.52rem', letterSpacing: '.2em',
                textTransform: 'uppercase', color: 'var(--ink-muted)',
                marginTop: '.25rem',
              }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Droite — diaporama */}
      <div className="hero-photo" style={{ position: 'relative', overflow: 'hidden', background: '#111' }}>
        {SLIDES.map((src, i) => (
          <div key={src} className={`hs${i === current ? ' on' : ''}`}
            style={{ backgroundImage: `url('${src}')` }} />
        ))}
        <div style={{
          position: 'absolute', bottom: '1.5rem', right: '1.5rem',
          background: '#fff', padding: '.4rem .75rem',
          fontFamily: 'var(--font-mono)', fontSize: '.55rem',
          letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink)',
        }}>
          Belgique &amp; environs
        </div>
        {/* Dots */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', display: 'flex', gap: '.4rem' }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: 6, height: 6, borderRadius: '50%', border: 'none', padding: 0,
              background: i === current ? '#fff' : 'rgba(255,255,255,.35)',
              cursor: 'pointer', transition: 'background .3s',
            }} />
          ))}
        </div>
      </div>
    </section>
  )
}
