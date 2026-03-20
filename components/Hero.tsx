'use client'

import { useState, useEffect } from 'react'

const SLIDES = [
  { url: '/banner2.jpg', label: 'Roadster bleu' },
  { url: '/banner1.jpg', label: 'Capot ancêtre' },
  { url: '/banner3.jpg', label: 'BMW R nineT' },
  { url: '/banner5.jpg', label: 'Motos en balade' },
  { url: '/banner6.jpg', label: 'BMW R nineT garage' },
  { url: '/banner4.jpg', label: 'Détail moto' },
]

interface Props {
  stats: { total: number; cars: number; motos: number; free: number }
}

export default function Hero({ stats }: Props) {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % SLIDES.length)
        setVisible(true)
      }, 600)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .hero-stats-desktop { display: none !important; }
          .hero-stats-mobile { display: flex !important; }
          .hero-content { padding: 1.2rem 1.2rem 1.5rem !important; }
          .hero-subtitle { display: none !important; }
          .hero-logo { width: 90px !important; height: 90px !important; }
        }
        @media (min-width: 601px) {
          .hero-stats-mobile { display: none !important; }
        }
      `}</style>
      <header style={{ position: 'relative', height: 400, overflow: 'hidden', background: '#12100e' }}>

        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${SLIDES[current].url}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: visible ? .42 : 0,
          transition: 'opacity .8s ease',
        }} />

        {/* Gradient vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(12,10,8,.88) 0%, rgba(12,10,8,.2) 60%, transparent 100%)',
        }} />

        {/* Grain overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: .04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Slide indicator dots */}
        <div style={{
          position: 'absolute', bottom: '1.2rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: '.4rem', zIndex: 2,
        }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current ? '#c49a30' : 'rgba(240,236,227,.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all .3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="hero-content" style={{
          position: 'relative', zIndex: 2,
          padding: '2rem 2.5rem 3.5rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
          {/* Logo + Titre côte à côte */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            marginBottom: '.75rem',
            animation: 'fadeUp .7s .05s backwards',
          }}>
            <img
              src="/logo.svg"
              alt="Where Do We Go"
              className="hero-logo"
              style={{
                width: 'clamp(160px, 22vw, 280px)',
                height: 'clamp(160px, 22vw, 280px)',
                flexShrink: 0,
                opacity: 1,
                filter: 'drop-shadow(0 2px 20px rgba(0,0,0,.8)) brightness(1.25)',
              }}
            />
            <div>
              <p style={{
                fontSize: '.62rem', letterSpacing: '.3em',
                textTransform: 'uppercase', color: '#c49a30',
                marginBottom: '.4rem', margin: '0 0 .4rem',
              }}>
                Belgique &amp; environs
              </p>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 4.5vw, 2.8rem)',
                fontWeight: 300,
                color: '#f0ece3',
                lineHeight: 1.05,
                margin: 0,
              }}>
                Where Do We Go<br />
                <em style={{ fontStyle: 'italic', color: '#c49a30', fontSize: '75%' }}>Rassemblements d'ancêtres &amp; sorties moto</em>
              </h1>
            </div>
          </div>

          <div style={{
            width: 48, height: 1,
            background: '#c49a30',
            margin: '.6rem 0',
            animation: 'slideWidth .7s .45s backwards',
          }} />

          <p className="hero-subtitle" style={{
            fontSize: '.72rem', color: 'rgba(240,236,227,.5)',
            letterSpacing: '.1em',
            animation: 'fadeUp .7s .55s backwards',
          }}>
            Voitures de collection &amp; balades moto organisées · Compilé par Cédric Goudaillier
          </p>

          {/* Stats mobile — inline sous le titre */}
          <div className="hero-stats-mobile" style={{
            display: 'none',
            gap: '1.2rem',
            marginTop: '.5rem',
            animation: 'fadeUp .7s .65s backwards',
          }}>
            {[
              { n: stats.total, l: 'évts' },
              { n: stats.cars, l: '🚗' },
              { n: stats.motos, l: '🏍️', mo: true },
              { n: stats.free, l: 'gratuits' },
            ].map(({ n, l, mo }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 300,
                  lineHeight: 1,
                  color: (mo as boolean) ? '#d04020' : '#f0ece3',
                }}>{n}</div>
                <div style={{
                  fontSize: '.52rem', textTransform: 'uppercase',
                  letterSpacing: '.1em', color: 'rgba(240,236,227,.4)',
                  marginTop: '.1rem',
                }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats desktop — position absolue en bas à droite */}
        <div className="hero-stats-desktop" style={{
          position: 'absolute', bottom: '2rem', right: '2.5rem',
          zIndex: 2, display: 'flex', gap: '2rem',
          animation: 'fadeUp .7s .65s backwards',
        }}>
          {[
            { n: stats.total, l: 'événements' },
            { n: stats.cars, l: '🚗 voitures' },
            { n: stats.motos, l: '🏍️ motos', mo: true },
            { n: stats.free, l: 'gratuits' },
          ].map(({ n, l, mo }) => (
            <div key={l} style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.9rem',
                fontWeight: 300,
                lineHeight: 1,
                color: (mo as boolean) ? '#d04020' : '#f0ece3',
              }}>{n}</div>
              <div style={{
                fontSize: '.58rem', textTransform: 'uppercase',
                letterSpacing: '.15em', color: 'rgba(240,236,227,.4)',
                marginTop: '.1rem',
              }}>{l}</div>
            </div>
          ))}
        </div>
      </header>
    </>
  )
}
