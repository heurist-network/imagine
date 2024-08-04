import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

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
  // Custom hooks for partner free minting
  const { findUsablePartnerNFT, availableNFT } = usePartnerFreeMint()
  const { partnerFreeMint } = useMintZkImagine()

  // State to manage loading state
  const [isLoading, setIsLoading] = useState(false)

  // Effect to find a usable partner NFT when component mounts or canPartnerFreeMint changes
  useEffect(() => {
    findUsablePartnerNFT()
  }, [findUsablePartnerNFT])

  // Handler for partner free minting
  const handlePartnerFreeMint = async () => {
    if (!availableNFT) return

    setIsLoading(true)
    try {
      const hash = await partnerFreeMint(modelId, imageId)
      onSuccess?.(hash)
    } catch (error) {
      console.error('Partner free minting failed:', error)
      onError?.(
        error instanceof Error ? error : new Error('Unknown error occurred'),
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render the button if partner free minting is not available
  if (!availableNFT) {
    return null
  }

  return (
    <Button onClick={handlePartnerFreeMint} disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Partner Free Mint
    </Button>
  )
}
