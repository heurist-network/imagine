'use server'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ModelsTitle, ModelsWrapper } from '@/components/motion/modelsWrapper'
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover'

export async function Models() {
  try {
    const res: any[] = await fetch(
      'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json',
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
          {lists.map((item) => (
            <Link
              className="flex"
              key={item.name}
              href={`/models/${item.name}`}
            >
              <DirectionAwareHover
                content={
                  <Image
                    unoptimized
                    className="h-full w-full scale-[1.15] transition-transform"
                    width={280}
                    height={400}
                    priority
                    src={`https://raw.githubusercontent.com/heurist-network/heurist-models/main/examples/${item.name}.jpg`}
                    alt="models image"
                  />
                }
              >
                <p className="text-xl font-bold">{item.name}</p>
                <p className="text-sm font-normal">{item.author}</p>
              </DirectionAwareHover>
            </Link>
          ))}
        </ModelsWrapper>
      </div>
    )
  } catch (error) {
    return notFound()
  }
}
