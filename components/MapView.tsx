'use client'

import { useEffect, useRef } from 'react'
import type { RassemblementEvent } from '@/lib/calendar'
import { formatDate, isGratuit } from '@/lib/calendar'

interface Props {
  events: RassemblementEvent[]
  onSelect: (event: RassemblementEvent) => void
}

export default function MapView({ events, onSelect }: Props) {
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initMap = async () => {
      const L = (await import('leaflet')).default

      if (!containerRef.current) return

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current).setView([50.5, 4.5], 8)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '© CartoDB',
        }).addTo(mapRef.current)
        L.circleMarker([50.7142, 4.3960], {
          radius: 10, color: '#9a7520', fillColor: '#9a7520',
          fillOpacity: 1, weight: 2,
        }).addTo(mapRef.current).bindPopup('<b>Waterloo</b> — référence')
      }

      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      events.forEach(e => {
        const col = isGratuit(e.price) ? '#2d6b3a'
          : e.type === 'moto' ? '#a03010'
            : e.km <= 50 ? '#1a4a7a' : '#9a7520'

        const marker = L.circleMarker(e.coords, {
          radius: e.type === 'moto' ? 9 : 8,
          color: col, fillColor: col,
          fillOpacity: .88, weight: 2,
        })
          .addTo(mapRef.current)
          .bindPopup(`
            <div style="font-family:system-ui;min-width:190px;padding:.1rem">
              <b style="font-size:1rem;display:block;margin-bottom:.2rem">${e.title}</b>
              <span style="font-size:.73rem;color:#666">${formatDate(e.date)} · ${e.price} · ${e.km} km</span>
            </div>
          `)
          .on('click', () => onSelect(e))

        markersRef.current.push(marker)
      })
    }

    initMap()
  }, [events, onSelect])

  return (
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={containerRef}
        style={{
          height: 460, borderRadius: 3,
          border: '1px solid #ccc0a0',
          overflow: 'hidden',
          boxShadow: '0 4px 28px rgba(18,16,14,.12)',
        }}
      />
      <div style={{
        position: 'absolute', bottom: '1rem', left: '1rem',
        background: 'rgba(240,236,227,.95)',
        border: '1px solid #ccc0a0', borderRadius: 3,
        padding: '.6rem .9rem', zIndex: 500,
        fontSize: '.68rem',
        display: 'flex', flexDirection: 'column', gap: '.35rem',
        backdropFilter: 'blur(8px)',
      }}>
        {[
          { color: '#9a7520', label: 'Voiture ancêtre' },
          { color: '#a03010', label: 'Moto' },
          { color: '#2d6b3a', label: 'Gratuit' },
          { color: '#1a4a7a', label: '≤ 50 km' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '.45rem', color: '#2a2520' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, display: 'inline-block' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
