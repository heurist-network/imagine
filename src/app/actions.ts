'use server'

import Heurist, { ImageModel } from 'heurist'

import { env } from '@/env.mjs'
import { Gateway, UserIdentifierType } from '@gateway-dao/sdk'

const heurist = new Heurist({
  apiKey: env.AUTH_KEY,
})

const gateway = new Gateway({
  apiKey: env.GATEWAY_API_KEY,
  token: env.GATEWAY_TOKEN,
  url: 'https://protocol.mygateway.xyz/graphql',
})

export async function generateImage(data: any) {
  try {
    const model_input: any = {
      prompt: data.prompt || '',
    }

    if (data.neg_prompt) {
      model_input.neg_prompt = data.neg_prompt
    }

    if (data.num_iterations) {
      model_input.num_iterations = Number(data.num_iterations)
    }

    if (data.guidance_scale) {
      model_input.guidance_scale = Number(data.guidance_scale)
    }
    if (data.width) {
      model_input.width = Number(data.width)
    }
    if (data.height) {
      model_input.height = Number(data.height)
    }
    if (data.seed) {
      let seed = parseInt(data.seed)
      if (seed > Number.MAX_SAFE_INTEGER) {
        seed = seed % Number.MAX_SAFE_INTEGER
      }
      model_input.seed = seed
    }

    const params = {
      model: data.model as ImageModel,
      ...model_input,
    }

    console.log("generate params", params)
    const response = await heurist.images.generate(params)

    return { status: 200, data: response }
  } catch (error: any) {
    console.log(error.message, 'generateImage error')
    return { status: 500, message: error.message }
  }
}

export async function issueToGateway(data: any, address: string) {
  try {
    const res = await fetch('https://protocol.mygateway.xyz/graphql', {
      method: 'POST',
      headers: {
        'X-Api-Key': env.GATEWAY_API_KEY,
        Authorization: `Bearer ${env.GATEWAY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        mutation createPDA {
          createPDA(
            input: {
              dataModelId: "ed6f1213-fe9f-4d5f-b239-7105fe2ab590"
              description: "A data model for iamge generation from Heurist."
              title: "Heurist AI Data Model"
              claim: {
                model_id: "${data.model}"
                prompt: "${data.prompt}"
                negative_prompt: "${data.neg_prompt || ''}"
                num_steps: ${data.num_inference_steps}
                guidance_scale: ${data.guidance_scale}
                seed: ${data.seed}
                image_url: "${data.url}"
              }
              owner: { type: EVM, value: "${address}" }
            }
          ) {
            id
            dataAsset {
              owner {
                id
                gatewayId
              }
              issuer {
                id
                gatewayId
              }
            }
            transactionId
          }
        }
        `,
        variables: {},
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.log(error, 'error')
      })

    return { status: 200, data: res.data.createPDA }
  } catch (error: any) {
    console.log(error, 'issueToGateway error') // Can log it for debugging
    return { status: 500, message: error.message }
  }
}

export async function getPDAs(address: string) {
  try {
    const pdas = await gateway.pda.getPDAs({
      filter: { owner: { type: UserIdentifierType.EVM, value: address } },
    })
    return { status: 200, data: pdas }
  } catch (error: any) {
    console.log(error, 'getPDAs error') // Can log it for debugging
    return { status: 500, message: error.message }
  }
}
