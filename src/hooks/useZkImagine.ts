import { useCallback, useEffect, useState } from 'react'
import {
  Abi,
  Address,
  encodeFunctionData,
  keccak256,
  PublicClient,
  WalletClient,
} from 'viem'
import { eip712WalletActions, zksync } from 'viem/zksync'
import {
  useAccount,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'

import ZkImagineABI from '@/abis/ZkImagine.json'
import { MarketConfig } from '@/constants/MarketConfig'

import { useSignatureFreeMint } from './useSignatureFreeMint'

export const useZkImagine = () => {
  const { address, chain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { switchChain } = useSwitchChain()
  const publicClient = usePublicClient({
    chainId: walletClient?.chain.id,
  })

  const { signatureData, canSignatureFreeMint, refreshSignatureData } =
    useSignatureFreeMint()

  const [mintFee, setMintFee] = useState<bigint | null>(null)
  const [discountedFee, setDiscountedFee] = useState<{
    fee: bigint
    discount: bigint
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [globalTimeThreshold, setGlobalTimeThreshold] = useState<bigint | null>(
    null,
  )

  const currentMarket = chain
    ? Object.values(MarketConfig).find((m) => m.chain.id === chain.id)
    : undefined

  const readMintFee = useCallback(async () => {
    if (!publicClient || !currentMarket) return

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

  const readDiscountedMintFee = useCallback(async () => {
    if (!publicClient || !currentMarket) return

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

  const readGlobalTimeThreshold = useCallback(async () => {
    if (!publicClient || !currentMarket) return

    try {
      const threshold = await publicClient.readContract({
        address: currentMarket.addresses.ZkImagine,
        abi: ZkImagineABI,
        functionName: 'globalTimeThreshold',
      })

      setGlobalTimeThreshold(threshold as bigint)
      return threshold as bigint
    } catch (error) {
      console.error('Error reading globalTimeThreshold:', error)
    }
  }, [publicClient, currentMarket])

  useEffect(() => {
    if (chain && chain.id !== zksync.id) {
      switchChain({ chainId: zksync.id })
    }
  }, [chain, switchChain])

  useEffect(() => {
    if (publicClient && currentMarket) {
      readMintFee().catch(console.error)
      readDiscountedMintFee().catch(console.error)
      readGlobalTimeThreshold().catch(console.error)
    }
  }, [
    publicClient,
    currentMarket,
    readMintFee,
    readDiscountedMintFee,
    readGlobalTimeThreshold,
  ])

  // @dev getSponsoredPaymasterParams is used for partnerFreeMint with zyfi paymaster.
  const getSponsoredPaymasterParams = useCallback(async (txRequest: any) => {
    try {
      const response = await fetch('/api/sponsored-paymaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txRequest }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error during sponsored paymaster API call:', error)
      throw error
    }
  }, [])

  // @dev call to zkImagine contract to mint.
  const mint = useCallback(
    async (referralAddress: string, modelId: string, imageId: string) => {
      if (!currentMarket || !walletClient || !publicClient || !address) {
        throw new Error('Wallet not connected or unsupported chain')
      }

      if (mintFee === null || discountedFee === null) {
        throw new Error('Mint fee not yet loaded')
      }

      setIsLoading(true)
      try {
        let mintFeeToUse = mintFee
        if (
          referralAddress !== '0x0000000000000000000000000000000000000000' &&
          referralAddress !== address
        ) {
          mintFeeToUse = discountedFee.fee
        } else {
          referralAddress = '0x0000000000000000000000000000000000000000'
        }

        const { request } = await publicClient.simulateContract({
          address: currentMarket.addresses.ZkImagine,
          abi: ZkImagineABI,
          functionName: 'mint',
          args: [address, referralAddress as Address, modelId, imageId],
          account: address,
          value: mintFeeToUse,
        })

        const hash = await walletClient.writeContract(request)
        await publicClient.waitForTransactionReceipt({ hash })

        return hash
      } finally {
        setIsLoading(false)
      }
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

  //@dev: call to zkImagine contract to partnerFreeMint with zyfi paymaster sponsored featue, no gas cost from user.
  const partnerFreeMint = useCallback(
    async (
      modelId: string,
      imageId: string,
      nftAddress: Address,
      tokenId: bigint,
    ) => {
      if (!currentMarket || !walletClient || !publicClient || !address) {
        throw new Error(
          'Wallet not connected, unsupported chain, or no available partner NFT',
        )
      }

      setIsLoading(true)
      try {
        const { request } = await publicClient.simulateContract({
          address: currentMarket.addresses.ZkImagine,
          abi: ZkImagineABI,
          functionName: 'partnerFreeMint',
          args: [address, nftAddress as Address, tokenId, modelId, imageId],
          account: address,
        })

        // paymasterResponse is used for partnerFreeMint with zyfi paymaster.
        const paymasterResponse = await getSponsoredPaymasterParams({
          from: address,
          to: request.address,
          data: encodeFunctionData({
            abi: request.abi as Abi,
            functionName: request.functionName as string,
            args: request.args,
          }),
        })

        const nonce = await publicClient.getTransactionCount({
          address: address,
        })

        const rawTx = paymasterResponse.txData

        // generate txPayload
        const txPayload = {
          account: address,
          to: rawTx.to,
          value: BigInt(rawTx.value!),
          chain: walletClient.chain,
          gas: BigInt(rawTx.gasLimit),
          gasPerPubdata: BigInt(rawTx.customData.gasPerPubdata),
          maxFeePerGas: BigInt(rawTx.maxFeePerGas),
          maxPriorityFeePerGas: BigInt(0),
          data: rawTx.data,
          paymaster: rawTx.customData.paymasterParams.paymaster,
          paymasterInput: rawTx.customData.paymasterParams.paymasterInput,
          nonce,
        }

        const hash = await sendAndWaitForTransaction(
          walletClient,
          publicClient,
          txPayload,
        )
        await publicClient.waitForTransactionReceipt({ hash })

        return hash
      } finally {
        setIsLoading(false)
      }
    },
    [
      address,
      currentMarket,
      walletClient,
      publicClient,
      getSponsoredPaymasterParams,
    ],
  )

  //@dev call to zkImagine contract to signatureFreeMint with zyfi paymaster sponsored featue, no gas cost from user.
  const signatureFreeMint = useCallback(
    async (modelId: string, imageId: string) => {
      if (!currentMarket || !walletClient || !publicClient || !address) {
        throw new Error('Wallet not connected or unsupported chain')
      }

      if (!canSignatureFreeMint) {
        throw new Error('User is not eligible for signature free mint')
      }

      setIsLoading(true)
      try {
        const { request } = await publicClient.simulateContract({
          address: currentMarket.addresses.ZkImagine,
          abi: ZkImagineABI,
          functionName: 'signatureFreeMint',
          args: [
            address,
            keccak256(address as `0x${string}`),
            signatureData!.signature as `0x${string}`,
            modelId,
            imageId,
          ],
          account: address,
        })

        // getSponsoredPaymasterParams is used for signatureFreeMint with zyfi paymaster.
        const paymasterResponse = await getSponsoredPaymasterParams({
          from: address,
          to: request.address,
          data: encodeFunctionData({
            abi: request.abi as Abi,
            functionName: request.functionName as string,
            args: request.args,
          }),
        })

        const nonce = await publicClient.getTransactionCount({
          address: address,
        })

        const rawTx = paymasterResponse.txData

        // generate txPayload
        const txPayload = {
          account: address,
          to: rawTx.to,
          value: BigInt(rawTx.value!),
          chain: walletClient.chain,
          gas: BigInt(rawTx.gasLimit),
          gasPerPubdata: BigInt(rawTx.customData.gasPerPubdata),
          maxFeePerGas: BigInt(rawTx.maxFeePerGas),
          maxPriorityFeePerGas: BigInt(0),
          data: rawTx.data,
          paymaster: rawTx.customData.paymasterParams.paymaster,
          paymasterInput: rawTx.customData.paymasterParams.paymasterInput,
          nonce,
        }

        const hash = await sendAndWaitForTransaction(
          walletClient,
          publicClient,
          txPayload,
        )
        await publicClient.waitForTransactionReceipt({ hash })

        return hash
      } finally {
        setIsLoading(false)
        refreshSignatureData()
      }
    },
    [
      address,
      currentMarket,
      walletClient,
      publicClient,
      canSignatureFreeMint,
      signatureData,
      getSponsoredPaymasterParams,
    ],
  )

  if (!chain || !address || !publicClient) {
    return {
      mint: async () => {
        throw new Error(
          'Wallet not connected, no address, or unsupported chain',
        )
      },
      partnerFreeMint: async () => {
        throw new Error(
          'Wallet not connected, no address, or unsupported chain',
        )
      },
      signatureFreeMint: async () => {
        throw new Error(
          'Wallet not connected, no address, or unsupported chain',
        )
      },
      mintFee: null,
      discountedFee: null,
      readMintFee: async () => {
        throw new Error('Public client not available')
      },
      readDiscountedMintFee: async () => {
        throw new Error('Public client not available')
      },
      isLoading: false,
      canSignatureFreeMint: () => false,
    }
  }

  return {
    mint,
    partnerFreeMint,
    signatureFreeMint,
    mintFee,
    discountedFee,
    readMintFee,
    readDiscountedMintFee,
    isLoading,
    canSignatureFreeMint,
    globalTimeThreshold,
    readGlobalTimeThreshold,
  }
}

const sendAndWaitForTransaction = async (
  walletClient: WalletClient,
  publicClient: PublicClient,
  txPayload: any,
) => {
  const eip712WalletClient = walletClient.extend(eip712WalletActions())

  const eip712Request =
    await eip712WalletClient.prepareTransactionRequest(txPayload)
  const serializedTransaction = await eip712WalletClient.signTransaction(
    eip712Request as any,
  )

  const hash = await publicClient.sendRawTransaction({
    serializedTransaction,
  })

  return hash
}
