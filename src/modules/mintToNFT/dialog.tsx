import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Address, formatEther, Hash, isAddress } from 'viem'
import { useAccount, useBalance, useClient } from 'wagmi'

import { Button, ButtonProps } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMintZkImagine } from '@/hooks/useMintZkImagine'
import { usePartnerFreeMint } from '@/hooks/usePartnerFreeMint'
import { useSignatureFreeMint } from '@/hooks/useSignatureFreeMint'
import { API_NOTIFY_IMAGE_GEN } from '@/lib/endpoints'
import { extractImageId } from '@/lib/utils'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { useMintToNFT } from './hooks'

export function MintToNFT({
  url,
  model,
  imageId,
  size,
}: {
  url: string
  model: string
  imageId: string
  size?: ButtonProps['size']
}) {
  const account = useAccount()
  const client = useClient()

  const { openConnectModal } = useConnectModal()
  const {
    setLoading,
    referralAddress,
    setReferralAddress,
    loading: loadingMintNFT,
  } = useMintToNFT()

  const {
    canSignatureFreeMint,
    isLoading: loadingSignatureFreeMint,
    error: signatureFreeMintError,
  } = useSignatureFreeMint()
  const [isSignatureFreeMinting, setIsSignatureFreeMinting] = useState(false)

  const {
    availableNFT,
    isLoading: loadingPartnerFreeMint,
    error: partnerFreeMintError,
    refreshPartnerNFTs,
  } = usePartnerFreeMint()
  const [isPartnerFreeMinting, setIsPartnerFreeMinting] = useState(false)

  const { mint, mintFee, discountedFee, signatureFreeMint, partnerFreeMint } =
    useMintZkImagine()

  const [open, setOpen] = useState(false)
  const [isValidReferral, setIsValidReferral] = useState(false)
  const isSignatureNotified = useRef(false)
  const isPartnerNotified = useRef(false)
  const alreadyMinted = useRef(false)

  const balance =
    (useBalance({
      address: account.address,
    }).data?.value as bigint) || BigInt(0)

  /**
   * Handles the minting process for signature free mint.
   */
  const onSignatureFreeMint = async () => {
    if (!canSignatureFreeMint) {
      toast.error('You cannot signature free mint')
      return
    }

    if (alreadyMinted.current) {
      toast.error('You have already minted this image.')
      return
    }

    setIsSignatureFreeMinting(true)

    try {
      const txHash = await signatureFreeMint(model, imageId)
      await handleMintingProcess(txHash)
      showSuccessToast('Mint zkImagine NFT successfully!', txHash)

      alreadyMinted.current = true
    } catch (error) {
      console.error('Signature free mint failed', error)
      toast.error(
        'Signature free minting failed. Please make sure you are in the list',
      )
    } finally {
      setIsSignatureFreeMinting(false)
    }
  }

  /**
   * Handles the minting process for partner free mint.
   */
  const onPartnerFreeMint = async () => {
    if (!availableNFT) {
      toast.error('No partner NFT available for free minting.')
      return
    }

    if (alreadyMinted.current) {
      toast.error('You have already minted this image.')
      return
    }

    setIsPartnerFreeMinting(true)
    try {
      const txHash = await partnerFreeMint(
        model,
        imageId,
        availableNFT.address,
        BigInt(availableNFT.tokenId),
      )
      await handleMintingProcess(txHash)
      showSuccessToast('Mint zkImagine NFT successfully!', txHash)

      alreadyMinted.current = true
    } catch (error) {
      console.error('Partner free minting failed:', error)
      toast.error(
        'Partner free minting failed. Please make sure you have a partner NFT available.',
      )
    } finally {
      setIsPartnerFreeMinting(false)
    }
  }

  /**
   * Handles the regular minting process.
   */
  const onMintToNFT = async () => {
    if (!account.address) return openConnectModal?.()

    if (alreadyMinted.current) {
      toast.error('You have already minted this image.')
      return
    }

    const extractedImageId = extractImageId(url)
    const zeroReferralAddress = '0x0000000000000000000000000000000000000000'

    setLoading(true)

    try {
      if (mintFee && balance < mintFee) {
        toast.error('Insufficient ETH balance to mint NFT.')
        return
      }

      const txHash = await mint(
        isAddress(referralAddress) ? referralAddress : zeroReferralAddress,
        model,
        extractedImageId,
      )
      await handleMintingProcess(txHash)
      showSuccessToast('Mint zkImagine NFT successfully!', txHash)

      alreadyMinted.current = true
    } catch (error: unknown) {
      handleMintError(error)
    } finally {
      setLoading(false)
      setReferralAddress('')
    }
  }

  /**
   * Handles the common minting process after a transaction is initiated.
   * @param txHash - The transaction hash
   */
  const handleMintingProcess = async (txHash: Hash) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    try {
      await postMintingData(txHash, controller.signal)
    } catch (error) {
      console.error('Error in minting process:', error)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Posts minting data to the API.
   * @param txHash - The transaction hash
   * @param signal - The AbortController signal
   */
  const postMintingData = async (txHash: Hash, signal: AbortSignal) => {
    const response = await fetch(API_NOTIFY_IMAGE_GEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: window.location.origin,
      },
      body: JSON.stringify({
        imageId,
        modelId: model,
        url,
      }),
      signal,
    }).catch(handleFetchError)

    handleApiResponse(response)
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
   * Handles minting errors.
   * @param error - The error object
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

  useEffect(() => {
    alreadyMinted.current = false
  }, [imageId])

  // Show toast when the user can signature free mint
  useEffect(() => {
    if (canSignatureFreeMint == true && !isSignatureNotified.current) {
      toast.success('🎉 Congratulations! You are in the free mint list!')
      isSignatureNotified.current = true
    } else if (canSignatureFreeMint == null && !isSignatureNotified.current) {
      isSignatureNotified.current = true
      console.log('Signature free mint: Not available')
    }
  }, [canSignatureFreeMint])

  // Show success toast if an available NFT is found
  useEffect(() => {
    if (availableNFT != null && !isPartnerNotified.current) {
      toast.success(
        '🎉Congratulations! You are holding an NFT that can be used for free mint!',
      )
      isPartnerNotified.current = true
    } else if (availableNFT == null && !isPartnerNotified.current) {
      isPartnerNotified.current = true
      console.log(
        'Partner Free Mint: No partner NFT available for free minting.',
      )
    }
  }, [availableNFT])

  // Refresh partner NFTs when the component mounts
  useEffect(() => {
    refreshPartnerNFTs()
  }, [refreshPartnerNFTs])

  useEffect(() => {
    if (signatureFreeMintError) {
      toast.error(`Error: ${signatureFreeMintError}`)
    }
    if (signatureFreeMintError) {
      toast.error(`Error: ${signatureFreeMintError}`)
    }
  }, [signatureFreeMintError, signatureFreeMintError])

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
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) return
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={size}
          variant="outline"
          disabled={
            loadingMintNFT ||
            isSignatureFreeMinting ||
            loadingSignatureFreeMint ||
            isPartnerFreeMinting ||
            loadingPartnerFreeMint
          }
          className="bg-gradient-to-r from-[#9ffd8d] to-[#eaff61] hover:bg-gradient-to-l"
          onClick={async () => {
            if (canSignatureFreeMint) {
              console.log('Signature free mint, proceed')
              onSignatureFreeMint()
            } else if (availableNFT) {
              console.log('Partner free mint, proceed')
              onPartnerFreeMint()
            } else {
              console.log('Mint, proceed')
              setOpen(true)
            }
          }}
        >
          {(loadingMintNFT ||
            isSignatureFreeMinting ||
            loadingSignatureFreeMint ||
            isPartnerFreeMinting ||
            loadingPartnerFreeMint) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          ✨ Mint zkImagine NFT{' '}
          {canSignatureFreeMint || availableNFT ? ' (Free & Zero Gas)' : ''}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mint Imagine NFT</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="address">{'Referral Address (Optional)'}</Label>
          <Input
            id="address"
            placeholder="Referral Address"
            autoComplete="off"
            value={referralAddress}
            onChange={(e) => setReferralAddress(e.target.value as Address)}
          />
          <span className="text-xs font-normal leading-snug text-muted-foreground">
            Use referral address to receive 10% mint discount
          </span>
        </div>
        <div className="text-sm">
          Mint fee:{' '}
          {mintFee && discountedFee
            ? isValidReferral
              ? formatEther(discountedFee.fee)
              : formatEther(mintFee)
            : '-'}{' '}
          ETH
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false)
              onMintToNFT()
            }}
          >
            Mint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
