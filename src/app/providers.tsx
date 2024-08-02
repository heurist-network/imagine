'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { zkSync, zkSyncSepoliaTestnet } from 'viem/chains'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { env } from '@/env.mjs'
import {
  connectorsForWallets,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Suggested',
      wallets: [
        metaMaskWallet,
        rabbyWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
  { appName: 'Imagine', projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID },
)

const config = createConfig({
  connectors,
  chains: [mainnet, zkSync],
  transports: {
    // http,
    [mainnet.id]: http(),
    [zkSync.id]: http(),
  },
})

const queryClient = new QueryClient()

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({ accentColor: 'hsl(240,5.9%,10%)' })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
