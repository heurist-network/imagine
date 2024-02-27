"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  metaMaskWallet,
  rabbyWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";
import { WagmiProvider, http, createConfig } from "wagmi";
import { env } from "@/env.mjs";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [
        metaMaskWallet,
        rabbyWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
  { appName: "Imagine", projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID }
);

const config = createConfig({
  connectors,
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({ accentColor: "hsl(240,5.9%,10%)" })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
