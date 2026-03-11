import './globals.css'
import Navbar from './Navbar'

export const metadata = {
  title: 'Masters Sweepstake 2026',
  description: 'School Golf Pool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        <Navbar />
        {children}
      </body>
    </html>
  )
}