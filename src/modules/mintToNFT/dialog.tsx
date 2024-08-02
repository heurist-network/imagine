import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Address, formatEther, Hash, isAddress } from 'viem'
import { useAccount, useBalance, useClient } from 'wagmi'

import { Button } from '@/components/ui/button'
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
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { useMintToNFT } from './hooks'

export function MintToNFT({
  children,
  url,
  model,
}: {
  children: React.ReactNode
  url: string
  model: string
}) {
  const account = useAccount()
  const client = useClient()

  const { openConnectModal } = useConnectModal()
  const { setLoading, referralAddress, setReferralAddress } = useMintToNFT()
  const { mint, mintFee, discountedFee } = useMintZkImagine()

  const [open, setOpen] = useState(false)
  const [isValidReferral, setIsValidReferral] = useState(false)

  const balance =
    (useBalance({
      address: account.address,
    }).data?.value as bigint) || BigInt(0)

  const onMintToNFT = async () => {
    if (!account.address) return openConnectModal?.()

    const arr = url.split('/').slice(-1)[0].split('-').slice(-3)
    const imageId = `${arr[0]}-${arr[1]}-${arr[2].split('.')[0]}`

    const zeroReferralAddress = '0x0000000000000000000000000000000000000000'

    setLoading(true)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

      // check wallet balance, balance should > mintFee
      if (mintFee && balance < mintFee) {
        toast.error('Insufficient ETH balance to mint NFT.')
        return
      }

      const txHash = await mint(
        isAddress(referralAddress) ? referralAddress : zeroReferralAddress,
        model,
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
      setReferralAddress('')
    }
  }

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
