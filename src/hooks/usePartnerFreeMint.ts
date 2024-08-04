import { useCallback, useEffect, useState } from 'react'
import { Address } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import ZkImagineABI from '@/abis/ZkImagine.json'
import { MarketConfig } from '@/constants/MarketConfig'

// API endpoints
const PARTNER_NFTS_API = '/api/partner-nfts'
const ALCHEMY_API_KEY = 'eidoi0POGaYMIT_BoH8UOsE9O5ojUyYN'
const ALCHEMY_API_URL = `https://zksync-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}` // Replace with your Alchemy API key

export const usePartnerFreeMint = () => {
  const { address, chain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({
    chainId: walletClient?.chain.id,
  })

  // State variables
  const [partnerNFTs, setPartnerNFTs] = useState<string[]>([])
  const [availableNFT, setAvailableNFT] = useState<{
    address: string
    tokenId: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch the list of partner NFTs from the API
  const fetchPartnerNFTs = useCallback(async () => {
    if (!address) return

    try {
      //TODO Uncomment the following code to fetch partner NFTs from the API
      // const response = await fetch(
      //   `${PARTNER_NFTS_API}?minterAddress=${address}`,
      // )

      // @dev in mock mode, API return the mock data ['0x5e0652d510d6823e0A6480b062179658645CBa81']
      const response = {
        json: async () => {
          return {
            canMintForPartnerNFTs: [
              '0x5e0652d510d6823e0A6480b062179658645CBa81',
            ],
          }
        },
        ok: true,
      }
      const data = await response.json()

      console.log('>>> fetchPartnerNFTs Debug - NFT list from API: ', data)

      if (!response.ok) {
        // @ts-ignore
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

  // Fetch NFTs owned by the user using Alchemy API
  const fetchNFTsForOwner = useCallback(async () => {
    if (!address || partnerNFTs.length === 0) return

    try {
      const contractAddresses = partnerNFTs
        .map((nft) => `contractAddresses[]=${nft}`)
        .join('&')
      const url = `${ALCHEMY_API_URL}/getNFTsForOwner?owner=${address}&${contractAddresses}&withMetadata=false`

      const response = await fetch(url, {
        method: 'GET',
        headers: { accept: 'application/json' },
      })
      const data = await response.json()

      console.log('>>> fetchNFTsForOwner Debug - NFT id:', data)

      return data.ownedNfts
    } catch (error) {
      console.error('Error fetching NFTs for owner', error)
      return []
    }
  }, [address, partnerNFTs])

  // Find a usable partner NFT for free minting
  const findUsablePartnerNFT = useCallback(async () => {
    if (!publicClient || !address) return null

    const ownedNfts = await fetchNFTsForOwner()

    for (const nft of ownedNfts) {
      try {
        const currentMarket = Object.values(MarketConfig).find(
          (m) => m.chain.id === publicClient.chain.id,
        )
        if (!currentMarket) continue

        // Check if the NFT can be used for partner free minting
        const result = await publicClient.readContract({
          address: currentMarket.addresses.ZkImagine,
          abi: ZkImagineABI,
          functionName: 'canMintForPartnerNFT',
          args: [address, nft.contractAddress as Address, BigInt(nft.tokenId)],
        })

        if (result) {
          console.log('>>> findUsablePartnerNFT Debug - NFT & ID:', nft)
          setAvailableNFT({
            address: nft.contractAddress,
            tokenId: nft.tokenId,
          })
          return { address: nft.contractAddress, tokenId: nft.tokenId }
        }
      } catch (error) {
        console.error('Error checking canMintForPartnerNFT:', error)
      }
    }

    setAvailableNFT(null)
    return null
  }, [publicClient, address, fetchNFTsForOwner])

  // Fetch partner NFTs when the component mounts or address changes
  useEffect(() => {
    fetchPartnerNFTs()
  }, [fetchPartnerNFTs])

  return {
    partnerNFTs,
    findUsablePartnerNFT,
    availableNFT,
    canPartnerFreeMint: partnerNFTs.length > 0,
  }
}
