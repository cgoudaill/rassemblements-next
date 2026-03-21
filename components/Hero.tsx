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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>{`
        .hero-wrap {
          position: relative;
          height: 37vh;
          min-height: 240px;
          overflow: hidden;
          background: #12100e;
        }
        .hero-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 40%;
          opacity: 0;
          transition: opacity 1.2s ease-in-out;
        }
        .hero-slide.active { opacity: 1; }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(18,16,14,.85) 0%, rgba(18,16,14,.25) 55%, transparent 100%);
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem 2.5rem 2rem;
        }
        .hero-eyebrow {
          font-size: .6rem;
          font-weight: 500;
          letter-spacing: .35em;
          text-transform: uppercase;
          color: #c49a30;
          margin-bottom: .5rem;
          display: block;
        }
        .hero-logo-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: .4rem;
        }
        .hero-logo {
          width: 70px;
          height: 70px;
          flex-shrink: 0;
          filter: drop-shadow(0 2px 12px rgba(0,0,0,.7)) brightness(1.2);
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          font-weight: 300;
          font-style: italic;
          color: #f0ece3;
          line-height: 1.1;
          margin: 0;
        }
        .hero-title em {
          font-size: 68%;
          color: #c49a30;
          display: block;
          margin-top: .15rem;
          font-style: italic;
        }
        .hero-sub {
          font-size: .65rem;
          color: rgba(240,236,227,.45);
          letter-spacing: .07em;
          margin-top: .35rem;
        }
        .hero-dots {
          position: absolute;
          bottom: .9rem;
          right: 2rem;
          z-index: 3;
          display: flex;
          gap: .4rem;
        }
        .hero-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(240,236,227,.28);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background .3s, transform .3s;
        }
        .hero-dot.active {
          background: #c49a30;
          transform: scale(1.35);
        }
        .hero-stats {
          position: absolute;
          bottom: 1rem;
          left: 2.5rem;
          z-index: 3;
          display: flex;
          gap: 1.5rem;
        }
        .hero-stat-n {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 300;
          line-height: 1;
          color: #f0ece3;
        }
        .hero-stat-n.moto { color: #d04020; }
        .hero-stat-l {
          font-size: .5rem;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: rgba(240,236,227,.38);
          margin-top: .1rem;
        }
        @media (max-width: 600px) {
          .hero-content { padding: 1rem 1.2rem 1.4rem; }
          .hero-title { font-size: 1.3rem; }
          .hero-logo { width: 48px !important; height: 48px !important; }
          .hero-sub { display: none; }
          .hero-stats { display: none; }
          .hero-eyebrow { display: none; }
        }
      `}</style>

      <header className="hero-wrap">

        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide${i === current ? ' active' : ''}`}
            style={{ backgroundImage: `url('${slide.url}')` }}
          />
        ))}

        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-eyebrow">Belgique &amp; environs · Printemps 2026</span>
          <div className="hero-logo-title">
            <img src="/logo.svg" alt="Where Do We Go" className="hero-logo" />
            <h1 className="hero-title">
              Where Do We Go
              <em>Rassemblements d'ancêtres &amp; sorties moto</em>
            </h1>
          </div>
          <p className="hero-sub">
            Voitures de collection &amp; balades moto organisées · Compilé par Cédric Goudaillier
          </p>
        </div>

        <div className="hero-stats">
          {[
            { n: stats.total, l: 'événements', mo: false },
            { n: stats.cars, l: 'voitures', mo: false },
            { n: stats.motos, l: 'motos', mo: true },
            { n: stats.free, l: 'gratuits', mo: false },
          ].map(({ n, l, mo }) => (
            <div key={l}>
              <div className={`hero-stat-n${mo ? ' moto' : ''}`}>{n}</div>
              <div className="hero-stat-l">{l}</div>
            </div>
          ))}
        </div>

        <div className="hero-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === current ? ' active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

      </header>
    </>
  )
}
