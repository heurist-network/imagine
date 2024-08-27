'use client'

import { useLayoutEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useInterval } from 'usehooks-ts'

import { ArrowIcon } from '@/components/icon/arrow'
import BlurIn from '@/components/magicui/blur-in'
import { FadeText } from '@/components/magicui/fade-text'
import { NumberTicker } from '@/components/magicui/number-ticker'
import SwapText from '@/components/magicui/swap-text'
import { TextGenerateEffect } from '@/components/magicui/text-generate-effect'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export function CampaignPreview() {
  // 当前时间距离某个时刻的间隔时间。按照天，小时，分钟来计算
  const endTime = new Date('2024-09-10')

  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)

  const calculateTime = () => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    setDays(days)
    setHours(hours)
    setMinutes(minutes)
  }

  useLayoutEffect(() => {
    calculateTime()
  }, [])

  useInterval(() => {
    calculateTime()
  }, 1000)

  return (
    <div className="h-[1110px] bg-campaign-preview bg-cover">
      <div className="container px-0 py-[135px]">
        <div className="flex gap-12">
          <div className="w-[682px]">
            <FadeText
              className={cn(
                inter.className,
                'text-[80px] font-bold !italic leading-[104px]',
              )}
              direction="up"
              framerProps={{
                show: { transition: { delay: 0.2, duration: 0.7 } },
              }}
              text="CREATE WITH AI"
            />
            <FadeText
              className={cn(
                inter.className,
                '-mt-2 mr-2 text-right text-[80px] !italic leading-[104px] text-[#7269E1]',
              )}
              direction="up"
              framerProps={{
                show: { transition: { delay: 0.4, duration: 0.7 } },
              }}
              text="EARN ZK TOKEN"
            />
            <div className="flex justify-end">
              <BlurIn className="group mt-6 flex cursor-pointer items-center justify-end gap-4">
                <SwapText
                  initialText="Mint Now"
                  finalText="Mint Now"
                  supportsHover
                  textClassName="text-[24px] font-semibold"
                />
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1D1D1B] text-white transition-colors group-hover:bg-[#CDF138] group-hover:text-black">
                  <ArrowIcon
                    size={32}
                    className="transition-transform group-hover:rotate-45 group-hover:scale-105"
                  />
                </div>
              </BlurIn>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-3 gap-5">
            <div className="flex flex-col items-center justify-center gap-1 bg-[#1d1d1b]">
              <div
                className={cn('font-sfMono text-2xl leading-[31px] text-white')}
              >
                SPRINT 1
              </div>
              <div className="font-sfMono text-[80px] font-bold leading-[95px]">
                <NumberTicker className="text-[#cdf138]" value={String(days)} />
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
              <div className="font-sfMono text-[80px] font-bold leading-[95px]">
                <NumberTicker
                  className="text-[#cdf138]"
                  value={String(hours)}
                />
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
              <div className="font-sfMono text-[80px] font-bold leading-[95px]">
                <NumberTicker
                  className="text-[#cdf138]"
                  value={String(minutes)}
                />
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
            <div className="flex gap-4 font-sfMono text-[72px] leading-[86px]">
              <NumberTicker value="73505.3" />
              <span>ZK</span>
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
            <div className="flex gap-4 font-sfMono text-[72px] leading-[86px]">
              <NumberTicker value="73505.3" />
              <span>ZK</span>
            </div>
          </div>
        </div>
        <div className="mt-24 flex">
          <div className="relative max-w-[750px] bg-white py-3 pl-14 pr-6 font-sfMono text-base leading-[19px] -tracking-[0.0075em]">
            <Image
              className="absolute left-6 top-3"
              src="/icon/plus.svg"
              alt="plus"
              width={16}
              height={16}
            />
            <TextGenerateEffect
              words1ClassName="font-bold"
              words1="Every zkImagine NFT is carrying rewards. Pool 1 is for everyone. Pool 2 is for top 20 participants."
              words2="Your scores depend on your mint count and social activities. Rewards are claimable at the end of every sprint."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
