import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const API_ENDPOINT =
    'https://uhqro81r0k.execute-api.us-east-1.amazonaws.com/dev/imageGen'

  const X_API_KEY = 'rUvdjh39jx7xLhXRdUCxV4jy3XNctgvTos6xSpl4'

  try {
    const body = await request.json()

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
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy API error:', error)
    return NextResponse.json(
      // @ts-ignore
      { error: 'Failed to call the API', details: error.message },
      { status: 500 },
    )
  }
}
