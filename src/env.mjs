import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  server: {
    AUTH_KEY: z.string().min(1),
    GATEWAY_API_KEY: z.string().min(1),
    GATEWAY_TOKEN: z.string().min(1),
    UMAMI_URL: z.string().optional(),
    UMAMI_WEBSITE_ID: z.string().optional(),
    ALCHEMY_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_NFT_CONTRACT_ADDRESS: z.string().min(1),
  },
  runtimeEnv: {
    AUTH_KEY: process.env.AUTH_KEY,
    GATEWAY_API_KEY: process.env.GATEWAY_API_KEY,
    GATEWAY_TOKEN: process.env.GATEWAY_TOKEN,
    UMAMI_URL: process.env.UMAMI_URL,
    UMAMI_WEBSITE_ID: process.env.UMAMI_WEBSITE_ID,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    NEXT_PUBLIC_NFT_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
  },
  emptyStringAsUndefined: true,
})
