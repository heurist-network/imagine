'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { nanoid } from 'nanoid'
import Image from 'next/image'
import Link from 'next/link'
import { Address, formatEther, Hash, isAddress } from 'viem'
import { useAccount, useClient } from 'wagmi'
import { z } from 'zod'

import { generateImage, issueToGateway } from '@/app/actions'
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
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMintZkImagine } from '@/hooks/useMintZkImagine'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { useMintToNFT } from '../mintToNFT'

const formSchema = z.object({
  prompt: z.string().optional(),
  neg_prompt: z.string().optional(),
  num_iterations: z.number(),
  guidance_scale: z.number(),
  width: z.number().min(512).max(1024),
  height: z.number().min(512).max(1024),
  seed: z.string().optional(),
  model: z.string().optional(),
})

export function FeatureModels({ lists }: { lists: any[] }) {
  const account = useAccount()
  const client = useClient()
  const { openConnectModal } = useConnectModal()
  const { setLoading, referralAddress, setReferralAddress } = useMintToNFT()
  const { mint, mintFee, discountedFee } = useMintZkImagine()
  const featureModels = lists.slice(0, 4)

  const [open, setOpen] = useState(false)

  const [loadingGetModels, setLoadingGetModels] = useState(0)
  const [loadingGenerate, setLoadingGenerate] = useState(false)
  const [mintType, setMintType] = useState<'quick' | 'advanced'>('quick')
  const [models, setModels] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState(
    featureModels[0]?.name || '',
  )
  const [result, setResult] = useState({
    url: '',
    width: 0,
    height: 0,
  })
  const [info, setInfo] = useState<any>(null)
  const [mintUrl, setMintUrl] = useState('')
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [isValidReferral, setIsValidReferral] = useState(false)
  const [loadingMint, setLoadingMint] = useState(false)

  const findActiveModel = featureModels.find(
    (model) => model.name === selectedModel,
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      neg_prompt: '(worst quality: 1.4), bad quality, nsfw',
      num_iterations: 25,
      guidance_scale: 7,
      width: findActiveModel?.type?.endsWith('xl') ? 680 : 512,
      height: findActiveModel?.type?.endsWith('xl') ? 1024 : 768,
      seed: '-1',
    },
  })

  const getModels = async (params?: string) => {
    const model = params || selectedModel

    if (!model) return setModels([])

    const findIndex = featureModels.findIndex((item) => item.name === model)

    setLoadingGetModels(findIndex + 1)

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
      setLoadingGetModels(0)
    }
  }

  const onGenerate = async () => {
    try {
      setResult({ url: '', width: 0, height: 0 })
      setMintUrl('')

      setLoadingGenerate(true)
      const params = { ...form.getValues(), model: selectedModel }

      setOpen(true)
      const res = await generateImage(params)
      if (res.status !== 200) {
        setOpen(false)
        toast.error(
          res.message || 'Failed to generate image, please try again.',
        )
        return
      }

      const data: any = res.data

      setResult({ url: data.url, width: data.width, height: data.height })

      const url = `https://d1dagtixswu0qn.cloudfront.net/${
        data.url.split('/').slice(-1)[0].split('?')[0]
      }`

      const item = {
        id: nanoid(),
        url,
        prompt: data.prompt,
        neg_prompt: data.neg_prompt,
        seed: data.seed,
        width: data.width,
        height: data.height,
        num_inference_steps: data.num_iterations,
        guidance_scale: data.guidance_scale,
        create_at: new Date().toISOString(),
      }

      setInfo(item)

      setMintUrl(url)
    } catch {
      setOpen(false)
    } finally {
      setLoadingGenerate(false)
    }
  }

  const onUpload = async () => {
    if (!account.address) {
      setOpen(false)
      openConnectModal?.()
      return
    }

    setTransactionId('')

    try {
      setLoadingUpload(true)
      const res = await issueToGateway(
        { ...info, model: selectedModel },
        account.address,
      )

      if (res.status !== 200) {
        return toast.error(
          res.message || 'Issue to Gateway failed, please try again.',
        )
      }

      setTransactionId(res.data?.transactionId!)

      toast.success('Issue to Gateway successfully.')
    } finally {
      setLoadingUpload(false)
    }
  }

  const onMintToNFT = async () => {
    if (!account.address) {
      setOpen(false)
      openConnectModal?.()
      return
    }

    const arr = mintUrl.split('/').slice(-1)[0].split('-').slice(-3)
    const imageId = `${arr[0]}-${arr[1]}-${arr[2].split('.')[0]}`

    const zeroReferralAddress = '0x0000000000000000000000000000000000000000'

    setLoadingMint(true)
    setLoading(true)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

      const txHash = await mint(
        isAddress(referralAddress) ? referralAddress : zeroReferralAddress,
        selectedModel,
        imageId,
      )

      // TODO: Post the image after mint tx sent
      //@dev post image to mint-proxy
      const response = await fetch('/api/mint-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: imageId,
          modelId: selectedModel,
          url: mintUrl,
          transactionHash: txHash as Hash,
        }),
        signal: controller.signal,
      }).catch((err) => {
        if (err.name === 'AbortError') {
          console.log('Request timed out')
          return null
        }
        throw err
      })

      clearTimeout(timeoutId)

      if (!response) {
        console.log('Mint-Proxy API: Proceeding to next step due to timeout')
      } else if (!response.ok) {
        const data = await response.json()
        console.error('Mint-Proxy API: Error:', data)
      }

      // View in Etherscan
      const txUrl = `${client?.chain?.blockExplorers?.default.url}/tx/${txHash}`
      toast.success(
        <div>
          <div>Mint zkImagine NFT successfully.</div>
          {client?.chain?.blockExplorers?.default.url && (
            <a
              href={txUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 underline"
            >
              View in explorer.
            </a>
          )}
        </div>,
      )
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to Mint zkImagine NFT:', error)
        // error handler - user rejected transaction
        if (error.message.includes('User rejected the request.')) {
          toast.error('User rejected transaction signature.')
        } else {
          toast.error(
            `Failed to Mint zkImagine NFT: ${error.message}. Please try again later.`,
          )
        }
      }
    } finally {
      setLoading(false)
      setLoadingMint(false)
      setReferralAddress('')
    }
  }

  useEffect(() => {
    getModels()
  }, [])

  useEffect(() => {
    if (
      isAddress(referralAddress) &&
      referralAddress !== account.address &&
      referralAddress !== '0x0000000000000000000000000000000000000000'
    ) {
      setIsValidReferral(true)
    } else {
      setIsValidReferral(false)
    }
  }, [referralAddress])

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
                if (!!loadingGetModels) return
                setSelectedModel(value)
                getModels(value)
              }}
              className="flex"
            >
              <TabsList className="flex-1 border border-slate-300 bg-white">
                {featureModels.map((model, index) => (
                  <TabsTrigger
                    className="flex-1 gap-2 data-[state=active]:bg-black data-[state=active]:text-white"
                    key={model.name}
                    value={model.name}
                  >
                    <span>Model {index + 1}</span>
                    {loadingGetModels === index + 1 && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
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
              {!!loadingGetModels ? (
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
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Prompt
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="rounded-[6px]"
                          placeholder="Prompt"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  className="rounded-full bg-[#CDF138] text-black hover:bg-[#CDF138]/90"
                  onClick={onGenerate}
                  disabled={loadingGenerate || !!loadingGetModels}
                >
                  {(loadingGenerate || !!loadingGetModels) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate and Mint
                </Button>

                <Button
                  variant="ghost"
                  className="rounded-full text-sm leading-6 text-black underline"
                  onClick={() => {
                    setMintType('advanced')
                  }}
                  disabled={loadingGenerate}
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
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Prompt
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="rounded-[6px]"
                          placeholder="Prompt"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neg_prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Negative Prompt
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="rounded-[6px]"
                          placeholder="Negative Prompt"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-6 lg:flex-row">
                  <FormField
                    control={form.control}
                    name="num_iterations"
                    render={({ field }) => (
                      <FormItem className="flex-1 space-y-4">
                        <FormLabel className="flex items-center">
                          Sampling Steps ({field.value})
                        </FormLabel>
                        <Input
                          className="hidden"
                          name="num_iterations"
                          value={field.value}
                          onChange={() => {}}
                        />
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            min={1}
                            max={50}
                            step={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guidance_scale"
                    render={({ field }) => (
                      <FormItem className="flex-1 space-y-4">
                        <FormLabel className="flex items-center">
                          Guidance Scale ({field.value})
                        </FormLabel>
                        <Input
                          className="hidden"
                          name="guidance_scale"
                          value={field.value}
                          onChange={() => {}}
                        />
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            min={1}
                            max={12}
                            step={0.1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-[6px]"
                            placeholder="Width"
                            type="number"
                            {...field}
                            onBlur={(e) => {
                              if (Number(e.target.value) < 512) {
                                field.onChange(512)
                              }
                              if (Number(e.target.value) > 1024) {
                                field.onChange(1024)
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-[6px]"
                            placeholder="Height"
                            type="number"
                            {...field}
                            onBlur={(e) => {
                              if (Number(e.target.value) < 512) {
                                field.onChange(512)
                              }
                              if (Number(e.target.value) > 1024) {
                                field.onChange(1024)
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seed</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-[6px]"
                            placeholder="Seed"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
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

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (loadingGenerate) {
            return toast.error('Please wait for the generation to complete.')
          }

          setOpen(isOpen)
        }}
      >
        <DialogContent className="w-[804px]">
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="w-full flex-1 overflow-hidden rounded-[10px] bg-[#877DFF]/50">
              {(loadingGenerate || !mintUrl) && (
                <div className="flex h-[500px] items-center justify-center md:h-[616px]">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </div>
              )}
              {!!mintUrl && (
                <div className="relative flex h-[500px] md:h-[616px]">
                  <Image
                    className="absolute inset-0"
                    src={mintUrl}
                    alt="mint"
                    objectFit="cover"
                    layout="fill"
                  />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div
                className={cn('rounded-xl border p-[25px]', {
                  'pointer-events-none opacity-50': loadingGenerate || !mintUrl,
                })}
              >
                <div className="flex flex-wrap gap-2">
                  <Link href={mintUrl}>
                    <Button className="rounded-full" variant="outline">
                      Download
                    </Button>
                  </Link>

                  <Button
                    className="gap-1.5 rounded-full"
                    variant="outline"
                    onClick={() => {
                      const path = mintUrl.split('/')
                      const name = path[path.length - 1].split('.')[0]
                      const intentUrl =
                        'https://twitter.com/intent/tweet?text=' +
                        encodeURIComponent(
                          'My latest #AIart creation with Imagine #Heurist 🎨',
                        ) +
                        '&url=' +
                        encodeURIComponent(
                          `https://imagine.heurist.ai/share/${name}`,
                        )
                      window.open(intentUrl, '_blank', 'width=550,height=420')
                    }}
                  >
                    <span>Share on</span>
                    <span className="i-ri-twitter-x-fill h-4 w-4" />
                  </Button>
                  <Button
                    className="gap-1.5 rounded-full"
                    variant="outline"
                    disabled={loadingUpload}
                    onClick={onUpload}
                  >
                    {loadingUpload ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Image
                        src="/gateway.svg"
                        alt="gateway"
                        width={26}
                        height={26}
                      />
                    )}
                    Upload to Gateway
                  </Button>
                </div>
                {!!transactionId && (
                  <div className="mt-2">
                    <Link
                      className="text-sky-400 underline"
                      href={`https://mygateway.xyz/explorer/transactions/${transactionId}`}
                      target="_blank"
                    >
                      Open in Gateway
                    </Link>
                  </div>
                )}
                <Separator className="my-4" />
                <Button
                  className="w-full rounded-full bg-[#CDF138] text-black hover:bg-[#CDF138]/90"
                  onClick={onMintToNFT}
                  disabled={loadingMint}
                >
                  {loadingMint && (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  )}
                  Mint to NFT
                </Button>
                <div className="mt-4 flex flex-col space-y-2">
                  <Label htmlFor="address">Referral Address</Label>
                  <Input
                    id="address"
                    placeholder="Referral Address"
                    autoComplete="off"
                    value={referralAddress}
                    onChange={(e) =>
                      setReferralAddress(e.target.value as Address)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
