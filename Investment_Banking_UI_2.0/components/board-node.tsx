"use client"

import { Briefcase, User, Lock, Check } from "lucide-react"
import type { NodeType } from "@/lib/game-data"

interface BoardNodeProps {
  id: number
  label: string
  type: NodeType
  isActive: boolean
  isCompleted: boolean
  isLocked: boolean
  onClick: () => void
}

/**
 * Isometric / pseudo-3D building illustrations for building-type nodes.
 * Each building uses a skewed right face + top face to give depth.
 */
function BuildingIllustration({
  label,
  isActive,
  isLocked,
  isCompleted,
}: {
  label: string
  isActive: boolean
  isLocked: boolean
  isCompleted: boolean
}) {
  const opacity = isLocked ? 0.35 : 1

  // Front face
  const frontFill = isLocked
    ? "hsl(0 0% 76% / 0.2)"
    : isCompleted
      ? "hsl(350 65% 35% / 0.5)"
      : isActive
        ? "hsl(350 55% 40%)"
        : "hsl(350 50% 32% / 0.75)"
  // Side face (darker for 3D depth)
  const sideFill = isLocked
    ? "hsl(0 0% 60% / 0.15)"
    : isCompleted
      ? "hsl(350 65% 25% / 0.5)"
      : isActive
        ? "hsl(350 55% 28%)"
        : "hsl(350 50% 22% / 0.75)"
  // Top face (lighter for 3D depth)
  const topFill = isLocked
    ? "hsl(0 0% 76% / 0.25)"
    : isCompleted
      ? "hsl(350 65% 42% / 0.5)"
      : isActive
        ? "hsl(350 55% 50%)"
        : "hsl(350 50% 40% / 0.7)"
  const stroke = isLocked
    ? "hsl(0 0% 76% / 0.2)"
    : isCompleted
      ? "hsl(350 65% 35% / 0.5)"
      : isActive
        ? "hsl(350 65% 55% / 0.7)"
        : "hsl(350 50% 35% / 0.4)"
  const windowFill = isLocked
    ? "hsl(0 0% 76% / 0.1)"
    : isActive
      ? "hsl(45 80% 70% / 0.7)"
      : "hsl(45 50% 55% / 0.3)"
  const windowSideFill = isLocked
    ? "hsl(0 0% 76% / 0.07)"
    : isActive
      ? "hsl(45 80% 60% / 0.5)"
      : "hsl(45 40% 45% / 0.2)"

  const lowerLabel = label.toLowerCase()
  // Depth offset for isometric projection
  const D = 8

  // NYSE - Classical facade with columns and triangular pediment (isometric)
  if (lowerLabel.includes("nyse")) {
    return (
      <svg
        width="80"
        height="76"
        viewBox="0 0 80 76"
        fill="none"
        style={{ opacity }}
        aria-hidden="true"
      >
        {/* Ground shadow */}
        <ellipse cx="38" cy="72" rx="30" ry="4" fill="hsl(0 0% 0% / 0.2)" />
        {/* Front face */}
        <rect x="10" y="28" width="46" height="38" fill={frontFill} stroke={stroke} strokeWidth="0.75" />
        {/* Right side face */}
        <polygon points={`56,28 ${56+D},${28-D} ${56+D},${66-D} 56,66`} fill={sideFill} stroke={stroke} strokeWidth="0.75" />
        {/* Top face */}
        <polygon points={`10,28 ${10+D},${28-D} ${56+D},${28-D} 56,28`} fill={topFill} stroke={stroke} strokeWidth="0.75" />
        {/* Pediment - front triangle */}
        <polygon points="10,28 33,12 56,28" fill={topFill} stroke={stroke} strokeWidth="0.75" />
        {/* Pediment - right side */}
        <polygon points={`56,28 33,12 ${33+D},${12-D} ${56+D},${28-D}`} fill={sideFill} stroke={stroke} strokeWidth="0.75" />
        {/* Columns on front */}
        <rect x="17" y="30" width="3" height="34" fill={stroke} opacity="0.5" />
        <rect x="26" y="30" width="3" height="34" fill={stroke} opacity="0.5" />
        <rect x="37" y="30" width="3" height="34" fill={stroke} opacity="0.5" />
        <rect x="46" y="30" width="3" height="34" fill={stroke} opacity="0.5" />
        {/* Windows on front */}
        <rect x="30" y="34" width="6" height="7" rx="0.5" fill={windowFill} />
        <rect x="30" y="46" width="6" height="7" rx="0.5" fill={windowFill} />
        {/* Entrance */}
        <rect x="27" y="56" width="12" height="10" rx="1" fill={windowFill} opacity="0.7" />
        {/* Flag on pediment peak */}
        <line x1="33" y1="12" x2="33" y2="5" stroke={stroke} strokeWidth="1" />
        <rect x="33" y="5" width="6" height="3.5" rx="0.5" fill={isActive ? "hsl(0 54% 61%)" : topFill} />
        {/* Foundation strip */}
        <rect x="10" y="64" width="46" height="2" fill={sideFill} />
      </svg>
    )
  }

  // Trading Floor - Modern glass office tower (isometric)
  if (lowerLabel.includes("trading")) {
    return (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        style={{ opacity }}
        aria-hidden="true"
      >
        {/* Ground shadow */}
        <ellipse cx="38" cy="75" rx="28" ry="4" fill="hsl(0 0% 0% / 0.2)" />
        {/* Front face - tall tower */}
        <rect x="16" y="10" width="38" height="62" rx="1" fill={frontFill} stroke={stroke} strokeWidth="0.75" />
        {/* Right side face */}
        <polygon points={`54,10 ${54+D},${10-D} ${54+D},${72-D} 54,72`} fill={sideFill} stroke={stroke} strokeWidth="0.75" />
        {/* Top face */}
        <polygon points={`16,10 ${16+D},${10-D} ${54+D},${10-D} 54,10`} fill={topFill} stroke={stroke} strokeWidth="0.75" />
        {/* Window grid on front - 4 columns x 6 rows */}
        {[0, 1, 2, 3, 4, 5].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <rect
              key={`f${row}-${col}`}
              x={20 + col * 8}
              y={15 + row * 9}
              width={5}
              height={6}
              rx={0.5}
              fill={windowFill}
            />
          ))
        )}
        {/* Side windows - 1 column x 6 rows */}
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <polygon
            key={`s${row}`}
            points={`54,${15 + row * 9} ${54+D-2},${15 + row * 9 - (D-2)} ${54+D-2},${15 + row * 9 + 6 - (D-2)} 54,${15 + row * 9 + 6}`}
            fill={windowSideFill}
          />
        ))}
        {/* Entrance */}
        <rect x="28" y="62" width="14" height="10" rx="1" fill={windowFill} opacity="0.6" />
        {/* Rooftop antenna */}
        <line x1="35" y1="10" x2="35" y2="2" stroke={stroke} strokeWidth="1.5" />
        <circle cx="35" cy="2" r="1.5" fill={isActive ? "hsl(0 54% 61%)" : topFill} />
      </svg>
    )
  }

  // Fed Reserve - Domed government building (isometric)
  if (lowerLabel.includes("fed")) {
    return (
      <svg
        width="80"
        height="78"
        viewBox="0 0 80 78"
        fill="none"
        style={{ opacity }}
        aria-hidden="true"
      >
        {/* Ground shadow */}
        <ellipse cx="38" cy="74" rx="32" ry="4" fill="hsl(0 0% 0% / 0.2)" />
        {/* Front face - wide body */}
        <rect x="8" y="32" width="52" height="38" fill={frontFill} stroke={stroke} strokeWidth="0.75" />
        {/* Right side face */}
        <polygon points={`60,32 ${60+D},${32-D} ${60+D},${70-D} 60,70`} fill={sideFill} stroke={stroke} strokeWidth="0.75" />
        {/* Top face of main body */}
        <polygon points={`8,32 ${8+D},${32-D} ${60+D},${32-D} 60,32`} fill={topFill} stroke={stroke} strokeWidth="0.75" />
        {/* Dome - front ellipse */}
        <ellipse cx="34" cy="32" rx="20" ry="10" fill={topFill} stroke={stroke} strokeWidth="0.75" />
        {/* Dome cap */}
        <ellipse cx="34" cy="26" rx="8" ry="5" fill={frontFill} stroke={stroke} strokeWidth="0.75" />
        {/* Cupola */}
        <rect x="31" y="17" width="6" height="9" rx="1" fill={topFill} stroke={stroke} strokeWidth="0.5" />
        <line x1="34" y1="17" x2="34" y2="10" stroke={stroke} strokeWidth="1" />
        <circle cx="34" cy="9" r="2" fill={isActive ? "hsl(0 54% 61%)" : topFill} stroke={stroke} strokeWidth="0.5" />
        {/* Columns on front */}
        <rect x="14" y="34" width="3" height="34" fill={stroke} opacity="0.4" />
        <rect x="23" y="34" width="3" height="34" fill={stroke} opacity="0.4" />
        <rect x="42" y="34" width="3" height="34" fill={stroke} opacity="0.4" />
        <rect x="51" y="34" width="3" height="34" fill={stroke} opacity="0.4" />
        {/* Windows on front */}
        <rect x="30" y="38" width="8" height="6" rx="0.5" fill={windowFill} />
        <rect x="30" y="50" width="8" height="8" rx="0.5" fill={windowFill} />
        {/* Side windows */}
        <polygon points={`60,38 ${60+D-2},${38-(D-2)} ${60+D-2},${44-(D-2)} 60,44`} fill={windowSideFill} />
        <polygon points={`60,50 ${60+D-2},${50-(D-2)} ${60+D-2},${58-(D-2)} 60,58`} fill={windowSideFill} />
        {/* Foundation */}
        <rect x="8" y="68" width="52" height="2" fill={sideFill} />
      </svg>
    )
  }

  // Market News / Default - Broadcast tower with side wings (isometric)
  return (
    <svg
      width="80"
      height="78"
      viewBox="0 0 80 78"
      fill="none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Ground shadow */}
      <ellipse cx="38" cy="74" rx="30" ry="4" fill="hsl(0 0% 0% / 0.2)" />
      {/* Left wing - front */}
      <rect x="10" y="36" width="14" height="34" fill={frontFill} stroke={stroke} strokeWidth="0.75" />
      {/* Main tower - front */}
      <rect x="20" y="16" width="28" height="54" rx="1" fill={frontFill} stroke={stroke} strokeWidth="0.75" />
      {/* Right wing - front */}
      <rect x="44" y="36" width="14" height="34" fill={frontFill} stroke={stroke} strokeWidth="0.75" />
      {/* Right side of right wing */}
      <polygon points={`58,36 ${58+D},${36-D} ${58+D},${70-D} 58,70`} fill={sideFill} stroke={stroke} strokeWidth="0.75" />
      {/* Right side of main tower (above wing) */}
      <polygon points={`48,16 ${48+D},${16-D} ${48+D},${36-D} 48,36`} fill={sideFill} stroke={stroke} strokeWidth="0.75" />
      {/* Top of main tower */}
      <polygon points={`20,16 ${20+D},${16-D} ${48+D},${16-D} 48,16`} fill={topFill} stroke={stroke} strokeWidth="0.75" />
      {/* Top of right wing */}
      <polygon points={`44,36 ${44+D},${36-D} ${58+D},${36-D} 58,36`} fill={topFill} stroke={stroke} strokeWidth="0.75" />
      {/* Roof cap on tower */}
      <rect x="24" y="12" width="20" height="6" rx="1" fill={topFill} stroke={stroke} strokeWidth="0.5" />
      {/* Antenna */}
      <line x1="34" y1="12" x2="34" y2="3" stroke={stroke} strokeWidth="1.5" />
      {/* Broadcast waves */}
      <path d="M28 6 Q31 3 34 3 Q37 3 40 6" stroke={isActive ? "hsl(0 54% 61%)" : stroke} strokeWidth="0.75" fill="none" />
      <path d="M26 9 Q30 4 34 4 Q38 4 42 9" stroke={isActive ? "hsl(0 54% 61% / 0.5)" : stroke} strokeWidth="0.5" fill="none" opacity="0.5" />
      {/* Tower front windows */}
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1].map((col) => (
          <rect
            key={`tw${row}-${col}`}
            x={25 + col * 10}
            y={20 + row * 9}
            width={6}
            height={5}
            rx={0.5}
            fill={windowFill}
          />
        ))
      )}
      {/* Side windows on tower */}
      {[0, 1, 2].map((row) => (
        <polygon
          key={`ts${row}`}
          points={`48,${20 + row * 9} ${48+D-2},${20 + row * 9 - (D-2)} ${48+D-2},${20 + row * 9 + 5 - (D-2)} 48,${20 + row * 9 + 5}`}
          fill={windowSideFill}
        />
      ))}
      {/* Left wing windows */}
      <rect x="13" y="42" width="5" height="4" rx="0.5" fill={windowFill} />
      <rect x="13" y="52" width="5" height="4" rx="0.5" fill={windowFill} />
      {/* Right wing windows */}
      <rect x="48" y="42" width="5" height="4" rx="0.5" fill={windowFill} />
      <rect x="48" y="52" width="5" height="4" rx="0.5" fill={windowFill} />
      {/* Entrance */}
      <rect x="29" y="60" width="10" height="10" rx="1" fill={windowFill} opacity="0.6" />
    </svg>
  )
}

