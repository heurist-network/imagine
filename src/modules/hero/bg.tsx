export function Bg() {
  const backgroundColor = '#1d1d1b',
    gridSize = 55,
    gridColor = '#32322F'

  return (
    <svg
      className="absolute left-0 top-0 h-full w-full"
      viewBox="0 0 1440 560"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="100%" height="100%" fill={backgroundColor} />
      {/* Vertical lines */}
      {Array.from({ length: Math.ceil(1440 / gridSize) + 1 }).map(
        (_, index) => (
          <line
            key={`v-${index}`}
            x1={`${index * gridSize}`}
            y1="0"
            x2={`${index * gridSize}`}
            y2="100%"
            stroke={gridColor}
            strokeWidth="1"
          />
        ),
      )}
      {/* Horizontal lines */}
      {Array.from({ length: Math.ceil(560 / gridSize) + 1 }).map((_, index) => (
        <line
          key={`h-${index}`}
          x1="0"
          y1={`${index * gridSize}`}
          x2="100%"
          y2={`${index * gridSize}`}
          stroke={gridColor}
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}
