'use server'

import Randomstring from 'randomstring'
import { z } from 'zod'

import { env } from '@/env.mjs'

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

    const id = Randomstring.generate({
      charset: 'hex',
      length: 10,
    })

    const model_input: any = {
      prompt: data.prompt || '',
    }

    if (data.num_iterations) {
      model_input.num_iterations = Number(data.num_iterations)
    }
    if (data.neg_prompt) {
      model_input.neg_prompt = data.neg_prompt
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
      job_id: `imagine-${id}`,
      model_input: {
        SD: model_input,
      },
      model_type: 'SD',
      model_id: data.model,
      deadline: 30,
      priority: 1,
    }

    const path = `${env.NEXT_PUBLIC_BASE_URL}/submit_job`

    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.AUTH_KEY}`,
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const url = await response.text()
    const dataUrl = url.replaceAll('"', '')

    return {
      status: 200,
      data: {
        url: dataUrl,
        prompt: data.prompt,
        neg_prompt: data.neg_prompt,
        num_iterations: Number(data.num_iterations),
        guidance_scale: Number(data.guidance_scale),
        width: Number(data.width),
        height: Number(data.height),
        seed: data.seed,
      },
    }
  } catch (error: any) {
    console.log(error, 'generateImage error')
    return { status: 500, message: error.message }
  }
}
