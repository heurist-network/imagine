import { useCallback, useEffect, useState } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import ZkImagineABI from '@/abis/ZkImagine.json'
import { MarketConfig } from '@/constants/MarketConfig'

interface SignatureData {
  walletAddress: string
  hash: string
  signature: string
}

const SIGNATURE_DATA_URL =
  'https://raw.githubusercontent.com/heurist-network/zkImagine-NFT/main/scripts/generateSignatures/output_signatures.json'

export const useSignatureFreeMint = () => {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({
    chainId: walletClient?.chain.id,
  })
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canSignatureFreeMint, setCanSignatureFreeMint] = useState(false)

  const fetchSignatureData = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(SIGNATURE_DATA_URL)

      const data: SignatureData[] = await response.json()

      const userSignatureData = data.find(
        (item) => item.walletAddress.toLowerCase() === address.toLowerCase(),
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

  // const canSignatureFreeMint = useCallback(async () => {
  //   if (signatureData !== null && publicClient) {
  //     const currentMarket = Object.values(MarketConfig).find(
  //       (m) => m.chain.id === publicClient.chain.id,
  //     )
  //     const contractAddress = currentMarket?.addresses.ZkImagine
  //     if (!contractAddress) {
  //       throw new Error('Contract address not found for the current chain')
  //     }
  //     // read contract: canMintForSignature
  //     const result = (await publicClient.readContract({
  //       address: contractAddress,
  //       abi: ZkImagineABI,
  //       functionName: 'canMintForSignature',
  //       args: [signatureData.hash, signatureData.signature],
  //     })) as { canMint: boolean; reason: string }

  //     return result.canMint
  //   }
  // }, [signatureData, publicClient])

  useEffect(() => {
    async function checkSignature() {
      if (signatureData !== null && publicClient) {
        const currentMarket = Object.values(MarketConfig).find(
          (m) => m.chain.id === publicClient.chain.id,
        )
        const contractAddress = currentMarket?.addresses.ZkImagine
        if (!contractAddress) {
          setCanSignatureFreeMint(false)
          throw new Error('Contract address not found for the current chain')
        }

        try {
          // read contract: canMintForSignature
          const result = (await publicClient.readContract({
            address: contractAddress,
            abi: ZkImagineABI,
            functionName: 'canMintForSignature',
            args: [signatureData.hash, signatureData.signature, address],
          })) as { canMint: boolean; reason: string }

          setCanSignatureFreeMint(!!result.canMint)
        } catch (error) {
          setCanSignatureFreeMint(false)
        }
      } else {
        setCanSignatureFreeMint(false)
      }
    }

    checkSignature()
  }, [signatureData, publicClient])

  useEffect(() => {
    fetchSignatureData()
  }, [fetchSignatureData])

  // Auto refresh signature data when webpage loads
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchSignatureData()
    }, 60000) // Refresh every minute

    return () => clearInterval(refreshInterval)
  }, [fetchSignatureData])

  return {
    signatureData,
    isLoading,
    error,
    canSignatureFreeMint,
    refreshSignatureData: fetchSignatureData,
  }
}
