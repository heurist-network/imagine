import { Suspense } from 'react'
import Image from 'next/image'

import { OpacityWrapper } from '@/components/motion/opacityWrapper'
import { FeatureModels } from '@/modules/featureModels'
import { Hero } from '@/modules/hero'
import { NewHero } from '@/modules/hero/new-index'
import { Models } from '@/modules/models'

// export default function Home() {
//   return (
//     <div className="mx-auto w-full max-w-5xl bg-fuchsia-400 md:max-w-[1440px]">
//       asfasf
//     </div>
//   )
// }
export default function Home() {
  return (
    <main className="flex-1">
      <NewHero />
      <FeatureModels />
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
