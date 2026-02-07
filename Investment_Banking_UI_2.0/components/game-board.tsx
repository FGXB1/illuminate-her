"use client"

import { useRef, useEffect, Fragment } from "react"
import { gameNodes } from "@/lib/game-data"
import { BoardNode } from "./board-node"
import { PlayerAvatar } from "./player-avatar"

interface GameBoardProps {
  currentNode: number
  completedNodes: Set<number>
  onNodeClick: (nodeId: number) => void
}

const OFFSET = 55
const SVG_W = OFFSET * 2 + 70
const SVG_H = 56
const SVG_CX = SVG_W / 2
const LEFT_X = SVG_CX - OFFSET
const RIGHT_X = SVG_CX + OFFSET

/* Street-tile dots along the curve */
function computePathPoints(
  startX: number,
  endX: number,
  height: number,
  count: number
) {
  const points: { x: number; y: number }[] = []
  for (let i = 0; i <= count; i++) {
    const t = i / count
    const midY = height / 2
    // cubic bezier interpolation
    const u = 1 - t
    const x =
      u * u * u * startX +
      3 * u * u * t * startX +
      3 * u * t * t * endX +
      t * t * t * endX
    const y =
      u * u * u * 0 +
      3 * u * u * t * midY +
      3 * u * t * t * midY +
      t * t * t * height
    points.push({ x, y })
  }
  return points
}

function PathConnector({
  startOnLeft,
  completed,
}: {
  startOnLeft: boolean
  completed: boolean
}) {
  const startX = startOnLeft ? LEFT_X : RIGHT_X
  const endX = startOnLeft ? RIGHT_X : LEFT_X
  const midY = SVG_H / 2
  const pathD = `M${startX} 0 C${startX} ${midY}, ${endX} ${midY}, ${endX} ${SVG_H}`

  const dots = computePathPoints(startX, endX, SVG_H, 8)

  return (
    <div className="flex justify-center -my-1 relative z-0">
      <svg
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        aria-hidden="true"
        className="overflow-visible"
      >
        {/* Outer sidewalk / curb edge */}
        <path
          d={pathD}
          stroke={
            completed
              ? "hsl(0 54% 61% / 0.08)"
              : "hsl(204 15% 20% / 0.25)"
          }
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
        />
        {/* Sidewalk edge line */}
        <path
          d={pathD}
          stroke={
            completed
              ? "hsl(0 54% 61% / 0.12)"
              : "hsl(204 15% 25% / 0.35)"
          }
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
        />
        {/* Road surface */}
        <path
          d={pathD}
          stroke={
            completed
              ? "hsl(0 54% 61% / 0.1)"
              : "hsl(204 20% 15% / 0.6)"
          }
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        {/* Dashed center lane divider (yellow style) */}
        <path
          d={pathD}
          stroke={
            completed
              ? "hsl(0 54% 61% / 0.45)"
              : "hsl(45 40% 45% / 0.35)"
          }
          strokeWidth="1.5"
          strokeDasharray="6 5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Lane edge lines */}
        {dots.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={1}
            fill={
              completed
                ? "hsl(0 54% 61% / 0.3)"
                : "hsl(204 20% 35% / 0.2)"
            }
          />
        ))}
      </svg>
    </div>
  )
}

export function GameBoard({
  currentNode,
  completedNodes,
  onNodeClick,
}: GameBoardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current
      const element = activeRef.current
      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()

      const scrollTop =
        elementRect.top -
        containerRect.top +
        container.scrollTop -
        containerRect.height / 2 +
        elementRect.height / 2

      container.scrollTo({ top: scrollTop, behavior: "smooth" })
    }
  }, [currentNode])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 board-city-grid"
      role="region"
      aria-label="Game board"
    >
      <div className="max-w-xs mx-auto flex flex-col items-center">
        {/* Start indicator */}
        <div className="mb-2 flex flex-col items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-display font-bold uppercase tracking-widest text-primary">
              Wall Street
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </span>
          <div className="w-px h-4 bg-border/50" />
        </div>

        {gameNodes.map((node, index) => {
          const isLeft = index % 2 === 0
          const isActive = node.id === currentNode
          const isCompleted = completedNodes.has(node.id)
          const isLocked = node.id > currentNode

          const prevCompleted =
            index > 0 && completedNodes.has(gameNodes[index - 1].id)

          return (
            <Fragment key={node.id}>
              {index > 0 && (
                <PathConnector
                  startOnLeft={(index - 1) % 2 === 0}
                  completed={prevCompleted}
                />
              )}

              <div
                ref={isActive ? activeRef : undefined}
                className="relative z-10"
                style={{
                  transform: `translateX(${isLeft ? -OFFSET : OFFSET}px)`,
                }}
              >
                {isActive && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 z-20"
                    style={{ top: node.type === "building" ? "-2.75rem" : "-2.25rem" }}
                  >
                    <PlayerAvatar />
                  </div>
                )}
                <BoardNode
                  id={node.id}
                  label={node.label}
                  type={node.type}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  isLocked={isLocked}
                  onClick={() => onNodeClick(node.id)}
                />
              </div>
            </Fragment>
          )
        })}

        {/* Finish marker */}
        <div className="mt-2 flex flex-col items-center gap-1.5">
          <div className="w-px h-4 bg-border/50" />
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center shadow-sm">
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 1l2 3h3l-2.5 2.5L11.5 10 8 7.5 4.5 10l1-3.5L3 4h3l2-3z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary/60"
              />
            </svg>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-[9px] font-display font-bold uppercase tracking-widest text-primary">
              Deal Closed
            </span>
          </span>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
