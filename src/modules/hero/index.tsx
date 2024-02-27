'use client'

import { motion, Variants } from 'framer-motion'
import Link from 'next/link'

import { Separator } from '@/components/ui/separator'

const VARIANTS: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
}

export function Hero() {
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
          <div className="text-muted-foreground">
            🎁 Imaginaries NFT Airdrop is here!
          </div>
          <Link
            href="/nft"
            className="group flex h-8 cursor-pointer select-none items-center gap-3 rounded-full border px-3 text-sm transition-colors hover:bg-[hsla(0,0%,95%,1)]"
          >
            <span>Get the gift</span>
            <span className="i-mingcute-right-fill text-muted-foreground group-hover:animate-bounce-horizontal" />
          </Link>
        </motion.div>
        <Link href="/nft">
          <motion.div
            variants={VARIANTS}
            className="group mt-8 flex h-8 cursor-pointer select-none items-center justify-center gap-1.5 rounded-full border px-1.5 transition-colors hover:bg-[hsla(0,0%,95%,1)] md:hidden"
          >
            <div className="flex h-6 items-center justify-center rounded-full bg-[#d4f7f0] px-2.5 text-xs text-[#067a6e]">
              New
            </div>
            <div className="text-sm text-muted-foreground">
              🎁 Imaginaries NFT Airdrop is here!
            </div>
            <span className="i-mingcute-right-fill text-muted-foreground group-hover:animate-bounce-horizontal" />
          </motion.div>
        </Link>
      </section>
    </motion.div>
  )
}
