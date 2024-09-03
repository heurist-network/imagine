'use client'

import { Info, Loader2, MoreVertical } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import Image from 'next/image'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'
import { useAccount } from 'wagmi'
import { z } from 'zod'

import { generateImage, issueToGateway } from '@/app/actions'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { cn } from '@/lib/utils'
import { MintToNFT, useMintToNFT } from '@/modules/mintToNFT'
import { zodResolver } from '@hookform/resolvers/zod'
import { useConnectModal } from '@rainbow-me/rainbowkit'

interface GenerateProps {
  model: string
  models: any[]
  isXl?: boolean
}

interface TooltipProps {
  content: any
  children: any
}

const formSchema = z.object({
  prompt: z.string().optional(),
  neg_prompt: z.string().optional(),
  num_iterations: z.number(),
  guidance_scale: z.number(),
  width: z.number().min(512).max(2048),
  height: z.number().min(512).max(2048),
  seed: z.string().optional(),
  model: z.string().optional(),
})

function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="group relative">
      {children}
      <div className="invisible absolute left-full z-10 -mt-2 ml-2 w-48 rounded bg-gray-800 p-2 text-xs text-white group-hover:visible">
        {content}
      </div>
    </div>
  )
}

interface PixelatedImageProps {
  src: string;
  pixelSize?: number;
}

interface PixelatedImageProps {
  src: string;
  pixelSize?: number;
}

const PixelatedImage: React.FC<PixelatedImageProps> = ({ src, pixelSize = 16 }) => {
  const [pixelatedSrc, setPixelatedSrc] = useState<string>('');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = pixelSize;
    canvas.height = pixelSize;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        let drawWidth = pixelSize;
        let drawHeight = pixelSize;
        
        if (aspectRatio > 1) {
          drawHeight = pixelSize / aspectRatio;
        } else {
          drawWidth = pixelSize * aspectRatio;
        }
        
        // Draw small
        ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
        
        // Get the pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);
        
        // Create a new canvas for the final image
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = 512;
        finalCanvas.height = 512;
        const finalCtx = finalCanvas.getContext('2d');
        
        if (finalCtx) {
          // Disable image smoothing
          finalCtx.imageSmoothingEnabled = false;
          
          // Scale up the pixelated image
          finalCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 512, 512);
          
          setPixelatedSrc(finalCanvas.toDataURL());
        }
      };
      img.src = src;
    }
  }, [src, pixelSize]);

  return (
    <Image
      className="rounded-lg shadow-xl"
      unoptimized
      width={512}
      height={512}
      priority
      src={pixelatedSrc || src}
      alt="pixelated image result"
    />
  );
};

