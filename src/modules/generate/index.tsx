'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { nanoid } from 'nanoid'
import Image from 'next/image'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'
import { z } from 'zod'

import { generateImage } from '@/app/actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { zodResolver } from '@hookform/resolvers/zod'

interface GenerateProps {
  model: string
  models: any[]
}

const formSchema = z.object({
  prompt: z.string().optional(),
  neg_prompt: z.string().optional(),
  num_iterations: z.number(),
  guidance_scale: z.number(),
  width: z.number().min(512).max(1024),
  height: z.number().min(512).max(1024),
  seed: z.string().optional(),
  model: z.string().optional(),
})

function Submit({ url, onReset }: { url: string; onReset: () => void }) {
  const status = useFormStatus()

  return (
    <div className="flex gap-2">
      <Button type="submit" disabled={status.pending} onClick={onReset}>
        {status.pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit
      </Button>
      {!!url && (
        <>
          <Link href={url}>
            <Button variant="outline">Download</Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              const link = `https://d1dagtixswu0qn.cloudfront.net/${
                url.split('/').slice(-1)[0].split('?')[0]
              }`

              const path = link.split('/')
              const name = path[path.length - 1].split('.')[0]
              const intentUrl =
                'https://twitter.com/intent/tweet?text=' +
                encodeURIComponent(
                  'My latest #AIart creation with Imagine #Heurist 🎨',
                ) +
                '&url=' +
                encodeURIComponent(`https://imagine.heurist.ai/share/${name}`)
              window.open(intentUrl, '_blank', 'width=550,height=420')
            }}
          >
            <span>Share on</span>
            <span className="i-ri-twitter-x-fill h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}

export default function Generate({ model, models }: GenerateProps) {
  const [state, formAction] = useFormState(generateImage, null)
  const [showRecommend, setShowRecommend] = useState(false)
  const [modelInfo, setModelInfo] = useState({ recommend: '' })
  const [history, setHistory] = useLocalStorage<any[]>('IMAGINE_HISTORY', [])
  const [result, setResult] = useState({
    url: '',
    width: 0,
    height: 0,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      neg_prompt: '',
      num_iterations: 30,
      guidance_scale: 10,
      width: 512,
      height: 768,
      seed: '-1',
    },
  })
  useEffect(() => {
    getModelData()
  }, [])

  useEffect(() => {
    if (!state) return

    if (state.status !== 200) {
      toast.error(
        state.message || 'Failed to generate image, please try again.',
      )
      return
    }

    const data: any = state.data

    setResult({
      url: data.url,
      width: data.width,
      height: data.height,
    })

    const findModel = history.find((item) => item.model === model)

    const url = `https://d1dagtixswu0qn.cloudfront.net/${
      data.url.split('/').slice(-1)[0].split('?')[0]
    }`

    const item = {
      id: nanoid(),
      url,
      prompt: data.prompt,
      neg_prompt: data.neg_prompt,
      seed: data.seed,
      width: data.width,
      height: data.height,
      num_inference_steps: data.num_inference_steps,
      guidance_scale: data.guidance_scale,
      create_at: new Date().toISOString(),
    }

    if (!findModel) {
      const obj = { model, lists: [item] }
      setHistory([...history, obj])
    } else {
      findModel.lists.push(item)
      setHistory(history)
    }

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth',
      })
    }, 100)
  }, [state])

  const getModelData = async () => {
    const res: any[] = await fetch(
      'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json',
      {
        next: { revalidate: 3600 },
      },
    ).then((res) => res.json())
    const nowModel = res.find((item) => item.name.includes(model))
    if (nowModel.type.includes('composite15')) {
      form.setValue('prompt', nowModel.autofill)
      setModelInfo(nowModel)
      setShowRecommend(true)
    }
  }
  return (
    <div>
      <div className="md:3/4 grid w-full grid-cols-3 gap-4 py-4 md:grid-cols-4 lg:w-4/5">
        {models.map((item) => (
          <AlertDialog key={item.label}>
            <AlertDialogTrigger asChild>
              <div className="relative cursor-pointer">
                <Image
                  className="rounded-lg transition-opacity duration-image hover:opacity-80"
                  unoptimized
                  width={512}
                  height={768}
                  priority
                  src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.label}.png`}
                  alt="model"
                />
                <span className="i-ri-information-line absolute bottom-1 right-1 h-5 w-5 text-gray-300 md:bottom-2 md:right-2 md:h-6 md:w-6" />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Prompt</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="whitespace-pre-wrap text-left">
                    {JSON.stringify(item.data, null, 2)}
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    form.setValue('prompt', item.data.prompt)
                    form.setValue('neg_prompt', item.data.neg_prompt)
                    form.setValue(
                      'num_iterations',
                      item.data.num_inference_steps,
                    )
                    form.setValue('guidance_scale', item.data.guidance_scale)
                    form.setValue('width', item.data.width)
                    form.setValue('height', item.data.height)
                    form.setValue('seed', item.data.seed)
                  }}
                >
                  Use this prompt
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>
      <Form {...form}>
        <form action={formAction} className="space-y-8">
          <input type="hidden" name="model" value={model} />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <>
                    <Input placeholder="Prompt" autoComplete="off" {...field} />
                    {showRecommend && (
                      <div> Recommended key words: {modelInfo.recommend}</div>
                    )}
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="neg_prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Negative Prompt</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Negative Prompt"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="num_iterations"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>Sampling Steps ({field.value})</FormLabel>
                <Input
                  className="hidden"
                  name="num_iterations"
                  value={field.value}
                  onChange={() => {}}
                />
                <FormControl>
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    min={1}
                    max={50}
                    step={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guidance_scale"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>Guidance Scale ({field.value})</FormLabel>
                <Input
                  className="hidden"
                  name="guidance_scale"
                  value={field.value}
                  onChange={() => {}}
                />
                <FormControl>
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    min={1}
                    max={20}
                    step={0.1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Width"
                    type="number"
                    {...field}
                    onBlur={(e) => {
                      if (Number(e.target.value) < 512) {
                        field.onChange(512)
                      }
                      if (Number(e.target.value) > 1024) {
                        field.onChange(1024)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Height"
                    type="number"
                    {...field}
                    onBlur={(e) => {
                      if (Number(e.target.value) < 512) {
                        field.onChange(512)
                      }
                      if (Number(e.target.value) > 1024) {
                        field.onChange(1024)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seed</FormLabel>
                <FormControl>
                  <Input placeholder="Seed" {...field} />
                </FormControl>
                <FormDescription>
                  Use -1 for random results. Use non-negative number for
                  deterministic results.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Submit
            url={result.url}
            onReset={() => {
              setResult({ url: '', width: 0, height: 0 })
            }}
          />
        </form>
      </Form>
      {result.url && (
        <div className="mt-8">
          <Image
            className="rounded-lg"
            unoptimized
            width={result.width}
            height={result.height}
            priority
            src={result.url}
            alt="image result"
          />
        </div>
      )}
    </div>
  )
}
