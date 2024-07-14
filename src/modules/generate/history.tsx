'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { formatDistance } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'

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
import { useMintZkImagine } from '@/hooks/useMintZkImagine'

import 'react-photo-view/dist/react-photo-view.css'

import { Button } from '@/components/ui/button'

export default function History({ model }: { model: string }) {
  const { mint } = useMintZkImagine()

  const [history] = useLocalStorage<any[]>('IMAGINE_HISTORY', [])
  const [loadingMintNFT, setLoadingMintNFT] = useState(false)

  const findModelHistory: any[] = (
    history.find((item) => item.model === model)?.lists ?? []
  )
    .sort((a: any, b: any) => +new Date(b.create_at) - +new Date(a.create_at))
    .slice(0, 50)

  const onMintToNFT = async (url: string) => {
    const arr = url.split('/').slice(-1)[0].split('-').slice(-3)
    const imageId = `${arr[0]}-${arr[1]}-${arr[2].split('.')[0]}`
    const defaultReferralAddress = '0xAEC3B3ec3aCd7BF66bC2a5d6A0D2619477BE8CcD'
    const mintFee = '0.00009'
    setLoadingMintNFT(true)
    try {
      const hash = await mint(mintFee, defaultReferralAddress, model, imageId)
      console.log('Transaction hash:', hash)
      toast.success('Imagine mint to NFT successfully.')
    } catch (error) {
      console.error('Failed to mint to NFT:', error)
      toast.error('Failed to mint to NFT, please try again.')
    } finally {
      setLoadingMintNFT(false)
    }
  }

  if (!findModelHistory.length) return <div className="py-4">No data</div>

  return (
    <PhotoProvider>
      <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
        {findModelHistory.map((item) => (
          <div
            key={item.id}
            className="group flex cursor-pointer flex-col justify-between rounded-lg border p-3 shadow md:p-4"
          >
            <div>
              <PhotoView src={item.url}>
                <Image
                  className="mb-4 aspect-[2/1] w-full rounded-lg object-cover object-center transition-opacity duration-image group-hover:opacity-80"
                  unoptimized
                  src={item.url}
                  alt="img"
                  width={item.width}
                  height={item.height}
                />
              </PhotoView>
              <div className="mb-1 md:text-lg">Prompt:</div>
              <div className="line-clamp-3 text-sm text-muted-foreground md:text-base">
                {item.prompt}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <Link href={item.url} download>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const path = item.url.split('/')
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
                    // "&via=" +
                    // encodeURIComponent("asf") +
                    // "&hashtags=" +
                    // encodeURIComponent("Heurist");
                    window.open(intentUrl, '_blank', 'width=550,height=420')
                  }}
                >
                  <span className="i-ri-twitter-x-fill" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <div>
                        <span>Mint</span>{' '}
                        <span className="hidden md:inline-block">to NTF</span>
                      </div>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to mint to NFT?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onMintToNFT(item.url)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="text-[13px] leading-[20px] text-[rgb(142,141,145)]">
                {formatDistance(new Date(item.create_at), new Date(), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PhotoProvider>
  )
}
