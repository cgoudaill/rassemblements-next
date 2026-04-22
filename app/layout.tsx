import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
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
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
