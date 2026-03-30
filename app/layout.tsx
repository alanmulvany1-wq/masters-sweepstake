import './globals.css'
import Navbar from './Navbar'
import { Crimson_Text } from 'next/font/google'

// Configure the Masters-style font
const crimson = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  style: ['italic', 'normal']
})

export const metadata = {
  title: 'Masters Sweepstake 2026',
  description: 'Ratoath Senior National School Fundraiser',
icons: {
    icon: "/icon.png", // This points to your school crest
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Apply the font class to the body and force it to be italic 
          to match your "Masters Italic" requirement across all pages.
      */}
      <body className={`${crimson.className} antialiased bg-gray-50 italic`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}