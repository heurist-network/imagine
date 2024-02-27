import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          <Image src="/logo.svg" alt="logo" width={30} height={30} />
          <div className="flex font-extrabold text-transparent text-2xl items-center bg-clip-text animate-flow bg-logo bg-[size:400%]">
            Imagine
          </div>
        </Link>
        <div className="flex gap-3 items-center">
          <nav className="md:flex items-center gap-1 hidden">
            <Link target="_blank" href="https://discord.gg/Ch6Y7mYMdr">
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 py-2 w-10 px-0">
                <span className="i-ri-discord-fill w-6 h-6" />
                <span className="sr-only">Discord</span>
              </div>
            </Link>
            <Link target="_blank" href="https://twitter.com/heurist_ai">
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 py-2 w-10 px-0">
                <span className="i-ri-twitter-x-fill w-[18px] h-[18px]" />
                <span className="sr-only">X</span>
              </div>
            </Link>
            <Link target="_blank" href="https://github.com/heurist-network">
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 py-2 w-10 px-0">
                <span className="i-ri-github-fill w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
          </nav>
          <div className="text-sm">
            <ConnectButton />
          </div>
          <div className="block md:hidden -mr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <span className="i-ri-menu-line text-[hsl(0,0%,40%)] w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    className="flex gap-2"
                    target="_blank"
                    href="https://discord.gg/Ch6Y7mYMdr"
                  >
                    <span className="i-ri-discord-fill w-6 h-6" />
                    <span>Discord</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    className="flex gap-2"
                    target="_blank"
                    href="https://twitter.com/heurist_ai"
                  >
                    <div className="w-6 h-6 flex justify-center items-center">
                      <span className="i-ri-twitter-x-fill w-[18px] h-[18px]" />
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
                    <span className="i-ri-github-fill w-6 h-6" />
                    <span>GitHub</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
