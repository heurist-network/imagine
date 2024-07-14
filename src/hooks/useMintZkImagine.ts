import { useCallback, useEffect } from 'react'
import { Address, createPublicClient, http, parseEther } from 'viem'
import { zkSyncSepoliaTestnet } from 'viem/zksync'
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi'

import ZkImagineABI from '@/abis/ZkImagine.json'
import { MarketConfig, MarketDataType } from '@/constants/MarketConfig'

export const useMintZkImagine = () => {
  const { address, chain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    switchChain({
      chainId: zkSyncSepoliaTestnet.id,
    })
  }, [chain])

  if (!chain || !address) {
    throw new Error(
      'useMintZkImagine: Chain or address not found, ensure you are connected to a wallet',
    )
  }

  const currentMarket = chain
    ? Object.values(MarketConfig).find((m) => m.chain.id === chain.id)
    : undefined

  const publicClient = createPublicClient({
    chain: chain,
    transport: http(),
  })

  const createContractFunction = useCallback(
    (functionName: string) => {
      return async (
        mintFee: string,
        referralAddress: string,
        modelId: string,
        imageId: string,
      ) => {
        if (!currentMarket) throw new Error('currentMarket not found')

        if (!walletClient) {
          throw new Error('useMintZkImagine: Wallet client not found')
        }

        // @ts-ignore
        const { request } = await publicClient.simulateContract({
          address: currentMarket.addresses.ZkImagine,
          abi: ZkImagineABI,
          functionName,
          args: [address, referralAddress as Address, modelId, imageId],
          account: address,
          value: parseEther(mintFee),
        })

        const hash = await walletClient.writeContract(request)
        await publicClient.waitForTransactionReceipt({ hash })

        return hash
      }
    },
    [address, chain, currentMarket, walletClient, publicClient],
  )

  return {
    mint: createContractFunction('mint'),
  }
}
