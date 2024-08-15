import { NextRequest, NextResponse } from 'next/server'

import { env } from '@/env.mjs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const contractAddresses = searchParams.getAll('contractAddresses[]')

  if (!address || contractAddresses.length === 0) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 },
    )
  }

  const contractAddressesParam = contractAddresses
    .map((addr) => `contractAddresses[]=${addr}`)
    .join('&')
  const url = `https://zksync-mainnet.g.alchemy.com/nft/v3/${env.ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}&${contractAddressesParam}&withMetadata=false`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`Alchemy API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching NFTs:', error)
    return NextResponse.json({ error: 'Failed to fetch NFTs' }, { status: 500 })
  }
}
