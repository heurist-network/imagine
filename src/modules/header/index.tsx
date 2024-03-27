import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Header() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link
          href="/"
          className="flex cursor-pointer select-none items-center gap-1"
        >
          <Image src="/logo.svg" alt="logo" width={30} height={30} />
          <div className="flex animate-flow items-center bg-logo bg-[size:400%] bg-clip-text text-2xl font-extrabold text-transparent">
            Imagine
          </div>
        </Link>
        <div className="flex items-center gap-3">
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
          <div className="-mr-2 block md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <span className="i-ri-menu-line h-4 w-4 text-[hsl(0,0%,40%)]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    className="flex gap-2"
                    target="_blank"
                    href="https://discord.gg/Ch6Y7mYMdr"
                  >
                    <span className="i-ri-discord-fill h-6 w-6" />
                    <span>Discord</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    className="flex gap-2"
                    target="_blank"
                    href="https://twitter.com/heurist_ai"
                  >
                    <div className="flex h-6 w-6 items-center justify-center">
                      <span className="i-ri-twitter-x-fill h-[18px] w-[18px]" />
                    </div>
                    <span>X</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    className="flex gap-2"
                    target="_blank"
                    href="https://github.com/heurist-network"
                  >
                    <span className="i-ri-github-fill h-6 w-6" />
                    <span>GitHub</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
