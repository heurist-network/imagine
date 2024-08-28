'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { ContractFunctionExecutionError, formatEther } from 'viem'
import { useAccount, useChains, usePublicClient, useWalletClient } from 'wagmi'

import { MagicCard } from '@/components/magicui/magic-card'
import Marquee from '@/components/magicui/marquee'
import { showSuccessToast } from '@/components/SuccessToast'
import { Market } from '@/constants/MarketConfig'
import { RewardType, useChestRewards } from '@/hooks/useChestRewards'
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

// New component for Pool Rewards
function PoolRewardCard({
  title,
  rewards,
  claimableRewards,
  onClaim,
}: {
  title: string
  rewards: string
  claimableRewards: bigint
  onClaim: () => void
}) {
  return (
    <div
      className={cn(
        'group flex cursor-pointer flex-col justify-between rounded-2xl bg-[#CDF138] py-[21px] transition-colors hover:bg-black xl:w-[466px]',
        'h-[140px] md:h-[154px] lg:h-[166px] xl:h-[178px]',
        'px-[24px] md:px-[32px] lg:px-[40px] xl:px-[48px]',
      )}
    >
      <div
        className={cn(
          'text-[#080808] transition-colors group-hover:text-[#CDF138]',
          'text-[16px] leading-[1.3] md:text-[20px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px]',
          inter.className,
        )}
      >
        {title}
      </div>
      <div
        className={cn(
          'font-sfMono font-bold text-[#1B1B1B] transition-colors group-hover:text-[#CDF138]',
          'text-[24px] leading-[1.3] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px]',
        )}
      >
        {rewards}
      </div>
      <div className="flex justify-between">
        <div className="line-clamp-1 rounded-[2px] bg-white px-2">
          Claimable:{' '}
          <span className="font-bold">{formatEther(claimableRewards)} ZK</span>
        </div>
        <div
          className={`flex cursor-pointer items-center gap-2 transition-colors group-hover:text-[#CDF138] ${
            claimableRewards === BigInt(0)
              ? 'pointer-events-none opacity-50'
              : ''
          }`}
          onClick={onClaim}
        >
          <div className="font-semibold underline">Claim</div>
          <Arrow className="transition-transform group-hover:rotate-45" />
        </div>
      </div>
    </div>
  )
}

