import { Toaster } from 'react-hot-toast'
import { GeistSans } from 'geist/font/sans'
import localFont from 'next/font/local'
import type { Metadata, Viewport } from 'next'

import { env } from '@/env.mjs'
import { cn } from '@/lib/utils'
import { Header } from '@/modules/header'

import { Providers } from './providers'

import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'

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
    <html lang="en" className={cn(GeistSans.className, SFMono.variable)}>
      {!!(env.UMAMI_URL && env.UMAMI_WEBSITE_ID) && (
        <script
          async
          src={env.UMAMI_URL}
          data-website-id={env.UMAMI_WEBSITE_ID}
        />
      )}
      <body className="bg-background min-h-screen">
        <Providers>
          <div className="inset-0 z-50 pointer-events-none fixed overflow-hidden">
            <div
              className={cn(
                `after:animate-aurora absolute -inset-[10px] opacity-30 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] [background-image:var(--white-gradient),var(--aurora)] [background-position:50%_50%,50%_50%] [background-size:300%,_200%] after:absolute after:inset-0 after:mix-blend-difference after:content-[""] after:[background-attachment:fixed] after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] dark:invert-0 dark:[background-image:var(--dark-gradient),var(--aurora)] after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
              )}
            />
          </div>
          <div className="bg-background flex flex-col min-h-screen pt-14 relative">
            <Header />
            {children}
          </div>
          <div className="h-[80px] w-full inset-x-0 bottom-0 z-30 mask-b pointer-events-none fixed select-none backdrop-blur-[1px]" />
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
