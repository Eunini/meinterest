import Header from './components/Header'
import './globals.css'
import { Inter } from 'next/font/google'

import Provider from './Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "MeInterest - Your Creative Space",
  description: "Discover and save creative ideas from around the world.",
  images: [
    {
      url: "logo1.png",
      width: 1200,
      height: 630,
      alt: "MeInterest Preview",
    },
  ],
  openGraph: {
    title: "MeInterest - Your Creative Space",
    description: "A Pinterest-like platform for creative inspiration.",
    type: "website",
    url: "https://yourwebsite.com",
    images: [
      {
        url: "logo1.png",
        width: 1200,
        height: 630,
        alt: "MeInterest Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MeInterest",
    description: "A Pinterest-like platform for creative inspiration.",
    images: ["logo1.png"],
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Header/>
          {children}
      </Provider>
        </body>
    </html>
  )
}
