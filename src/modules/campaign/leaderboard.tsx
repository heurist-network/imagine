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
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export function Leaderboard() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<any>([])
  const [hasNextPage, setHasNextPage] = useState(false)

  const getData = async (currentPage?: number) => {
    setData([])

    try {
      const res = await fetch(
        `https://xl53ziu42g.execute-api.us-east-1.amazonaws.com/prod/leaderboard-stats?pageSize=10&page=${currentPage ?? page}`,
      )
      const data = await res.json()
      if (!data.items) {
        setData([])
        return
      }
      setData(data.items)
      setHasNextPage(data.pageInfo.hasNextPage)
    } catch (error) {
      setData([])
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="relative overflow-hidden bg-[#F6F8FC] pb-20 pt-[120px]">
      <div
        className={cn(
          'animate-pop-blob absolute -right-12 -top-20 h-80 w-80 rounded-sm bg-[#877DFF]/20 p-8 mix-blend-multiply blur-3xl filter',
        )}
      />
      <div
        className={cn(
          'animate-pop-blob absolute -bottom-24 -left-24 h-80 w-80 rounded-sm bg-[#CDF138]/80 p-8 mix-blend-multiply blur-3xl filter',
        )}
      />
      <div className="container px-0">
        <div
          className={cn(
            'text-[48px] font-semibold leading-[36px] -tracking-[0.0075em] text-[#080808]',
            inter.className,
          )}
        >
          Mint Leaderboard
        </div>
        <div className="mt-[50px] w-full overflow-auto">
          <div className="table w-full border-spacing-y-4">
            <div
              className={cn(
                'table-row text-[20px] font-semibold leading-[24px] text-[#171717]/80',
                inter.className,
              )}
            >
              <div className="table-cell pl-4">Rank</div>
              <div className="table-cell min-w-[200px] pl-4">Address</div>
              <div className="table-cell min-w-[200px] pl-4">Score</div>
              <div className="table-cell min-w-[200px] pl-4">
                ZK Token Rewords
              </div>
            </div>
            {data.map((item: any, index: number) => (
              <div
                key={index}
                className="table-row font-sfMono text-[20px] font-semibold leading-[24px] text-[#171717]"
              >
                <div className="table-cell items-center rounded-l-[16px] border bg-[#F8FAFD]/60 py-7 pl-4">
                  {index + 1 + (page - 1) * 10 < 10
                    ? `0${index + 1 + (page - 1) * 10}`
                    : index + 1 + (page - 1) * 10}
                </div>
                <div className="table-cell border-y bg-[#F8FAFD]/60 pl-4">
                  {item.epoch_address.slice(0, 6)}...
                  {item.epoch_address.slice(-4)}
                </div>
                <div className="table-cell border-y bg-[#F8FAFD]/60 pl-4">
                  {item.score}
                </div>
                <div className="table-cell rounded-r-[16px] border-y border-r bg-[#F8FAFD]/60 pl-4">
                  87654
                </div>
              </div>
            ))}
          </div>
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
                      setPage(page - 1)
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
                      setPage(page + 1)
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
                      setPage(page + 1)
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
