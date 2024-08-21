import { NextResponse } from 'next/server'
import { Hash } from 'viem'

type Payload = {
  imageId: string
  modelId: string
  url: string
  transactionHash: Hash
}

export async function POST(request: Request) {
  const API_ENDPOINT = 'https://uoub6ss185.execute-api.us-east-1.amazonaws.com/prod/notify-image-gen'

  try {
    const body: Payload = await request.json()

    // Input validation
    if (!body.imageId || !body.modelId || !body.url) {
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
