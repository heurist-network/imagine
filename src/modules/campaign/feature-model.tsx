'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { formatEther, getAddress, Hash, isAddress } from 'viem'
import { zksync } from 'viem/chains'
import { useAccount, useBalance, useClient, useSwitchChain } from 'wagmi'
import { z } from 'zod'

import { generateImage, issueToGateway } from '@/app/actions'
import DiscloseImage from '@/components/magicui/disclose-image'
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
import { usePartnerFreeMint } from '@/hooks/usePartnerFreeMint'
import { useSignatureFreeMint } from '@/hooks/useSignatureFreeMint'
import { useZkImagine } from '@/hooks/useZkImagine'
import {
  getReferralAddress,
  postImageGen,
  postNotifyAfterMintActions,
} from '@/lib/endpoints'
import { cn, extractImageId } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { useMintToNFT } from '../mintToNFT'

interface TabProps {
  text: string
  selected: boolean
  setSelected: React.Dispatch<React.SetStateAction<string>>
}

const formSchema = z.object({
  prompt: z.string().optional(),
  neg_prompt: z.string().optional(),
  num_iterations: z.number().min(1).max(50),
  guidance_scale: z.number().min(1).max(12),
  width: z.number().min(512).max(1024),
  height: z.number().min(512).max(1024),
  seed: z.string().optional(),
  model: z.string().optional(),
})

const inter = Inter({ subsets: ['latin'] })

/**
 * FeatureModels component for displaying and interacting with featured AI models
 * @param {Object} props - Component props
 * @param {any[]} props.lists - List of available models
 */

