'use client'

import { Loader2, MoreVertical } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { nanoid } from 'nanoid'
import Image from 'next/image'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'
import { Address, formatEther, isAddress } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { useMintZkImagine } from '@/hooks/useMintZkImagine'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useConnectModal } from '@rainbow-me/rainbowkit'

interface GenerateProps {
  model: string
  models: any[]
}

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

export default function Generate({ model, models }: GenerateProps) {
  const account = useAccount()
  const { openConnectModal } = useConnectModal()
  const { mint, mintFee, discountedFee } = useMintZkImagine()
  const [loadingGenerate, setLoadingGenerate] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [showRecommend, setShowRecommend] = useState(false)
  const [modelInfo, setModelInfo] = useState({ recommend: '' })
  const [history, setHistory] = useLocalStorage<any[]>('IMAGINE_HISTORY', [])
  const [result, setResult] = useState({
    url: '',
    width: 0,
    height: 0,
  })
  const [info, setInfo] = useState<any>(null)
  const [transactionId, setTransactionId] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [loadingMintNFT, setLoadingMintNFT] = useState(false)
  const [referralAddress, setReferralAddress] = useState('')
  const [isValidReferral, setIsValidReferral] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      neg_prompt: '',
      num_iterations: 30,
      guidance_scale: 10,
      width: 512,
      height: 768,
      seed: '-1',
    },
  })

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

  const onMintToNFT = async () => {
    // if wallet is not connected, open connect modal
    if (!account.address) return openConnectModal?.()

    const arr = info.url.split('/').slice(-1)[0].split('-').slice(-3)
    const imageId = `${arr[0]}-${arr[1]}-${arr[2].split('.')[0]}`

    const zeroReferralAddress = '0x0000000000000000000000000000000000000000'

    setLoadingMintNFT(true)
    try {
      const hash = await mint(
        isAddress(referralAddress) ? referralAddress : zeroReferralAddress,
        model,
        imageId,
      )
      toast.success('Imagine mint to NFT successfully.')
    } catch (error) {
      console.error('Failed to mint to NFT:', error)
      toast.error('Failed to mint to NFT, please try again.')
    } finally {
      setLoadingMintNFT(false)
      setReferralAddress('')
    }
  }

  const onSubmit = async () => {
    setResult({ url: '', width: 0, height: 0 })

    try {
      setLoadingGenerate(true)
      const params = { ...form.getValues(), model }

      const res = await generateImage(params)
      if (res.status !== 200) {
        return toast.error(
          res.message || 'Failed to generate image, please try again.',
        )
      }

      const data: any = res.data

      setResult({ url: data.url, width: data.width, height: data.height })

      const findModel = history.find((item) => item.model === model)

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

      if (!findModel) {
        const obj = { model, lists: [item] }
        setHistory([...history, obj])
      } else {
        findModel.lists.push(item)
        setHistory(history)
      }

      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          left: 0,
          behavior: 'smooth',
        })
      }, 100)
    } finally {
      setLoadingGenerate(false)
    }
  }

  const onUpload = async () => {
    if (!account.address) return openConnectModal?.()

    setTransactionId('')

    try {
      setLoadingUpload(true)
      const res = await issueToGateway({ ...info, model }, account.address)

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

  const getModelData = async () => {
    const res: any[] = await fetch(
      'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json',
      {
        next: { revalidate: 3600 },
      },
    ).then((res) => res.json())
    const nowModel = res.find((item) => item.name.includes(model))
    if (nowModel.type.includes('composite15')) {
      form.setValue('prompt', nowModel.autofill)
      setModelInfo(nowModel)
      setShowRecommend(true)
    }
  }

  useEffect(() => {
    getModelData()
  }, [])

  return (
    <div>
      <div className="md:3/4 grid w-full grid-cols-3 gap-4 py-4 md:grid-cols-4 lg:w-4/5">
        {models.map((item) => (
          <AlertDialog key={item.label}>
            <AlertDialogTrigger asChild>
              <div className="relative cursor-pointer">
                <Image
                  className="rounded-lg transition-opacity duration-image hover:opacity-80"
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
                    form.setValue('prompt', item.data.prompt)
                    form.setValue('neg_prompt', item.data.neg_prompt)
                    form.setValue(
                      'num_iterations',
                      item.data.num_inference_steps,
                    )
                    form.setValue('guidance_scale', item.data.guidance_scale)
                    form.setValue('width', item.data.width)
                    form.setValue('height', item.data.height)
                    form.setValue('seed', item.data.seed)
                  }}
                >
                  Use this prompt
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>
      <Form {...form}>
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <>
                    <Input placeholder="Prompt" autoComplete="off" {...field} />
                    {showRecommend && (
                      <FormDescription>
                        Recommended key words: {modelInfo.recommend}
                      </FormDescription>
                    )}
                  </>
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
                <FormLabel>Negative Prompt</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Negative Prompt"
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
            name="num_iterations"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>Sampling Steps ({field.value})</FormLabel>
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
              <FormItem className="space-y-4">
                <FormLabel>Guidance Scale ({field.value})</FormLabel>
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
                    max={20}
                    step={0.1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input
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
                  <Input placeholder="Seed" {...field} />
                </FormControl>
                <FormDescription>
                  Use -1 for random results. Use non-negative number for
                  deterministic results.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button disabled={loadingGenerate} onClick={onSubmit}>
              {loadingGenerate && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
            {!!result.url && (
              <Button
                className={cn({ 'gap-2': !loadingUpload })}
                variant="outline"
                disabled={loadingUpload}
                onClick={onUpload}
              >
                {loadingUpload ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
            )}
            {!!result.url && (
              <>
                <div className="hidden gap-2 md:flex">
                  <Link href={result.url}>
                    <Button variant="outline">Download</Button>
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => {
                      const link = `https://d1dagtixswu0qn.cloudfront.net/${
                        result.url.split('/').slice(-1)[0].split('?')[0]
                      }`

                      const path = link.split('/')
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={loadingMintNFT}>
                        {loadingMintNFT && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Mint to NFT
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mint Imagine NFT</AlertDialogTitle>
                        <AlertDialogDescription>
                          <span className="text-sm font-bold text-black">
                            {'Referral Address (Optional)'}
                          </span>
                          <Input
                            placeholder="Referral Address"
                            value={referralAddress}
                            onChange={(e) =>
                              setReferralAddress(e.target.value as Address)
                            }
                          />
                          <span>
                            Use referral address to receive 10% mint discount
                          </span>
                        </AlertDialogDescription>
                        <AlertDialogDescription>
                          Mint fee:{' '}
                          {mintFee && discountedFee
                            ? isValidReferral
                              ? formatEther(discountedFee.fee)
                              : formatEther(mintFee)
                            : '-'}{' '}
                          ETH
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onMintToNFT}>
                          Mint
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="flex md:hidden"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={result.url}>Download</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <div
                        className="flex items-center gap-1.5"
                        onClick={() => {
                          const link = `https://d1dagtixswu0qn.cloudfront.net/${
                            result.url.split('/').slice(-1)[0].split('?')[0]
                          }`

                          const path = link.split('/')
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
                          window.open(
                            intentUrl,
                            '_blank',
                            'width=550,height=420',
                          )
                        }}
                      >
                        <span>Share on</span>
                        <span className="i-ri-twitter-x-fill h-4 w-4" />
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setTimeout(() => {
                          setAlertOpen(true)
                        }, 200)
                      }}
                    >
                      Mint to NFT
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
          {!!transactionId && (
            <div className="flex gap-2">
              <div className="flex-shrink-0 whitespace-nowrap">
                Transaction Details:{' '}
              </div>
              <Link
                className="line-clamp-3 text-muted-foreground transition-colors hover:text-primary"
                href={`https://mygateway.xyz/explorer/transactions/${transactionId}`}
                target="_blank"
              >
                {`https://mygateway.xyz/explorer/transactions/${transactionId}`}
              </Link>
            </div>
          )}
        </div>
      </Form>
      {result.url && (
        <div className="mt-8">
          <Image
            className="rounded-lg"
            unoptimized
            width={result.width}
            height={result.height}
            priority
            src={result.url}
            alt="image result"
          />
        </div>
      )}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mint to NFT?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onMintToNFT}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
