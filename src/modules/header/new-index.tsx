'use client'

import { useLayoutEffect, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, Variants } from 'framer-motion'
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'

import { Logo } from '@/components/Logo'
import { ConnectButton } from '@/components/ui/connect-button'
import { cn } from '@/lib/utils'

export function NewHeader() {
  const { scrollY } = useScroll()
  const [isScrollTop, setIsScrollTop] = useState(false)
  const [maxWidth, setMaxWidth] = useState<string | undefined>()

  // 定义滚动阈值
  const threshold = 28

  const debounced = useDebounceCallback((latest) => {
    setIsScrollTop(latest > threshold)
  }, 200)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    debounced(latest)
  })

  const variants: Variants = {
    stateA: {
      backgroundColor: '#2d2d2d00',
      top: 0,
      maxWidth,
    },
    stateB: {
      backgroundColor: '#2d2d2d77',
      top: 20,
      maxWidth: '800px',
    },
  }

  const calcMaxWidth = () => {
    const clientWidth = window.innerWidth

    if (clientWidth >= 1536) {
      setMaxWidth('1536px')
    } else if (clientWidth >= 1280) {
      setMaxWidth('1280px')
    } else if (clientWidth >= 1024) {
      setMaxWidth('1024px')
    } else if (clientWidth >= 768) {
      setMaxWidth('768px')
    } else if (clientWidth >= 640) {
      setMaxWidth('640px')
    } else {
      setMaxWidth(undefined)
    }
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', calcMaxWidth)

    return () => {
      window.removeEventListener('resize', calcMaxWidth)
    }
  }, [])

  return (
    <header className="h-20 w-full transition-all z-50">
      <motion.div
        initial="stateA"
        animate={isScrollTop ? 'stateB' : 'stateA'}
        className={cn('container sticky top-0 flex h-20 items-center', {
          'fixed left-0 right-0 h-16 rounded-full border border-[#343434] px-6 backdrop-blur-md':
            isScrollTop,
        })}
        variants={variants}
        transition={{
          duration: 0.5, // 过渡持续时间
          ease: 'easeInOut', // 过渡缓动函数
          backgroundColor: { type: 'spring', stiffness: 400, damping: 30 }, // 为宽度设置弹簧动画
          top: { type: 'spring', stiffness: 400, damping: 30 }, // 为宽度设置弹簧动画
          maxWidth: { type: 'spring', stiffness: 400, damping: 30 }, // 为宽度设置弹簧动画
        }}
      >
        <Link href="/" className="text-white w-[116px]">
          <Logo />
        </Link>
        <div className="flex flex-1 text-white -tracking-[0.0016em] justify-center">
          <Link
            href="/campaign"
            className="py-2 px-4 transition-colors hover:text-[#CDF138]"
          >
            Campaign
          </Link>
        </div>
        <ConnectButton />
      </motion.div>
    </header>
  )
}
