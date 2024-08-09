import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { zkSync } from 'viem/chains'

import { MarketConfig } from '@/constants/MarketConfig'

interface ResponseData {
  error: {
    code: number
    message: string
  } | null
  data: {
    result: boolean
  }
}

const ZkImagineAddress = MarketConfig['zkSync'].addresses.ZkImagine

// Create a Viem public client
const client = createPublicClient({
  chain: zkSync,
  transport: http(),
})

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ResponseData>> {
  const address = req.nextUrl.searchParams.get('address')

  if (!address || typeof address !== 'string' || !address.startsWith('0x')) {
    return NextResponse.json({
      error: { code: 400, message: 'Invalid address' },
      data: { result: false },
    })
  }

  try {
    let isValid = false

    const balance = await client.readContract({
      address: ZkImagineAddress,
      abi: [
        {
          inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    })
    isValid = BigInt(balance) > BigInt(0)

    console.log('address:', address)
    console.log('balance:', balance)

    return NextResponse.json({
      error: isValid ? null : { code: 400, message: 'Insufficient balance' },
      data: { result: isValid },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      error: { code: 500, message: 'Internal Server Error' },
      data: { result: false },
    })
  }
}
