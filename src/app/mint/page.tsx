'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const invoices = [
  {
    invoice: 'INV001',
    walletAddress: '0xabcd...1234',
    nftBalance: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    walletAddress: '0xabcd...1234',
    nftBalance: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    walletAddress: '0xabcd...1234',
    nftBalance: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    walletAddress: '0xabcd...1234',
    nftBalance: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    walletAddress: '0xabcd...1234',
    nftBalance: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    walletAddress: '0xabcd...1234',
    nftBalance: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    walletAddress: '0xabcd...1234',
    nftBalance: '$300.00',
    paymentMethod: 'Credit Card',
  },
]

export default function Mint() {
  const [mintType, setMintType] = useState('quick')

  return (
    <main className="flex flex-1 flex-col">
      <div className="container pt-8">
        <div className="text-3xl font-semibold -tracking-[0.0075em] text-neutral-900">
          Campaign Statistics & Rewards
        </div>
        <div className="mt-8 grid grid-cols-4 overflow-hidden rounded-[6px] border border-neutral-200">
          <div className="flex flex-col items-center gap-4 border-b border-r border-neutral-200 bg-[red] pb-4 pt-6 font-semibold -tracking-[0.005em] text-neutral-900 md:bg-transparent">
            <div className="text-xl">Sprint</div>
            <div className="text-2xl">1</div>
          </div>
          <div className="flex flex-col items-center gap-4 border-b border-r border-neutral-200 pb-4 pt-6 font-semibold -tracking-[0.005em] text-neutral-900">
            <div className="text-xl">Reward Pool</div>
            <div className="text-2xl">9,999.99 ETH</div>
          </div>
          <div className="flex flex-col items-center gap-4 border-b border-r border-neutral-200 pb-4 pt-6 font-semibold -tracking-[0.005em] text-neutral-900">
            <div className="text-xl">My Power</div>
            <div className="text-2xl">2,000</div>
          </div>
          <div className="flex flex-col items-center gap-4 border-b border-neutral-200 pb-4 pt-6 font-semibold -tracking-[0.005em] text-neutral-900">
            <div className="text-xl">My ZK Reward</div>
            <div className="text-2xl">123,456 ZK</div>
          </div>
          <div className="flex items-center justify-center gap-2 border-r border-neutral-200 bg-slate-50 py-5">
            <Image src="/icon/timer.svg" alt="timer" width={24} height={24} />
            <div className="text-sm leading-6 text-neutral-900">
              <span className="font-bold">13 </span>
              <span>Days, </span>
              <span className="font-bold">20 </span>
              <span>Hours</span>
            </div>
          </div>
          <div className="flex items-center justify-center border-r border-neutral-200 bg-slate-50">
            <Button className="rounded-full">How to Earn Rewards</Button>
          </div>
          <div className="flex items-center justify-center border-r border-neutral-200 bg-slate-50">
            <Link className="text-sm text-neutral-900 underline" href="#">
              What’s My Power?
            </Link>
          </div>
          <div className="flex items-center justify-center bg-slate-50">
            <Button className="rounded-full">Claim Rewards</Button>
          </div>
        </div>
      </div>
      <div className="mt-16 bg-slate-50">
        <div className="container py-8">
          <div className="text-3xl font-semibold -tracking-[0.0075em] text-neutral-900">
            Featured Models of the Day
          </div>
          <div className="mb-8 mt-1.5 text-sm leading-6 text-neutral-500">
            Select a model from today's curated collection to generate and mint.
          </div>

          <div className="flex items-center gap-16">
            <div className="flex h-[552px] flex-1 flex-col gap-8">
              <Tabs defaultValue="model1">
                <TabsList className="border border-slate-300 bg-white">
                  <TabsTrigger
                    className="w-[117px] data-[state=active]:bg-black data-[state=active]:text-white"
                    value="model1"
                  >
                    Model 1
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-[117px] data-[state=active]:bg-black data-[state=active]:text-white"
                    value="model2"
                  >
                    Model 2
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-[117px] data-[state=active]:bg-black data-[state=active]:text-white"
                    value="model3"
                  >
                    Model 3
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-[117px] data-[state=active]:bg-black data-[state=active]:text-white"
                    value="model4"
                  >
                    Model 4
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-[117px] data-[state=active]:bg-black data-[state=active]:text-white"
                    value="model5"
                  >
                    Model 5
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div>
                <div className="flex items-center justify-center">
                  <div className="h-[240px] w-[165px] translate-x-5 rotate-[15deg] rounded-md bg-fuchsia-200">
                    asf
                  </div>
                  <div className="z-10 h-[392px] w-[259px] rounded-md bg-sky-200">
                    asf
                  </div>
                  <div className="h-[240px] w-[165px] -translate-x-5 -rotate-[15deg] rounded-md bg-rose-200">
                    asf
                  </div>
                </div>
                <div className="mt-8 flex flex-col items-center justify-center">
                  <div className="text-lg font-semibold text-neutral-900">
                    YamersCartoonArcadia
                  </div>
                  <div className="text-lg font-semibold text-gray-500">
                    Created by <span className="text-neutral-900">Yamer</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold">
                Quick Generate and Mint
              </div>
              <div className="mb-4 mt-1.5 text-sm leading-6 text-slate-500">
                Generate an image instantly with a pre-filled prompt. For more
                customization options, use Advanced Mint.
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="prompt">Email</Label>
                <Input
                  className="rounded-[6px]"
                  id="prompt"
                  placeholder="Prompt"
                  autoComplete="off"
                />
              </div>
              <div className="mt-4 flex items-center gap-6">
                <Button className="rounded-full bg-[#CDF138] text-black hover:bg-[#CDF138]/90">
                  Generate and Mint
                </Button>
                <Link href="#" className="underline">
                  Advanced Mint{' '}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-16">
        <div className="text-3xl font-semibold -tracking-[0.0075em] text-neutral-900">
          Mint Leaderboard
        </div>
        <div className="mt-8">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Wallet address</TableHead>
                <TableHead>NFT Balance</TableHead>
                <TableHead className="text-right">Imagine Power</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.walletAddress}</TableCell>
                  <TableCell>{invoice.nftBalance}</TableCell>
                  <TableCell className="text-right">
                    {invoice.paymentMethod}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  )
}