export function CampaignReward() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({
    chainId: walletClient?.chain?.id,
  })

  const [userRewards, setUserRewards] = useState<UserRewardsData | null>(null)
  const { rewards, claimRewards } = useChestRewards(Market.zksync)

  useEffect(() => {
    const fetchUserRewards = async () => {
      if (address) {
        try {
          const rewards = await getUserRewards(address)
          setUserRewards(rewards)
        } catch (error) {
          console.error('Error fetching user rewards:', error)
        }
      } else {
        setUserRewards(null)
      }
    }

    fetchUserRewards()
  }, [address])

  const handleClaimRewards = async (poolType: RewardType) => {
    if (!publicClient) {
      toast.error('Error claiming rewards: Wallet not connected')
      return
    }

    try {
      const tx = await claimRewards(poolType)
      console.log('claim rewards tx', tx)
      showSuccessToast(
        publicClient,
        'Rewards claimed successfully!',
        tx?.transactionHash,
      )
    } catch (error) {
      console.error('Error claiming rewards:', error)
      if (
        error instanceof ContractFunctionExecutionError &&
        error.message.includes('No rewards to claim')
      ) {
        toast.error(
          'No claimable rewards at this time. Please try again later.',
        )
      } else {
        toast.error('Error claiming rewards. Please try again.')
      }
    } finally {
      // Refresh user rewards after claiming
      if (address) {
        const updatedRewards = await getUserRewards(address)
        setUserRewards(updatedRewards)
      }
    }
  }

  return (
    <div className="relative min-h-[1040px]">
      <div className="absolute inset-0 flex flex-col gap-[55px] overflow-y-hidden bg-white pt-[76px]">
        <Marquee className="[--duration:32s] [--gap:100px]">
          <Image
            className="h-[129px] -translate-x-[250px]"
            src="/campaign/create-to-earn.png"
            alt="reward"
            width={1355}
            height={129}
          />
        </Marquee>
        <Marquee className="[--duration:34s] [--gap:100px]">
          <Image
            className="h-[129px] -translate-x-[30px]"
            src="/campaign/create-to-earn.png"
            alt="reward"
            width={1355}
            height={129}
          />
        </Marquee>
        <Marquee className="[--duration:42s] [--gap:100px]">
          <Image
            className="h-[129px] -translate-x-[190px]"
            src="/campaign/create-to-earn.png"
            alt="reward"
            width={1355}
            height={129}
          />
        </Marquee>
        <Marquee className="[--duration:38s] [--gap:100px]">
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

        <Marquee className="[--duration:37s] [--gap:100px] xl:hidden">
          <Image
            className="h-[129px] -translate-x-[480px]"
            src="/campaign/create-to-earn.png"
            alt="reward"
            width={1355}
            height={129}
          />
        </Marquee>
        <Marquee className="[--duration:26s] [--gap:100px] xl:hidden">
          <Image
            className="h-[129px] -translate-x-[480px]"
            src="/campaign/create-to-earn.png"
            alt="reward"
            width={1355}
            height={129}
          />
        </Marquee>
      </div>
      <div className="container relative z-10 flex flex-col gap-5 py-[32px] md:py-[100px] lg:py-[163px] xl:flex-row xl:py-[233px]">
        <div className="flex flex-col justify-between gap-5 xl:gap-0">
          <div
            className={cn(
              'group flex flex-col justify-between rounded-2xl bg-[#CDF138] py-[33px] transition-colors hover:bg-black xl:w-[466px]',
              'h-[140px] md:h-[154px] lg:h-[166px] xl:h-[178px]',
              'px-[24px] md:px-[32px] lg:px-[40px] xl:px-[48px]',
            )}
          >
            <div className="flex justify-between">
              <div
                className={cn(
                  'text-[#080808] transition-colors group-hover:text-[#CDF138]',
                  'text-[16px] leading-[1.3] md:text-[20px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px]',
                  inter.className,
                )}
              >
                My Score
              </div>

              <div
                className={cn(
                  'text-[#080808] transition-colors group-hover:text-[#CDF138]',
                  'text-[16px] leading-[1.3] md:text-[20px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px]',
                  inter.className,
                )}
              >
                Rank
              </div>
            </div>
            <div className="flex justify-between">
              <div
                className={cn(
                  'font-sfMono font-bold text-[#1B1B1B] transition-colors group-hover:text-[#CDF138]',
                  'text-[24px] leading-[1.3] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px]',
                )}
              >
                {userRewards ? userRewards.score.toLocaleString() : '---'}
              </div>
              <div
                className={cn(
                  'font-sfMono font-bold text-[#1B1B1B] transition-colors group-hover:text-[#CDF138]',
                  'text-[24px] leading-[1.3] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px]',
                )}
              >
                {userRewards ? userRewards.ranking : '---'}
              </div>
            </div>
          </div>
          <PoolRewardCard
            title="My Pool 1 Rewards"
            rewards={
              userRewards ? userRewards.pool1_rewards.toLocaleString() : '---'
            }
            claimableRewards={rewards.silverRewards}
            onClaim={() => {
              if (rewards.silverRewards > BigInt(0)) {
                handleClaimRewards(RewardType.SILVER)
              }
            }}
          />

          <PoolRewardCard
            title="My Pool 2 Rewards"
            rewards={
              userRewards ? userRewards.pool2_rewards.toLocaleString() : '---'
            }
            claimableRewards={rewards.goldRewards}
            onClaim={() => {
              if (rewards.goldRewards > BigInt(0)) {
                handleClaimRewards(RewardType.GOLD)
              }
            }}
          />
        </div>
        <MagicCard
          className={cn(
            'flex h-auto w-auto flex-1 flex-col rounded-2xl bg-campaign-reward-work bg-cover text-white xl:min-h-[574px]',
            'px-[24px] md:px-[32px] lg:px-[40px] xl:px-[48px]',
            'py-[31px] md:py-[37px] lg:py-[42px] xl:py-[48px]',
          )}
          containerClassName="flex-1 flex flex-col"
          gradientColor="#CDF138"
          gradientOpacity={0.25}
        >
          <div
            className={cn(
              'text-[24px] font-bold leading-[1.2] md:text-[32px] lg:text-[40px] xl:text-[48px]',
              inter.className,
            )}
          >
            How does it work?
          </div>
          <div
            className={cn(
              'flex flex-1 flex-col justify-between -tracking-[0.0075em]',
              'mt-[24px] md:mt-[38px] lg:mt-[51px] xl:mt-[64px]',
              inter.className,
            )}
          >
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="group/item flex flex-1 flex-col gap-2">
                <div
                  className={cn(
                    'transition-all group-hover/item:translate-x-1 group-hover/item:text-[#CDF138]',
                    'text-[16px] leading-[1.2] md:text-[18px] lg:text-[21px] xl:text-[24px]',
                  )}
                >
                  Step 1
                </div>
                <div className="text-[16px] font-semibold leading-[1.2] md:text-[18px] lg:text-[21px] xl:text-[24px]">
                  Choose a Model
                </div>
                <div className="font-sfMono text-[14px] leading-[1.125] text-white/90 xl:text-[16px]">
                  Some models are general-purpose and some models excel at
                  creating a specific visual style.
                </div>
              </div>
              <div className="group/item flex flex-1 flex-col gap-2">
                <div
                  className={cn(
                    'transition-all group-hover/item:translate-x-1 group-hover/item:text-[#CDF138]',
                    'text-[16px] leading-[1.2] md:text-[18px] lg:text-[21px] xl:text-[24px]',
                  )}
                >
                  Step 2
                </div>
                <div className="text-[16px] font-semibold leading-[1.2] md:text-[18px] lg:text-[21px] xl:text-[24px]">
                  Write a Prompt
                </div>
                <div className="font-sfMono text-[14px] leading-[1.125] text-white/90 xl:text-[16px]">
                  Describe the image using natural language to convey your
                  wishes. It's recommended to use keywords separated by commas.
                  Click on the preset images to get inspired.
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-6 md:flex-row lg:mt-10 xl:mt-0">
              <div className="group/item flex flex-1 flex-col gap-2">
                <div
                  className={cn(
                    'transition-all group-hover/item:translate-x-1 group-hover/item:text-[#CDF138]',
                    'text-[16px] leading-[1.2] md:text-[18px] lg:text-[21px] xl:text-[24px]',
                  )}
                >
                  Step 3
                </div>
                <div className="text-[16px] font-semibold leading-[1.2] md:text-[18px] lg:text-[21px] xl:text-[24px]">
                  Generate and Mint
                </div>
                <div className="font-sfMono text-[14px] leading-[1.125] text-white/90 xl:text-[16px]">
                  Mint fee is 0.0006 ETH on ZKsync Era. Partner NFT holders and
                  selected Heurist community members get one chance of free mint
                  per day.
                </div>
              </div>
              <div className="group/item flex flex-1 flex-col gap-2">
                <div
                  className={cn(
                    'transition-all group-hover/item:translate-x-1 group-hover/item:text-[#CDF138]',
                    'text-[16px] leading-[1.2] md:text-[18px] lg:text-[21px] xl:text-[24px]',
                  )}
                >
                  Step 4
                </div>
                <div className="text-[16px] font-semibold leading-[1.2] md:text-[18px] lg:text-[21px] xl:text-[24px]">
                  Upload and Share
                </div>
                <div className="font-sfMono text-[14px] leading-[1.125] text-white/90 xl:text-[16px]">
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
