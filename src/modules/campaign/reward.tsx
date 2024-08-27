'use client'

import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useAccount } from 'wagmi'

import { MagicCard } from '@/components/magicui/magic-card'
import Marquee from '@/components/magicui/marquee'
import { getUserRewards, UserRewardsData } from '@/lib/endpoints'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M14 2L2.1519 13.8481M14 2C12.6471 5.37441 12.4619 9.13105 13.4732 12.6832L13.8481 14M14 2C10.6256 3.35287 6.86895 3.53812 3.31679 2.5268L2 2.1519"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="bevel"
      />
    </svg>
  )
}

export function CampaignReward() {
  const { address } = useAccount()
  const [userRewards, setUserRewards] = useState<UserRewardsData | null>(null)

  useEffect(() => {
    const fetchUserRewards = async () => {
      if (address) {
        try {
          const rewards = await getUserRewards(address)
          setUserRewards(rewards)
        } catch (error) {
          console.error('Error fetching user rewards:', error)
        }
      }
    }

    fetchUserRewards()
  }, [address])

  return (
    <div className="relative h-[1040px]">
      <div className="absolute inset-0 flex flex-col gap-[55px] bg-white pt-[76px]">
        <Marquee className="[--duration:30s] [--gap:100px]">
          <Image
            className="h-[129px] -translate-x-[250px]"
            src="/campaign/create-to-earn.png"
            alt="reward"
            width={1355}
            height={129}
          />
        </Marquee>
        <Marquee className="[--duration:30s] [--gap:100px]">
          <Image
            className="h-[129px] -translate-x-[30px]"
            src="/campaign/create-to-earn.png"
            alt="reward"
            width={1355}
            height={129}
          />
        </Marquee>
        <Marquee className="[--duration:30s] [--gap:100px]">
          <Image
            className="h-[129px] -translate-x-[190px]"
            src="/campaign/create-to-earn.png"
            alt="reward"
            width={1355}
            height={129}
          />
        </Marquee>
        <Marquee className="[--duration:30s] [--gap:100px]">
          <Image
            className="h-[129px] -translate-x-[340px]"
            src="/campaign/create-to-earn.png"
            alt="reward"
            width={1355}
            height={129}
          />
        </Marquee>
        <Marquee className="[--duration:30s] [--gap:100px]">
          <Image
            className="h-[129px] -translate-x-[480px]"
            src="/campaign/create-to-earn.png"
            alt="reward"
            width={1355}
            height={129}
          />
        </Marquee>
      </div>
      <div className="container relative z-10 flex gap-5 px-0 py-[233px]">
        <div className="flex flex-col gap-5">
          <div className="group flex h-[178px] w-[466px] flex-col gap-2 rounded-2xl bg-[#CDF138] px-12 py-[33px] transition-colors hover:bg-black">
            <div
              className={cn(
                'text-[32px] leading-[42px] text-[#080808] transition-colors group-hover:text-[#CDF138]',
                inter.className,
              )}
            >
              My Score
            </div>
            <div className="font-sfMono text-[48px] font-bold leading-[62px] text-[#1B1B1B] transition-colors group-hover:text-[#CDF138]">
              {userRewards ? userRewards.score.toLocaleString() : '---'}
            </div>
          </div>
          <div className="group flex h-[178px] w-[466px] cursor-pointer flex-col gap-2 rounded-2xl bg-[#CDF138] px-12 py-[21px] transition-colors hover:bg-black">
            <div
              className={cn(
                'text-[32px] leading-[42px] text-[#080808] transition-colors group-hover:text-[#CDF138]',
                inter.className,
              )}
            >
              My Pool 1 Rewards
            </div>
            <div className="font-sfMono text-[48px] font-bold leading-[62px] text-[#1B1B1B] transition-colors group-hover:text-[#CDF138]">
              {userRewards ? userRewards.pool1_rewards.toFixed(2) : '---'} ZK
            </div>
            <div className="flex justify-between">
              <div className="rounded-[2px] bg-white px-2">
                Claimable: <span className="font-bold">34.45 ZK</span>
              </div>
              <div className="flex items-center gap-2 transition-colors group-hover:text-[#CDF138]">
                <div className="font-semibold underline">Claim</div>
                <Arrow className="transition-transform group-hover:rotate-45" />
              </div>
            </div>
          </div>
          <div className="group flex h-[178px] w-[466px] cursor-pointer flex-col gap-2 rounded-2xl bg-[#CDF138] px-12 py-[21px] transition-colors hover:bg-black">
            <div
              className={cn(
                'text-[32px] leading-[42px] text-[#080808] transition-colors group-hover:text-[#CDF138]',
                inter.className,
              )}
            >
              My Pool 2 Rewards
            </div>
            <div className="font-sfMono text-[48px] font-bold leading-[62px] text-[#1B1B1B] transition-colors group-hover:text-[#CDF138]">
              {userRewards ? userRewards.pool2_rewards.toFixed(2) : '---'} ZK
            </div>
            <div className="flex justify-between">
              <div className="rounded-[2px] bg-white px-2">
                Claimable: <span className="font-bold">34.45 ZK</span>
              </div>
              <div className="flex items-center gap-2 transition-colors group-hover:text-[#CDF138]">
                <div className="font-semibold underline">Claim</div>
                <Arrow className="transition-transform group-hover:rotate-45" />
              </div>
            </div>
          </div>
        </div>
        <MagicCard
          className="flex h-auto w-auto flex-1 flex-col rounded-2xl bg-campaign-reward-work bg-cover p-12 text-white"
          containerClassName="flex-1 flex flex-col"
          gradientColor="#CDF138"
          gradientOpacity={0.25}
        >
          <div
            className={cn(
              'text-[48px] font-bold leading-[58px]',
              inter.className,
            )}
          >
            How does it work?
          </div>
          <div
            className={cn(
              'mt-16 flex flex-1 flex-col justify-between -tracking-[0.0075em]',
              inter.className,
            )}
          >
            <div className="flex gap-6">
              <div className="group/item flex flex-1 flex-col gap-2">
                <div className="text-[24px] leading-[29px] transition-all group-hover/item:translate-x-1 group-hover/item:text-[#CDF138]">
                  Step 1
                </div>
                <div className="text-[24px] font-semibold leading-[29px]">
                  Choose a model
                </div>
                <div className="font-sfMono text-base leading-[18px] text-white/90">
                  Some models are general-purpose and some models excel at
                  creating a specific visual style.
                </div>
              </div>
              <div className="group/item flex flex-1 flex-col gap-2">
                <div className="text-[24px] leading-[29px] transition-all group-hover/item:translate-x-1 group-hover/item:text-[#CDF138]">
                  Step 2
                </div>
                <div className="text-[24px] font-semibold leading-[29px]">
                  Write a prompt
                </div>
                <div className="font-sfMono text-base leading-[18px] text-white/90">
                  Describe the image using natural language to convey your
                  wishes. It's recommended to use key words separated by commas.
                  Click on the preset images to get inspired.
                </div>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="group/item flex flex-1 flex-col gap-2">
                <div className="text-[24px] leading-[29px] transition-all group-hover/item:translate-x-1 group-hover/item:text-[#CDF138]">
                  Step 3
                </div>
                <div className="text-[24px] font-semibold leading-[29px]">
                  Generate and min
                </div>
                <div className="font-sfMono text-base leading-[18px] text-white/90">
                  Mint fee is 0.0006 ETH on ZKsync Era. Partner NFT holders and
                  selected Heurist community members get one chance of free mint
                  per day.
                </div>
              </div>
              <div className="group/item flex flex-1 flex-col gap-2">
                <div className="text-[24px] leading-[29px] transition-all group-hover/item:translate-x-1 group-hover/item:text-[#CDF138]">
                  Step 4
                </div>
                <div className="text-[24px] font-semibold leading-[29px]">
                  Upload and share
                </div>
                <div className="font-sfMono text-base leading-[18px] text-white/90">
                  Upload the artwork to Gateway Network and share on X (Twitter)
                  to earn additional scores.
                </div>
              </div>
            </div>
          </div>
        </MagicCard>
      </div>
    </div>
  )
}
