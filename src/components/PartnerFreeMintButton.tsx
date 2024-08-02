import { Loader2 } from 'lucide-react' // Assuming you're using Lucide icons
import React, { useState } from 'react'

import { Button } from '@/components/ui/button' // Adjust this import based on your UI library

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
  const { partnerNFTs, findUsablePartnerNFT, canPartnerFreeMint } =
    usePartnerFreeMint()

  const { partnerFreeMint } = useMintZkImagine()
  const [isLoading, setIsLoading] = useState(false)

  const handlePartnerFreeMint = async () => {
    if (!canPartnerFreeMint) return

    setIsLoading(true)
    try {
      const hash = await partnerFreeMint(modelId, imageId)
      // console.log('Partner free minting successful, transaction hash:', hash)
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

  if (!canPartnerFreeMint) {
    return null // Don't render the button if partner free minting is not available
  }

  return (
    <div>
      {canPartnerFreeMint && (
        <Button onClick={handlePartnerFreeMint}>Partner Free Mint</Button>
      )}
    </div>
  )
}
