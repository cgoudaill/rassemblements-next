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
    <section style={{ position: 'relative', height: '58vh', minHeight: 380, overflow: 'hidden' }}>
      <style>{`
        .hs { position: absolute; inset: 0; background-size: cover; background-position: center 35%; opacity: 0; transition: opacity 1.4s ease-in-out; }
        .hs.on { opacity: 1; }
        .hero-dot2 { width: 7px; height: 7px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.55); background: transparent; cursor: pointer; padding: 0; transition: background .3s; }
        .hero-dot2.on { background: #fff; border-color: #fff; }
      `}</style>

      {SLIDES.map((src, i) => (
        <div key={src} className={`hs${i === current ? ' on' : ''}`}
          style={{ backgroundImage: `url('${src}')` }} />
      ))}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(10,8,6,.1) 0%, rgba(10,8,6,.45) 55%, rgba(10,8,6,.82) 100%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 2, height: '100%',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 3.5rem 3.5rem',
        maxWidth: 900,
      }}>
        <span style={{
          fontSize: '.58rem', fontWeight: 600, letterSpacing: '.42em',
          textTransform: 'uppercase', color: '#c49a30',
          marginBottom: '.8rem', display: 'block',
        }}>
          Belgique &amp; environs · Printemps 2026
        </span>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
          fontWeight: 300, fontStyle: 'italic',
          color: '#fff', lineHeight: 1.07, margin: '0 0 .6rem',
          textShadow: '0 2px 24px rgba(0,0,0,.35)',
        }}>
          Rassemblements<br />d'ancêtres &amp; sorties moto.
        </h1>

        <p style={{
          fontSize: '.83rem', color: 'rgba(255,255,255,.6)',
          margin: '0 0 1.8rem', letterSpacing: '.02em', lineHeight: 1.65,
        }}>
          Voitures de collection et balades moto organisées en Belgique
          et dans les environs. Compilé par Cédric Goudaillier.
        </p>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[
            { n: stats.total, l: 'événements' },
            { n: stats.cars, l: 'voitures' },
            { n: stats.motos, l: 'motos', accent: true },
            { n: stats.free, l: 'gratuits' },
          ].map(({ n, l, accent }) => (
            <div key={l}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.55rem', fontWeight: 300, lineHeight: 1,
                color: accent ? '#d04020' : '#fff',
              }}>{n}</div>
              <div style={{
                fontSize: '.46rem', textTransform: 'uppercase',
                letterSpacing: '.15em', color: 'rgba(255,255,255,.38)',
                marginTop: '.18rem',
              }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '1.5rem', right: '2.5rem',
        zIndex: 3, display: 'flex', gap: '.45rem',
      }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`hero-dot2${i === current ? ' on' : ''}`} />
        ))}
      </div>
    </section>
  )
}
