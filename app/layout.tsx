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
  title: 'Where Do We Go — Rassemblements d\'ancêtres & sorties moto | Belgique',
  description: 'Agenda complet des rassemblements de voitures anciennes et des balades moto organisées en Belgique. Ancêtres & sorties moto — Compilé par Cédric Goudaillier.',
  authors: [{ name: 'Cédric Goudaillier' }],
  keywords: ['rassemblement voitures anciennes Belgique 2026', 'oldtimer Belgique', 'balade moto ancêtres', 'Cédric Goudaillier'],
  openGraph: {
    title: 'Where Do We Go — Rassemblements d\'ancêtres & sorties moto',
    description: 'Agenda ancêtres & balades moto organisées en Belgique',
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
