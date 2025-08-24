import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blood Analysis Tool',
  description: 'AI-powered blood test analysis with OCR capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
