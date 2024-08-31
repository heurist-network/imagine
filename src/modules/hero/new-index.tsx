import { ArrowIcon, PlusIcon } from '@/components/icon'
import TrailingImage from '@/components/magicui/trailing-image'
import { cn } from '@/lib/utils'

import { Bg } from './bg'

export async function NewHero() {
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
    <div className="h-screen bg-gray-900 -mt-20 min-h-[880px] relative">
      <Bg />
      <TrailingImage lists={lists} />
      <div className="container flex h-full z-20 pointer-events-none relative items-center lg:items-end">
        <div className="flex flex-col flex-1 gap-10 justify-between lg:flex-row lg:pb-[8.33%] lg:gap-0">
          <div className="flex flex-col gap-2">
            <div className="flex">
              <div
                className={cn(
                  'pointer-events-auto flex items-center justify-center gap-2 rounded-full bg-[#32322F] px-3 py-2 font-medium -tracking-[0.03em] text-[#CDF138]',
                  'text-[16px] leading-[1.2] md:text-[17px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px]',
                )}
              >
                <PlusIcon className="w-4" />
                <span>Imagine Studio</span>
              </div>
            </div>
            <div
              className={cn(
                'pointer-events-auto font-semibold -tracking-[0.012em] text-white',
                'text-[40px] leading-[1.2] md:text-[53px] lg:text-[66px] lg:leading-[1] xl:text-[79px] 2xl:text-[92px]',
              )}
            >
              <div>Best Stable</div>
              <div>Diffusion models</div>
              <div>on a decentralized</div>
              <div>network of GPUs</div>
            </div>
          </div>
          <div className="flex items-end justify-end lg:justify-start">
            <div className="cursor-pointer flex gap-2.5 pointer-events-auto items-center">
              <div
                className={cn(
                  'font-medium text-white',
                  'text-[16px] leading-[1.33] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]',
                )}
              >
                Join Create-to-Earn Event
              </div>
              <div
                className={cn(
                  'flex aspect-square flex-shrink-0 items-center justify-center rounded-full bg-[#CDF138]',
                  'w-[40px] md:w-[46px] lg:w-[52px] xl:w-[58px] 2xl:w-[64px]',
                )}
              >
                <ArrowIcon className="w-9" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
