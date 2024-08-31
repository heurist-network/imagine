'use client'

import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import { useAccount } from 'wagmi'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  getLeaderboard,
  getUserRewards,
  LeaderboardData,
  UserRewardsData,
} from '@/lib/endpoints'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

const PAGE_SIZE = 20

export function Leaderboard() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<LeaderboardData[]>([])
  const [sprint, setSprint] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [userRank, setUserRank] = useState<UserRewardsData | null>(null)
  const { address } = useAccount()

  const getData = async (currentPage?: number) => {
    setLoading(true)

    try {
      const response = await getLeaderboard(undefined, currentPage ?? page)
      setData(response.items)
      setHasNextPage(response.pageInfo.hasNextPage)
      if (currentPage) setPage(currentPage)

      if (response.items[0]) {
        setSprint(response.items[0].epoch.toString())
      }

      // Fetch user's rank if address is available
      if (address) {
        const userRewards = await getUserRewards(address)
        setUserRank(userRewards)
      } else {
        setUserRank(null)
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [address])

  return (
    <div className="bg-[#F6F8FC] pt-[120px] pb-20 relative overflow-hidden">
      <div
        className={cn(
          'absolute -right-12 -top-20 h-80 w-80 animate-pop-blob rounded-sm bg-[#877DFF]/20 p-8 mix-blend-multiply blur-3xl filter',
        )}
      />
      <div
        className={cn(
          'absolute -bottom-24 -left-24 h-80 w-80 animate-pop-blob rounded-sm bg-[#CDF138]/80 p-8 mix-blend-multiply blur-3xl filter',
        )}
      />
      <div className="container">
        <div
          className={cn(
            'font-semibold -tracking-[0.0075em] text-[#080808]',
            'text-[24px] leading-[1.3] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px]',
            inter.className,
          )}
        >
          Sprint {sprint} Leaderboard
        </div>
        <div className="mt-1.5 text-sm mb-4 text-neutral-500 leading-6 lg:mb-8">
          Leaderboard data is refreshed every 5 minutes.
        </div>
        <div
          className={cn(
            'relative w-full overflow-auto',
            'mt-[35px] md:mt-[38px] lg:mt-[42px] xl:mt-[46px] 2xl:mt-[50px]',
          )}
        >
          <div className="border-spacing-y-4 w-full table">
            <div
              className={cn(
                'table-row font-semibold text-[#171717]/80',
                'text-[16px] leading-[1.2] lg:text-[20px]',
                inter.className,
              )}
            >
              <div className="pl-4 table-cell">Rank</div>
              <div className="min-w-[200px] pl-4 table-cell">Address</div>
              <div className="min-w-[200px] pl-4 table-cell">Mint Count</div>
              <div className="min-w-[200px] pl-4 table-cell">Imagine Score</div>
              <div className="min-w-[200px] pl-4 table-cell">
                ZK Token Rewords
              </div>
            </div>
            {/* User's rank (if available) */}
            {userRank && (
              <LeaderboardRow
                item={{
                  epoch_address: userRank.address,
                  mint_count: userRank.mint_count,
                  score: userRank.score,
                  zk_cashback: userRank.pool1_rewards + userRank.pool2_rewards,
                  epoch: parseInt(userRank.epoch),
                  ranking: userRank.ranking,
                  pay_in_eth: 0,
                }}
                index={userRank.ranking - 1} // Special index to indicate it's the user's row
                page={1}
                PAGE_SIZE={PAGE_SIZE}
                isUser={true}
              />
            )}

            {data.map((item: LeaderboardData, index: number) => (
              <LeaderboardRow
                key={index}
                item={item}
                index={index}
                page={page}
                PAGE_SIZE={PAGE_SIZE}
              />
            ))}
          </div>
          {loading && (
            <div className="flex bg-white/30 top-0 right-0 bottom-4 left-0 absolute items-center justify-center">
              <span className="h-6 animate-spin w-6 i-mingcute-loading-fill" />
            </div>
          )}
        </div>
        <div className="mt-[18px]">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={cn(
                    page === 1 ? 'cursor-not-allowed' : 'cursor-pointer',
                    'h-10 w-10 lg:h-16 lg:w-16',
                  )}
                  onClick={() => {
                    if (page > 1) {
                      getData(page - 1)
                    }
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  className="cursor-pointer h-10 w-10 lg:h-16 lg:w-16"
                  isActive
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
              {hasNextPage && (
                <PaginationItem>
                  <PaginationLink
                    className="cursor-pointer h-10 w-10 lg:h-16 lg:w-16"
                    onClick={() => {
                      getData(page + 1)
                    }}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  className={cn(
                    hasNextPage ? 'cursor-pointer' : 'cursor-not-allowed',
                    'h-10 w-10 lg:h-16 lg:w-16',
                  )}
                  onClick={() => {
                    if (hasNextPage) {
                      getData(page + 1)
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

interface LeaderboardRowProps {
  item: LeaderboardData
  index: number
  page: number
  PAGE_SIZE: number
  isUser?: boolean
}

export function LeaderboardRow({
  item,
  index,
  page,
  PAGE_SIZE,
  isUser,
}: LeaderboardRowProps) {
  return (
    <div
      className={cn(
        'font-SFMono table-row font-semibold text-[#171717]',
        'text-[16px] leading-[1.2] lg:text-[20px]',
      )}
    >
      <div
        className={cn(
          'table-cell items-center rounded-l-[16px] border border-[#E5E5E5] bg-[#F8FAFD]/60 py-7 pl-4',
          {
            'border-y-[3px] border-l-[3px] border-y-[#CDF138] border-l-[#CDF138]':
              isUser,
          },
        )}
      >
        {index + 1 + (page - 1) * PAGE_SIZE < 10
          ? `0${index + 1 + (page - 1) * PAGE_SIZE}`
          : index + 1 + (page - 1) * PAGE_SIZE}
      </div>
      <div
        className={cn('table-cell border-y bg-[#F8FAFD]/60 pl-4', {
          'border-y-[3px] border-y-[#CDF138]': isUser,
        })}
      >
        {isUser
          ? 'My Wallet'
          : `${item.epoch_address?.slice(0, 6)}...${item.epoch_address?.slice(-4)}`}
      </div>
      <div
        className={cn('table-cell border-y bg-[#F8FAFD]/60 pl-4', {
          'border-y-[3px] border-y-[#CDF138]': isUser,
        })}
      >
        {item.mint_count}
      </div>
      <div
        className={cn('table-cell border-y bg-[#F8FAFD]/60 pl-4', {
          'border-y-[3px] border-y-[#CDF138]': isUser,
        })}
      >
        {item.score}
      </div>
      <div
        className={cn(
          'table-cell rounded-r-[16px] border-y border-r bg-[#F8FAFD]/60 pl-4',
          {
            'border-y-[3px] border-r-[3px] border-y-[#CDF138] border-r-[#CDF138]':
              isUser,
          },
        )}
      >
        {item.zk_cashback.toFixed(2)}
      </div>
    </div>
  )
}
