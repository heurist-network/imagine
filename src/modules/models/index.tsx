'use server'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  ImageWrapper,
  ModelsTitle,
  ModelsWrapper,
} from '@/components/motion/modelsWrapper'

export async function Models() {
  try {
    const res: any[] = await fetch(
      'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models-new.json',
      {
        next: { revalidate: 3600 },
      },
    ).then((res) => res.json())

    const lists = res.filter(
      (item) =>
        item.type === 'sd15' ||
        item.type === 'sdxl10' ||
        item.type.includes('composite') ||
        item.type.includes('flux'),
    )

    if (!lists.length) return null

    return (
      <div className="pb-20">
        <ModelsTitle>Deployed Models</ModelsTitle>
        <ModelsWrapper>
          {lists.map((item, index) => (
            <Link
              className="flex"
              key={item.name}
              href={`/models/${item.name}`}
            >
              <ImageWrapper name={item.name} index={index}>
                <Image
                  unoptimized
                  className="h-full w-full transition-transform hover:scale-105"
                  width={280}
                  height={400}
                  priority
                  src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.name}.jpg`}
                  alt="models image"
                />
              </ImageWrapper>
            </Link>
          ))}
        </ModelsWrapper>
      </div>
    )
  } catch (error) {
    return notFound()
  }
}
