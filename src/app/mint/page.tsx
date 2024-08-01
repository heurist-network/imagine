'use client'

import { useState } from 'react'
import Image from 'next/image'

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
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
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
    { id: '1', name: 'image1' },
    { id: '2', name: 'image2' },
    { id: '3', name: 'image3' },
  ])

  return (
    <main className="flex flex-1 flex-col pb-20">
      <div className="container pt-8">
        <div className="text-2xl font-semibold -tracking-[0.0075em] text-neutral-900 lg:text-3xl">
          Campaign Statistics & Rewards
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-0">
          <div className="overflow-hidden rounded-[6px] border-y border-l border-r border-neutral-200 lg:rounded-r-none">
            <div className="flex flex-col items-center gap-4 pb-4 pt-6 font-semibold">
              <div className="text-xl -tracking-[0.005em]">Sprint</div>
              <div className="text-2xl -tracking-[0.006em]">1</div>
            </div>
            <div className="flex items-center justify-center gap-2 border-t border-neutral-200 bg-slate-50 py-5">
              <Image src="/icon/timer.svg" alt="timer" width={24} height={24} />
              <div className="text-sm leading-6 text-neutral-900">
                <span className="font-bold">13 </span>
                <span>Days, </span>
                <span className="font-bold">20 </span>
                <span>Hours</span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[6px] border-y border-l border-r border-neutral-200 lg:rounded-none lg:border-l-0">
            <div className="flex flex-col items-center gap-4 pb-4 pt-6 font-semibold">
              <div className="text-xl -tracking-[0.005em]">Reward Pool</div>
              <div className="text-2xl -tracking-[0.006em]">9,999.99 ETH</div>
            </div>
            <div className="flex items-center justify-center border-t border-neutral-200 bg-slate-50 py-3">
              <Button className="rounded-full">How to Earn Rewards</Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-[6px] border-y border-l border-r border-neutral-200 lg:rounded-none lg:border-l-0">
            <div className="flex flex-col items-center gap-4 pb-4 pt-6 font-semibold">
              <div className="text-xl -tracking-[0.005em]">My Power</div>
              <div className="text-2xl -tracking-[0.006em]">2,000</div>
            </div>
            <div className="flex items-center justify-center border-t border-neutral-200 bg-slate-50 py-3">
              <Button
                className="rounded-full text-sm underline"
                variant="ghost"
              >
                What’s My Power?
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-[6px] border-y border-l border-r border-neutral-200 lg:rounded-l-none lg:border-l-0">
            <div className="flex flex-col items-center gap-4 pb-4 pt-6 font-semibold">
              <div className="text-xl -tracking-[0.005em]">My ZK Reward</div>
              <div className="text-2xl -tracking-[0.006em]">123,456 ZK</div>
            </div>
            <div className="flex items-center justify-center border-t border-neutral-200 bg-slate-50 py-3">
              <Button className="rounded-full">Claim Rewards</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 lg:bg-slate-50">
        <div className="container py-8">
          <div className="text-2xl font-semibold -tracking-[0.0075em] text-neutral-900 lg:text-3xl">
            Featured Models of the Day
          </div>
          <div className="mb-4 mt-1.5 text-sm leading-6 text-neutral-500 lg:mb-8">
            Select a model from today's curated collection to generate and mint.
          </div>
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-16">
            <div className="flex h-[552px] w-full flex-1 flex-col gap-4 lg:gap-8">
              <Tabs defaultValue="model1" className="flex">
                <TabsList className="flex-1 border border-slate-300 bg-white">
                  <TabsTrigger
                    className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white"
                    value="model1"
                  >
                    Model 1
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white"
                    value="model2"
                  >
                    Model 2
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white"
                    value="model3"
                  >
                    Model 3
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white"
                    value="model4"
                  >
                    Model 4
                  </TabsTrigger>
                  {/* <TabsTrigger
                    className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white"
                    value="model5"
                  >
                    Model 5
                  </TabsTrigger> */}
                </TabsList>
              </Tabs>
              <div className="flex justify-center lg:hidden">
                <Carousel className="w-[259px]">
                  <CarouselContent>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <CarouselItem key={index} className="flex justify-center">
                        <div className="flex h-[408px] w-[259px] p-1">
                          <Card className="flex flex-1">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <CardContent className="flex flex-1 cursor-pointer items-center justify-center p-6">
                                  <span className="text-4xl font-semibold">
                                    {index + 1}
                                  </span>
                                </CardContent>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Prompt</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction>
                                    Use this prompt
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <div className="hidden lg:block">
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
            {mintType === 'quick' ? (
              <div className="flex-1">
                <div className="text-lg font-semibold">
                  Quick Generate and Mint
                </div>
                <div className="mb-4 mt-1.5 text-sm leading-6 text-slate-500">
                  Generate an image instantly with a pre-filled prompt. For more
                  customization options, use Advanced Mint.
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Input
                    className="rounded-[6px]"
                    id="prompt"
                    placeholder="Prompt"
                    autoComplete="off"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button className="rounded-full bg-[#CDF138] text-black hover:bg-[#CDF138]/90">
                    Generate and Mint
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-full text-sm leading-6 text-black underline"
                    onClick={() => {
                      setMintType('advanced')
                    }}
                  >
                    Advanced Mint
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col gap-4">
                <div className="text-lg font-semibold">
                  Advanced Generate and Mint
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Input
                    className="rounded-[6px]"
                    id="prompt"
                    placeholder="Prompt"
                    autoComplete="off"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="prompt">Negative Prompt</Label>
                  <Input
                    className="rounded-[6px]"
                    id="negative_prompt"
                    placeholder="Negative Prompt"
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col gap-6 lg:flex-row">
                  <div className="grid flex-1 items-center gap-3">
                    <Label className="text-sm leading-[14px]">
                      Sampling Steps (24)
                    </Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  <div className="grid flex-1 items-center gap-3">
                    <Label className="text-sm leading-[14px]">
                      Guidance Scale (10)
                    </Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="width">Width</Label>
                    <Input
                      className="rounded-[6px]"
                      id="width"
                      placeholder="Width"
                      autoComplete="off"
                    />
                  </div>
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      className="rounded-[6px]"
                      id="height"
                      placeholder="Height"
                      autoComplete="off"
                    />
                  </div>
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="seed">Seed</Label>
                    <Input
                      className="rounded-[6px]"
                      id="seed"
                      placeholder="Seed"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="rounded-full bg-[#CDF138] text-black hover:bg-[#CDF138]/90">
                    Generate and Mint
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-full text-sm leading-6 text-black underline"
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
        <div className="text-3xl font-semibold -tracking-[0.0075em] text-neutral-900">
          Mint Leaderboard
        </div>
        <div className="mt-8 overflow-hidden rounded-[6px] border border-neutral-200">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[100px] text-neutral-900">
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
