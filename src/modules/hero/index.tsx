'use client'

import { useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import AnimatedGradientText from '@/components/magicui/animated-gradient-text'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useMintToNFT } from '@/modules/mintToNFT'

const VARIANTS: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
}

export function Hero() {
  const searchParams = useSearchParams()
  const { setReferralAddress } = useMintToNFT()

  useEffect(() => {
    const search = searchParams.get('ref')

    if (search) {
      setReferralAddress(search)
    }
  }, [])

  return (
    <motion.div
      className="flex"
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.15 } },
      }}
    >
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-3 py-8 md:py-12 md:pb-8 lg:py-16 lg:pb-4">
        <motion.p className="mb-2 leading-7" variants={VARIANTS}>
          Welcome to <b>Imagine</b> powered by <b>Heurist</b>
        </motion.p>
        <motion.h1
          className="scroll-m-20 text-center text-4xl font-bold tracking-tight lg:text-5xl"
          variants={VARIANTS}
        >
          Best Stable Diffusion models on
        </motion.h1>
        <motion.h1
          className="scroll-m-20 bg-section-title bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent lg:text-5xl"
          variants={VARIANTS}
        >
          a decentralized network of GPUs
        </motion.h1>
        <motion.p
          className="mt-8 text-center text-lg text-muted-foreground"
          variants={VARIANTS}
        >
          <b>Call for model creators:</b> Want to get your models listed and
          earn HUE token rewards?
        </motion.p>
        <motion.div variants={VARIANTS} whileHover={{ scale: 1.03 }}>
          <Link
            href="mailto:team@heurist.xyz"
            className="flex items-center space-x-2.5 rounded-lg px-3 text-center text-sm"
          >
            <span className="i-ri-mail-send-line" />
            <Separator orientation="vertical" className="h-4" />
            <b>team@heurist.xyz</b>
          </Link>
        </motion.div>
        <motion.div
          variants={VARIANTS}
          className="mt-8 hidden items-center gap-4 md:flex"
        >
          <div className="flex h-6 items-center justify-center rounded-full bg-[#d4f7f0] px-2.5 text-xs text-[#067a6e]">
            New
          </div>
          <div className="mr-2 text-muted-foreground">
            🎁 Imaginaries NFT Airdrop is here!
          </div>
          <Link href="/nft">
            <AnimatedGradientText>
              ✨ <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{' '}
              <span
                className={cn(
                  `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                )}
              >
                Get the gift
              </span>
              <span className="i-mingcute-right-fill ml-1 text-muted-foreground group-hover:animate-bounce-horizontal" />
            </AnimatedGradientText>
          </Link>
        </motion.div>
        <Link className="flex md:hidden" href="/nft">
          <AnimatedGradientText>
            🎁 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{' '}
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
              )}
            >
              Imaginaries NFT Airdrop is here!
            </span>
            <span className="i-mingcute-right-fill ml-1 text-muted-foreground group-hover:animate-bounce-horizontal" />
          </AnimatedGradientText>
        </Link>
      </section>
    </motion.div>
  )
}
