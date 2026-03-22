'use client'

import { useState, useMemo, useEffect } from 'react'
import type { RassemblementEvent } from '@/lib/calendar'
import { formatDate, isGratuit } from '@/lib/calendar'
import Hero from './Hero'
import EventCard from './EventCard'
import EventModal from './EventModal'
import MapView from './MapView'

type FilterType = 'all' | 'gratuit' | 'proche' | 'avr' | 'mai'
type TabType = 'all' | 'car' | 'moto'
type SortType = 'date' | 'dist' | 'price'
type ViewType = 'grid' | 'map'

interface Props {
  events: RassemblementEvent[]
  updatedAt: string
}

export default function ClientPage({ events, updatedAt }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [tab, setTab] = useState<TabType>('all')
  const [sort, setSort] = useState<SortType>('date')
  const [view, setView] = useState<ViewType>('grid')
  const [selected, setSelected] = useState<RassemblementEvent | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const stats = useMemo(() => ({
    total: events.length,
    cars: events.filter(e => e.type === 'car').length,
    motos: events.filter(e => e.type === 'moto').length,
    free: events.filter(e => isGratuit(e.price)).length,
  }), [events])

  const filtered = useMemo(() => {
    let result = events.filter(e => {
      const q = search.toLowerCase()
      const matchSearch = !q || [e.title, e.location, e.description, e.price]
        .join(' ').toLowerCase().includes(q)
      let matchFilter = true
      if (filter === 'gratuit') matchFilter = isGratuit(e.price)
      else if (filter === 'proche') matchFilter = e.km <= 50
      else if (filter === 'avr') matchFilter = e.date.startsWith('2026-04')
      else if (filter === 'mai') matchFilter = e.date >= '2026-05-01'
      const matchTab = tab === 'all' || e.type === tab
      return matchSearch && matchFilter && matchTab
    })

    if (sort === 'date') result.sort((a, b) => a.date.localeCompare(b.date))
    else if (sort === 'dist') result.sort((a, b) => a.km - b.km)
    else if (sort === 'price') result.sort((a, b) =>
      (isGratuit(a.price) ? 0 : 1) - (isGratuit(b.price) ? 0 : 1)
    )

    return result
  }, [events, search, filter, tab, sort])

  // Close modal on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const filterCars = filtered.filter(e => e.type === 'car').length
  const filterMotos = filtered.filter(e => e.type === 'moto').length

  return (
    <>
      {/* ── NAV HORIZONTALE ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 300,
        background: 'rgba(18,16,14,.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(154,117,32,.2)',
        padding: '0 2rem',
        height: '3.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        {/* Logo + nom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', flexShrink: 0 }}>
          <img src="/logo.svg" alt="Where Do We Go" style={{ width: 28, height: 28, filter: 'brightness(1.1)' }} />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '.95rem',
            fontStyle: 'italic',
            color: '#f0ece3',
            letterSpacing: '.01em',
            lineHeight: 1,
          }}>
            Where Do We Go
          </span>
        </div>

        {/* Liens centre — masqués sur mobile */}
        <nav style={{
          display: 'flex',
          gap: '0',
          alignItems: 'center',
        }}>
          {[
            { label: '🚗 Voitures', tab: 'car' as TabType },
            { label: '🏍️ Motos', tab: 'moto' as TabType },
          ].map(({ label, tab: t }) => (
            <button
              key={t}
              onClick={() => { setTab(tab === t ? 'all' : t); setView('grid') }}
              style={{
                background: 'none',
                border: 'none',
                color: tab === t ? '#c49a30' : 'rgba(240,236,227,.5)',
                padding: '.3rem 1rem',
                cursor: 'pointer',
                fontSize: '.78rem',
                fontFamily: 'var(--font-body)',
                fontWeight: tab === t ? 500 : 400,
                letterSpacing: '.03em',
                transition: 'color .2s',
                borderBottom: tab === t ? '2px solid #c49a30' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setView('map')}
            style={{
              background: 'none',
              border: 'none',
              color: view === 'map' ? '#c49a30' : 'rgba(240,236,227,.5)',
              padding: '.3rem 1rem',
              cursor: 'pointer',
              fontSize: '.78rem',
              fontFamily: 'var(--font-body)',
              fontWeight: view === 'map' ? 500 : 400,
              letterSpacing: '.03em',
              transition: 'color .2s',
              borderBottom: view === 'map' ? '2px solid #c49a30' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            🗺 Carte
          </button>
        </nav>

        {/* CTA bouton */}
        <button
          onClick={() => {
            setTab('all')
            setFilter('all')
            setView('grid')
            document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' })
          }}
          style={{
            background: 'linear-gradient(135deg, #9a7520, #a03010)',
            border: 'none',
            color: '#f0ece3',
            padding: '.38rem 1rem',
            borderRadius: 3,
            cursor: 'pointer',
            fontSize: '.73rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            letterSpacing: '.04em',
            whiteSpace: 'nowrap',
            transition: 'opacity .2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {stats.total} événements →
        </button>
      </header>

      {/* ── HERO ── */}
      <Hero stats={stats} />

      {/* ── TOOLBAR FILTRES ── */}
      <nav style={{
        background: '#12100e',
        borderBottom: '1px solid rgba(154,117,32,.2)',
        padding: '.7rem 2rem',
        display: 'flex',
        gap: '.6rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'sticky',
        top: '3.2rem',
        zIndex: 200,
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '.65rem', top: '50%',
            transform: 'translateY(-50%)', color: '#9a7520', fontSize: '1rem',
            pointerEvents: 'none',
          }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un événement, une ville..."
            style={{
              width: '100%',
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(154,117,32,.2)',
              color: '#f0ece3',
              padding: '.42rem 1rem .42rem 2rem',
              borderRadius: 2,
              fontSize: '.78rem',
              fontFamily: 'var(--font-body)',
              outline: 'none',
            }}
          />
        </div>

        {/* Type tabs */}
        <div style={{
          display: 'flex', gap: 2,
          background: 'rgba(255,255,255,.04)',
          padding: 3, borderRadius: 3,
          border: '1px solid rgba(154,117,32,.15)',
        }}>
          {(['all', 'car', 'moto'] as TabType[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t
                ? t === 'all' ? 'linear-gradient(135deg,#9a7520,#a03010)'
                  : t === 'car' ? '#9a7520' : '#a03010'
                : 'none',
              border: 'none',
              color: tab === t ? '#f0ece3' : 'rgba(240,236,227,.35)',
              padding: '.28rem .75rem',
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: '.73rem',
              fontFamily: 'var(--font-body)',
              fontWeight: tab === t ? 500 : 400,
              whiteSpace: 'nowrap',
              transition: '.2s',
            }}>
              {t === 'all' ? 'Tous' : t === 'car' ? '🚗 Voitures' : '🏍️ Motos'}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select value={sort} onChange={e => setSort(e.target.value as SortType)} style={{
          background: 'rgba(255,255,255,.06)',
          border: '1px solid rgba(154,117,32,.18)',
          color: 'rgba(240,236,227,.7)',
          padding: '.35rem .72rem',
          borderRadius: 2,
          fontSize: '.73rem',
          fontFamily: 'var(--font-body)',
          outline: 'none',
          cursor: 'pointer',
        }}>
          <option value="date" style={{ background: '#1a1714' }}>Par date</option>
          <option value="dist" style={{ background: '#1a1714' }}>Par distance</option>
          <option value="price" style={{ background: '#1a1714' }}>Par prix</option>
        </select>

        {/* Filters */}
        {(['all', 'gratuit', 'proche', 'avr', 'mai'] as FilterType[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: 'none',
            border: `1px solid ${filter === f ? '#c49a30' : 'rgba(154,117,32,.18)'}`,
            color: filter === f ? '#c49a30' : 'rgba(240,236,227,.35)',
            padding: '.33rem .72rem',
            borderRadius: 2,
            cursor: 'pointer',
            fontSize: '.72rem',
            fontFamily: 'var(--font-body)',
            transition: '.2s',
            whiteSpace: 'nowrap',
          }}>
            {f === 'all' ? 'Tous' : f === 'gratuit' ? 'Gratuits'
              : f === 'proche' ? '≤ 50 km' : f === 'avr' ? 'Avril' : 'Mai +'}
          </button>
        ))}

        {/* View toggle */}
        <div style={{
          display: 'flex', gap: 2,
          background: 'rgba(255,255,255,.04)',
          padding: 3, borderRadius: 3,
          border: '1px solid rgba(154,117,32,.15)',
        }}>
          {(['grid', 'map'] as ViewType[]).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? '#9a7520' : 'none',
              border: 'none',
              color: view === v ? '#f0ece3' : 'rgba(240,236,227,.35)',
              padding: '.26rem .52rem',
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: '.85rem',
              transition: '.2s',
            }}>
              {v === 'grid' ? '⊞' : '◉'}
            </button>
          ))}
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{
        padding: 'clamp(.75rem, 3vw, 1.75rem) clamp(.75rem, 3vw, 2rem)',
        maxWidth: 1380,
        margin: '0 auto',
      }}>
        {/* Results info */}
        <p style={{
          fontSize: '.72rem', color: '#7a7060',
          marginBottom: '1.2rem', paddingBottom: '.7rem',
          borderBottom: '1px solid #ccc0a0',
          letterSpacing: '.04em',
        }}>
          {filtered.length} événement{filtered.length > 1 ? 's' : ''} · {filterCars} voiture{filterCars > 1 ? 's' : ''} · {filterMotos} moto{filterMotos > 1 ? 's' : ''}
        </p>

        {/* Map view */}
        {view === 'map' && (
          <MapView events={filtered} onSelect={setSelected} />
        )}

        {/* Grid view */}
        {view === 'grid' && (
          <>
            {filtered.length === 0 && (
              <p style={{
                textAlign: 'center', padding: '4rem 2rem',
                color: '#7a7060', fontFamily: 'var(--font-display)',
                fontSize: '1.3rem', fontStyle: 'italic',
              }}>
                Aucun événement ne correspond à votre recherche.
              </p>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(305px, 100%), 1fr))',
              gap: '1.1rem',
            }}>
              {filtered.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={i}
                  onClick={() => setSelected(event)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        textAlign: 'center',
        padding: '1.75rem 2rem',
        color: '#7a7060',
        fontSize: '.68rem',
        borderTop: '1px solid #ccc0a0',
        marginTop: '2rem',
        letterSpacing: '.06em',
        lineHeight: 1.8,
      }}>
        <strong style={{ color: '#2a2520', fontWeight: 500 }}>Cédric Goudaillier</strong>
        {' '}· Waterloo, Belgique<br />
        Agenda mis à jour automatiquement · Dernière synchronisation : {updatedAt}<br />
        Sources : Google Calendar &quot;Rassemblement ancetres&quot; &amp; &quot;Rassemblements motos&quot;
      </footer>

      {/* ── MODAL ── */}
      {selected && (
        <EventModal
          event={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
