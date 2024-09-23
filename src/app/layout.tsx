import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import Link from 'next/link'
import type { Metadata, Viewport } from 'next'

import { env } from '@/env.mjs'
import { cn } from '@/lib/utils'
import { Footer } from '@/modules/footer'
import { Header } from '@/modules/header'

import { Providers } from './providers'

import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

const title = 'Heurist Imagine'
const description =
  'Generate images with AI using a decentralized network of GPUs. Create and reproduce IP without limiation. Showcase your creativity and earn crypto.'

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
      url: 'https://imagine.heurist.ai/CoverImage.jpg',
      width: 1200,
      height: 630,
      alt: 'Heurist Imagine',
    },
  },
  twitter: {
    title,
    description,
    images: {
      url: 'https://imagine.heurist.ai/CoverImage.jpg',
      width: 1200,
      height: 630,
      alt: 'Heurist Imagine',
    },
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

const SFMono = localFont({
  src: [
    {
      path: '../../public/font/SFMono-Light-3.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/font/SFMono-Regular-4.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/font/SFMono-Medium-5.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/font/SFMono-Semibold-6.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/font/SFMono-Bold-7.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/font/SFMono-Heavy-8.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-sf-mono',
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(inter.className, SFMono.variable)}>
      {!!(env.UMAMI_URL && env.UMAMI_WEBSITE_ID) && (
        <script
          async
          src={env.UMAMI_URL}
          data-website-id={env.UMAMI_WEBSITE_ID}
        />
      )}
      <body className="min-h-screen">
        <Providers>
          <div className="bg-[#CDF138]">
            <div className="mx-auto flex h-10 max-w-5xl flex-nowrap items-center justify-center gap-0.5 truncate px-6 text-xs font-medium text-gray-950 md:max-w-[1440px] md:text-sm">
              <span>🎉 Heurist x ZKsync Presents: Create AI Art and Earn ZK Tokens</span>
              <Link
                className="underline"
                href="https://docs.heurist.ai/ecosystem/create-to-earn"
                target="_blank"
              >
                Read more here
              </Link>
            </div>
          </div>
          <div className="relative flex min-h-screen flex-col bg-background">
            <Suspense>
              <Header />
            </Suspense>
            {children}
            <Footer />
          </div>
          {/* <div className="h-[80px] w-full inset-x-0 bottom-0 z-30 mask-b pointer-events-none fixed select-none backdrop-blur-[1px]" /> */}
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
