import { Suspense } from 'react'
import Image from 'next/image'

import { OpacityWrapper } from '@/components/motion/opacityWrapper'
import { Hero } from '@/modules/hero'
import { Models } from '@/modules/models'

export default function Home() {
  return (
    <main className="flex-1">
      <div className="container">
        <Suspense>
          <Hero />
        </Suspense>
        <OpacityWrapper>
          <div className="my-6 flex items-center gap-2 md:my-10">
            <div className="h-[1px] flex-1 bg-[#ebeaeb]" />
            <Image src="/logo.svg" alt="logo" width={24} height={24} />
            <div className="h-[1px] flex-1 bg-[#ebeaeb]" />
          </div>
        </OpacityWrapper>
        <Models />
      </div>
    </main>
  )
}
