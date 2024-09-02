'use client'

import { useLayoutEffect, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, Variants } from 'framer-motion'
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'

import { Logo } from '@/components/Logo'
import SwapText from '@/components/magicui/swap-text'
import { ConnectButton } from '@/components/ui/connect-button'
import { cn } from '@/lib/utils'

export function NewHeader() {
  const { scrollY } = useScroll()
  const [isScrollTop, setIsScrollTop] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
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

    if (clientWidth >= 768) {
      setMaxWidth('1440px')
    } else if (clientWidth >= 640) {
      setMaxWidth('1024px')
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
    <>
      <header className="z-50 h-20 w-full transition-all">
        <motion.div
          initial="stateA"
          animate={isScrollTop ? 'stateB' : 'stateA'}
          className={cn(
            'sticky top-0 z-10 flex h-20 items-center justify-between',
            'mx-auto max-w-5xl px-6 md:max-w-[1440px]',
            {
              'fixed left-6 right-6 h-16 rounded-full border border-[#343434] px-6 backdrop-blur-md':
                isScrollTop,
            },
          )}
          variants={variants}
          transition={{
            duration: 0.5, // 过渡持续时间
            ease: 'easeInOut', // 过渡缓动函数
            backgroundColor: { type: 'spring', stiffness: 400, damping: 30 }, // 为宽度设置弹簧动画
            top: { type: 'spring', stiffness: 400, damping: 30 }, // 为宽度设置弹簧动画
            maxWidth: { type: 'spring', stiffness: 400, damping: 30 }, // 为宽度设置弹簧动画
          }}
        >
          <Link href="/" className="w-[116px] text-white">
            <Logo />
          </Link>
          <div className="hidden flex-1 justify-center lg:flex">
            <Link href="/campaign">
              <SwapText
                initialText="Campaign"
                finalText="Campaign"
                supportsHover
                textClassName="text-white -tracking-[0.0016em] transition-colors hover:text-[#CDF138] duration-100 text-[16px] leading-[1.5]"
              />
            </Link>
          </div>
          <div className="hidden lg:block">
            <ConnectButton />
          </div>
          <div className="block lg:hidden">
            <div
              className="flex h-10 w-10 cursor-pointer items-center justify-center text-white"
              onClick={() => {
                setIsExpanded(!isExpanded)
              }}
            >
              {isExpanded ? (
                <span className="i-mingcute-close-line h-7 w-7" />
              ) : (
                <span className="i-mingcute-menu-line h-7 w-7" />
              )}
            </div>
          </div>
        </motion.div>
      </header>
      <div
        className={cn(
          'fixed left-0 top-0 h-[calc(100dvh+24px)] max-h-0 w-full overflow-y-hidden bg-white/80 px-6 text-black opacity-0 backdrop-blur-lg transition-all lg:hidden',
          {
            'z-[100] max-h-[calc(100dvh+24px)] opacity-100': isExpanded,
          },
        )}
      >
        <div className="flex h-20 items-center justify-end">
          <div
            className="flex h-10 w-10 cursor-pointer items-center justify-center text-black"
            onClick={() => setIsExpanded(false)}
          >
            <span className="i-mingcute-close-line h-7 w-7" />
          </div>
        </div>
        <Link
          className="flex h-12 items-center gap-4 border-b border-b-[rgba(0,0,0,0.1)]"
          href="/campaign"
          onClick={() => setIsExpanded(false)}
        >
          <span>Campaign</span>
        </Link>
        <div className="mt-4 text-sm">
          <ConnectButton />
        </div>
      </div>
    </>
  )
}
