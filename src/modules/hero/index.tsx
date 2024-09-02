import { ArrowIcon, PlusIcon } from '@/components/icon'
import BlurIn from '@/components/magicui/blur-in'
import SwapText from '@/components/magicui/swap-text'
import { TextGenerateEffect } from '@/components/magicui/text-generate-effect'
import TrailingImage from '@/components/magicui/trailing-image'
import { cn } from '@/lib/utils'

import { Bg } from './bg'

export async function Hero() {
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

  return (
    <div className="h-screen bg-gray-900 -mt-20 relative md:min-h-[880px]">
      <Bg />
      <TrailingImage lists={lists} />
      <div
        className={cn(
          'pointer-events-none relative z-20 flex h-full items-center',
          'mx-auto max-w-5xl px-6 md:max-w-[1440px]',
        )}
      >
        <div className="flex flex-col flex-1 gap-14 justify-between lg:flex-row lg:pb-[8.33%] lg:gap-0">
          <div className="flex flex-col gap-[20px] md:gap-[29px] lg:gap-[38px] xl:gap-[47px] 2xl:gap-[56px]">
            <BlurIn className="flex" delay={1.1}>
              <div
                className={cn(
                  'pointer-events-auto flex items-center justify-center gap-2 rounded-full bg-[#32322F] px-3 py-2 font-medium -tracking-[0.03em] text-[#CDF138]',
                  'text-[16px] leading-[1.2] md:text-[17px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px]',
                )}
              >
                <PlusIcon className="w-4" />
                <span>Imagine Studio</span>
              </div>
            </BlurIn>

            <TextGenerateEffect
              className={cn(
                'pointer-events-auto font-semibold -tracking-[0.012em] text-white',
                'text-[40px] leading-[1.2] md:text-[53px] lg:text-[66px] lg:leading-[1] xl:text-[79px] 2xl:text-[92px]',
              )}
              words1="Best Stable"
              words2="Diffusion models"
              words3="on a decentralized"
              words4="network of GPUs"
            />
          </div>
          <div className="flex items-end justify-end lg:justify-start">
            <BlurIn
              className="cursor-pointer flex gap-2.5 group pointer-events-auto items-center"
              delay={1.1}
            >
              <SwapText
                initialText="Join Create-to-Earn Event"
                finalText="Join Create-to-Earn Event"
                supportsHover
                textClassName={cn(
                  'font-medium text-white transition-colors hover:text-[#CDF138] duration-100',
                  'text-[16px] leading-[1.33] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]',
                )}
              />
              <div
                className={cn(
                  'flex aspect-square flex-shrink-0 items-center justify-center rounded-full bg-[#CDF138] transition-transform group-hover:rotate-45',
                  'w-[40px] md:w-[46px] lg:w-[52px] xl:w-[58px] 2xl:w-[64px]',
                )}
              >
                <ArrowIcon className="w-9" />
              </div>
            </BlurIn>
          </div>
        </div>
      </div>
    </div>
  )
}
