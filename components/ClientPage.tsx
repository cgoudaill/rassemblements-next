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
  const NAV_H = '3.8rem'

  return (
    <>
      <style>{`
        .nav-link {
          background: none; border: none; border-bottom: 2px solid transparent;
          color: var(--ink-muted); padding: .3rem .9rem; cursor: pointer;
          font-size: .75rem; font-family: var(--font-body); font-weight: 400;
          letter-spacing: .12em; text-transform: uppercase;
          transition: color .15s, border-color .15s; margin-bottom: -2px;
        }
        .nav-link:hover { color: var(--ink); }
        .nav-link.active { color: var(--ink); border-bottom-color: var(--ink); font-weight: 500; }
        .nav-link.active-red { color: var(--red); border-bottom-color: var(--red); }
        .cta-btn {
          background: var(--ink); border: none; color: #fff;
          padding: .42rem 1.2rem; cursor: pointer;
          font-size: .72rem; font-family: var(--font-body); font-weight: 500;
          letter-spacing: .1em; text-transform: uppercase; transition: background .15s;
        }
        .cta-btn:hover { background: var(--red); }
        .filter-pill {
          background: #fff; border: 1px solid #ccc;
          color: var(--ink-mid); padding: .28rem .85rem;
          cursor: pointer; font-size: .7rem; font-family: var(--font-body);
          transition: all .15s; white-space: nowrap; letter-spacing: .02em;
        }
        .filter-pill:hover { border-color: var(--ink); color: var(--ink); }
        .filter-pill.active { background: var(--ink); border-color: var(--ink); color: #fff; font-weight: 500; }
        .filter-pill.moto:hover { border-color: var(--red); color: var(--red); }
        .filter-pill.moto.active { background: var(--red); border-color: var(--red); color: #fff; }
        .search-input {
          width: 100%; background: #fff;
          border: 1px solid #ccc; color: var(--ink);
          padding: .38rem .9rem .38rem 2rem;
          font-size: .78rem; font-family: var(--font-body); outline: none;
          transition: border-color .15s;
        }
        .search-input::placeholder { color: #bbb; }
        .search-input:focus { border-color: var(--ink); }
        .sort-select {
          background: #fff; border: 1px solid #ccc;
          color: var(--ink-mid); padding: .35rem .7rem;
          font-size: .73rem; font-family: var(--font-body);
          outline: none; cursor: pointer;
        }
        .sort-select:focus { border-color: var(--ink); }
        .view-btn {
          border: 1px solid #ccc; background: #fff;
          color: var(--ink-muted); padding: .35rem .6rem;
          cursor: pointer; font-size: .85rem; transition: all .15s;
        }
        .view-btn.active { background: var(--ink); border-color: var(--ink); color: #fff; }
        .view-btn:hover:not(.active) { border-color: var(--ink); color: var(--ink); }
        .card-arrow { opacity: 0; }
        article:hover .card-arrow { opacity: 1 !important; }
        @media (max-width: 640px) {
          .nav-links { display: none !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 300,
        background: '#fff',
        borderBottom: '2px solid var(--ink)',
        padding: '0 clamp(1rem, 3vw, 3rem)',
        height: NAV_H,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', flexShrink: 0 }}>
          <img src="/logo.svg" alt="Where Do We Go" style={{ width: 28, height: 28 }} />
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: '1.1rem', color: 'var(--ink)', lineHeight: 1,
            }}>Where Do We Go</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '.5rem',
              letterSpacing: '.25em', textTransform: 'uppercase',
              color: 'var(--red)', lineHeight: 1, marginTop: '.15rem',
            }}>Belgique &amp; environs</div>
          </div>
        </div>

        <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <button className={`nav-link${tab === 'car' ? ' active' : ''}`}
            onClick={() => { setTab(tab === 'car' ? 'all' : 'car'); setView('grid') }}>
            Voitures
          </button>
          <button className={`nav-link${tab === 'moto' ? ' active-red' : ''}`}
            onClick={() => { setTab(tab === 'moto' ? 'all' : 'moto'); setView('grid') }}>
            Motos
          </button>
          <button className={`nav-link${view === 'map' ? ' active' : ''}`}
            onClick={() => setView('map')}>
            Carte
          </button>
          <button className="nav-link">À propos</button>
        </nav>

        <button className="cta-btn"
          onClick={() => {
            setTab('all'); setFilter('all'); setView('grid')
            document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' })
          }}>
          Voir les événements
        </button>
      </header>

      <Hero stats={stats} />

      {/* ── FILTRES ── */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--rule)',
        padding: '.75rem clamp(1rem, 3vw, 3rem)',
        position: 'sticky', top: NAV_H, zIndex: 200,
        display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap',
      }}>
        {/* Recherche */}
        <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '.7rem', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--ink-muted)',
            fontSize: '.9rem', pointerEvents: 'none',
          }}>⌕</span>
          <input className="search-input" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un événement, une ville…" />
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--rule)' }} />

        {/* Type */}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Type</span>
        <button className={`filter-pill${tab === 'all' ? ' active' : ''}`} onClick={() => setTab('all')}>Tous</button>
        <button className={`filter-pill${tab === 'car' ? ' active' : ''}`} onClick={() => setTab(tab === 'car' ? 'all' : 'car')}>🚗 Voitures</button>
        <button className={`filter-pill moto${tab === 'moto' ? ' active' : ''}`} onClick={() => setTab(tab === 'moto' ? 'all' : 'moto')}>🏍️ Motos</button>

        <div style={{ width: 1, height: 20, background: 'var(--rule)' }} />

        {/* Filtres */}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Filtre</span>
        {(['gratuit', 'proche', 'avr', 'mai'] as FilterType[]).map(f => (
          <button key={f} className={`filter-pill${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f === filter ? 'all' : f)}>
            {f === 'gratuit' ? '✦ Gratuits' : f === 'proche' ? '≤ 50 km' : f === 'avr' ? 'Avril' : 'Mai +'}
          </button>
        ))}

        <div style={{ width: 1, height: 20, background: 'var(--rule)' }} />

        {/* Tri + vue */}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Trier</span>
        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value as SortType)}>
          <option value="date">Par date</option>
          <option value="dist">Par distance</option>
          <option value="price">Par prix</option>
        </select>

        <div style={{ display: 'flex', gap: 3 }}>
          {(['grid', 'map'] as ViewType[]).map(v => (
            <button key={v} onClick={() => setView(v)} className={`view-btn${view === v ? ' active' : ''}`}>
              {v === 'grid' ? '⊞' : '◉'}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <main style={{
        padding: 'clamp(.75rem, 3vw, 2.5rem) clamp(.75rem, 3vw, 3rem)',
        maxWidth: 1400, margin: '0 auto',
      }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: '.75rem',
          marginBottom: '2rem', paddingBottom: '1rem',
          borderBottom: '1px solid var(--rule)',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: '1.4rem', color: 'var(--ink)',
          }}>
            {filtered.length} événement{filtered.length > 1 ? 's' : ''}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '.58rem',
            letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--ink-muted)',
          }}>
            · {filterCars} voiture{filterCars > 1 ? 's' : ''} · {filterMotos} moto{filterMotos > 1 ? 's' : ''}
          </span>
        </div>

        {view === 'map' && <MapView events={filtered} onSelect={setSelected} />}

        {view === 'grid' && (
          <>
            {filtered.length === 0 && (
              <p style={{
                textAlign: 'center', padding: '5rem 2rem',
                color: 'var(--ink-muted)', fontFamily: 'var(--font-display)',
                fontSize: '1.3rem', fontStyle: 'italic',
              }}>
                Aucun événement ne correspond à votre recherche.
              </p>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(310px, 100%), 1fr))',
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
        borderTop: '2px solid var(--ink)',
        padding: '2rem clamp(1rem, 3vw, 3rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: '3rem', background: 'var(--ink)', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: '1.1rem', color: '#fff',
        }}>Where Do We Go</div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '.55rem',
          letterSpacing: '.15em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,.45)', lineHeight: 1.8, textAlign: 'right',
        }}>
          Cédric Goudaillier · Waterloo, Belgique<br />
          Mis à jour automatiquement · {updatedAt}
        </div>
      </footer>

      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
