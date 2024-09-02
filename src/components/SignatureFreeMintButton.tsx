import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { useMintZkImagine } from '@/hooks/useMintZkImagine'
import { useSignatureFreeMint } from '@/hooks/useSignatureFreeMint'

interface SignatureFreeMintButtonProps {
  modelId: string
  imageId: string
  onSuccess?: (hash: string) => void
  onError?: (error: Error) => void
}

export const SignatureFreeMintButton: React.FC<
  SignatureFreeMintButtonProps
> = ({ modelId, imageId, onSuccess, onError }) => {
  const { canSignatureFreeMint, isLoading, error, refreshSignatureData } =
    useSignatureFreeMint()
  const { signatureFreeMint } = useMintZkImagine()
  const [isMinting, setIsMinting] = useState(false)
  const [isNotified, setIsNotified] = useState(false)

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`)
    }
  }, [error])

  // Show toast when the user can signature free mint
  useEffect(() => {
    if (canSignatureFreeMint != null && !isNotified) {
      toast.success('You are in the free mint whitelist!')
      setIsNotified(true)
    } else if (canSignatureFreeMint == null && !isNotified) {
      setIsNotified(true)
      console.log('Signature free mint: Not available')
    }
  }, [canSignatureFreeMint])

  const handlePartnerFreeMint = async () => {
    if (!canSignatureFreeMint) {
      toast.error('You are not eligible for free mint')
      return
    }
    setIsMinting(true)

    try {
      const hash = await signatureFreeMint(modelId, imageId)
      onSuccess?.(hash)
      toast.success('Free mint successful! Score +1')
    } catch (error) {
      console.error('Signature free mint failed', error)
      onError?.(
        error instanceof Error ? error : new Error('Unknown error occurred'),
      )
      toast.error(
        'Free minting failed. Please make sure you are in the list',
      )
    } finally {
      setIsMinting(false)
    }
  }
  return (
    <div className="flex space-x-2">
      <Button
        onClick={handlePartnerFreeMint}
        disabled={isMinting || isLoading || !canSignatureFreeMint}
      >
        {isMinting || isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Signature Free Mint
      </Button>
    </div>
  )
}
