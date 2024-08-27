'use client'

import { motion, Variants } from 'framer-motion'

import { cn } from '@/lib/utils'

interface BlurIntProps {
  children: React.ReactNode
  className?: string
  variant?: {
    hidden: { filter: string; opacity: number }
    visible: { filter: string; opacity: number }
  }
  duration?: number
}
const BlurIn = ({
  children,
  className,
  variant,
  duration = 1,
}: BlurIntProps) => {
  const defaultVariants: Variants = {
    hidden: {
      filter: 'blur(30px)',
      opacity: 0,
      transition: { delay: 0.6, duration: 0.8 },
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      transition: { delay: 0.6, duration: 0.8 },
    },
  }
  const combinedVariants = variant || defaultVariants

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration }}
      variants={combinedVariants}
      className={cn(className, 'drop-shadow-sm')}
    >
      {children}
    </motion.div>
  )
}

export default BlurIn
