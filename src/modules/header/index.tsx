'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import AnimatedGradientText from '@/components/magicui/animated-gradient-text'
import { ConnectButton } from '@/components/ui/connect-button'
import { cn } from '@/lib/utils'

export function Header() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/90">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex flex-1">
          <Link
            href="/"
            className="flex cursor-pointer select-none items-center gap-1"
          >
            <Image src="/logo.svg" alt="logo" width={30} height={30} />
            <div className="flex animate-flow items-center bg-logo bg-[size:400%] bg-clip-text text-2xl font-extrabold text-transparent">
              Imagine
            </div>
          </Link>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/campaign">
            <AnimatedGradientText>
              <span
                className={cn(
                  `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                )}
              >
                Create To Earn
              </span>
              <span className="i-mingcute-right-fill ml-1 text-muted-foreground group-hover:animate-bounce-horizontal" />
            </AnimatedGradientText>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link target="_blank" href="https://discord.com/invite/heuristai">
              <div className="inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-md px-0 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <span className="i-ri-discord-fill h-6 w-6" />
                <span className="sr-only">Discord</span>
              </div>
            </Link>
            <Link target="_blank" href="https://twitter.com/heurist_ai">
              <div className="inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-md px-0 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <span className="i-ri-twitter-x-fill h-[18px] w-[18px]" />
                <span className="sr-only">X</span>
              </div>
            </Link>
            <Link target="_blank" href="https://github.com/heurist-network">
              <div className="inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-md px-0 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <span className="i-ri-github-fill h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
          </nav>
          <div className="text-sm">
            <ConnectButton />
          </div>
        </div>
        <div className="flex gap-2 md:hidden">
          <Link href="/campaign">
            <AnimatedGradientText>
              <span
                className={cn(
                  `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                )}
              >
                Create To Earn
              </span>
            </AnimatedGradientText>
          </Link>
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border"
            onClick={() => {
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? (
              <span className="i-mingcute-close-line" />
            ) : (
              <span className="i-mingcute-menu-line" />
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'block h-[calc(100dvh-56px)] max-h-0 overflow-y-hidden px-8 transition-all md:hidden',
          {
            'max-h-[calc(100dvh-56px)]': isExpanded,
          },
        )}
      >
        <Link
          className="mt-4 flex h-12 items-center gap-4 border-b"
          target="_blank"
          href="https://discord.com/invite/heuristai"
        >
          <span className="i-ri-discord-fill h-6 w-6" />
          <span className="sr-only1">Discord</span>
        </Link>
        <Link
          className="flex h-12 items-center gap-4 border-b"
          target="_blank"
          href="https://twitter.com/heurist_ai"
        >
          <span className="i-ri-twitter-x-fill h-6 w-6" />
          <span className="sr-only1">X</span>
        </Link>
        <Link
          className="flex h-12 items-center gap-4 border-b"
          target="_blank"
          href="https://github.com/heurist-network"
        >
          <span className="i-ri-github-fill h-6 w-6" />
          <span className="sr-only1">GitHub</span>
        </Link>
        <div className="mt-4 text-sm">
          <ConnectButton />
        </div>
      </div>
    </div>
  )
  // return (
  //   <div className="border-b bg-background/95 border-border/40 w-full top-0 z-50 sticky backdrop-blur supports-[backdrop-filter]:bg-background/60">
  //     <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
  //       <Link
  //         href="/"
  //         className="cursor-pointer flex gap-1 select-none items-center"
  //       >
  //         <Image src="/logo.svg" alt="logo" width={30} height={30} />
  //         <div className="bg-logo bg-clip-text flex font-extrabold bg-[size:400%] text-transparent animate-flow text-2xl items-center">
  //           Imagine
  //         </div>
  //       </Link>
  //       <div className="flex gap-3 items-center">
  //         <nav className="gap-1 hidden items-center md:flex">
  //           <Link target="_blank" href="https://discord.com/invite/heuristai">
  //             <div className="rounded-md font-medium h-10 text-sm py-2 px-0 transition-colors w-10 inline-flex items-center justify-center whitespace-nowrap hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-1 disabled:opacity-50 disabled:pointer-events-none">
  //               <span className="h-6 w-6 i-ri-discord-fill" />
  //               <span className="sr-only">Discord</span>
  //             </div>
  //           </Link>
  //           <Link target="_blank" href="https://twitter.com/heurist_ai">
  //             <div className="rounded-md font-medium h-10 text-sm py-2 px-0 transition-colors w-10 inline-flex items-center justify-center whitespace-nowrap hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-1 disabled:opacity-50 disabled:pointer-events-none">
  //               <span className="h-[18px] w-[18px] i-ri-twitter-x-fill" />
  //               <span className="sr-only">X</span>
  //             </div>
  //           </Link>
  //           <Link target="_blank" href="https://github.com/heurist-network">
  //             <div className="rounded-md font-medium h-10 text-sm py-2 px-0 transition-colors w-10 inline-flex items-center justify-center whitespace-nowrap hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-1 disabled:opacity-50 disabled:pointer-events-none">
  //               <span className="h-6 w-6 i-ri-github-fill" />
  //               <span className="sr-only">GitHub</span>
  //             </div>
  //           </Link>
  //         </nav>
  //         <div className="text-sm">
  //           <ConnectButton />
  //         </div>
  //         <div className="-mr-2 block md:hidden">
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <Button variant="outline" size="icon" className="rounded-full">
  //                 <span className="h-4 text-[hsl(0,0%,40%)] w-4 i-ri-menu-line" />
  //               </Button>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent>
  //               <DropdownMenuItem asChild>
  //                 <Link
  //                   className="flex gap-2"
  //                   target="_blank"
  //                   href="https://discord.gg/Ch6Y7mYMdr"
  //                 >
  //                   <span className="h-6 w-6 i-ri-discord-fill" />
  //                   <span>Discord</span>
  //                 </Link>
  //               </DropdownMenuItem>
  //               <DropdownMenuItem asChild>
  //                 <Link
  //                   className="flex gap-2"
  //                   target="_blank"
  //                   href="https://twitter.com/heurist_ai"
  //                 >
  //                   <div className="flex h-6 w-6 items-center justify-center">
  //                     <span className="h-[18px] w-[18px] i-ri-twitter-x-fill" />
  //                   </div>
  //                   <span>X</span>
  //                 </Link>
  //               </DropdownMenuItem>
  //               <DropdownMenuItem asChild>
  //                 <Link
  //                   className="flex gap-2"
  //                   target="_blank"
  //                   href="https://github.com/heurist-network"
  //                 >
  //                   <span className="h-6 w-6 i-ri-github-fill" />
  //                   <span>GitHub</span>
  //                 </Link>
  //               </DropdownMenuItem>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}
