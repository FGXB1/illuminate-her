"use client"

import { TrendingUp } from "lucide-react"

interface DealProgressMeterProps {
  currentNode: number
  totalNodes: number
}

export function DealProgressMeter({ currentNode, totalNodes }: DealProgressMeterProps) {
  const progress = Math.round((currentNode / totalNodes) * 100)

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <TrendingUp className="h-4 w-4 text-primary shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-display font-medium text-foreground">
            Deal Progress
          </span>
          <span className="text-xs font-display font-bold text-primary">
            {progress}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
