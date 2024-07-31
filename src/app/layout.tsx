import { Toaster } from 'react-hot-toast'
import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'

import { env } from '@/env.mjs'
import { Header } from '@/modules/header'

import { Providers } from './providers'

import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'

const title = 'Imagine | AI Image generator by Heurist'
const description =
  'Access Stable Diffusion models on a decentralized network of GPUs. Create and reproduce IP without limiation. Showcase your creativity and earn cryptocurrencies.'

export const metadata: Metadata = {
  metadataBase: new URL('https://imagine.heurist.ai'),
  title,
  description,
  authors: [{ name: 'Heurist', url: 'https://heurist.ai' }],
  generator: 'https://heurist.ai',
  keywords:
    'AI, Image, Generator, Image Generation, Heurist, Stable Diffusion, Decentralized, GPU, Free',
  openGraph: {
    title,
    description,
    url: 'https://imagine.heurist.ai',
    type: 'article',
    images: {
      url: 'https://imagine.heurist.ai/BlazingDrive.png',
      width: 512,
      height: 768,
      alt: 'Heurist Imagine',
    },
  },
  twitter: {
    title,
    description,
    images: {
      url: 'https://imagine.heurist.ai/BlazingDrive.png',
      width: 512,
      height: 768,
      alt: 'Heurist Imagine',
    },
  },
  appleWebApp: {
    title,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.className}>
      {!!(env.UMAMI_URL && env.UMAMI_WEBSITE_ID) && (
        <script
          async
          src={env.UMAMI_URL}
          data-website-id={env.UMAMI_WEBSITE_ID}
        />
      )}
      <body className="min-h-screen bg-background">
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-background">
            <Header />
            {children}
          </div>
          <div className="mask-b pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[80px] w-full select-none backdrop-blur-[1px]" />
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
