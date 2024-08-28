import { Toaster } from 'react-hot-toast'
import { GeistSans } from 'geist/font/sans'
import localFont from 'next/font/local'
import type { Metadata, Viewport } from 'next'

import { env } from '@/env.mjs'
import { Header } from '@/modules/header'

import { Providers } from './providers'

import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'

import { cn } from '@/lib/utils'

const title = 'Heurist Imagine'
const description =
  'Access Stable Diffusion models provided by a decentralized network of GPUs. Create and reproduce IP without limiation. Showcase your creativity and earn crypto.'

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

const sfMono = localFont({
  src: [
    {
      path: '../../public/font/SFMono-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/font/SFMono-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/font/SFMono-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/font/SFMono-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sf-mono',
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(GeistSans.className, sfMono.variable)}>
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
