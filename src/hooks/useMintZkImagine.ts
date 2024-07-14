import { useCallback, useEffect, useState } from 'react'
import { Address, parseEther } from 'viem'
import { zkSyncSepoliaTestnet } from 'viem/zksync'
import {
  useAccount,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'

import ZkImagineABI from '@/abis/ZkImagine.json'
import { MarketConfig } from '@/constants/MarketConfig'

export const useMintZkImagine = () => {
  const { address, chain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { switchChain } = useSwitchChain()
  const [mintFee, setMintFee] = useState<bigint | null>(null)
  const publicClient = usePublicClient({
    chainId: walletClient?.chain.id,
  })

  const currentMarket = chain
    ? Object.values(MarketConfig).find((m) => m.chain.id === chain.id)
    : undefined

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

  useEffect(() => {
    if (chain && chain.id !== zkSyncSepoliaTestnet.id) {
      switchChain({ chainId: zkSyncSepoliaTestnet.id })
    }
  }, [chain, switchChain])

  useEffect(() => {
    if (publicClient && currentMarket) {
      readMintFee().catch(console.error)
    }
  }, [publicClient, currentMarket, readMintFee])

  const mint = useCallback(
    async (referralAddress: string, modelId: string, imageId: string) => {
      if (!currentMarket || !walletClient || !publicClient || !address) {
        throw new Error('Wallet not connected or unsupported chain')
      }

      if (mintFee === null) {
        throw new Error('Mint fee not yet loaded')
      }

      let mintFeeAfterDiscount = mintFee
      if (
        referralAddress !== '0x0000000000000000000000000000000000000000' &&
        referralAddress !== address
      ) {
        // 10% discount for using referral address && not using own address
        mintFeeAfterDiscount = (mintFeeAfterDiscount * BigInt(90)) / BigInt(100)
      } else {
        referralAddress = '0x0000000000000000000000000000000000000000'
      }

      const { request } = await publicClient.simulateContract({
        address: currentMarket.addresses.ZkImagine,
        abi: ZkImagineABI,
        functionName: 'mint',
        args: [address, referralAddress as Address, modelId, imageId],
        account: address,
        value: mintFeeAfterDiscount,
      })

      const hash = await walletClient.writeContract(request)
      await publicClient.waitForTransactionReceipt({ hash })

      return hash
    },
    [address, currentMarket, walletClient, publicClient, mintFee],
  )

  if (!chain || !address || !publicClient) {
    return {
      mint: async () => {
        throw new Error('Wallet not connected or unsupported chain')
      },
      mintFee: null,
      readMintFee: async () => {
        throw new Error('Wallet not connected or unsupported chain')
      },
    }
  }

  return {
    mint,
    mintFee,
    readMintFee,
  }
}
