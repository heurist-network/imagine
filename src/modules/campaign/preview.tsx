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
import { EpochRewardsData, getEpochRewards } from '@/lib/endpoints'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export function CampaignPreview() {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [sprint, setSprint] = useState('')
  const [rewardsData, setRewardsData] = useState<EpochRewardsData | null>(null)

  const calculateTime = () => {
    const now = new Date()
    const diff = rewardsData?.epochCutoffTime
      ? new Date(rewardsData.epochCutoffTime).getTime() - now.getTime()
      : 0
    const days = Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0)
    const hours = Math.max(
      Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      0,
    )
    const minutes = Math.max(
      Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      0,
    )

    setDays(days)
    setHours(hours)
    setMinutes(minutes)

    const currentSprint = rewardsData
      ? rewardsData.currentEpoch.split('_')[1]
      : ''
    setSprint(currentSprint)
  }

  useLayoutEffect(() => {
    calculateTime()
    fetchRewardsData()
  }, [])

  useInterval(() => {
    calculateTime()
  }, 1000)

  const fetchRewardsData = async () => {
    try {
      // optional epoch param: 'epoch_1'
      const data = await getEpochRewards()
      setRewardsData(data)
    } catch (error) {
      console.error('Error fetching epoch rewards:', error)
    }
  }

  return (
    <div className="bg-campaign-preview bg-cover">
      <div
        className={cn(
          's2:px-8 container max-w-screen-2xl px-4',
          's2:pt-[135px] py-[134px] pt-16',
        )}
      >
        <div className="s5:flex-row flex flex-col gap-12">
          <div className="s5:w-[682px] w-full">
            <FadeText
              className={cn(
                inter.className,
                'font-bold !italic leading-[104px]',
                's2:text-[80px] text-[40px]',
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
                '-mt-2 mr-2 !italic leading-[104px] text-[#7269E1]',
                's2:text-[80px] text-[40px]',
                's2:text-right text-left',
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
                  textClassName="s2:text-[24px] text-[16px] font-semibold"
                />
                <div className="s2:h-16 s2:w-16 flex h-8 w-8 items-center justify-center rounded-full bg-[#1D1D1B] text-white transition-colors group-hover:bg-[#CDF138] group-hover:text-black">
                  <ArrowIcon className="s2:w-8 w-[18px] transition-transform group-hover:rotate-45 group-hover:scale-105" />
                </div>
              </BlurIn>
            </div>
          </div>
          <div className="flex flex-1 justify-center">
            <div className="s5:max-w-none s2:max-w-[684px] grid max-w-[400px] flex-1 grid-cols-3 gap-5">
              <div className="s5:py-0 s2:py-12 flex flex-col items-center justify-center gap-1 bg-[#1d1d1b] py-6">
                <div
                  className={cn(
                    'font-sfMono text-white',
                    's2:text-[24px] text-[14px] leading-[1.3]',
                  )}
                >
                  SPRINT {sprint}
                </div>
                <div
                  className={cn(
                    'font-sfMono font-bold',
                    's2:text-[80px] text-[40px] leading-[1.1875]',
                  )}
                >
                  <NumberTicker
                    className="text-[#cdf138]"
                    value={String(days)}
                  />
                </div>
                <div
                  className={cn(
                    'font-sfMono font-light text-[#cdf138]',
                    's2:text-[48px] text-[24px] leading-[1.3]',
                  )}
                >
                  DAY
                </div>
              </div>
              <div className="s5:py-0 s2:py-12 flex flex-col items-center justify-center gap-1 bg-[#1d1d1b] py-6">
                <div
                  className={cn(
                    'font-sfMono text-white',
                    's2:text-[24px] text-[14px] leading-[1.3]',
                  )}
                >
                  ENDS
                </div>
                <div
                  className={cn(
                    'font-sfMono font-bold',
                    's2:text-[80px] text-[40px] leading-[1.1875]',
                  )}
                >
                  <NumberTicker
                    className="text-[#cdf138]"
                    value={String(hours)}
                  />
                </div>
                <div
                  className={cn(
                    'font-sfMono font-light text-[#cdf138]',
                    's2:text-[48px] text-[24px] leading-[1.3]',
                  )}
                >
                  HRS
                </div>
              </div>
              <div className="s5:py-0 s2:py-12 flex flex-col items-center justify-center gap-1 bg-[#1d1d1b] py-6">
                <div
                  className={cn(
                    'font-sfMono text-white',
                    's2:text-[24px] text-[14px] leading-[1.3]',
                  )}
                >
                  IN
                </div>
                <div
                  className={cn(
                    'font-sfMono font-bold',
                    's2:text-[80px] text-[40px] leading-[1.1875]',
                  )}
                >
                  <NumberTicker
                    className="text-[#cdf138]"
                    value={String(minutes)}
                  />
                </div>
                <div
                  className={cn(
                    'font-sfMono font-light text-[#cdf138]',
                    's2:text-[48px] text-[24px] leading-[1.3]',
                  )}
                >
                  MINS
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="s3:flex-row mt-24 flex flex-col border-y-[3px] border-black">
          <div className="s3:border-r-[3px] s3:border-b-0 flex flex-1 flex-col gap-4 border-b-[3px] border-black py-12 pl-12">
            <div
              className={cn(
                'text-[48px] leading-[58px] text-black/90',
                inter.className,
              )}
            >
              Pool 1
            </div>
            <div className="flex gap-4 font-sfMono text-[72px] leading-[86px]">
              <NumberTicker
                value={rewardsData?.pool1TotalRewards.toFixed(1) || '0.0'}
              />
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
              <NumberTicker
                value={rewardsData?.pool2TotalRewards.toFixed(1) || '0.0'}
              />
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
