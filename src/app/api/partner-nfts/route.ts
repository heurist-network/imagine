// src/app/api/partner-nfts/route.ts
import { NextResponse } from 'next/server'

const AVAILABLE_FREE_MINT_API =
  'https://mrlkq2kv5f.execute-api.us-east-1.amazonaws.com/test/available-free-mint'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const minterAddress = searchParams.get('minterAddress')

  if (!minterAddress) {
    return NextResponse.json(
      { error: 'minterAddress is required' },
      { status: 400 },
    )
  }

  const headersList = {
    Accept: '*/*',
    'User-Agent': 'ZKImagine-App',
    'Content-Type': 'application/json',
  }

  try {
    const apiRes = await fetch(
      `${AVAILABLE_FREE_MINT_API}?minterAddress=${minterAddress}`,
      {
        method: 'GET',
        headers: headersList,
      },
    )

    const data = await apiRes.text()

    if (!apiRes.ok) {
      console.error('API Error:', data)

      return NextResponse.json(
        { error: 'Failed to fetch partner NFTs', details: data },
        { status: apiRes.status },
      )
    }

    return new NextResponse(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching partner NFTs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partner NFTs' },
      { status: 500 },
    )
  }
}
