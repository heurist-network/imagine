import { Inter } from 'next/font/google'
import Image from 'next/image'

import ShimmerButton from '@/components/magicui/shimmer-button'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export function CampaignPreview() {
  return (
    <div className="bg-campaign-preview h-[1110px] bg-cover">
      <div className="container px-0 py-[135px]">
        <div className="flex gap-12">
          <div>
            <div
              className={cn(
                inter.className,
                'text-[80px] font-bold !italic leading-[1.3]',
              )}
            >
              CREATE WITH AI
            </div>
            <div
              className={cn(
                inter.className,
                '-mt-2 text-[80px] !italic leading-[1.3] text-[#7269E1]',
              )}
            >
              EARN ZK TOKEN
            </div>
            <div className="group mt-6 flex cursor-pointer select-none items-center justify-end gap-4">
              <div className={cn('text-[24px] font-semibold', inter.className)}>
                Mint Now
              </div>
              <ShimmerButton className="h-16 w-16">
                <Image
                  className="transition-transform group-hover:rotate-45 group-hover:scale-105"
                  src="/arrow.svg"
                  alt="arrow"
                  width={32}
                  height={32}
                />
              </ShimmerButton>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-3 gap-5">
            <div className="flex flex-col items-center justify-center gap-1 bg-[#1d1d1b]">
              <div
                className={cn('font-sfMono text-2xl leading-[31px] text-white')}
              >
                SPRINT 1
              </div>
              <div className="font-sfMono text-[80px] font-bold leading-[95px] text-[#cdf138]">
                13
              </div>
              <div className="font-sfMono text-[48px] font-light leading-[62px] text-[#cdf138]">
                DAY
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 bg-[#1d1d1b]">
              <div
                className={cn('font-sfMono text-2xl leading-[31px] text-white')}
              >
                ENDS
              </div>
              <div className="font-sfMono text-[80px] font-bold leading-[95px] text-[#cdf138]">
                20
              </div>
              <div className="font-sfMono text-[48px] font-light leading-[62px] text-[#cdf138]">
                HRS
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 bg-[#1d1d1b]">
              <div
                className={cn('font-sfMono text-2xl leading-[31px] text-white')}
              >
                IN
              </div>
              <div className="font-sfMono text-[80px] font-bold leading-[95px] text-[#cdf138]">
                59
              </div>
              <div className="font-sfMono text-[48px] font-light leading-[62px] text-[#cdf138]">
                MINS
              </div>
            </div>
          </div>
        </div>
        <div className="mt-24 flex border-y-[3px] border-black">
          <div className="flex flex-1 flex-col gap-4 border-r-[3px] border-black py-12 pl-12">
            <div
              className={cn(
                'text-[48px] leading-[58px] text-black/90',
                inter.className,
              )}
            >
              Pool 1
            </div>
            <div className="font-sfMono flex text-[72px] leading-[86px]">
              73505.3 ZK
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 py-12 pl-12">
            <div
              className={cn(
                'text-[48px] leading-[58px] text-black/90',
                inter.className,
              )}
            >
              Pool 2
            </div>
            <div className="font-sfMono flex text-[72px] leading-[86px]">
              73505.3 ZK
            </div>
          </div>
        </div>
        <div className="mt-24 flex">
          <div className="font-sfMono relative max-w-[750px] bg-white py-3 pl-14 pr-6 text-base leading-[19px] -tracking-[0.0075em]">
            <Image
              className="absolute left-6 top-3"
              src="/icon/plus.svg"
              alt="plus"
              width={16}
              height={16}
            />
            <div className="font-bold">
              Every zkImagine NFT is carrying rewards. Pool 1 is for everyone.
              Pool 2 is for top 20 participants.
            </div>
            <div>
              Your scores depend on your mint count and social activities.
              Rewards are claimable at the end of every sprint.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
