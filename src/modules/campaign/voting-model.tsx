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
 */

export function VotingModel() {
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
          Vote for Your Favorite Image
        </div>
        <div className="mt-1.5 font-SFMono text-[14px] leading-[1.5] text-neutral-500 lg:text-[16px]">
          Vote for your favorite image from the curated collection.
        </div>

        {/* TODO: Display the vote times and the vote count */}
        <div className="flex items-center justify-start space-x-8">
          <div className="font-SFMono text-[14px] leading-[1.5] text-neutral-500 lg:text-[16px]">
            Vote Times: <span className="text-white">0</span>
          </div>
          <div className="font-SFMono text-[14px] leading-[1.5] text-neutral-500 lg:text-[16px]">
            Vote Count: <span className="text-white">0</span>
          </div>
        </div>

        {/* TODO: Display 3 images with voting buttons, reference the feature models for image style */}
        <div className="flex flex-col items-center justify-center">
          <div className="mt-10 flex flex-row items-center justify-center gap-20">
            <div
              className={cn(
                'relative h-[480px] w-[320px] cursor-pointer overflow-hidden rounded-[8px] border-2 border-[#CDF138] bg-[#CDF138]',
              )}
            >
              <Image
                src="https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/BlazingDrive-2.jpg"
                alt="Feature Model 1"
                width={512}
                height={768}
              />

              {/* Select the image button, button under the image */}
              <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                <Button>Select</Button>
              </div>
            </div>

            <div
              className={cn(
                'relative h-[480px] w-[320px] cursor-pointer overflow-hidden rounded-[8px] border-2 border-[#CDF138] bg-[#CDF138]',
              )}
            >
              <Image
                src="https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/BlazingDrive-2.jpg"
                alt="Feature Model 1"
                width={512}
                height={768}
              />

              {/* Select the image button, button under the image */}
              <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                <Button>Select</Button>
              </div>
            </div>

            <div
              className={cn(
                'relative h-[480px] w-[320px] cursor-pointer overflow-hidden rounded-[8px] border-2 border-[#CDF138] bg-[#CDF138]',
              )}
            >
              <Image
                src="https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/BlazingDrive-2.jpg"
                alt="Feature Model 1"
                width={512}
                height={768}
              />

              {/* Select the image button, button under the image */}
              <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                <Button>Select</Button>
              </div>
            </div>
          </div>

          {/* TODO: Add a button to submit the vote */}
          <div className="flex flex-row items-center justify-center gap-10">
            <Button className="mt-10">Vote</Button>
            <Button className="mt-10">Refresh</Button>
          </div>
        </div>
      </div>
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
