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
    <div className="flex h-[calc(100vh-56px)] min-h-[800px] items-center bg-campaign-preview bg-cover md:min-h-[1100px] lg:min-h-[1200px] xl:min-h-[1100px] 2xl:min-h-[900px]">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 2xl:flex-row 2xl:gap-12">
          <div className="flex flex-col justify-between 2xl:h-[293px]">
            <div className="w-[682px]">
              <FadeText
                className={cn(
                  inter.className,
                  'font-bold !italic',
                  'text-[40px] leading-[1.3] md:text-[56px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px]',
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
                  '-mt-2 mr-2 !italic text-[#7269E1]',
                  'text-[40px] leading-[1.3] md:text-right md:text-[56px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px]',
                )}
                direction="up"
                framerProps={{
                  show: { transition: { delay: 0.4, duration: 0.7 } },
                }}
                text="EARN ZK TOKEN"
              />
            </div>
            <BlurIn
              className="group mt-6 flex cursor-pointer items-center gap-4 md:justify-end 2xl:mt-0"
              onClick={() => {
                document.getElementById('featured-models')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
            >
              <SwapText
                initialText="Mint Now"
                finalText="Mint Now"
                supportsHover
                textClassName="text-[16px] font-semibold md:text-[16.8px] lg:text-[19.2px] xl:text-[21.6px] 2xl:text-[24px]"
              />
              <div
                className={cn(
                  'flex items-center justify-center rounded-full bg-[#1D1D1B] text-white transition-colors group-hover:bg-[#CDF138] group-hover:text-black',
                  'h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16',
                )}
              >
                <ArrowIcon
                  className={cn(
                    'transition-transform group-hover:rotate-45 group-hover:scale-105',
                    'w-[18px] md:w-5 lg:w-6 xl:w-7 2xl:w-8',
                  )}
                />
              </div>
            </BlurIn>
          </div>
          <div className="flex flex-1 justify-center">
            <div className="grid max-w-[709px] flex-1 grid-cols-3 justify-between gap-5">
              <div className="flex h-[148px] flex-col items-center justify-center bg-[#1D1D1B] md:h-[293px]">
                <div
                  className={cn(
                    'font-sfMono text-white',
                    'text-[14px] leading-[1.3] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]',
                  )}
                >
                  SPRINT {sprint}
                </div>
                <div
                  className={cn(
                    'font-sfMono font-bold',
                    'text-[40px] leading-[1.1875] md:text-[56px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px]',
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
                    'text-[24px] leading-[1.3] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px]',
                  )}
                >
                  DAY
                </div>
              </div>
              <div className="flex h-[148px] flex-col items-center justify-center bg-[#1D1D1B] md:h-[293px]">
                <div
                  className={cn(
                    'font-sfMono text-white',
                    'text-[14px] leading-[1.3] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]',
                  )}
                >
                  ENDS
                </div>
                <div
                  className={cn(
                    'font-sfMono font-bold',
                    'text-[40px] leading-[1.1875] md:text-[56px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px]',
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
                    'text-[24px] leading-[1.3] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px]',
                  )}
                >
                  HRS
                </div>
              </div>
              <div className="flex h-[148px] flex-col items-center justify-center bg-[#1D1D1B] md:h-[293px]">
                <div
                  className={cn(
                    'font-sfMono text-white',
                    'text-[14px] leading-[1.3] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]',
                  )}
                >
                  IN
                </div>
                <div
                  className={cn(
                    'font-sfMono font-bold',
                    'text-[40px] leading-[1.1875] md:text-[56px] lg:text-[64px] xl:text-[72px] 2xl:text-[80px]',
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
                    'text-[24px] leading-[1.3] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px]',
                  )}
                >
                  MINS
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col border-y-[3px] border-black xl:flex-row',
            'mt-[24px] md:mt-[32px] lg:mt-[38px] xl:mt-[44px] 2xl:mt-[50px]',
          )}
        >
          <div
            className={cn(
              'flex flex-1 flex-col gap-2 border-b-[3px] border-r-0 border-black xl:border-b-0 xl:border-r-[3px]',
              'py-6 md:py-[26px] lg:py-7 xl:py-[30px] 2xl:py-8',
              'pl-6 md:pl-[30px] lg:pl-9 xl:pl-[42px] 2xl:pl-12',
            )}
          >
            <div
              className={cn(
                'font-medium text-black/90',
                'text-[24px] leading-[1.2] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px]',
                inter.className,
              )}
            >
              Pool 1
            </div>
            <div
              className={cn(
                'flex gap-4 font-sfMono font-bold',
                'text-[34px] leading-[1.19] md:text-[42px] lg:text-[52px] xl:text-[62px] 2xl:text-[72px]',
              )}
            >
              <NumberTicker
                value={rewardsData?.pool1TotalRewards.toFixed(1) || '0.0'}
              />
              <span>ZK</span>
            </div>
          </div>
          <div
            className={cn(
              'flex flex-1 flex-col gap-2',
              'py-6 md:py-[26px] lg:py-7 xl:py-[30px] 2xl:py-8',
              'pl-6 md:pl-[30px] lg:pl-9 xl:pl-[42px] 2xl:pl-12',
            )}
          >
            <div
              className={cn(
                'font-medium text-black/90',
                'text-[24px] leading-[1.2] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px]',
                inter.className,
              )}
            >
              Pool 2
            </div>
            <div
              className={cn(
                'flex gap-4 font-sfMono font-bold',
                'text-[34px] leading-[1.19] md:text-[42px] lg:text-[52px] xl:text-[62px] 2xl:text-[72px]',
              )}
            >
              <NumberTicker
                value={rewardsData?.pool2TotalRewards.toFixed(1) || '0.0'}
              />
              <span>ZK</span>
            </div>
          </div>
        </div>

        <div className="mt-[24px] flex md:mt-[32px] lg:mt-[38px] xl:mt-[44px] 2xl:mt-[50px]">
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
