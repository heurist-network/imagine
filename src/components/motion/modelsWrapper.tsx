"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface GetVariantsProps {
  duration?: number;
  delay?: number;
}

const getVariants = (params?: GetVariantsProps) => {
  const duration = params?.duration || 0.6;
  const delay = params?.delay || 0;

  const ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0.001, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration, delay } },
  };

  return ANIMATION_VARIANTS;
};

export function ImageWrapper({
  children,
  className,
  name,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  name: string;
  index: number;
}) {
  return (
    <motion.div
      variants={getVariants({ delay: 0.5 + index * 0.2 })}
      className={cn(
        "overflow-hidden rounded-lg cursor-pointer relative",
        className
      )}
    >
      {children}
      <div className="absolute bottom-0 left-0 right-0 bg-[rgba(0,0,0,.3)] text-white h-12 flex justify-center items-center backdrop-blur-sm font-semibold">
        {name}
      </div>
    </motion.div>
  );
}

export function ModelsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      viewport={{ once: true }}
      initial="hidden"
      whileInView="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {children}
    </motion.div>
  );
}

export function ModelsTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={getVariants({ delay: 0.3 })}
      className="scroll-m-20 pb-6 text-2xl font-semibold tracking-tight first:mt-0 text-center text-transparent bg-clip-text bg-sub-section-title"
    >
      {children}
    </motion.h2>
  );
}
