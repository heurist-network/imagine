import { useCallback, useEffect, useState } from 'react'
import { Address, keccak256 } from 'viem'
import { useAccount } from 'wagmi'

interface SignatureData {
  address: string
  hash: string
  signature: string
}

const SIGNATURE_DATA_URL =
  'https://raw.githubusercontent.com/heurist-network/zkImagine-NFT/main/scripts/generateSignatures/output_signatures.json'

export const useSignatureFreeMint = () => {
  const { address } = useAccount()
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSignatureData = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(SIGNATURE_DATA_URL)
      const data: SignatureData[] = await response.json()

      const userSignatureData = data.find(
        (item) => item.address.toLowerCase() === address.toLowerCase(),
      )

      if (userSignatureData) {
        setSignatureData(userSignatureData)
      } else {
        setSignatureData(null)
      }
    } catch (error) {
      console.error('Error fetching signature data:', error)
      setError('Failed to fetch signature data')
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetchSignatureData()
  }, [fetchSignatureData])

  const canSignatureFreeMint = useCallback(() => {
    return signatureData !== null
  }, [signatureData])

  return {
    signatureData,
    isLoading,
    error,
    canSignatureFreeMint,
    refreshSignatureData: fetchSignatureData,
  }
}
