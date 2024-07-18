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
  test_zkSync = 'test_zkSync',
  // zkSync = 'zkSync',
}

export const MarketConfig: {
  [key in keyof typeof Market]: MarketDataType
} = {
  test_zkSync: {
    market: Market.test_zkSync,
    chain: zkSyncSepoliaTestnet,
    addresses: {
      ZkImagine: '0xa031c0c14b7b45748880db8075b815943E7837De',
    },
  },
}

// list all the chain in NetworkConfig
export const supportedChains: Chain[] = Object.values(MarketConfig).map(
  (market) => market.chain,
)
