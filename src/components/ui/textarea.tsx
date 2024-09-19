import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    React.useEffect(() => {
      onResize()
    }, [props.value])

    const onResize = () => {
      if (!textareaRef.current) return
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
      textareaRef.current.style.overflow =
        textareaRef.current.getBoundingClientRect().height ===
        textareaRef.current.scrollHeight
          ? 'hidden'
          : 'auto'
    }

    return (
      <textarea
        className={cn(
          'flex max-h-56 min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={textareaRef}
        onInput={() => {
          onResize()
        }}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
