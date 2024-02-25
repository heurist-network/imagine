import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  metaMaskWallet,
  rabbyWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, http, createConfig } from 'wagmi' 
import { mainnet, sepolia } from 'wagmi/chains' 
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

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
  { appName: 'Imagine', projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID },
);

const config = createConfig({
  connectors,
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

// const config = getDefaultConfig({
//   appName: 'Imagine',
//   projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
//   chains: [mainnet],
//   transports: {
//     [mainnet.id]: http(),
//   },
//   // chains: [sepolia],
//   // transports: {
//   //   [sepolia.id]: http("https://sepolia.gateway.tenderly.co"),
//   // },
// })

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)

export default MyApp
