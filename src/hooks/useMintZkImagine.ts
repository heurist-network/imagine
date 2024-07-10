import { Address, parseEther } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'

import ZkImagineABI from '../abis/ZkImagine.json'
import { MarketConfig } from '../constants/MarketConfig'

export const useMintZkImagine = () => {
  const { address, chain } = useAccount()
  const { writeContract, data, error, isPending } = useWriteContract()
  const mintFee = '0'

  const referralAddress =
    '0x0000000000000000000000000000000000000000' as Address // zero address

  const market = Object.values(MarketConfig).find(
    (config) => config.chain.id === chain?.id,
  )

  const contractAddress = market?.addresses.ZkImagine

  if (!contractAddress) {
    console.error('Contract address not found')
  }

  const mint = async (modelId: string, imageId: string) => {
    if (!address || !contractAddress) {
      throw new Error('Address or contract not available')
    }

    console.log(contractAddress, 'contractAddress')
    console.log(address, 'address')
    console.log(referralAddress, 'referralAddress')
    console.log(modelId, 'modelId')
    console.log(imageId, 'imageId')

    try {
      const tx = writeContract({
        address: contractAddress,
        abi: ZkImagineABI,
        functionName: 'mint',
        args: [address, referralAddress, modelId, imageId],
        value: parseEther(mintFee), // Assuming a 0.01 ETH mint fee, adjust as needed
      })

      return tx
    } catch (err) {
      console.error('Error minting:', err)
      throw err
    }
  }

  return {
    mint,
    data,
    error,
    isPending,
  }
}
