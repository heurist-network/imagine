import React, { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '100px',
      background = 'rgba(0, 0, 0, 1)',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            // '--bg': background,
          } as CSSProperties
        }
        className={cn(
          '[--bg:rgba(0,0,0,1)] hover:[--bg:#CDF138]',
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 text-white dark:text-black',
          '[background:var(--bg)] [border-radius:var(--radius)]',
          'transform-gpu transition-all active:translate-y-[1px]',
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}

        {/* Highlight */}
        <div
          className={cn(
            'insert-0 absolute h-full w-full',
            // px-4 py-1.5
            'rounded-2xl text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]',

            // transition
            'transform-gpu transition-all',

            // on hover
            'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',

            // on click
            'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]',
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            'absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]',
          )}
        />
      </button>
    )
  },
)

ShimmerButton.displayName = 'ShimmerButton'

export default ShimmerButton
