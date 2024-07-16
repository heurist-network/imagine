import { useCallback, useEffect, useState } from 'react'
import { Address } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import ZkImagineABI from '@/abis/ZkImagine.json'
import { MarketConfig } from '@/constants/MarketConfig'

const AVAILABLE_FREE_MINT_API =
  'https://mrlkq2kv5f.execute-api.us-east-1.amazonaws.com/test/available-free-mint'

export const usePartnerFreeMint = () => {
  const { address, chain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({
    chainId: walletClient?.chain.id,
  })
  const [partnerNFTs, setPartnerNFTs] = useState<string[]>([])

  const fetchPartnerNFTs = useCallback(async () => {
    if (!address) return

    try {
      const response = await fetch(AVAILABLE_FREE_MINT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ minterAddress: address }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch partner NFTs')
      }

      const data = await response.json()
      setPartnerNFTs(data.canMintForPartnerNFTs)
    } catch (error) {
      console.error('Error fetching partner NFTs:', error)
    }
  }, [address])

  const checkCanMintForPartnerNFT = useCallback(
    async (partnerNFTAddress: string) => {
      if (!publicClient || !address) return false

      const currentMarket = Object.values(MarketConfig).find(
        (m) => m.chain.id === publicClient.chain.id,
      )
      if (!currentMarket) return false

      try {
        const result = await publicClient.readContract({
          address: currentMarket.addresses.ZkImagine,
          abi: ZkImagineABI,
          functionName: 'canMintForPartnerNFT',
          args: [address, partnerNFTAddress as Address],
        })

        return (result as any).canMint
      } catch (error) {
        console.error('Error checking canMintForPartnerNFT:', error)
        return false
      }
    },
    [publicClient, address],
  )

  const findUsablePartnerNFT = useCallback(async () => {
    for (const nftAddress of partnerNFTs) {
      if (await checkCanMintForPartnerNFT(nftAddress)) {
        return nftAddress
      }
    }
    return null
  }, [partnerNFTs, checkCanMintForPartnerNFT])

  useEffect(() => {
    fetchPartnerNFTs()
  }, [fetchPartnerNFTs])

  return {
    partnerNFTs,
    findUsablePartnerNFT,
    canPartnerFreeMint: partnerNFTs.length > 0,
  }
}