/** Shape + color mapping for investor & company categories */
const simpleConfig: Record<
  "investor" | "company",
  {
    shape: string
    activeShape: string
    completedShape: string
    lockedShape: string
    activeIcon: string
    completedIcon: string
    glowColor: string
    size: string
    activeSize: string
  }
> = {
  investor: {
    shape: "rounded-full",
    activeShape:
      "bg-investor border-investor text-investor-foreground shadow-lg shadow-investor/30",
    completedShape: "bg-investor/10 border-investor/40 text-investor",
    lockedShape: "bg-secondary border-border opacity-50",
    activeIcon: "text-investor-foreground",
    completedIcon: "text-investor",
    glowColor: "bg-investor/15",
    size: "w-14 h-14",
    activeSize: "w-16 h-16",
  },
  company: {
    shape: "rounded-xl",
    activeShape:
      "bg-company border-company text-company-foreground shadow-lg shadow-company/30",
    completedShape: "bg-company/10 border-company/40 text-company",
    lockedShape: "bg-secondary border-border opacity-50",
    activeIcon: "text-company-foreground",
    completedIcon: "text-company",
    glowColor: "bg-company/15",
    size: "w-14 h-14",
    activeSize: "w-16 h-16",
  },
}

export function BoardNode({
  label,
  type,
  isActive,
  isCompleted,
  isLocked,
  onClick,
}: BoardNodeProps) {
  // Building nodes get stylized building illustrations
  if (type === "building") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isLocked}
        className="relative flex flex-col items-center gap-1 group transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label={`${label}${isLocked ? " (locked)" : isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
      >
        {/* Glow for active building */}
        {isActive && (
          <span className="absolute -inset-3 rounded-2xl bg-marketplace/10 animate-pulse-glow pointer-events-none" />
        )}

        {/* Ground shadow */}
        <span
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full ${
            isActive ? "bg-marketplace/20" : "bg-background/40"
          } blur-sm`}
        />

        {/* The building illustration */}
        <span className="relative">
          <BuildingIllustration
            label={label}
            isActive={isActive}
            isLocked={isLocked}
            isCompleted={isCompleted}
          />

          {/* Completed check badge */}
          {isCompleted && !isActive && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center ring-2 ring-background z-10">
              <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
            </span>
          )}

          {/* Lock overlay for locked buildings */}
          {isLocked && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-5 h-5 text-muted-foreground/50" />
            </span>
          )}
        </span>

        {/* Label */}
        <span
          className={`text-[10px] font-display font-semibold leading-tight text-center max-w-[80px] ${
            isActive
              ? "text-foreground"
              : isCompleted
                ? "text-foreground/70"
                : isLocked
                  ? "text-muted-foreground/50"
                  : "text-muted-foreground"
          }`}
        >
          {label}
        </span>
      </button>
    )
  }

  // Investor & Company nodes - simple icon nodes
  const config = simpleConfig[type]
  const shapeClass = config.shape
  const sizeClass = isActive ? config.activeSize : config.size

  const stateClass = isLocked
    ? config.lockedShape
    : isActive
      ? config.activeShape
      : isCompleted
        ? config.completedShape
        : "bg-card border-border text-muted-foreground"

  const iconClass = isLocked
    ? "text-muted-foreground"
    : isActive
      ? config.activeIcon
      : isCompleted
        ? config.completedIcon
        : "text-muted-foreground"

  const IconComponent = type === "investor" ? User : Briefcase

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className="relative flex flex-col items-center gap-1.5 group transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label={`${label}${isLocked ? " (locked)" : isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
    >
      {/* Glow ring for active nodes */}
      {isActive && (
        <span
          className={`absolute inset-0 -m-4 ${shapeClass} ${config.glowColor} animate-pulse-glow pointer-events-none`}
        />
      )}

      {/* The node shape */}
      <span
        className={`relative flex items-center justify-center ${sizeClass} ${shapeClass} border-[2.5px] transition-all duration-300 ${stateClass}`}
      >
        {isLocked ? (
          <Lock className="w-4 h-4 text-muted-foreground" />
        ) : (
          <span className={iconClass}>
            <IconComponent size={isActive ? 22 : 18} />
          </span>
        )}

        {/* Completed check badge */}
        {isCompleted && !isActive && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center ring-2 ring-background">
            <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
          </span>
        )}
      </span>

      {/* Category indicator dots */}
      {!isLocked && (
        <span className="flex items-center gap-0.5">
          {type === "investor" && (
            <>
              <span className="w-1 h-1 rounded-full bg-investor/60" />
              <span className="w-1 h-1 rounded-full bg-investor/40" />
            </>
          )}
          {type === "company" && (
            <span className="w-4 h-0.5 rounded-full bg-company/50" />
          )}
        </span>
      )}

      {/* Label */}
      <span
        className={`text-[10px] font-display font-semibold leading-tight text-center max-w-[80px] ${
          isActive
            ? "text-foreground"
            : isCompleted
              ? "text-foreground/70"
              : isLocked
                ? "text-muted-foreground/50"
                : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </button>
  )
}
