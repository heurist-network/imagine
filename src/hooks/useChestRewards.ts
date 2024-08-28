import { useCallback, useEffect, useState } from 'react'
import { Address } from 'viem'
import {
  useAccount,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'

import ChestRewardsABI from '../abis/ChestRewards.json'
import { Market, MarketConfig, MarketDataType } from '../constants/MarketConfig'

// Define the structure of rewards
type Rewards = {
  silverRewards: bigint
  goldRewards: bigint
}

// Enum for reward types
export enum RewardType {
  SILVER = 0,
  GOLD = 1,
}

/**
 * Custom hook for interacting with the ChestRewards contract
 * @param market The market to interact with
 */
export function useChestRewards(market: Market) {
  const { address, chain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { switchChain } = useSwitchChain()
  const [rewards, setRewards] = useState<Rewards>({
    silverRewards: BigInt(0),
    goldRewards: BigInt(0),
  })
  const publicClient = usePublicClient({
    chainId: walletClient?.chain.id,
  })

  const [currentMarket, setCurrentMarket] = useState<
    MarketDataType | undefined
  >(undefined)

  // Effect to set the current market and switch chain if necessary
  useEffect(() => {
    const marketData = MarketConfig[market]
    setCurrentMarket(marketData)

    if (chain && chain.id !== marketData.chain.id) {
      switchChain({ chainId: marketData.chain.id })
    }
  }, [chain, market, switchChain])

  const chestRewardsAddress = currentMarket?.addresses.ChestRewards as
    | Address
    | undefined

  /**
   * Fetch the current rewards for the connected address
   */
  const viewRewards = useCallback(async () => {
    if (!address || !publicClient || !chestRewardsAddress) return

    try {
      const result = (await publicClient.readContract({
        address: chestRewardsAddress,
        abi: ChestRewardsABI,
        functionName: 'viewRewards',
        args: [address],
      })) as [bigint, bigint]

      setRewards({
        silverRewards: result[0],
        goldRewards: result[1],
      })
    } catch (error) {
      console.error('Error viewing rewards:', error)
    }
  }, [address, publicClient, chestRewardsAddress])

  /**
   * Claim rewards for the connected address
   * @param rewardType The type of reward to claim (SILVER or GOLD)
   */
  const claimRewards = useCallback(
    async (rewardType: RewardType) => {
      if (!address || !walletClient || !publicClient || !chestRewardsAddress)
        return

      try {
        // Simulate the contract call
        const { request } = await publicClient.simulateContract({
          address: chestRewardsAddress,
          abi: ChestRewardsABI,
          functionName: 'claimRewards',
          account: address,
          args: [rewardType],
        })

        // Execute the actual transaction
        const hash = await walletClient.writeContract(request)

        // Wait for the transaction to be mined
        const receipt = await publicClient.waitForTransactionReceipt({ hash })

        // Refresh rewards after claiming
        await viewRewards()

        return receipt
      } catch (error) {
        console.error('Error claiming rewards:', error)
        throw error
      }
    },
    [address, walletClient, publicClient, chestRewardsAddress, viewRewards],
  )

  // Effect to fetch rewards when publicClient and chestRewardsAddress are available
  useEffect(() => {
    if (publicClient && chestRewardsAddress) {
      viewRewards()
    }
  }, [publicClient, chestRewardsAddress, viewRewards])

  return {
    rewards,
    viewRewards,
    claimRewards,
    currentMarket,
  }
}
