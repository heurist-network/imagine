'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

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
  {
    invoice: 'INV008',
    walletAddress: '0xabcd...1234',
    nftBalance: '$300.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV009',
    walletAddress: '0xabcd...1234',
    nftBalance: '$300.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV010',
    walletAddress: '0xabcd...1234',
    nftBalance: '$300.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV011',
    walletAddress: '0xabcd...1234',
    nftBalance: '$300.00',
    paymentMethod: 'Credit Card',
  },
]

export default function Mint() {
  const [mintType, setMintType] = useState<'quick' | 'advanced'>('quick')
  const [images, setImages] = useState([
    {
      id: '1',
      name: 'image1',
    },
    {
      id: '2',
      name: 'image2',
    },
    {
      id: '3',
      name: 'image3',
    },
  ])

  return (
    <main className="flex flex-col flex-1 pb-20">
      <div className="container pt-8">
        <div className="font-semibold text-3xl text-neutral-900 -tracking-[0.0075em]">
          Campaign Statistics & Rewards
        </div>
        <div className="border border-neutral-200 rounded-[6px] mt-8 grid grid-cols-4 overflow-hidden">
          <div className="bg-[red] border-b border-r flex flex-col font-semibold border-neutral-200 pt-6 pb-4 text-neutral-900 -tracking-[0.005em] gap-4 items-center md:bg-transparent">
            <div className="text-xl">Sprint</div>
            <div className="text-2xl">1</div>
          </div>
          <div className="border-b border-r flex flex-col font-semibold border-neutral-200 pt-6 pb-4 text-neutral-900 -tracking-[0.005em] gap-4 items-center">
            <div className="text-xl">Reward Pool</div>
            <div className="text-2xl">9,999.99 ETH</div>
          </div>
          <div className="border-b border-r flex flex-col font-semibold border-neutral-200 pt-6 pb-4 text-neutral-900 -tracking-[0.005em] gap-4 items-center">
            <div className="text-xl">My Power</div>
            <div className="text-2xl">2,000</div>
          </div>
          <div className="border-b flex flex-col font-semibold border-neutral-200 pt-6 pb-4 text-neutral-900 -tracking-[0.005em] gap-4 items-center">
            <div className="text-xl">My ZK Reward</div>
            <div className="text-2xl">123,456 ZK</div>
          </div>
          <div className="border-r flex bg-slate-50 border-neutral-200 py-5 gap-2 items-center justify-center">
            <Image src="/icon/timer.svg" alt="timer" width={24} height={24} />
            <div className="text-sm text-neutral-900 leading-6">
              <span className="font-bold">13 </span>
              <span>Days, </span>
              <span className="font-bold">20 </span>
              <span>Hours</span>
            </div>
          </div>
          <div className="border-r flex bg-slate-50 border-neutral-200 items-center justify-center">
            <Button className="rounded-full">How to Earn Rewards</Button>
          </div>
          <div className="border-r flex bg-slate-50 border-neutral-200 items-center justify-center">
            <Link className="text-sm text-neutral-900 underline" href="#">
              What’s My Power?
            </Link>
          </div>
          <div className="flex bg-slate-50 items-center justify-center">
            <Button className="rounded-full">Claim Rewards</Button>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 mt-16">
        <div className="container py-8">
          <div className="font-semibold text-3xl text-neutral-900 -tracking-[0.0075em]">
            Featured Models of the Day
          </div>
          <div className="mt-1.5 text-sm mb-8 text-neutral-500 leading-6">
            Select a model from today's curated collection to generate and mint.
          </div>

          <div className="flex gap-16 items-center">
            <div className="flex flex-col flex-1 h-[552px] gap-8">
              <Tabs defaultValue="model1">
                <TabsList className="bg-white border border-slate-300">
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
                  {images.map((image, index) => (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div
                          className={cn(
                            'h-[240px] w-[165px] cursor-pointer rounded-md',
                            index === 0 &&
                              'translate-x-5 rotate-[15deg] bg-fuchsia-200',
                            index === 1 &&
                              'z-10 h-[392px] w-[259px] bg-sky-200',
                            index === 2 &&
                              '-translate-x-5 -rotate-[15deg] bg-rose-200',
                          )}
                        >
                          {image.name}
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Prompt</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Use this prompt</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ))}
                </div>
                <div className="flex flex-col mt-8 items-center justify-center">
                  <div className="font-semibold text-lg text-neutral-900">
                    YamersCartoonArcadia
                  </div>
                  <div className="font-semibold text-lg text-gray-500">
                    Created by <span className="text-neutral-900">Yamer</span>
                  </div>
                </div>
              </div>
            </div>
            {mintType === 'quick' ? (
              <div className="flex-1">
                <div className="font-semibold text-lg">
                  Quick Generate and Mint
                </div>
                <div className="mt-1.5 text-sm mb-4 text-slate-500 leading-6">
                  Generate an image instantly with a pre-filled prompt. For more
                  customization options, use Advanced Mint.
                </div>
                <div className="w-full grid gap-1.5 items-center">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Input
                    className="rounded-[6px]"
                    id="prompt"
                    placeholder="Prompt"
                    autoComplete="off"
                  />
                </div>
                <div className="flex mt-4 gap-2 items-center">
                  <Button className="rounded-full bg-[#CDF138] text-black hover:bg-[#CDF138]/90">
                    Generate and Mint
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-full text-sm text-black leading-6 underline"
                    onClick={() => {
                      setMintType('advanced')
                    }}
                  >
                    Advanced Mint
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 gap-4">
                <div className="font-semibold text-lg">
                  Advanced Generate and Mint
                </div>
                <div className="w-full grid gap-1.5 items-center">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Input
                    className="rounded-[6px]"
                    id="prompt"
                    placeholder="Prompt"
                    autoComplete="off"
                  />
                </div>
                <div className="w-full grid gap-1.5 items-center">
                  <Label htmlFor="prompt">Negative Prompt</Label>
                  <Input
                    className="rounded-[6px]"
                    id="negative_prompt"
                    placeholder="Negative Prompt"
                    autoComplete="off"
                  />
                </div>
                <div className="flex">
                  <div className="flex-1 grid gap-3 items-center">
                    <Label className="text-sm leading-[14px]">
                      Sampling Steps (24)
                    </Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  <div className="flex-1 grid gap-3 items-center">
                    <Label className="text-sm leading-[14px]">
                      Guidance Scale (10)
                    </Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-1 grid gap-1.5 items-center">
                    <Label htmlFor="width">Width</Label>
                    <Input
                      className="rounded-[6px]"
                      id="width"
                      placeholder="Width"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex-1 grid gap-1.5 items-center">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      className="rounded-[6px]"
                      id="height"
                      placeholder="Height"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex-1 grid gap-1.5 items-center">
                    <Label htmlFor="seed">Seed</Label>
                    <Input
                      className="rounded-[6px]"
                      id="seed"
                      placeholder="Seed"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Button className="rounded-full bg-[#CDF138] text-black hover:bg-[#CDF138]/90">
                    Generate and Mint
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-full text-sm text-black leading-6 underline"
                    onClick={() => {
                      setMintType('quick')
                    }}
                  >
                    Quick Mint
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container mt-16">
        <div className="font-semibold text-3xl text-neutral-900 -tracking-[0.0075em]">
          Mint Leaderboard
        </div>
        <div className="border border-neutral-200 rounded-[6px] mt-8 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-neutral-900 w-[100px]">
                  Rank
                </TableHead>
                <TableHead className="text-neutral-900">
                  Wallet address
                </TableHead>
                <TableHead className="text-neutral-900">NFT Balance</TableHead>
                <TableHead className="text-right text-neutral-900">
                  Imagine Power
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice, index) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {index + 1 < 10 ? '0' + (index + 1) : index + 1}
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
