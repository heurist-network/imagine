import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { useMintZkImagine } from '@/hooks/useMintZkImagine'
import { usePartnerFreeMint } from '@/hooks/usePartnerFreeMint'

interface PartnerFreeMintButtonProps {
  modelId: string
  imageId: string
  onSuccess?: (hash: string) => void
  onError?: (error: Error) => void
}

export const PartnerFreeMintButton: React.FC<PartnerFreeMintButtonProps> = ({
  modelId,
  imageId,
  onSuccess,
  onError,
}) => {
  const { availableNFT, isLoading, error, refreshPartnerNFTs } =
    usePartnerFreeMint()
  const { partnerFreeMint } = useMintZkImagine()
  const [isMinting, setIsMinting] = useState(false)
  const [isNotified, setIsNotified] = useState(false)

  // Run refreshPartnerNFTs once on mount
  useEffect(() => {
    refreshPartnerNFTs()
  }, [refreshPartnerNFTs])

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`)
    }
  }, [error])

  // Show success toast if an available NFT is found
  useEffect(() => {
    if (availableNFT != null && !isNotified) {
      toast.success('Partner NFT available for free minting!')
      setIsNotified(true)
    } else if (availableNFT == null && !isNotified) {
      setIsNotified(true)
      console.log(
        'Partner Free Mint: No partner NFT available for free minting.',
      )
    }
  }, [availableNFT])

  const handlePartnerFreeMint = async () => {
    if (!availableNFT) {
      toast.error('No partner NFT available for free minting.')
      return
    }

    setIsMinting(true)
    try {
      const hash = await partnerFreeMint(
        modelId,
        imageId,
        availableNFT.address,
        BigInt(availableNFT.tokenId),
      )
      onSuccess?.(hash)
      toast.success('Free mint successful! Score +1')
    } catch (error) {
      console.error('Partner free minting failed:', error)
      onError?.(
        error instanceof Error ? error : new Error('Unknown error occurred'),
      )
      toast.error(
        'Free minting failed. Please make sure you hold an eligible partner NFT.',
      )
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="flex space-x-2">
      <Button
        onClick={handlePartnerFreeMint}
        disabled={isMinting || isLoading || !availableNFT}
      >
        {isMinting || isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Partner Free Mint
      </Button>
    </div>
  )
}
