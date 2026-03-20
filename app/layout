import type { Metadata } from 'next'
import { Cormorant_Garamond, Instrument_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  title: 'Where Do We Go — Oldtimers & Classic Bikes 2026 | Belgique',
  description: 'Agenda complet des rassemblements, balades et rallyes de voitures et motos anciennes en Belgique 2026. Oldtimers & Classic Bikes — Compilé par Cédric Goudaillier.',
  authors: [{ name: 'Cédric Goudaillier' }],
  keywords: ['rassemblement voitures anciennes Belgique 2026', 'oldtimer Belgique', 'balade moto ancêtres', 'Cédric Goudaillier'],
  openGraph: {
    title: 'Where Do We Go — Oldtimers & Classic Bikes 2026',
    description: 'Agenda oldtimers & classic bikes en Belgique 2026',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  )
}
