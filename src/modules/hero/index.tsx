"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const VARIANTS: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

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
        <motion.p className="leading-7 mb-2" variants={VARIANTS}>
          Welcome to <b>Imagine</b> powered by <b>Heurist</b>
        </motion.p>
        <motion.h1
          className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-center"
          variants={VARIANTS}
        >
          Best Stable Diffusion models on
        </motion.h1>
        <motion.h1
          className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-center text-transparent bg-clip-text bg-section-title"
          variants={VARIANTS}
        >
          a decentralized network of GPUs
        </motion.h1>
        <motion.p
          className="text-lg text-muted-foreground mt-8 text-center"
          variants={VARIANTS}
        >
          <b>Call for model creators:</b> Want to get your models listed and
          earn HUE token rewards?
        </motion.p>
        <motion.div variants={VARIANTS} whileHover={{ scale: 1.03 }}>
          <Link
            href="mailto:team@heurist.xyz"
            className="text-center px-3 rounded-lg flex items-center space-x-2.5 text-sm"
          >
            <span className="i-ri-mail-send-line" />
            <Separator orientation="vertical" className="h-4" />
            <b>team@heurist.xyz</b>
          </Link>
        </motion.div>
        <motion.div
          variants={VARIANTS}
          className="mt-8 gap-4 items-center hidden md:flex"
        >
          <div className="text-xs flex bg-[#d4f7f0] px-2.5 h-6 justify-center items-center rounded-full text-[#067a6e]">
            New
          </div>
          <div className="text-muted-foreground">
            🎁 Imaginaries NFT Airdrop is here!
          </div>
          <Link
            href="/nft"
            className="border px-3 text-sm h-8 flex gap-3 items-center rounded-full cursor-pointer select-none transition-colors hover:bg-[hsla(0,0%,95%,1)] group"
          >
            <span>Get the gift</span>
            <span className="text-muted-foreground i-mingcute-right-fill group-hover:animate-bounce-horizontal" />
          </Link>
        </motion.div>
        <Link href="/nft">
          <motion.div
            variants={VARIANTS}
            className="mt-8 md:hidden flex border rounded-full h-8 justify-center items-center px-1.5 gap-1.5 select-none cursor-pointer transition-colors hover:bg-[hsla(0,0%,95%,1)] group"
          >
            <div className="text-xs flex bg-[#d4f7f0] px-2.5 h-6 justify-center items-center rounded-full text-[#067a6e]">
              New
            </div>
            <div className="text-muted-foreground text-sm">
              🎁 Imaginaries NFT Airdrop is here!
            </div>
            <span className="i-mingcute-right-fill group-hover:animate-bounce-horizontal text-muted-foreground" />
          </motion.div>
        </Link>
      </section>
    </motion.div>
  );
}
