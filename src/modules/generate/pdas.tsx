'use client'

import { useEffect, useState } from 'react'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { useAccount } from 'wagmi'

import { getPDAs } from '@/app/actions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function PDAs() {
  const account = useAccount()
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<any[]>([])

  const getList = async (address: string) => {
    try {
      setLoading(true)
      const res = await getPDAs(address)
      if (!res.data) return setList([])
      console.log(res.data.PDAs, 'PDAs')
      setList(res.data.PDAs)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!account.address) return

    getList(account.address)
  }, [account.address])

  if (!account.address) return <ConnectButton />

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

  if (!list.length) return <div className="py-4">No data</div>

  return (
    <div className="mt-4 flex flex-col gap-2">
      {list.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.id}</CardTitle>
            <CardDescription className="line-clamp-2">
              <Link href={item.arweaveUrl} target="_blank">
                {item.arweaveUrl}
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label>Last Updated</Label>
                  <div className="text-sm text-muted-foreground">
                    {formatDistance(new Date(item.lastUpdated), new Date(), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
