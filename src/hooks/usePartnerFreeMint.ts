import { useCallback, useEffect, useState } from 'react'
import { Address } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import ZkImagineABI from '@/abis/ZkImagine.json'
import { MarketConfig } from '@/constants/MarketConfig'
import { partnerNftList } from '@/constants/partnerNftList'

export const usePartnerFreeMint = () => {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({
    chainId: walletClient?.chain.id,
  })

  const [availableNFT, setAvailableNFT] = useState<{
    address: Address
    tokenId: string
  } | null>(null)
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // @note Alchemy API Call: Fetch NFTs owned by the user
  const fetchNFTsForOwner = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    try {
      const contractAddresses = partnerNftList
        .map((nft) => `contractAddresses[]=${nft}`)
        .join('&')
      const url = `/api/getNFTsForOwner?address=${address}&${contractAddresses}&withMetadata=false`

      const response = await fetch(url)
      const data = await response.json()

      setOwnedNFTs(data.ownedNfts || [])
    } catch (error) {
      console.error('Error fetching NFTs for owner', error)
      setOwnedNFTs([])
    } finally {
      setIsLoading(false)
    }
  }, [address])

  // @note Read contract:  Find a usable partner NFT for free minting
  const findUsablePartnerNFT = useCallback(async () => {
    if (!publicClient || !address || ownedNFTs.length === 0) return null

    for (const nft of ownedNFTs) {
      try {
        const currentMarket = Object.values(MarketConfig).find(
          (m) => m.chain.id === publicClient.chain.id,
        )
        if (!currentMarket) continue

        const result = (await publicClient.readContract({
          address: currentMarket.addresses.ZkImagine,
          abi: ZkImagineABI,
          functionName: 'canMintForPartnerNFT',
          args: [address, nft.contractAddress as Address, BigInt(nft.tokenId)],
        })) as { canMint: boolean; reason: string }

        if (result.canMint === true) {
          const usableNFT = {
            address: nft.contractAddress,
            tokenId: nft.tokenId,
          }

          setAvailableNFT(usableNFT)
          return usableNFT
        }
      } catch (error) {
        console.error('Error checking canMintForPartnerNFT:', error)
      }
    }

    setAvailableNFT(null)
    return null
  }, [publicClient, address, ownedNFTs])

  // Effect to find usable NFT when ownedNFTs changes
  useEffect(() => {
    findUsablePartnerNFT()
  }, [findUsablePartnerNFT])

  // Function to manually trigger NFT fetch and usable NFT check
  //@dev This function allows the component to refresh the list of owned NFTs and find any that are eligible for partner free minting, updating the UI accordingly.
  const refreshPartnerNFTs = useCallback(async () => {
    await fetchNFTsForOwner()
  }, [fetchNFTsForOwner])

  return {
    availableNFT,
    isLoading,
    error,
    refreshPartnerNFTs,
  }
}
