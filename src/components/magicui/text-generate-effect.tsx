'use client'

import { useEffect } from 'react'
import { motion, stagger, useAnimate } from 'framer-motion'

import { cn } from '@/lib/utils'

export const TextGenerateEffect = ({
  words1,
  words1ClassName,
  words2,
  words2ClassName,
  words3,
  words3ClassName,
  words4,
  words4ClassName,
  className,
  filter = true,
  duration = 0.5,
}: {
  words1?: string
  words1ClassName?: string
  words2?: string
  words2ClassName?: string
  words3?: string
  words3ClassName?: string
  words4?: string
  words4ClassName?: string
  className?: string
  filter?: boolean
  duration?: number
}) => {
  const [scope, animate] = useAnimate()
  let words1Array = words1?.split(' ') || []
  let words2Array = words2?.split(' ') || []
  let words3Array = words3?.split(' ') || []
  let words4Array = words4?.split(' ') || []
  useEffect(() => {
    animate(
      'span',
      {
        opacity: 1,
        filter: filter ? 'blur(0px)' : 'none',
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.15),
      },
    )
  }, [scope.current])

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        <div>
          {words1Array.map((word, idx) => {
            return (
              <motion.span
                key={word + idx}
                className={cn('opacity-0', words1ClassName)}
                style={{ filter: filter ? 'blur(10px)' : 'none' }}
              >
                {word}{' '}
              </motion.span>
            )
          })}
        </div>
        <div>
          {words2Array.map((word, idx) => {
            return (
              <motion.span
                key={word + idx}
                className={cn('opacity-0', words2ClassName)}
                style={{ filter: filter ? 'blur(10px)' : 'none' }}
              >
                {word}{' '}
              </motion.span>
            )
          })}
        </div>
        <div>
          {words3Array.map((word, idx) => {
            return (
              <motion.span
                key={word + idx}
                className={cn('opacity-0', words3ClassName)}
                style={{ filter: filter ? 'blur(10px)' : 'none' }}
              >
                {word}{' '}
              </motion.span>
            )
          })}
        </div>
        <div>
          {words4Array.map((word, idx) => {
            return (
              <motion.span
                key={word + idx}
                className={cn('opacity-0', words4ClassName)}
                style={{ filter: filter ? 'blur(10px)' : 'none' }}
              >
                {word}{' '}
              </motion.span>
            )
          })}
        </div>
      </motion.div>
    )
  }

  return <div className={className}>{renderWords()}</div>
}
