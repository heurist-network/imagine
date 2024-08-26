import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export function Leaderboard() {
  return (
    <div className="h-[1040px] bg-white pt-[129px]">
      <div className="container px-0">
        <div
          className={cn(
            'text-[48px] font-semibold leading-[36px] -tracking-[0.0075em] text-[#080808]',
            inter.className,
          )}
        >
          Mint Leaderboard
        </div>
      </div>
    </div>
  )
}
