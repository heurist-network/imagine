import Image from 'next/image'
import Link from 'next/link'

import { ArrowIcon } from '@/components/icon'
import BlurFade from '@/components/magicui/blur-fade'
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover'

export async function FeatureModels() {
  const res: any[] = await fetch(
    'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json',
    {
      next: { revalidate: 3600 },
    },
  ).then((res) => res.json())

  const lists = res.filter(
    (item) =>
      item.type === 'sd15' ||
      item.type === 'sdxl10' ||
      item.type.includes('composite'),
  )

  const getModelTag = (type: string): string => {
    if (type === 'sd15') return 'SD1.5'
    if (type === 'sdxl') return 'SDXL'
    if (type === 'composite15') return 'SD1.5 LoRA'
    if (type === 'compositexl') return 'SDXL LoRA'
    if (type === 'flux-dev' || type === 'flux-schnell') return 'Flux'
    return ''
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] py-[160px]">
      <div className="container">
        <div className="flex gap-4">
          <div className="font-semibold text-[40px] text-[#1D1D1B] leading-[1.2] -tracking-[0.012em]">
            Featured Models
          </div>
          <ArrowIcon className="w-8 rotate-90" strokeWidth={4} />
        </div>
        <div className="mt-14 grid gap-6 grid-cols-4">
          {lists.map((item, index) => (
            <BlurFade key={item.name} delay={0.25 + index * 0.05} inView>
              <Link
                href={`/models/${item.name}`}
                className="bg-fuchsia-300 relative"
              >
                <DirectionAwareHover
                  className="cursor-pointer"
                  content={
                    <div className="aspect-[464/696]">
                      <Image
                        unoptimized
                        priority
                        layout="fill"
                        className="scale-[1.15]"
                        src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.name}.png`}
                        alt="models image"
                      />
                    </div>
                  }
                >
                  <div className="pr-20 relative">
                    <div className="font-semibold text-[24px] text-[#F7F7F6] leading-[1.33] tracking-[0.0064em] truncate">
                      {item.name}
                    </div>
                    <div className="font-bold text-[13px] text-[#F7F7F6] leading-[1.3] -tracking-[0.01em]">
                      {item.author}
                    </div>
                    <div className="rounded-full flex bg-[#CDF138] h-16 top-1/2 right-0 w-16 -translate-y-1/2 group absolute items-center justify-center">
                      <ArrowIcon
                        className="transition-transform text-gray-950 w-9 group-hover:rotate-45"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                </DirectionAwareHover>
                {!!getModelTag(item.type) && (
                  <div className="font-semibold bg-white/80 rounded-[5px] py-[3px] px-2 top-6 left-6 text-[14px] text-[#1D1D1B] leading-[1.57] tracking-[0.0016em] z-10 pointer-events-none absolute backdrop-blur-md">
                    {getModelTag(item.type)}
                  </div>
                )}
              </Link>
            </BlurFade>
          ))}
        </div>
      </div>
    </div>
  )
}
