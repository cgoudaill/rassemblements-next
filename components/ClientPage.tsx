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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const filterCars = filtered.filter(e => e.type === 'car').length
  const filterMotos = filtered.filter(e => e.type === 'moto').length

  const NAV_H = '3.6rem'

  return (
    <>
      <style>{`
        .nav-link {
          background: none; border: none; border-bottom: 2px solid transparent;
          color: #5a5040; padding: .3rem .9rem; cursor: pointer;
          font-size: .8rem; font-family: var(--font-body); font-weight: 400;
          letter-spacing: .04em; transition: color .2s, border-color .2s;
          margin-bottom: -1px;
        }
        .nav-link:hover { color: #2a2010; }
        .nav-link.active { color: #9a7520; border-bottom-color: #9a7520; font-weight: 500; }
        .cta-btn {
          background: #9a7520; border: none; color: #fff;
          padding: .42rem 1.1rem; border-radius: 4px; cursor: pointer;
          font-size: .75rem; font-family: var(--font-body); font-weight: 500;
          letter-spacing: .04em; transition: background .2s, transform .1s;
        }
        .cta-btn:hover { background: #7a5e18; transform: translateY(-1px); }
        .filter-pill {
          background: none;
          border: 1px solid #d4c4a0;
          color: #7a6a50; padding: .32rem .8rem; border-radius: 20px;
          cursor: pointer; font-size: .72rem; font-family: var(--font-body);
          transition: all .2s; white-space: nowrap;
        }
        .filter-pill:hover { border-color: #9a7520; color: #9a7520; }
        .filter-pill.active { background: #9a7520; border-color: #9a7520; color: #fff; font-weight: 500; }
        .filter-pill.moto.active { background: #a03010; border-color: #a03010; }
        .search-input {
          width: 100%; background: #fff;
          border: 1px solid #ddd4c0; color: #2a2010;
          padding: .5rem 1rem .5rem 2.2rem;
          border-radius: 4px; font-size: .78rem;
          font-family: var(--font-body); outline: none;
          transition: border-color .2s;
        }
        .search-input:focus { border-color: #9a7520; }
        .sort-select {
          background: #fff; border: 1px solid #ddd4c0;
          color: #5a5040; padding: .42rem .8rem;
          border-radius: 4px; font-size: .73rem;
          font-family: var(--font-body); outline: none; cursor: pointer;
        }
        @media (max-width: 640px) {
          .nav-links { display: none !important; }
          .hero-stats-row { display: none !important; }
        }
      `}</style>

      {/* ── NAV CLAIRE ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 300,
        background: 'rgba(248,244,236,.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e0d4b8',
        padding: '0 2.5rem',
        height: NAV_H,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '1rem',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flexShrink: 0 }}>
          <img src="/logo.svg" alt="Where Do We Go"
            style={{ width: 30, height: 30 }} />
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: '.95rem', color: '#2a2010', lineHeight: 1,
            }}>Where Do We Go</div>
            <div style={{
              fontSize: '.52rem', letterSpacing: '.18em',
              textTransform: 'uppercase', color: '#9a7520', lineHeight: 1,
              marginTop: '.15rem',
            }}>Belgique &amp; environs</div>
          </div>
        </div>

        {/* Liens centre */}
        <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <button className={`nav-link${tab === 'car' ? ' active' : ''}`}
            onClick={() => { setTab(tab === 'car' ? 'all' : 'car'); setView('grid') }}>
            Voitures anciennes
          </button>
          <button className={`nav-link${tab === 'moto' ? ' active' : ''}`}
            onClick={() => { setTab(tab === 'moto' ? 'all' : 'moto'); setView('grid') }}>
            Balades moto
          </button>
          <button className={`nav-link${view === 'map' ? ' active' : ''}`}
            onClick={() => setView('map')}>
            Carte
          </button>
          <button className="nav-link">À propos</button>
        </nav>

        {/* CTA */}
        <button className="cta-btn"
          onClick={() => {
            setTab('all'); setFilter('all'); setView('grid')
            document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' })
          }}>
          Voir les événements
        </button>
      </header>

      {/* ── HERO ── */}
      <Hero stats={stats} />

      {/* ── BARRE FILTRES CLAIRE ── */}
      <div style={{
        background: '#f8f4ec',
        borderBottom: '1px solid #e0d4b8',
        padding: '.85rem 2.5rem',
        position: 'sticky',
        top: NAV_H,
        zIndex: 200,
      }}>
        {/* Ligne 1 : recherche + tri + vue */}
        <div style={{
          display: 'flex', gap: '.75rem', alignItems: 'center',
          marginBottom: '.65rem', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <span style={{
              position: 'absolute', left: '.7rem', top: '50%',
              transform: 'translateY(-50%)', color: '#9a7520',
              fontSize: '.9rem', pointerEvents: 'none',
            }}>⌕</span>
            <input className="search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un événement, une ville..." />
          </div>
          <select className="sort-select" value={sort}
            onChange={e => setSort(e.target.value as SortType)}>
            <option value="date">Par date</option>
            <option value="dist">Par distance</option>
            <option value="price">Par prix</option>
          </select>
          {/* Vue */}
          <div style={{ display: 'flex', gap: 3 }}>
            {(['grid', 'map'] as ViewType[]).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? '#9a7520' : '#fff',
                border: '1px solid ' + (view === v ? '#9a7520' : '#ddd4c0'),
                color: view === v ? '#fff' : '#7a6a50',
                padding: '.38rem .55rem', borderRadius: 4,
                cursor: 'pointer', fontSize: '.85rem', transition: '.2s',
              }}>{v === 'grid' ? '⊞' : '◉'}</button>
            ))}
          </div>
        </div>

        {/* Ligne 2 : pills */}
        <div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className={`filter-pill${tab === 'all' ? ' active' : ''}`}
            onClick={() => setTab('all')}>Tous</button>
          <button className={`filter-pill${tab === 'car' ? ' active' : ''}`}
            onClick={() => setTab(tab === 'car' ? 'all' : 'car')}>🚗 Voitures</button>
          <button className={`filter-pill moto${tab === 'moto' ? ' active' : ''}`}
            onClick={() => setTab(tab === 'moto' ? 'all' : 'moto')}>🏍️ Motos</button>
          <div style={{ width: 1, height: 16, background: '#d4c4a0', margin: '0 .2rem' }} />
          {(['all', 'gratuit', 'proche', 'avr', 'mai'] as FilterType[]).map(f => (
            <button key={f} className={`filter-pill${filter === f && f !== 'all' ? ' active' : ''}`}
              onClick={() => setFilter(f === filter ? 'all' : f)}>
              {f === 'all' ? 'Tous' : f === 'gratuit' ? 'Gratuits'
                : f === 'proche' ? '≤ 50 km' : f === 'avr' ? 'Avril' : 'Mai +'}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <main style={{
        padding: 'clamp(.75rem, 3vw, 2rem) clamp(.75rem, 3vw, 2.5rem)',
        maxWidth: 1400, margin: '0 auto',
      }}>
        <p style={{
          fontSize: '.72rem', color: '#9a8a70',
          marginBottom: '1.4rem', paddingBottom: '.8rem',
          borderBottom: '1px solid #e0d4b8', letterSpacing: '.04em',
        }}>
          {filtered.length} événement{filtered.length > 1 ? 's' : ''} · {filterCars} voiture{filterCars > 1 ? 's' : ''} · {filterMotos} moto{filterMotos > 1 ? 's' : ''}
        </p>

        {view === 'map' && <MapView events={filtered} onSelect={setSelected} />}

        {view === 'grid' && (
          <>
            {filtered.length === 0 && (
              <p style={{
                textAlign: 'center', padding: '4rem 2rem',
                color: '#9a8a70', fontFamily: 'var(--font-display)',
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
                <EventCard key={event.id} event={event} index={i}
                  onClick={() => setSelected(event)} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        textAlign: 'center', padding: '2rem',
        color: '#9a8a70', fontSize: '.68rem',
        borderTop: '1px solid #e0d4b8', marginTop: '2rem',
        letterSpacing: '.06em', lineHeight: 1.8,
        background: '#f8f4ec',
      }}>
        <strong style={{ color: '#5a4a30', fontWeight: 500 }}>Cédric Goudaillier</strong>
        {' '}· Waterloo, Belgique<br />
        Agenda mis à jour automatiquement · Dernière synchronisation : {updatedAt}<br />
        Sources : Google Calendar &quot;Rassemblement ancetres&quot; &amp; &quot;Rassemblements motos&quot;
      </footer>

      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
