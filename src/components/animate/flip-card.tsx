import Image from 'next/image'

import { cn } from '@/lib/utils'

interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string
  title: string
  description: string
  subtitle?: string
  rotate?: 'x' | 'y'
}

export function FlipCards({
  url,
  className,
  rotate = 'y',
  back,
  extra,
}: {
  url: string
  className?: string
  rotate?: 'x' | 'y'
  back?: React.ReactNode
  extra?: React.ReactNode
}) {
  const rotationClass = {
    x: [
      'group-hover:[transform:rotateX(180deg)]',
      '[transform:rotateX(180deg)]',
    ],
    y: [
      'group-hover:[transform:rotateY(180deg)]',
      '[transform:rotateY(180deg)]',
    ],
  }

  const self = rotationClass[rotate]

  return (
    <div
      className={cn('group aspect-[512/768] [perspective:1000px]', className)}
    >
      <div
        className={cn(
          'relative h-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d]',
          self[0],
        )}
      >
        <div className="absolute h-full w-full [backface-visibility:hidden]">
          <Image
            className="rounded-lg transition-opacity duration-image hover:opacity-80"
            unoptimized
            width={512}
            height={768}
            priority
            src={url}
            alt="model"
          />
        </div>

        <div
          className={cn(
            'h-full w-full overflow-y-auto rounded-2xl bg-black/80 p-4 text-slate-200 [backface-visibility:hidden]',
            self[1],
          )}
        >
          {back}
        </div>

        {extra}
      </div>
    </div>
  )
}

export default function FlipCard({
  image,
  title,
  description,
  subtitle,
  rotate = 'y',
  className,
  ...props
}: FlipCardProps) {
  const rotationClass = {
    x: [
      'group-hover:[transform:rotateX(180deg)]',
      '[transform:rotateX(180deg)]',
    ],
    y: [
      'group-hover:[transform:rotateY(180deg)]',
      '[transform:rotateY(180deg)]',
    ],
  }
  const self = rotationClass[rotate]

  return (
    <div className={cn('group [perspective:1000px]', className)} {...props}>
      <div
        className={cn(
          'relative h-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d]',
          self[0],
        )}
      >
        {/* Front */}
        <div className="absolute h-full w-full [backface-visibility:hidden]">
          <img
            src={image}
            alt="image"
            className="h-full w-full rounded-2xl object-cover shadow-2xl shadow-black/40"
          />
          <div className="absolute bottom-4 left-4 text-xl font-bold text-white">
            {title}
          </div>
        </div>

        {/* Back */}
        <div
          className={cn(
            'absolute h-full w-full rounded-2xl bg-black/80 p-4 text-slate-200 [backface-visibility:hidden]',
            self[1],
          )}
        >
          <div className="flex min-h-full flex-col gap-2">
            <h1 className="text-xl font-bold text-white">{subtitle}</h1>
            <p className="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">
              {description}{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
