'use client'
import { useState } from 'react'

interface Props {
  search: string
  onSearch: (v: string) => void
  tab: string
  onTab: (v: any) => void
  filter: string
  onFilter: (v: any) => void
  sort: string
  onSort: (v: any) => void
  view: string
  onView: (v: any) => void
}

export default function MobileToolbar({ search, onSearch, tab, onTab, filter, onFilter, sort, onSort, view, onView }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ background: '#12100e', borderBottom: '1px solid rgba(154,117,32,.2)', position: 'sticky', top: 0, zIndex: 200 }}>
      {/* Ligne principale mobile */}
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', padding: '.6rem 1rem' }}>
        {/* Search */}
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: '.6rem', top: '50%', transform: 'translateY(-50%)', color: '#9a7520', fontSize: '1rem', pointerEvents: 'none' }}>⌕</span>
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Rechercher..."
            style={{ width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(154,117,32,.2)', color: '#f0ece3', padding: '.38rem .8rem .38rem 1.8rem', borderRadius: 2, fontSize: '.76rem', fontFamily: 'var(--font-body)', outline: 'none' }}
          />
        </div>
        {/* Vue toggle */}
        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,.04)', padding: 3, borderRadius: 3 }}>
          {(['grid', 'map'] as const).map(v => (
            <button key={v} onClick={() => onView(v)} style={{ background: view === v ? '#9a7520' : 'none', border: 'none', color: view === v ? '#f0ece3' : 'rgba(240,236,227,.35)', padding: '.24rem .48rem', borderRadius: 2, cursor: 'pointer', fontSize: '.82rem' }}>
              {v === 'grid' ? '⊞' : '◉'}
            </button>
          ))}
        </div>
        {/* Filtres bouton */}
        <button onClick={() => setOpen(!open)} style={{ background: open ? '#9a7520' : 'rgba(255,255,255,.06)', border: '1px solid rgba(154,117,32,.2)', color: '#f0ece3', padding: '.38rem .7rem', borderRadius: 2, cursor: 'pointer', fontSize: '.74rem', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
          {open ? '✕' : '⚙ Filtres'}
        </button>
      </div>

      {/* Panneau filtres dépliable */}
      {open && (
        <div style={{ padding: '.5rem 1rem .8rem', borderTop: '1px solid rgba(154,117,32,.15)', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          {/* Tabs type */}
          <div style={{ display: 'flex', gap: 4 }}>
            {(['all', 'car', 'moto'] as const).map(t => (
              <button key={t} onClick={() => onTab(t)} style={{ flex: 1, background: tab === t ? (t === 'all' ? 'linear-gradient(135deg,#9a7520,#a03010)' : t === 'car' ? '#9a7520' : '#a03010') : 'rgba(255,255,255,.06)', border: '1px solid rgba(154,117,32,.15)', color: '#f0ece3', padding: '.35rem .4rem', borderRadius: 2, cursor: 'pointer', fontSize: '.72rem', fontFamily: 'var(--font-body)', opacity: tab === t ? 1 : .5 }}>
                {t === 'all' ? 'Tous' : t === 'car' ? '🚗 Voitures' : '🏍️ Motos'}
              </button>
            ))}
          </div>
          {/* Filtres rapides */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {(['all', 'gratuit', 'proche', 'avr', 'mai'] as const).map(f => (
              <button key={f} onClick={() => onFilter(f)} style={{ background: 'none', border: `1px solid ${filter === f ? '#c49a30' : 'rgba(154,117,32,.18)'}`, color: filter === f ? '#c49a30' : 'rgba(240,236,227,.4)', padding: '.3rem .6rem', borderRadius: 2, cursor: 'pointer', fontSize: '.7rem', fontFamily: 'var(--font-body)' }}>
                {f === 'all' ? 'Tous' : f === 'gratuit' ? 'Gratuits' : f === 'proche' ? '≤ 50 km' : f === 'avr' ? 'Avril' : 'Mai +'}
              </button>
            ))}
          </div>
          {/* Tri */}
          <select value={sort} onChange={e => onSort(e.target.value)} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(154,117,32,.18)', color: 'rgba(240,236,227,.7)', padding: '.35rem .72rem', borderRadius: 2, fontSize: '.73rem', fontFamily: 'var(--font-body)', outline: 'none', width: '100%' }}>
            <option value="date" style={{ background: '#1a1714' }}>Trier par date</option>
            <option value="dist" style={{ background: '#1a1714' }}>Trier par distance</option>
            <option value="price" style={{ background: '#1a1714' }}>Trier par prix</option>
          </select>
        </div>
      )}
    </div>
  )
}
