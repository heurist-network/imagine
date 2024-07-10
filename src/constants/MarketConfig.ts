import { Address, Chain } from 'viem'
import { zkSync, zkSyncSepoliaTestnet } from 'viem/chains'

export type MarketDataType = {
  market: Market
  chain: Chain
  addresses: {
    ZkImagine: Address
  }
}

export enum Market {
  zkSyncSepoliaTestnet = 'zkSyncSepoliaTestnet',
  // zkSync = 'zkSync',
}

export const MarketConfig: {
  [key in keyof typeof Market]: MarketDataType
} = {
  zkSyncSepoliaTestnet: {
    market: Market.zkSyncSepoliaTestnet,
    chain: zkSyncSepoliaTestnet,
    addresses: {
      ZkImagine: '0x76Aab445e30F8e51Af2aeCd8620B1dd6bFAfC117',
    },
  },
}

// list all the chain in NetworkConfig
export const supportedChains: Chain[] = Object.values(MarketConfig).map(
  (market) => market.chain,
)
