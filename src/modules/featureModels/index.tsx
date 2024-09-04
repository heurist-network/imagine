import Image from 'next/image'
import Link from 'next/link'

import { ArrowIcon } from '@/components/icon'
import BlurFade from '@/components/magicui/blur-fade'
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover'
import { cn } from '@/lib/utils'

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
    if (type === 'sdxl10') return 'SDXL'
    if (type === 'composite15') return 'SD1.5 LoRA'
    if (type === 'compositexl') return 'SDXL LoRA'
    if (type === 'flux-dev' || type === 'flux-schnell') return 'Flux'
    return ''
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] py-[80px] group md:py-[100px] lg:py-[120px] xl:py-[140px] 2xl:py-[160px]">
      <div className="mx-auto max-w-5xl px-6 md:max-w-[1440px]">
        <div className="flex gap-4">
          <div
            className={cn(
              'font-semibold -tracking-[0.012em] text-[#1D1D1B]',
              'text-[24px] leading-[1.2] md:text-[28px] lg:text-[32px] xl:text-[36px] 2xl:text-[40px]',
            )}
          >
            Featured Models
          </div>
          <ArrowIcon
            className="transition-transform w-8 rotate-45 group-hover:rotate-90"
            strokeWidth={4}
          />
        </div>
        <div
          className={cn(
            'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            'mt-[24px] md:mt-[32px] lg:mt-[40px] xl:mt-[48px] 2xl:mt-[56px]',
          )}
        >
          {lists.map((item, index) => (
            <BlurFade key={item.name} delay={0.25 + index * 0.05} inView>
              <Link href={`/models/${item.name}`} className="relative block">
                <div className="bg-transparent rounded-lg relative block overflow-hidden md:hidden">
                  <div className="relative aspect-[464/696]">
                    <Image
                      unoptimized
                      priority
                      layout="fill"
                      className="scale-[1.15]"
                      src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.name}.jpg`}
                      alt="models image"
                    />
                  </div>

                  <div className="text-white right-6 bottom-6 left-6 z-40 absolute">
                    <div className="pr-20 relative">
                      <div className="font-semibold text-[24px] text-[#F7F7F6] leading-[1.33] tracking-[0.0064em] truncate">
                        {item.name}
                      </div>
                      <div className="font-bold text-[13px] text-[#F7F7F6] leading-[1.3] -tracking-[0.01em]">
                        {item.author}
                      </div>
                      <div className="rounded-full flex bg-[#CDF138] h-16 top-1/2 right-0 w-16 -translate-y-1/2 absolute items-center justify-center">
                        <ArrowIcon
                          className="transition-transform text-gray-950 w-9"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DirectionAwareHover
                  className="cursor-pointer"
                  content={
                    <div className="relative aspect-[464/696]">
                      <Image
                        unoptimized
                        priority
                        layout="fill"
                        className="scale-[1.15]"
                        src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.name}.jpg`}
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
                    <div className="rounded-full flex bg-[#CDF138] h-16 top-1/2 right-0 w-16 -translate-y-1/2 absolute items-center justify-center">
                      <ArrowIcon
                        className="transition-transform text-gray-950 w-9"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                </DirectionAwareHover>
                {!!getModelTag(item.type) && (
                  <div className="font-semibold bg-white/80 rounded-[5px] py-[3px] px-2 top-6 left-6 text-[14px] text-[#1D1D1B] leading-[1.57] tracking-[0.0016em] z-20 pointer-events-none absolute backdrop-blur-md">
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
