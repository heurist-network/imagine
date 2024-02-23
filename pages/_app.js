import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi' 
import { mainnet, sepolia } from 'wagmi/chains' 
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'Imagine',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  // TODO: Add mainnet back in
  // chains: [mainnet],
  // transports: {
  //   [mainnet.id]: http(),
  // },
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
})

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
