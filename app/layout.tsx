import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stream Tools',
  description: 'Mobile-first streaming tools for creators.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>
}
