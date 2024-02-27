'use client'

import { motion, Variants } from 'framer-motion'

const ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0.001 },
  show: { opacity: 1, transition: { duration: 0.6 } },
}

export function OpacityWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={ANIMATION_VARIANTS}
    >
      {children}
    </motion.div>
  )
}
