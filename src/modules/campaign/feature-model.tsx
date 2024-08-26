import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export function FeatureModel() {
  return (
    <div className="h-[1040px] bg-[#1D1D1B] pt-[129px]">
      <div className="container px-0 text-white">
        <div
          className={cn(
            'text-[48px] font-semibold leading-[58px] -tracking-[0.0075em]',
            inter.className,
          )}
        >
          Featured Models of the Day
        </div>
      </div>
    </div>
  )
}
