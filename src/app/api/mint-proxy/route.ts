import { NextResponse } from 'next/server'

const API_ENDPOINT =
  'https://uhqro81r0k.execute-api.us-east-1.amazonaws.com/dev/imageGen'

const X_API_KEY = 'rUvdjh39jx7xLhXRdUCxV4jy3XNctgvTos6xSpl4'

export async function POST(request: Request) {
  console.log('Received request to /api/mint-proxy')

  try {
    const body = await request.json()

    // Input validation
    if (!body.imageId || !body.modelId || !body.url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    console.log('Request body:', JSON.stringify(body))

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        'x-api-key': X_API_KEY,
      },
      body: JSON.stringify(body),
    })

    console.log('API response status:', response.status)

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

    console.log('Successful response:', JSON.stringify(data))

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
