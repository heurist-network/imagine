import { NextResponse } from 'next/server'
import { Hash } from 'viem'

type Payload = {
  imageId: string
  modelId: string
  url: string
  transactionHash: Hash
}

export async function POST(request: Request) {
  const API_ENDPOINT = 'https://imagine-seven.vercel.app/api/mint-proxy'
  const X_API_KEY = 'rUvdjh39jx7xLhXRdUCxV4jy3XNctgvTos6xSpl4'

  try {
    const body: Payload = await request.json()

    // Input validation
    if (!body.imageId || !body.modelId || !body.url || !body.transactionHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        'x-api-key': X_API_KEY,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('API Error:', response.status, errorBody)
      return NextResponse.json(
        {
          error: `API request failed with status ${response.status}`,
          details: errorBody,
        },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Proxy API error:', error)
      return NextResponse.json(
        { error: 'Failed to call the API', details: error.message },
        { status: 500 },
      )
    }
  }
}
