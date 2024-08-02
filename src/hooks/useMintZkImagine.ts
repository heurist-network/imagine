import { useCallback, useEffect, useState } from 'react'
import { Address } from 'viem'
import { zkSync, zkSyncSepoliaTestnet } from 'viem/zksync'
import {
  useAccount,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'

import ZkImagineABI from '@/abis/ZkImagine.json'
import { MarketConfig } from '@/constants/MarketConfig'

import { usePartnerFreeMint } from './usePartnerFreeMint'

/**
 * Custom hook for minting ZkImagine NFTs.
 * This hook handles the minting process, including reading mint fees,
 * calculating discounts, and executing the mint transaction.
 *
 * @returns An object containing minting functions and related data.
 */
export const useMintZkImagine = () => {
  // Get account details and wallet client
  const { address, chain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { switchChain } = useSwitchChain()

  const { findUsablePartnerNFT, canPartnerFreeMint } = usePartnerFreeMint()

  // State for storing mint fees
  const [mintFee, setMintFee] = useState<bigint | null>(null)
  const [discountedFee, setDiscountedFee] = useState<{
    fee: bigint
    discount: bigint
  } | null>(null)

  // Get public client for reading contract data
  const publicClient = usePublicClient({
    chainId: walletClient?.chain.id,
  })

  // Determine the current market based on the connected chain
  const currentMarket = chain
    ? Object.values(MarketConfig).find((m) => m.chain.id === chain.id)
    : undefined

  /**
   * Reads the current mint fee from the contract.
   */
  const readMintFee = useCallback(async () => {
    if (!publicClient || !currentMarket) {
      console.error('Public client or current market not available')
      return
    }

    try {
      const fee = await publicClient.readContract({
        address: currentMarket.addresses.ZkImagine,
        abi: ZkImagineABI,
        functionName: 'mintFee',
      })

      setMintFee(fee as bigint)
      return fee as bigint
    } catch (error) {
      console.error('Error reading mintFee:', error)
    }
  }, [publicClient, currentMarket])

  /**
   * Reads the discounted mint fee from the contract.
   */
  const readDiscountedMintFee = useCallback(async () => {
    if (!publicClient || !currentMarket) {
      console.error('Public client or current market not available')
      return
    }

    try {
      const [discountedFee, discount] = (await publicClient.readContract({
        address: currentMarket.addresses.ZkImagine,
        abi: ZkImagineABI,
        functionName: 'getDiscountedMintFee',
      })) as [bigint, bigint]

      setDiscountedFee({ fee: discountedFee, discount })
      return { fee: discountedFee, discount }
    } catch (error) {
      console.error('Error reading discounted mint fee:', error)
    }
  }, [publicClient, currentMarket])

  // Switch to zkSync Sepolia testnet if not already connected
  useEffect(() => {
    if (chain && chain.id !== zkSync.id) {
      switchChain({ chainId: zkSync.id })
    }
  }, [chain, switchChain])

  // Read mint fees when public client and market are available
  useEffect(() => {
    if (publicClient && currentMarket) {
      readMintFee().catch(console.error)
      readDiscountedMintFee().catch(console.error)
    }
  }, [publicClient, currentMarket, readMintFee, readDiscountedMintFee])

  /**
   * Mints a new ZkImagine NFT.
   *
   * @param referralAddress - The address of the referrer (for discount)
   * @param modelId - The ID of the model used for the NFT
   * @param imageId - The ID of the image used for the NFT
   * @returns The transaction hash of the mint transaction
   */
  const mint = useCallback(
    async (referralAddress: string, modelId: string, imageId: string) => {
      if (!currentMarket || !walletClient || !publicClient || !address) {
        throw new Error('Wallet not connected or unsupported chain')
      }

      if (mintFee === null || discountedFee === null) {
        throw new Error('Mint fee not yet loaded')
      }

      // Determine which fee to use based on referral address
      let mintFeeToUse = mintFee
      if (
        referralAddress !== '0x0000000000000000000000000000000000000000' &&
        referralAddress !== address
      ) {
        // Use discounted fee if a valid referral address is provided
        mintFeeToUse = discountedFee.fee
      } else {
        referralAddress = '0x0000000000000000000000000000000000000000'
      }

      // Simulate the contract interaction
      const { request } = await publicClient.simulateContract({
        address: currentMarket.addresses.ZkImagine,
        abi: ZkImagineABI,
        functionName: 'mint',
        args: [address, referralAddress as Address, modelId, imageId],
        account: address,
        value: mintFeeToUse,
      })

      // Execute the actual transaction
      const hash = await walletClient.writeContract(request)
      await publicClient.waitForTransactionReceipt({ hash })

      return hash
    },
    [
      address,
      currentMarket,
      walletClient,
      publicClient,
      mintFee,
      discountedFee,
    ],
  )

  const partnerFreeMint = useCallback(
    async (modelId: string, imageId: string) => {
      if (!currentMarket || !walletClient || !publicClient || !address) {
        throw new Error('Wallet not connected or unsupported chain')
      }

      const usablePartnerNFT = await findUsablePartnerNFT()
      if (!usablePartnerNFT) {
        throw new Error('No usable partner NFT found for free minting')
      }

      // Simulate the contract interaction
      const { request } = await publicClient.simulateContract({
        address: currentMarket.addresses.ZkImagine,
        abi: ZkImagineABI,
        functionName: 'partnerFreeMint',
        args: [address, usablePartnerNFT as Address, modelId, imageId],
        account: address,
      })

      // Execute the actual transaction
      const hash = await walletClient.writeContract(request)
      await publicClient.waitForTransactionReceipt({ hash })

      return hash
    },
    [address, currentMarket, walletClient, publicClient, findUsablePartnerNFT],
  )
  // Return placeholder functions if wallet is not connected or chain is not supported
  if (!chain || !address || !publicClient) {
    return {
      mint: async () => {
        throw new Error('Wallet not connected or unsupported chain')
      },
      partnerFreeMint: async () => {
        throw new Error('Wallet not connected or unsupported chain')
      },
      mintFee: null,
      discountedFee: null,
      readMintFee: async () => {
        throw new Error('Wallet not connected or unsupported chain')
      },
      readDiscountedMintFee: async () => {
        throw new Error('Wallet not connected or unsupported chain')
      },
      canPartnerFreeMint: false,
    }
  }

  // Return the hook's functions and data
  return {
    mint,
    partnerFreeMint,
    mintFee,
    discountedFee,
    readMintFee,
    readDiscountedMintFee,
    canPartnerFreeMint,
  }
}
