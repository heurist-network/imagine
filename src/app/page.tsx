import { Suspense } from 'react'
import Image from 'next/image'

import { OpacityWrapper } from '@/components/motion/opacityWrapper'
import { Hero } from '@/modules/hero'
import { NewHero } from '@/modules/hero/new-index'
import { Models } from '@/modules/models'

export default function Home() {
  return (
    <main className="flex-1">
      <NewHero />
      <div>asfasf</div>
      {/* <div className="container h-[3000px]">
        <Suspense>
          <Hero />
        </Suspense>
        <OpacityWrapper>
          <div className="flex my-6 gap-2 items-center md:my-10">
            <div className="bg-[#ebeaeb] flex-1 h-[1px]" />
            <Image src="/logo.svg" alt="logo" width={24} height={24} />
            <div className="bg-[#ebeaeb] flex-1 h-[1px]" />
          </div>
        </OpacityWrapper>
        <Models />
      </div> */}
    </main>
  )
}
// export default function Home() {
//   return (
//     <main className="flex-1">
//       <div className="container">
//         <Suspense>
//           <Hero />
//         </Suspense>
//         <OpacityWrapper>
//           <div className="flex my-6 gap-2 items-center md:my-10">
//             <div className="bg-[#ebeaeb] flex-1 h-[1px]" />
//             <Image src="/logo.svg" alt="logo" width={24} height={24} />
//             <div className="bg-[#ebeaeb] flex-1 h-[1px]" />
//           </div>
//         </OpacityWrapper>
//         <Models />
//       </div>
//     </main>
//   )
// }
