import { ImgHTMLAttributes, useState } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

/**
 * All the props are passed to the img element.
 * Make sure to adjust the width and height of the container div
 * as per the design requirements/image aspect ratio.
 */
export default function DiscloseImage({
  style,
  className,
  imgClassName,
  doorClassName,
  vertical = false,
  src,
  width,
  height,
  // ...props
}: ImgHTMLAttributes<HTMLImageElement> & {
  /**
   * Class name for the window on the left and right side of the image.
   */
  doorClassName?: string

  imgClassName?: string

  /**
   * If true, the doors will slide vertically.
   */
  vertical?: boolean
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const baseClassName =
    'ease-slow duration-mid absolute bg-sky-500 transition-all animate-out fill-mode-forwards'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-[#CDF138]',
        className,
      )}
      style={style}
    >
      <Image
        alt="img"
        onLoad={() => setImageLoaded(true)}
        src={src || ''}
        unoptimized
        priority
        width={Number(width)}
        height={Number(height)}
        className={cn(
          'h-full w-full object-cover transition-opacity',
          imageLoaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />

      {imageLoaded && (
        <>
          <div
            className={cn(baseClassName, doorClassName, {
              'top-0 h-1/2 w-full slide-out-to-top-full': vertical,
              'bottom-0 left-0 top-0 w-1/2 slide-out-to-left-full': !vertical,
            })}
          />
          <div
            className={cn(baseClassName, doorClassName, {
              'bottom-0 h-1/2 w-full slide-out-to-bottom-full': vertical,
              'bottom-0 right-0 top-0 w-1/2 slide-out-to-right-full': !vertical,
            })}
          />
        </>
      )}
    </div>
  )
}
