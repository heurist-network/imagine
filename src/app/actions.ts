'use server'

import Heurist, { ImageModel } from 'heurist'
import { z } from 'zod'

import { env } from '@/env.mjs'

const heurist = new Heurist({
  apiKey: env.AUTH_KEY,
})

const formSchema = z.object({
  prompt: z.string().optional(),
  neg_prompt: z.string().optional(),
  num_iterations: z.string(),
  guidance_scale: z.string(),
  width: z.string(),
  height: z.string(),
  seed: z.string().optional(),
  model: z.string().optional(),
})

export async function generateImage(_: any, formData: FormData) {
  try {
    const data = formSchema.parse({
      prompt: formData.get('prompt'),
      neg_prompt: formData.get('neg_prompt'),
      num_iterations: formData.get('num_iterations'),
      guidance_scale: formData.get('guidance_scale'),
      width: formData.get('width'),
      height: formData.get('height'),
      seed: formData.get('seed'),
      model: formData.get('model'),
    })

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

    const response = await heurist.images.generate(params)

    return {
      status: 200,
      data: response,
    }
  } catch (error: any) {
    console.log(error.message, 'generateImage error')
    return { status: 500, message: error.message }
  }
}
