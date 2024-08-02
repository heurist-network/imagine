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
  zkSync = 'zkSync',
}

export const MarketConfig: {
  [key in keyof typeof Market]: MarketDataType
} = {
  test_zkSync: {
    market: Market.test_zkSync,
    chain: zkSyncSepoliaTestnet,
    addresses: {
      ZkImagine: '0xBC25a6EF4884A9FF0A8D7F637eb3441d62002F0b',
    },
  },
  zkSync: {
    market: Market.zkSync,
    chain: zkSync,
    addresses: {
      ZkImagine: '0x5c63369e3F04018A0C32559661E025F051fB071E',
    },
  },
}

// list all the chain in NetworkConfig
export const supportedChains: Chain[] = Object.values(MarketConfig).map(
  (market) => market.chain,
)
