export function PlusIcon({
  className,
  strokeWidth = 2,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 0V16M16 8L0 8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}