export default function Generate({ model, models, isXl }: GenerateProps) {
  const account = useAccount()
  const { openConnectModal } = useConnectModal()
  const [loadingGenerate, setLoadingGenerate] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [showRecommend, setShowRecommend] = useState(false)
  const [modelInfo, setModelInfo] = useState({ recommend: '' })
  const [history, setHistory] = useLocalStorage<any[]>('IMAGINE_HISTORY', [])
  const [result, setResult] = useState({
    url: '',
    width: 0,
    height: 0,
  })
  const [info, setInfo] = useState<any>(null)
  const [transactionId, setTransactionId] = useState('')
  const { loading: loadingMintNFT } = useMintToNFT()

  // Philand results need pixelation
  const [isPhiland, setIsPhiland] = useState(false)
  useEffect(() => {
    setIsPhiland(model === 'Philand')
    console.log('model name', model)
  }, [model])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      neg_prompt: '(worst quality: 1.4), bad quality, nsfw',
      num_iterations: 25,
      guidance_scale: 7,
      width: 512,
      height: 768,
      seed: '-1',
    },
  })

  useEffect(() => {
    form.setValue('width', isPhiland ? 1024 : isXl ? 680 : 512)
    form.setValue('height', isPhiland ? 1024 : isXl ? 1024 : 768)
  }, [isPhiland, isXl, form])

  const onSubmit = async () => {
    setResult({ url: '', width: 0, height: 0 })

    try {
      setIsGenerating(true)
      const params = { ...form.getValues(), model }

      const res = await generateImage(params)
      if (res.status !== 200) {
        return toast.error(
          res.message || 'Failed to generate image, please try again.',
        )
      }

      const data: any = res.data

      setResult({ url: data.url, width: data.width, height: data.height })

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
        num_inference_steps: data.num_iterations,
        guidance_scale: data.guidance_scale,
        create_at: new Date().toISOString(),
      }

      setInfo(item)

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
    } finally {
      setIsGenerating(false)
    }
  }

  const onUpload = async () => {
    if (!account.address) return openConnectModal?.()

    setTransactionId('')

    try {
      setLoadingUpload(true)
      const res = await issueToGateway({ ...info, model }, account.address)

      if (res.status !== 200) {
        return toast.error(
          res.message || 'Issue to Gateway failed, please try again.',
        )
      }

      setTransactionId(res.data?.transactionId!)

      toast.success('Issue to Gateway successfully.')
    } finally {
      setLoadingUpload(false)
    }
  }

  const getModelData = async () => {
    const res: any[] = await fetch(
      'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models-new.json',
      {
        next: { revalidate: 3600 },
      },
    ).then((res) => res.json())
    const nowModel = res.find((item) => item.name.includes(model))
    if (nowModel.type.includes('composite')) {
      form.setValue('prompt', nowModel.autofill)
      setModelInfo(nowModel)
      setShowRecommend(true)
    }
  }

  useEffect(() => {
    getModelData()
  }, [])

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
                  src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.label}.jpg`}
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
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Prompt
                  <Tooltip content="Enter a description or a list of key words of the image you want to generate">
                    <Info className="ml-2 h-4 w-4 cursor-help" />
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <>
                    <Input placeholder="Prompt" autoComplete="off" {...field} />
                    {showRecommend && (
                      <FormDescription>
                        Recommended key words: {modelInfo.recommend}
                      </FormDescription>
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
                <FormLabel className="flex items-center">
                  Negative Prompt
                  <Tooltip content="Enter elements you don't want in the generated image">
                    <Info className="ml-2 h-4 w-4 cursor-help" />
                  </Tooltip>
                </FormLabel>
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

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
              control={form.control}
              name="num_iterations"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="flex items-center">
                    Sampling Steps ({field.value})
                    <Tooltip content="Recommended: 20-30. Higher values may produce better quality but take longer.">
                      <Info className="ml-2 h-4 w-4 cursor-help" />
                    </Tooltip>
                  </FormLabel>
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
                  <FormLabel className="flex items-center">
                    Guidance Scale ({field.value})
                    <Tooltip content="Recommended: 4-10. Higher values adhere more strictly to the prompt.">
                      <Info className="ml-2 h-4 w-4 cursor-help" />
                    </Tooltip>
                  </FormLabel>
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
                      max={12}
                      step={0.1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
                      disabled={isPhiland}
                      {...field}
                      onBlur={(e) => {
                        if (Number(e.target.value) < 512) {
                          field.onChange(512)
                        }
                        if (Number(e.target.value) > 2048) {
                          field.onChange(2048)
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
                      disabled={isPhiland}
                      onBlur={(e) => {
                        if (Number(e.target.value) < 512) {
                          field.onChange(512)
                        }
                        if (Number(e.target.value) > 2048) {
                          field.onChange(2048)
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
                  <FormLabel className="flex items-center">
                    Seed
                    <Tooltip content="Use -1 for random results. Use non-negative number for deterministic results.">
                      <Info className="ml-2 h-4 w-4 cursor-help" />
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Seed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            {/* <PulsatingButton
              className={cn(
                'h-14 w-full text-2xl font-semibold',
                isGenerating ? 'bg-blue-500/50' : 'bg-blue-500',
                isGenerating ? 'cursor-not-allowed' : 'cursor-pointer',
              )}
              onClick={onSubmit}
              disabled={isGenerating}
              pulseColor={isGenerating ? 'transparent' : '#0096ff'}
            >
              <div className="flex flex-row items-center">
                {isGenerating && (
                  <Loader2 className="h-6 mr-2 animate-spin w-6" />
                )}
                {isGenerating ? 'Generating...' : 'Generate'}
              </div>
            </PulsatingButton> */}
            <motion.button
              className="h-14 w-full overflow-hidden rounded-lg text-2xl font-semibold text-white shadow-lg"
              style={{
                background: 'linear-gradient(45deg, #00ff9d, #ffff00, #00ff9d)',
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: isGenerating
                  ? ['0% 50%', '100% 50%', '0% 50%']
                  : ['0% 50%', '100% 50%'],
              }}
              transition={{
                duration: isGenerating ? 3 : 6,
                ease: 'linear',
                repeat: Infinity,
              }}
              onClick={onSubmit}
              disabled={isGenerating}
            >
              <motion.div
                animate={{ scale: isGenerating ? [1, 1.1, 1] : [1, 1.05, 1] }}
                transition={{
                  duration: isGenerating ? 0.5 : 2,
                  repeat: Infinity,
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </motion.div>
            </motion.button>

            {!!result.url && (
              <>
                <div className="flex flex-wrap justify-center gap-2">
                  <MintToNFT url={info.url} model={model}>
                    <Button
                      variant="outline"
                      disabled={loadingMintNFT}
                      className="bg-gradient-to-r from-[#9ffd8d] to-[#eaff61] hover:bg-gradient-to-l"
                    >
                      {loadingMintNFT && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      ✨ Mint zkImagine NFT
                    </Button>
                  </MintToNFT>
                  <Button
                    className={cn({ 'gap-2': !loadingUpload })}
                    variant="outline"
                    disabled={loadingUpload}
                    onClick={onUpload}
                  >
                    {loadingUpload ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Image
                        src="/gateway.svg"
                        alt="gateway"
                        width={26}
                        height={26}
                      />
                    )}
                    Upload to Gateway
                  </Button>
                  <Link href={result.url}>
                    <Button variant="outline">Download</Button>
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => {
                      const link = `https://d1dagtixswu0qn.cloudfront.net/${
                        result.url.split('/').slice(-1)[0].split('?')[0]
                      }`

                      const path = link.split('/')
                      const name = path[path.length - 1].split('.')[0]
                      const intentUrl =
                        'https://twitter.com/intent/tweet?text=' +
                        encodeURIComponent(
                          'My latest #AIart creation with Imagine #Heurist 🎨',
                        ) +
                        '&url=' +
                        encodeURIComponent(
                          `https://imagine.heurist.ai/share/${name}`,
                        )
                      window.open(intentUrl, '_blank', 'width=550,height=420')
                    }}
                  >
                    <span>Share on</span>
                    <span className="i-ri-twitter-x-fill h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
          {loadingUpload && (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading Upload to Gateway
            </div>
          )}
          {!!transactionId && (
            <div className="flex gap-2">
              <div className="flex-shrink-0 whitespace-nowrap">
                Transaction Details:{' '}
              </div>
              <Link
                className="line-clamp-3 text-muted-foreground transition-colors hover:text-primary"
                href={`https://mygateway.xyz/explorer/transactions/${transactionId}`}
                target="_blank"
              >
                {`https://mygateway.xyz/explorer/transactions/${transactionId}`}
              </Link>
            </div>
          )}
        </div>
      </Form>
      {result.url && (
        <motion.div
          className="mt-8 flex flex-col items-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isPhiland && (
            <div className="flex justify-center w-full">
              <PixelatedImage
                src={result.url}
              />
            </div>
          )}
          <div className="flex justify-center w-full">
            <Image
              className="rounded-lg shadow-xl"
              unoptimized
              width={result.width}
              height={result.height}
              priority
              src={result.url}
              alt="image result"
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