export function FeatureModel({ lists }: { lists: any[] }) {
  const searchParams = useSearchParams()
  const account = useAccount()
  const { switchChain } = useSwitchChain()
  const client = useClient()
  const { openConnectModal } = useConnectModal()
  const {
    setLoading,
    referralAddress,
    setReferralAddress,
    loading: loadingMintNFT,
  } = useMintToNFT()

  const {
    mint,
    mintFee,
    discountedFee,
    signatureFreeMint,
    partnerFreeMint,
    globalTimeThreshold,
  } = useZkImagine()
  const {
    canSignatureFreeMint,
    isLoading: loadingSignatureFreeMint,
    error: signatureFreeMintError,
    refreshSignatureData,
  } = useSignatureFreeMint()

  const {
    availableNFT,
    isLoading: loadingPartnerFreeMint,
    error: partnerFreeMintError,
    refreshPartnerNFTs,
  } = usePartnerFreeMint()

  const featureModels = lists.slice(0, 4)

  const [open, setOpen] = useState(false)
  const [loadingGetModels, setLoadingGetModels] = useState(true)
  const [loadingGenerate, setLoadingGenerate] = useState(false)
  const [mintType, setMintType] = useState<'quick' | 'advanced'>('quick')
  const [modelList, setModelList] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [activeModelIndex, setActiveModelIndex] = useState(0)
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
  const [isMinted, setIsMinted] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [loadingMint, setLoadingMint] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  const balance =
    (useBalance({
      address: account.address,
    }).data?.value as bigint) || BigInt(0)

  const findActiveModel = featureModels[activeModelIndex]

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

  const getModel = async (model: string) => {
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

    return [
      { label: model, data: model1 },
      { label: `${model}-2`, data: model2 },
      { label: `${model}-3`, data: model3 },
    ]
  }

  const getAllModels = async () => {
    try {
      setLoadingGetModels(true)
      const models = await Promise.all(
        featureModels.map(async (model) => await getModel(model.name)),
      )
      setModelList(models)
      setModels(models[0])
    } catch (error) {
      setModelList([])
    } finally {
      setLoadingGetModels(false)
    }
  }

  useEffect(() => {
    getAllModels()
  }, [featureModels.length])

  /**
   * Generates an image based on the current form values
   */
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
        id: extractImageId(url),
        url,
        prompt: data.prompt,
        neg_prompt: data.neg_prompt,
        seed: data.seed,
        width: data.width,
        height: data.height,
        num_inference_steps: data.num_iterations,
        guidance_scale: data.guidance_scale,
        create_at: new Date().toISOString(),
        model: selectedModel,
      }

      setInfo(item)

      setMintUrl(url)
    } catch {
      setOpen(false)
    } finally {
      setLoadingGenerate(false)
      console.log(
        'Refreshed partner NFTs and signature data successfully. Result:',
        {
          availableNFT: availableNFT,
          canSignatureFreeMint: canSignatureFreeMint,
        },
      )
    }
  }

  /**
   * Uploads the generated image to the Gateway
   */
  const onUpload = async () => {
    if (loadingUpload) return

    if (!isMinted)
      return toast.error('You need to mint NFT first to earn scores')
    if (!account.address) return openConnectModal?.()

    setTransactionId('')

    try {
      setLoadingUpload(true)
      const res = await issueToGateway(
        { ...info, model: info.model },
        account.address,
      )

      if (res.status !== 200) {
        return toast.error(
          res.message || 'Issue to Gateway failed, please try again.',
        )
      }

      setTransactionId(res.data?.transactionId!)

      await postNotifyAfterMintActions({
        modelId: info.model,
        imageId: info.id,
        actionType: 'GATEWAY_UPLOAD',
      })

      toast.success('Image uploaded to Gateway successfully!')
    } finally {
      setLoadingUpload(false)
      setIsUploaded(true)
    }
  }

  /**
   * Handles sharing the generated image on Twitter.
   * Constructs a tweet with a predefined text and a link to the shared image.
   * Opens a new window with the Twitter intent URL.
   */
  const onShareTwitter = async () => {
    if (!isMinted)
      return toast.error('You need to mint NFT first to earn scores')

    await postNotifyAfterMintActions({
      modelId: info.model,
      imageId: info.id,
      actionType: 'TWITTER_SHARE',
    })

    const path = mintUrl.split('/')
    const name = path[path.length - 1].split('.')[0]
    const intentUrl =
      'https://twitter.com/intent/tweet?text=' +
      encodeURIComponent('My latest #AIart creation with Imagine #Heurist 🎨') +
      '&url=' +
      encodeURIComponent(`https://imagine.heurist.ai/share/${name}`)
    window.open(intentUrl, '_blank', 'width=550,height=420')
  }

  /**
   * Handles the regular minting process.
   */
  const onMintToNFT = async () => {
    const extractedImageId = extractImageId(info.url)
    const zeroReferralAddress = '0x0000000000000000000000000000000000000000'

    setLoading(true)

    console.log('Mint config:', {
      accountAddress: account.address,
      canSignatureFreeMint,
      availableNFT,
      referralAddress,
    })

    try {
      // Signature Free Mint  - Partner Free Mint - Mint
      let txHash: Hash | undefined
      if (canSignatureFreeMint) {
        console.log('Calling Signature Free Mint function')
        txHash = await signatureFreeMint(info.model, extractedImageId)
      } else if (availableNFT) {
        console.log('Calling Partner Free Mint function')
        txHash = await partnerFreeMint(
          info.model,
          extractedImageId,
          availableNFT.address,
          BigInt(availableNFT.tokenId),
        )
      } else {
        if (mintFee && balance < mintFee) {
          toast.error('Insufficient ETH balance to mint NFT.')
          return
        }
        console.log('Calling Mint function')
        txHash = await mint(
          isAddress(referralAddress) ? referralAddress : zeroReferralAddress,
          info.model,
          extractedImageId,
        )
      }

      // @dev post image gen notification after mint
      await handleMintingProcess()
      if (txHash) {
        showSuccessToast('Mint successful! Score +1 ', txHash)
      }

      setLoading(false)
      setReferralAddress('')
      setIsMinted(true)
    } catch (error: unknown) {
      handleMintError(error)
    } finally {
      setLoading(false)
      setReferralAddress('')
      refreshPartnerNFTs()
    }
  }

  /**
   * Handles the common minting process after a transaction is initiated.
   * @param txHash - The transaction hash
   */
  const handleMintingProcess = async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    try {
      await postImageGen(
        {
          modelId: info.model,
          imageId: info.id,
          url: info.url,
        },
        controller.signal,
      )
    } catch (error) {
      console.error('Error in minting process:', error)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Handles fetch errors.
   * @param err - The error object
   */
  const handleFetchError = (err: Error) => {
    if (err.name === 'AbortError') {
      console.log('Request timed out')
      return null
    }
    throw err
  }

  /**
   * Ensures the user is connected to their wallet
   * @returns {boolean} True if connected, false otherwise
   */
  const ensureUserConnected = (): boolean => {
    if (!account.address) {
      setOpen(false)
      openConnectModal?.()
      return false
    }
    return true
  }

  /**
   * Handles API response.
   * @param response - The fetch response object
   */
  const handleApiResponse = (response: Response | null) => {
    if (!response) {
      console.log(
        'notify-image-gen API: Proceeding to next step due to timeout',
      )
    } else if (!response.ok) {
      response
        .json()
        .then((data) => console.error('notify-image-gen API: Error:', data))
    }
  }

  /**
   * Shows a success toast with a transaction link.
   * @param message - The success message
   * @param txHash - The transaction hash
   */
  const showSuccessToast = (message: string, txHash?: Hash) => {
    const txUrl = txHash
      ? `${client?.chain?.blockExplorers?.default.url}/tx/${txHash}`
      : ''
    toast.success(
      <div>
        <div>{message}</div>
        {txUrl && (
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
  }

  /**
   * Handles errors that occur during minting
   * @param {unknown} error - The error that occurred
   */
  const handleMintError = (error: unknown) => {
    if (error instanceof Error) {
      console.error('Failed to Mint zkImagine NFT:', error)
      if (error.message.includes('User rejected the request.')) {
        toast.error('User rejected transaction signature.')
      } else {
        toast.error(
          `Failed to Mint zkImagine NFT: ${error.message}. Please try again later.`,
        )
      }
    }
  }

  // Refresh partner NFTs when the component mounts
  useEffect(() => {
    const refreshData = async () => {
      await refreshPartnerNFTs()
      await refreshSignatureData()
    }

    refreshData()
  }, [refreshPartnerNFTs, refreshSignatureData])

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

  useEffect(() => {
    setReferralCode('')
    setReferralAddress('')
    const referralCode =
      searchParams.get('ref') || searchParams.get('referral_code')
    if (referralCode) {
      setReferralCode(referralCode)
      handleSubmitReferralCode(referralCode)
    }
  }, [])

  useEffect(() => {
    if (models.length > 0) {
      const defaultModel = models[1]
      if (defaultModel && defaultModel.data) {
        form.setValue('prompt', defaultModel.data.prompt || '')
        form.setValue('neg_prompt', defaultModel.data.neg_prompt || '')
        form.setValue('num_iterations', defaultModel.data.num_iterations || 25)
        form.setValue('guidance_scale', defaultModel.data.guidance_scale || 7)
        form.setValue('width', defaultModel.data.width || 512)
        form.setValue('height', defaultModel.data.height || 768)
        form.setValue('seed', '-1')
      }
    }
  }, [models, form])

  // Switch to zksync chain
  useEffect(() => {
    const chain = account?.chain

    if (chain && chain.id !== zksync.id) {
      switchChain({ chainId: zksync.id })
    }
  }, [account, switchChain])

  // // Validate referral code and set referral address if valid
  // useEffect(() => {
  //   const validateReferralCode = async () => {
  //     if (!/^[0-9a-fA-F]{16}$/.test(referralCode)) {
  //       toast.error('Invalid referral code, please try another one.')
  //       setReferralAddress('')
  //       return
  //     }
  //     try {
  //       const data = await getReferralAddress(referralCode)
  //       setReferralAddress(
  //         isAddress(data.referral_address) ? data.referral_address : '',
  //       )
  //       toast.success(
  //         '🎉 Congrats! You have successfully used the referral code to enjoy a discount mint!',
  //       )
  //       console.log('Referral code & address:', referralCode, data)
  //     } catch (error) {
  //       toast.error('Invalid referral code, please try another one.')
  //       console.error('Error validating referral code:', error)
  //       setReferralAddress('')
  //     }
  //   }
  //   referralCode ? validateReferralCode() : setReferralAddress('')
  // }, [referralCode])

  const handleSubmitReferralCode = async (urlReferralCode?: string) => {
    // urlReferralCode is the referral code from the URL, referralCode is the referral code from the state
    const code = urlReferralCode || referralCode

    console.log('handleSubmitReferralCode code:', code)

    if (!/^[0-9a-fA-F]{16}$/.test(code)) {
      setReferralAddress('')
      toast.error('Invalid referral code, please try another one.')
      return
    }
    try {
      const data = await getReferralAddress(code)
      setReferralAddress(
        isAddress(data.referral_address) ? data.referral_address : '',
      )

      if (
        account &&
        getAddress(account.address as string) ===
          getAddress(data.referral_address)
      ) {
        toast.error('You cannot use your own referral code.')
        setReferralCode('')
        setReferralAddress('')
        return
      }

      toast.success(
        '🎉 Congrats! You have successfully used the referral code to enjoy a discount mint!',
      )
    } catch (error) {
      toast.error('Invalid referral code, please try another one.')
      console.error('Error validating referral code:', error)
      setReferralAddress('')
    }
  }

  return (
    <div
      className={cn(
        'bg-[#1D1D1B]',
        'pt-[32px] md:pt-[57px] lg:pt-[81px] xl:pt-[105px] 2xl:pt-[129px]',
        'pb-[32px] md:pb-[54px] lg:pb-[74px] xl:pb-[94px] 2xl:pb-[114px]',
      )}
      id="featured-models"
    >
      <div className="container text-white">
        <div
          className={cn(
            'font-semibold -tracking-[0.0075em]',
            'text-[24px] leading-[1.2] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[48px]',
            inter.className,
          )}
        >
          Featured Models of the Day
        </div>
        <div className="mt-1.5 font-SFMono text-[14px] leading-[1.5] text-neutral-500 lg:text-[16px]">
          Select a model from today's curated collection to generate and mint.
        </div>

        <div
          className={cn(
            'flex flex-col items-center xl:flex-row xl:gap-20',
            'mt-[16px] md:mt-[24px] lg:mt-[32px] xl:mt-[40px] 2xl:mt-[48px]',
          )}
        >
          <div
            className={cn(
              'flex w-full flex-1 flex-col',
              'gap-[16px] md:gap-[24px] lg:gap-[32px] xl:gap-[40px] 2xl:gap-[48px]',
            )}
          >
            <NavTabs
              tabs={['Model 1', 'Model 2', 'Model 3', 'Model 4']}
              onSelect={(index) => {
                setModels(modelList[index])
                setActiveModelIndex(index)
              }}
            />

            <ModelCarousel models={models} />

            <div className="hidden xl:block">
              {loadingGetModels ? (
                <div className="flex h-[392px] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                  <span className="ml-2 text-white">Loading models...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {models.map((item, index) => (
                    <AlertDialog key={index}>
                      <AlertDialogTrigger asChild>
                        <div
                          className={cn(
                            'relative h-[240px] w-[165px] cursor-pointer overflow-hidden rounded-[8px] border-2 border-[#CDF138] bg-[#CDF138]',
                            index === 0 && 'translate-x-5 rotate-[15deg]',
                            index === 1 && 'z-10 h-[392px] w-[259px]',
                            index === 2 && '-translate-x-5 -rotate-[15deg]',
                          )}
                        >
                          <Image
                            className="rounded-[8px] transition-opacity duration-image hover:opacity-80"
                            unoptimized
                            width={512}
                            height={768}
                            priority
                            src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.label}.jpg`}
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
                              form.setValue(
                                'neg_prompt',
                                item.data.neg_prompt || '',
                              )
                              form.setValue(
                                'num_iterations',
                                item.data.num_iterations || 25,
                              )
                              form.setValue(
                                'guidance_scale',
                                item.data.guidance_scale || 7,
                              )
                              form.setValue('width', item.data.width || 512)
                              form.setValue('height', item.data.height || 768)
                              form.setValue('seed', item.data.seed || '-1')
                            }}
                            className="bg-[#CDF138] text-black hover:bg-[#CDF138]/90"
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
                <div className="text-lg font-semibold text-neutral-300">
                  {findActiveModel?.name}
                </div>
                <div className="text-lg font-semibold text-neutral-500">
                  Created by{' '}
                  <span className="text-neutral-300">
                    {findActiveModel?.author}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={cn(
              'mt-4 flex w-full flex-col gap-4 rounded-[10px] bg-transparent p-0 xl:mt-0 xl:w-[652px] xl:bg-[#262626] xl:p-12',
              inter.className,
            )}
          >
            {mintType === 'quick' ? (
              <div className="flex-1">
                <div className="text-[18px] font-semibold leading-[1.56]">
                  Quick Generate and Mint
                </div>
                <div className="mb-4 mt-1.5 font-SFMono text-sm leading-6 text-neutral-400">
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
                            className="'SF_Mono'] rounded-[6px] text-black"
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
                    disabled={loadingGenerate || loadingGetModels}
                  >
                    {(loadingGenerate || loadingGetModels) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Generate and Mint
                  </Button>

                  <Button
                    className="rounded-full bg-transparent text-neutral-300 underline hover:bg-transparent"
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
                            className="rounded-[6px] text-black"
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
                            className="rounded-[6px] text-black"
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
                              rangeClassName="bg-[#CDF138]"
                              value={[field.value]}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
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
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              min={1}
                              max={12}
                              step={0.1}
                              rangeClassName="bg-[#CDF138]"
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
                              className="rounded-[6px] text-black"
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
                              className="rounded-[6px] text-black"
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
                              className="rounded-[6px] text-black"
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
                    className="rounded-full bg-transparent text-neutral-300 underline hover:bg-transparent"
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

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          // Reset state when dialog is closed
          if (!isOpen) {
            setLoadingGenerate(false)
            setMintUrl('')
            setInfo(null)
            setTransactionId('')
            setLoadingUpload(false)
            setLoadingMint(false)
          }

          setOpen(isOpen)
        }}
      >
        <DialogContent className="z-[200] max-h-[calc(100vh-150px)] w-[804px] overflow-y-auto">
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex w-full flex-1 overflow-hidden rounded-[10px] bg-[#877DFF]/50">
              {(loadingGenerate || !mintUrl) && (
                <div className="flex min-h-[300px] flex-1 items-center justify-center text-white md:h-[616px]">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </div>
              )}
              {!!mintUrl && (
                <div className="relative flex min-h-[300px] flex-1 md:h-[616px]">
                  <DiscloseImage
                    doorClassName="bg-[#CDF138]"
                    className="absolute inset-0 bg-[#CDF138]"
                    src={mintUrl}
                    alt="mint"
                    imgClassName="inset-0 absolute"
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
                <div className="flex flex-col font-medium">
                  <Link
                    className="flex h-10 cursor-pointer items-center gap-2 px-3 text-sm transition-colors hover:bg-accent"
                    href={mintUrl}
                  >
                    <span className="i-ri-download-2-line h-4 w-4" />
                    <span>Download</span>
                  </Link>
                  <Separator />
                  <div
                    className="flex h-10 cursor-pointer items-center gap-2 px-3 text-sm transition-colors hover:bg-accent"
                    onClick={onShareTwitter}
                  >
                    <span className="i-ri-twitter-x-fill h-4 w-4" />
                    <span>Share on X</span>
                  </div>
                  {!isUploaded && (
                    <>
                      <Separator />
                      <div
                        className="flex h-10 cursor-pointer items-center gap-2 px-3 text-sm transition-colors hover:bg-accent"
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
                      </div>
                    </>
                  )}
                </div>

                {!!transactionId && (
                  <div className="mt-2">
                    <Button
                      className="gap-1.5 rounded-full"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://mygateway.xyz/explorer/transactions/${transactionId}`,
                          '_blank',
                        )
                      }
                    >
                      <Image
                        src="/gateway.svg"
                        alt="gateway"
                        width={26}
                        height={26}
                      />
                      Open in Gateway
                    </Button>
                  </div>
                )}
                <Separator />
                <div className="mt-6 flex flex-col space-y-2">
                  <Label htmlFor="address">
                    ✨ Mint zkImagine NFT{' '}
                    {canSignatureFreeMint || availableNFT
                      ? ' (Free)'
                      : referralAddress
                        ? `(${discountedFee ? formatEther(discountedFee.fee) : '-'} ETH)`
                        : `(${mintFee ? formatEther(mintFee) : '-'} ETH)`}
                  </Label>
                  <Button
                    className="w-full rounded-full bg-[#CDF138] text-black hover:bg-[#CDF138]/90"
                    onClick={onMintToNFT}
                    disabled={loadingMint}
                  >
                    {(loadingMintNFT ||
                      loadingPartnerFreeMint ||
                      loadingSignatureFreeMint) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Mint
                  </Button>
                </div>

                {!canSignatureFreeMint && !availableNFT && (
                  <div className="mt-6 flex flex-col space-y-2">
                    <Label htmlFor="address">Referral Code</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="referral_code"
                        placeholder="Referral Code"
                        autoComplete="off"
                        onChange={(e) =>
                          setReferralCode(e.target.value as string)
                        }
                        value={referralCode}
                        disabled={isAddress(referralAddress)}
                      />
                      <Button
                        onClick={() => {
                          console.log('Submitting referral code:', referralCode)
                          handleSubmitReferralCode()
                        }}
                        className="bg-[#CDF138] text-black hover:bg-[#CDF138]/80"
                        disabled={isAddress(referralAddress)}
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                )}
                <Separator className="my-4" />
                {!canSignatureFreeMint && !availableNFT && (
                  <div className="text-sm text-gray-500">
                    <div>
                      <Label>{`⬆️ Input referral address to get a discount!`}</Label>
                    </div>
                    <div>
                      Normal Mint: {mintFee ? formatEther(mintFee) : '-'} ETH
                    </div>
                    <div>
                      After Discount:{' '}
                      {discountedFee ? formatEther(discountedFee.fee) : '-'} ETH
                    </div>
                  </div>
                )}

                <Separator className="my-4" />
                {globalTimeThreshold && (
                  <div className="text-sm text-gray-500">
                    <Label>Free Mint Refresh at:</Label>
                    <p>
                      {new Date(
                        Number(globalTimeThreshold) * 1000,
                      ).toLocaleString(undefined, {
                        timeZone:
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const Tab = ({ text, selected, setSelected }: TabProps) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        'relative flex-1 rounded-md p-2 text-sm text-black transition-all',
      )}
    >
      <p
        className={cn(
          'relative z-50 text-[14px] font-medium xl:text-[16px]',
          inter.className,
        )}
      >
        {text}
      </p>
      {selected && (
        <motion.span
          layoutId="tabs"
          transition={{ type: 'spring', duration: 0.5 }}
          className={cn('absolute inset-0 rounded-sm bg-[#CDF138]')}
        />
      )}
    </button>
  )
}

export function NavTabs({
  tabs,
  onSelect,
}: {
  tabs: string[]
  onSelect?: (index: number) => void
}) {
  const [selected, setSelected] = useState<string>(tabs[0])

  return (
    <div className="flex flex-wrap items-center rounded-md bg-white p-1">
      {tabs.map((tab, index) => (
        <Tab
          text={tab}
          selected={selected === tab}
          setSelected={(value) => {
            if (value === selected) return
            setSelected(value)
            onSelect?.(index)
          }}
          key={tab}
        />
      ))}
    </div>
  )
}

/**
 * ModelCarousel component for displaying model carousel on mobile
 */
interface ModelCarouselProps {
  models: Array<{
    label: string
    // Add other properties of the model object as neede
  }>
}

const ModelCarousel: React.FC<ModelCarouselProps> = ({ models }) => (
  <div className="flex justify-center xl:hidden">
    <Carousel className="h-[397px] w-[259px]">
      <CarouselContent>
        {models.map((item, index) => (
          <CarouselItem key={index} className="flex justify-center">
            <ModelCard item={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="text-black" />
      <CarouselNext className="text-black" />
    </Carousel>
  </div>
)

/**
 * ModelCard component for displaying individual model cards
 */
interface ModelCardProps {
  item: {
    label: string
    // Add other properties of the item object as needed
  }
}

const ModelCard: React.FC<ModelCardProps> = ({ item }) => (
  <Card className="flex flex-1">
    <CardContent className="relative flex-1 cursor-pointer items-center justify-center p-6">
      <Image
        className="absolute inset-0 rounded-lg"
        unoptimized
        priority
        src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.label}.jpg`}
        alt="model"
        objectFit="cover"
        layout="fill"
      />
      <span className="i-ri-information-line absolute bottom-1 right-1 h-5 w-5 text-gray-300 md:bottom-2 md:right-2 md:h-6 md:w-6" />
    </CardContent>
  </Card>
)
