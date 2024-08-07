'use client'

import { useEffect, useState } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export function FeatureModels({ lists }: { lists: any[] }) {
  const featureModels = lists.slice(0, 4)

  const [loadingGetModels, setLoadingGetModels] = useState(false)
  const [mintType, setMintType] = useState<'quick' | 'advanced'>('quick')
  const [models, setModels] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState(
    featureModels[0]?.name || '',
  )

  const findActiveModel = featureModels.find(
    (model) => model.name === selectedModel,
  )

  const getModels = async (params?: string) => {
    const model = params || selectedModel

    if (!model) return setModels([])

    setLoadingGetModels(true)

    try {
      const model1 = await fetch(
        `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}.json`,
        {
          next: { revalidate: 3600 },
        },
      ).then((res) => res.json())
      const model2 = await fetch(
        `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-2.json`,
        {
          next: { revalidate: 3600 },
        },
      ).then((res) => res.json())
      const model3 = await fetch(
        `https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${model}-3.json`,
        {
          next: { revalidate: 3600 },
        },
      ).then((res) => res.json())

      const models = [
        { label: model, data: model1 },
        { label: `${model}-2`, data: model2 },
        { label: `${model}-3`, data: model3 },
      ]

      setModels(models)
    } finally {
      setLoadingGetModels(false)
    }
  }

  const onGenerate = () => {
    console.log(214124)
  }

  useEffect(() => {
    getModels()
  }, [])

  return (
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
            <Tabs
              value={selectedModel}
              onValueChange={(value) => {
                setSelectedModel(value)
                getModels(value)
              }}
              className="flex"
            >
              <TabsList className="flex-1 border border-slate-300 bg-white">
                {featureModels.map((model, index) => (
                  <TabsTrigger
                    className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white"
                    key={model.name}
                    value={model.name}
                  >
                    Model {index + 1}
                  </TabsTrigger>
                ))}
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
              {loadingGetModels ? (
                <div>Loading...</div>
              ) : (
                <div className="flex items-center justify-center">
                  {models.map((item, index) => (
                    <AlertDialog key={index}>
                      <AlertDialogTrigger asChild>
                        <div
                          className={cn(
                            'relative h-[240px] w-[165px] cursor-pointer overflow-hidden rounded-md bg-slate-50',
                            index === 0 && 'translate-x-5 rotate-[15deg]',
                            index === 1 && 'z-10 h-[392px] w-[259px]',
                            index === 2 && '-translate-x-5 -rotate-[15deg]',
                          )}
                        >
                          <Image
                            className="transition-opacity duration-image hover:opacity-80"
                            unoptimized
                            width={512}
                            height={768}
                            priority
                            src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.label}.png`}
                            alt="model"
                          />
                          <span className="i-ri-information-line absolute bottom-1 right-1 h-5 w-5 text-gray-300 md:bottom-2 md:right-2 md:h-6 md:w-6" />
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Prompt</AlertDialogTitle>
                          <AlertDialogDescription asChild>
                            <div className="whitespace-pre-wrap text-left">
                              {JSON.stringify(item.data, null, 2)}
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              console.log(124124)
                            }}
                          >
                            Use this prompt
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-col items-center justify-center">
                <div className="text-lg font-semibold text-neutral-900">
                  {findActiveModel?.name}
                </div>
                <div className="text-lg font-semibold text-gray-500">
                  Created by{' '}
                  <span className="text-neutral-900">
                    {findActiveModel?.author}
                  </span>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded-full bg-[#CDF138] text-black hover:bg-[#CDF138]/90">
                      Generate and Mint
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[804px]">
                    <DialogTitle className="hidden" />
                    <DialogDescription className="hidden" />
                    <div className="flex flex-col items-center gap-6 md:flex-row">
                      <div className="w-full flex-1 rounded-[10px] bg-[#877DFF]/50">
                        <div className="flex h-[500px] items-center justify-center md:h-[616px]">
                          Generating...
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="rounded-xl border p-[25px]">
                          <div className="flex flex-wrap gap-2">
                            <Button className="rounded-full" variant="outline">
                              Download
                            </Button>
                            <Button
                              className="gap-1.5 rounded-full"
                              variant="outline"
                              // onClick={() => {
                              //   const link = `https://d1dagtixswu0qn.cloudfront.net/${
                              //     result.url.split('/').slice(-1)[0].split('?')[0]
                              //   }`

                              //   const path = link.split('/')
                              //   const name = path[path.length - 1].split('.')[0]
                              //   const intentUrl =
                              //     'https://twitter.com/intent/tweet?text=' +
                              //     encodeURIComponent(
                              //       'My latest #AIart creation with Imagine #Heurist 🎨',
                              //     ) +
                              //     '&url=' +
                              //     encodeURIComponent(
                              //       `https://imagine.heurist.ai/share/${name}`,
                              //     )
                              //   window.open(intentUrl, '_blank', 'width=550,height=420')
                              // }}
                            >
                              <span>Share on</span>
                              <span className="i-ri-twitter-x-fill h-4 w-4" />
                            </Button>
                            <Button
                              className="gap-1.5 rounded-full"
                              variant="outline"
                            >
                              <Image
                                src="/gateway.svg"
                                alt="gateway"
                                width={26}
                                height={26}
                              />
                              Upload to Gateway
                            </Button>
                          </div>
                          <Separator className="my-4" />
                          <Button className="w-full rounded-full bg-[#CDF138] text-black hover:bg-[#CDF138]/90">
                            Mint to NFT
                          </Button>
                          <div className="mt-4 flex flex-col space-y-2">
                            <Label htmlFor="address">Referral Address</Label>
                            <Input
                              id="address"
                              placeholder="Referral Address"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

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
                <Button
                  className="rounded-full bg-[#CDF138] text-black hover:bg-[#CDF138]/90"
                  onClick={onGenerate}
                >
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
  )
}
