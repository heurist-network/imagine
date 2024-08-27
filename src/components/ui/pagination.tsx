import { MoreHorizontal } from 'lucide-react'
import * as React from 'react'
import { Inter } from 'next/font/google'
import Link from 'next/link'

import { ButtonProps, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export function Arrow({
  className,
  size = 24,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M14 2L2.1519 13.8481M14 2C12.6471 5.37441 12.4619 9.13105 13.4732 12.6832L13.8481 14M14 2C10.6256 3.35287 6.86895 3.53812 3.31679 2.5268L2 2.1519"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="bevel"
      />
    </svg>
  )
}

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-5', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      'h-16 w-16 rounded-full text-[18px] font-bold leading-[22px] text-black',
      { 'bg-black text-white hover:bg-black/80 hover:text-white': isActive },
      inter.className,
      className,
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('h-16 w-16 rounded-full border border-[#BCBCBC]', className)}
    {...props}
  >
    <Arrow className="-rotate-[135deg] text-black/40" />
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('h-16 w-16 rounded-full border border-[#BCBCBC]', className)}
    {...props}
  >
    <Arrow className="rotate-45 text-black/40" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
