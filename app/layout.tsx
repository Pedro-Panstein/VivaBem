import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { DataInitializer } from '@/components/providers/data-initializer'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: 'VivaBem - Monitoramento Inteligente de Saúde',
  description: 'Sistema de monitoramento de saúde com visualização interativa do corpo humano. Acompanhe sua saúde de forma visual e compreensível.',
  generator: 'v0.app',
  keywords: ['saúde', 'monitoramento', 'corpo humano', 'medicina', 'health tech'],
  authors: [{ name: 'VivaBem Team' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${orbitron.variable} bg-background`}>
      <body className="font-sans antialiased">
        <DataInitializer>
          {children}
        </DataInitializer>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
