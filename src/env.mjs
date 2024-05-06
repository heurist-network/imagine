import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

// https://env.t3.gg/docs/nextjs

export const env = createEnv({
  server: {
    AUTH_KEY: z.string().min(1),
    GATEWAY_API_KEY: z.string().min(1),
    GATEWAY_TOKEN: z.string().min(1),
    UMAMI_URL: z.string().optional(),
    UMAMI_WEBSITE_ID: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_NFT_CONTRACT_ADDRESS: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_NFT_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  },
})
