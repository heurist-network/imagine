'use client'

import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getLeaderboard, LeaderboardData } from '@/lib/endpoints'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

const PAGE_SIZE = 20;

export function Leaderboard() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<LeaderboardData[]>([])
  const [sprint, setSprint] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)

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
    } catch (error) {
      console.error('Error fetching leaderboard data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="relative overflow-hidden bg-[#F6F8FC] pb-20 pt-[120px]">
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
      <div className="container px-0">
        <div
          className={cn(
            'text-[48px] font-semibold leading-[36px] -tracking-[0.0075em] text-[#080808]',
            inter.className,
          )}
        >
          Sprint {sprint} Leaderboard
        </div>
        <div className="relative mt-[50px] w-full overflow-auto">
          <div className="table w-full border-spacing-y-4">
            <div
              className={cn(
                'table-row text-[20px] font-semibold leading-[24px] text-[#171717]/80',
                inter.className,
              )}
            >
              <div className="table-cell pl-4">Rank</div>
              <div className="table-cell min-w-[200px] pl-4">Address</div>
              <div className="table-cell min-w-[200px] pl-4">Mint Count</div>
              <div className="table-cell min-w-[200px] pl-4">Imagine Score</div>
              <div className="table-cell min-w-[200px] pl-4">
                ZK Token Rewords
              </div>
            </div>
            {data.map((item: LeaderboardData, index: number) => (
              <div
                key={index}
                className="table-row font-sfMono text-[20px] font-semibold leading-[24px] text-[#171717]"
              >
                <div
                  className={cn(
                    'table-cell items-center rounded-l-[16px] border border-[#E5E5E5] bg-[#F8FAFD]/60 py-7 pl-4',
                    {
                      'border-y-[3px] border-l-[3px] border-y-[#CDF138] border-l-[#CDF138]':
                        index === 0 && page === 1,
                    },
                  )}
                >
                  {index + 1 + (page - 1) * PAGE_SIZE < 10
                    ? `0${index + 1 + (page - 1) * PAGE_SIZE}`
                    : index + 1 + (page - 1) * PAGE_SIZE}
                </div>
                <div
                  className={cn('table-cell border-y bg-[#F8FAFD]/60 pl-4', {
                    'border-y-[3px] border-y-[#CDF138]':
                      index === 0 && page === 1,
                  })}
                >
                  {item.epoch_address.slice(0, 6)}...
                  {item.epoch_address.slice(-4)}
                </div>
                <div
                  className={cn('table-cell border-y bg-[#F8FAFD]/60 pl-4', {
                    'border-y-[3px] border-y-[#CDF138]':
                      index === 0 && page === 1,
                  })}
                >
                  {item.mint_count}
                </div>

                <div
                  className={cn('table-cell border-y bg-[#F8FAFD]/60 pl-4', {
                    'border-y-[3px] border-y-[#CDF138]':
                      index === 0 && page === 1,
                  })}
                >
                  {item.score}
                </div>

                <div
                  className={cn(
                    'table-cell rounded-r-[16px] border-y border-r bg-[#F8FAFD]/60 pl-4',
                    {
                      'border-y-[3px] border-r-[3px] border-y-[#CDF138] border-r-[#CDF138]':
                        index === 0 && page === 1,
                    },
                  )}
                >
                  {item.zk_cashback}
                </div>
              </div>
            ))}
          </div>
          {loading && (
            <div className="absolute bottom-4 left-0 right-0 top-0 flex items-center justify-center bg-white/30">
              <span className="i-mingcute-loading-fill h-6 w-6 animate-spin" />
            </div>
          )}
        </div>
        <div className="mt-[18px]">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={
                    page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
                  }
                  onClick={() => {
                    if (page > 1) {
                      getData(page - 1)
                    }
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink className="cursor-pointer" isActive>
                  {page}
                </PaginationLink>
              </PaginationItem>
              {hasNextPage && (
                <PaginationItem>
                  <PaginationLink
                    className="cursor-pointer"
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
                  className={
                    hasNextPage ? 'cursor-pointer' : 'cursor-not-allowed'
                  }
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
