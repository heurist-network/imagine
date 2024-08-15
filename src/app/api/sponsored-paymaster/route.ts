import { NextRequest, NextResponse } from 'next/server'

import { env } from '@/env.mjs'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { txRequest } = body

  if (!txRequest) {
    return NextResponse.json(
      { error: 'Missing txRequest in body' },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(
      'https://api.zyfi.org/api/erc20_sponsored_paymaster/v1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': env.ZYFI_API_KEY,
        },
        body: JSON.stringify({
          chain: 324, // zkSync Era Mainnet
          // feeTokenAddress: '0x000000000000000000000000000000000000800A', // ETH on zkSync
          sponsorshipRatio: 100, // 100% sponsored for partner free mint
          txData: {
            from: txRequest.from,
            to: txRequest.to,
            data: txRequest.data,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Zyfi API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error during Zyfi API call:', error)
    return NextResponse.json(
      { error: 'Failed to get sponsored paymaster params' },
      { status: 500 },
    )
  }
}
