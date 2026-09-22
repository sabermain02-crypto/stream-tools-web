import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stream Tools — Streaming Platform',
  description: 'Stream Tools untuk creator: streaming, premium, AI, voice, VTuber, dan tools lainnya.',
  icons: { icon: '/images/logo-mark.png' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>
}
