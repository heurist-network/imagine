import { useCallback, useEffect, useState } from 'react'
import { Address } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import ZkImagineABI from '@/abis/ZkImagine.json'
import { MarketConfig } from '@/constants/MarketConfig'

const PARTNER_NFTS_API = '/api/partner-nfts'

export const usePartnerFreeMint = () => {
  const { address, chain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({
    chainId: walletClient?.chain.id,
  })
  const [partnerNFTs, setPartnerNFTs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchPartnerNFTs = useCallback(async () => {
    if (!address) return

    try {
      const response = await fetch(
        `${PARTNER_NFTS_API}?minterAddress=${address}`,
      )
      const textData = await response.text()

      let data
      try {
        data = JSON.parse(textData)
      } catch (e) {
        console.error('Failed to parse JSON:', textData)
        throw new Error('Invalid response format')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch partner NFTs')
      }

      setPartnerNFTs(data.canMintForPartnerNFTs || [])
      setError(null)
    } catch (error) {
      console.error('Error fetching partner NFTs:', error)
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred',
      )
      setPartnerNFTs([])
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
