'use client'

import { useLayoutEffect, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, Variants } from 'framer-motion'
import { useDebounceCallback } from 'usehooks-ts'

// import { Arrow } from '@/components/icon'
// import { Logo } from '@/components/logo'
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
    <header className="z-50 h-20 w-full transition-all">
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
        <div className="w-[116px] cursor-pointer text-white">
          {/* <Logo /> */}
        </div>
        <div className="flex flex-1 justify-center -tracking-[0.0016em] text-white">
          <div className="cursor-pointer px-4 py-2 transition-colors hover:text-[#CDF138]">
            Ecosystem
          </div>
          <div className="cursor-pointer px-4 py-2 transition-colors hover:text-[#CDF138]">
            Developer
          </div>
          <div className="cursor-pointer px-4 py-2 transition-colors hover:text-[#CDF138]">
            Mining
          </div>
        </div>
        <div className="flex h-10 w-[116px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#CDF138] font-semibold text-black">
          <div className="-tracking-[0.0016em]">Portal</div>
          {/* <Arrow className="h-5 w-5 -rotate-45" strokeWidth={4} /> */}
        </div>
      </motion.div>
    </header>
  )
}
