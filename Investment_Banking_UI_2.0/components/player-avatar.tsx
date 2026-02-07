"use client"

export function PlayerAvatar() {
  return (
    <div className="relative animate-avatar-bounce" aria-label="Player avatar">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 ring-2 ring-primary/50">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-primary-foreground"
          aria-hidden="true"
        >
          {/* Dollar sign icon */}
          <text
            x="7"
            y="11"
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill="currentColor"
          >
            {"$"}
          </text>
        </svg>
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/40" />
    </div>
  )
}
