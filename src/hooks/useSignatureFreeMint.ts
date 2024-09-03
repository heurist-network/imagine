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
  const [canSignatureFreeMint, setCanSignatureFreeMint] = useState()

  /**
   * Fetches the signature data for the connected wallet address and checks if it's valid.
   */
  const fetchAndCheckSignatureData = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      // Fetch signature data
      const response = await fetch(SIGNATURE_DATA_URL)
      const data: SignatureData[] = await response.json()

      const userSignatureData = data.find(
        (item) => item.walletAddress.toLowerCase() === address.toLowerCase(),
      )

      setSignatureData(userSignatureData || null)

      // Check signature validity
      if (userSignatureData && publicClient) {
        const currentMarket = Object.values(MarketConfig).find(
          (m) => m.chain.id === publicClient.chain.id,
        )
        const contractAddress = currentMarket?.addresses.ZkImagine
        if (!contractAddress) {
          setCanSignatureFreeMint(false)
          setError('Contract address not found for the current chain')
          return
        }

        try {
          // Read contract: canMintForSignature
          const result = (await publicClient.readContract({
            address: contractAddress,
            abi: ZkImagineABI,
            functionName: 'canMintForSignature',
            args: [
              userSignatureData.hash,
              userSignatureData.signature,
              address,
            ],
          })) as { canMint: boolean; reason: string }

          setCanSignatureFreeMint(result.canMint)
        } catch (error) {
          console.error('Error reading contract:', error)
          setError('Failed to read contract')
        }
      }
    } catch (error) {
      console.error('Error fetching or checking signature data:', error)
      setError('Failed to fetch or check signature data')
      setCanSignatureFreeMint(false)
    } finally {
      setIsLoading(false)
    }
  }, [address, publicClient])

  /**
   * Fetches the signature data and checks if the signature is valid when the component mounts.
   */
  useEffect(() => {
    fetchAndCheckSignatureData()
  }, [fetchAndCheckSignatureData])

  /**
   * Automatically refreshes the signature data every minute.
   */
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchAndCheckSignatureData()
    }, 60000) // Refresh every minute

    return () => clearInterval(refreshInterval)
  }, [fetchAndCheckSignatureData])

  return {
    signatureData,
    isLoading,
    error,
    canSignatureFreeMint,
    refreshSignatureData: fetchAndCheckSignatureData,
  }
}
