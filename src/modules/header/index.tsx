'use client'

import { useLayoutEffect, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, Variants } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useDebounceCallback } from 'usehooks-ts'

import { Logo } from '@/components/Logo'
import AnimatedGradientText from '@/components/magicui/animated-gradient-text'
import SwapText from '@/components/magicui/swap-text'
import { ConnectButton } from '@/components/ui/connect-button'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { scrollY } = useScroll()
  const [isScrollTop, setIsScrollTop] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [maxWidth, setMaxWidth] = useState<string | undefined>()
  const isHomePage = pathname === '/'

  const referralCode = searchParams.get('ref')

  const campaignLink = referralCode
    ? `/campaign?ref=${referralCode}`
    : '/campaign'

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
      backgroundColor: '#40404000',
      top: 0,
      maxWidth,
    },
    stateB: {
      backgroundColor: '#40404099',
      top: 24,
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
      <header className="z-[100] h-20 w-full transition-all">
        <motion.div
          initial="stateA"
          animate={isScrollTop ? 'stateB' : 'stateA'}
          className={cn(
            'sticky top-0 z-10 flex h-20 items-center justify-between',
            'mx-auto max-w-5xl px-6 md:max-w-[1440px]',
            {
              'fixed left-6 right-6 h-16 rounded-full border-[0.5px] border-neutral-600 px-6 shadow-md backdrop-blur-md':
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
          <Link
            href="/"
            className={cn(
              'w-[250px]',
              isHomePage || isScrollTop ? 'text-white' : 'text-[#0c0c0c]',
            )}
          >
            <Logo />
          </Link>
          {pathname !== '/campaign' && (
            <div className="hidden flex-1 justify-center lg:flex">
              <Link href={campaignLink}>
                <SwapText
                  initialText="Campaign"
                  finalText="Campaign"
                  supportsHover
                  textClassName={cn(
                    '-tracking-[0.0016em] transition-colors hover:text-[#CDF138] duration-100 text-[16px] leading-[1.5]',
                    isHomePage || isScrollTop ? 'text-white' : 'text-[#0c0c0c]',
                  )}
                />
              </Link>
            </div>
          )}

          <div className="hidden w-[250px] justify-end lg:flex">
            <ConnectButton />
          </div>
          <div className="block lg:hidden">
            <div
              className={cn(
                'flex h-10 w-10 cursor-pointer items-center justify-center',
                isHomePage || isScrollTop ? 'text-white' : 'text-[#0c0c0c]',
              )}
              onClick={() => setIsExpanded(!isExpanded)}
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
          'fixed left-0 top-0 h-[calc(100dvh+24px)] max-h-0 w-full transform-cpu overflow-y-hidden bg-white/80 px-6 text-black opacity-0 backdrop-blur-lg transition-all lg:hidden',
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
          className="flex h-12 items-center gap-2 border-y border-y-[rgba(0,0,0,0.1)]"
          href={campaignLink}
          onClick={() => setIsExpanded(false)}
        >
          <span>Campaign</span>
          <div className="flex">
            <AnimatedGradientText className="px-2 py-1 text-[10px] leading-[12px]">
              <span
                className={cn(
                  `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                )}
              >
                NEW
              </span>
            </AnimatedGradientText>
          </div>
        </Link>
        <div className="mt-4 text-sm">
          <ConnectButton />
        </div>
      </div>
    </>
  )
}
