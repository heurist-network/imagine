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
  // const [isSignatureNotified, setIsSignatureNotified] = useState(false)
  const isSignatureNotified = useRef(false)
  const isPartnerNotified = useRef(false)

  const balance =
    (useBalance({
      address: account.address,
    }).data?.value as bigint) || BigInt(0)

  const onSignatureFreeMint = async () => {
    if (!canSignatureFreeMint) {
      toast.error('You cannot signature free mint')
      return
    }
    setIsSignatureFreeMinting(true)

    try {
      // Set up abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

      const txHash = await signatureFreeMint(model, imageId)

      // Post minting data to API
      const response = await fetch('/api/mint-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: imageId,
          modelId: model,
          url: url,
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

      // Clear timeout
      clearTimeout(timeoutId)

      // Handle API response
      if (!response) {
        console.log('Mint-Proxy API: Proceeding to next step due to timeout')
      } else if (!response.ok) {
        const data = await response.json()
        console.error('Mint-Proxy API: Error:', data)
      }

      // Show success message with transaction link
      const txUrl = `${client?.chain?.blockExplorers?.default.url}/tx/${txHash}`
      toast.success(
        <div>
          <div>Signature free mint successful.</div>
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
    } catch (error) {
      console.error('Signature free mint failed', error)
      toast.error(
        'Signature free minting failed. Please make sure you are in the list',
      )
    } finally {
      setIsSignatureFreeMinting(false)
    }
  }

  const onPartnerFreeMint = async () => {
    if (!availableNFT) {
      toast.error('No partner NFT available for free minting.')
      return
    }

    setIsPartnerFreeMinting(true)
    try {
      // Set up abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

      const txHash = await partnerFreeMint(
        model,
        imageId,
        availableNFT.address,
        BigInt(availableNFT.tokenId),
      )

      // Post minting data to API
      const response = await fetch('/api/mint-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: imageId,
          modelId: model,
          url: url,
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

      // Clear timeout
      clearTimeout(timeoutId)

      // Handle API response
      if (!response) {
        console.log('Mint-Proxy API: Proceeding to next step due to timeout')
      } else if (!response.ok) {
        const data = await response.json()
        console.error('Mint-Proxy API: Error:', data)
      }

      // Show success message with transaction link
      const txUrl = `${client?.chain?.blockExplorers?.default.url}/tx/${txHash}`
      toast.success(
        <div>
          <div>Partner free minting successful!</div>
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
    } catch (error) {
      console.error('Partner free minting failed:', error)
      toast.error(
        'Partner free minting failed. Please make sure you have a partner NFT available.',
      )
    } finally {
      setIsPartnerFreeMinting(false)
    }
  }

  const onMintToNFT = async () => {
    // Function to handle minting an NFT

    // 1. Check if user is connected, if not open connect modal
    if (!account.address) return openConnectModal?.()

    // 2. Extract imageId from URL
    const arr = url.split('/').slice(-1)[0].split('-').slice(-3)
    const imageId = `${arr[0]}-${arr[1]}-${arr[2].split('.')[0]}`

    // Define zero address for referral
    const zeroReferralAddress = '0x0000000000000000000000000000000000000000'

    // Set loading state
    setLoading(true)

    try {
      // Set up abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

      // Check if user has sufficient balance
      if (mintFee && balance < mintFee) {
        toast.error('Insufficient ETH balance to mint NFT.')
        return
      }

      // 3. Call mint function
      const txHash = await mint(
        isAddress(referralAddress) ? referralAddress : zeroReferralAddress,
        model,
        imageId,
      )

      // 4. Post minting data to API
      const response = await fetch('/api/mint-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: imageId,
          modelId: model,
          url: url,
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

      // Clear timeout
      clearTimeout(timeoutId)

      // 5. Handle API response
      if (!response) {
        console.log('Mint-Proxy API: Proceeding to next step due to timeout')
      } else if (!response.ok) {
        const data = await response.json()
        console.error('Mint-Proxy API: Error:', data)
      }

      // 6. Show success message with transaction link
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
      // Error handling
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
    } finally {
      // Reset states
      setLoading(false)
      setReferralAddress('')
    }
  }

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
