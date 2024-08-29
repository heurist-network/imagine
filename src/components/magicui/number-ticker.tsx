'use client'

import { createDropdownMenuScope } from '@radix-ui/react-dropdown-menu'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'

import { cn } from '@/lib/utils'

function Number({
  value,
  index,
  total,
  delay,
  className,
  getHeight,
}: {
  value: string
  index: number
  getHeight: () => number
  className?: string
  total: number
  delay?: number
}) {
  const numberRef = useRef<HTMLDivElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 150 - index * 2,
    damping: 15,
  })

  const isRaw = String(+value) !== value

  useEffect(() => {
    if (isRaw || !numberRef.current) {
      return
    }

    const update = () => {
      const height = getHeight()
      springValue.set(-height * +value)
      // Add a delay to prevent the spring from firing too early.
    }

    if (!delay) {
      update()
      return
    }

    const timer = setTimeout(
      update,
      (total - index) * Math.floor(Math.random() * delay),
    )

    return () => clearTimeout(timer)
  }, [value, isRaw, springValue, getHeight, index, total, delay])

  if (isRaw) {
    return <span>{value}</span>
  }

  return (
    <motion.div
      ref={numberRef}
      style={{
        translateY: springValue,
      }}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div className={className} key={i}>
          {i}
        </motion.div>
      ))}
    </motion.div>
  )
}

export function NumberTicker({
  value,
  delay,
  className,
  numberClassName,
}: {
  value: string
  className?: string
  numberClassName?: string
  delay?: number
}) {
  const parts = String(value).trim().split('')
  const divRef = useRef<HTMLDivElement>(null)

  const [random, setRandom] = useState(0)

  const getHeight = useCallback(
    () => divRef.current?.getBoundingClientRect().height ?? 0,
    [random],
  )

  useResizeObserver({
    ref: divRef,
    onResize: () => {
      setRandom(Math.random())
    },
  })

  return (
    <div
      className={cn(
        'relative overflow-hidden whitespace-pre tabular-nums text-foreground',
        className,
      )}
    >
      <div className="absolute inset-0 flex min-w-fit">
        {parts.map((part, index) => (
          <Number
            getHeight={getHeight}
            index={index}
            key={index}
            value={part}
            total={parts.length}
            className={numberClassName}
            delay={delay}
          />
        ))}
      </div>
      <div ref={divRef} className="invisible min-w-fit">
        {value}
      </div>
    </div>
  )
}
