import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ToastProvider } from '@/components/ui/Toast'
import { reportWebVitals } from '@/lib/performance'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: 'Brand Generator Pro',
  description: 'Générateur de noms de marques et slogans avec IA',
  keywords: 'générateur, marque, slogan, IA, branding, marketing',
  authors: [{ name: 'Brand Generator Pro' }],
  openGraph: {
    title: 'Brand Generator Pro',
    description: 'Générateur de noms de marques et slogans avec IA',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <ToastProvider />
        </Providers>
        
        {/* Web Vitals monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                import('/src/lib/performance').then(({ reportWebVitals }) => {
                  if (typeof reportWebVitals === 'function') {
                    reportWebVitals();
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}


