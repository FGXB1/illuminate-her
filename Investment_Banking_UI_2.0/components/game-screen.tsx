"use client"

import { useState, useCallback } from "react"
import { Landmark, RotateCcw } from "lucide-react"
import { gameNodes, type GameNode } from "@/lib/game-data"
import { DealProgressMeter } from "./deal-progress-meter"
import { Scene } from "./3d/Scene"
import { InteractionCard } from "./interaction-card"

export function GameScreen() {
  const [currentNode, setCurrentNode] = useState(1)
  const [completedNodes, setCompletedNodes] = useState<Set<number>>(new Set())
  const [activeNode, setActiveNode] = useState<GameNode | null>(null)

  const handleNodeClick = useCallback(
    (nodeId: number) => {
      // Allow clicking already visited nodes or the current one
      if (nodeId > currentNode) return
      const node = gameNodes.find((n) => n.id === nodeId)
      if (node) setActiveNode(node)
    },
    [currentNode]
  )

  const handleChoice = useCallback(
    (_outcome: string) => {
      if (activeNode) {
        setCompletedNodes((prev) => {
          const next = new Set(prev)
          next.add(activeNode.id)
          return next
        })
        if (activeNode.id === currentNode && currentNode < gameNodes.length) {
          setCurrentNode((prev) => prev + 1)
        }
        setActiveNode(null)
      }
    },
    [activeNode, currentNode]
  )

  const handleClose = useCallback(() => {
    setActiveNode(null)
  }, [])

  const handleReset = useCallback(() => {
    setCurrentNode(1)
    setCompletedNodes(new Set())
    setActiveNode(null)
  }, [])

  const allComplete = completedNodes.size === gameNodes.length

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene
          currentNode={currentNode}
          completedNodes={completedNodes}
          onNodeClick={handleNodeClick}
        />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
        {/* Top bar */}
        <div className="max-w-md w-full mx-auto pointer-events-auto">
          <header className="flex items-center gap-3 px-4 pt-4 pb-2 bg-background/80 backdrop-blur-sm rounded-b-xl mx-2 mt-2 shadow-sm border border-border/50">
            <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-inner shadow-black/10">
              <Landmark className="w-5 h-5 text-primary-foreground" />
            </span>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-foreground text-sm leading-tight">
                Walk Through Wall Street
              </h1>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Investment Banking Explorer
              </p>
            </div>
            {completedNodes.size > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary/80"
                aria-label="Reset game"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </header>

          {/* Deal progress */}
          <div className="px-2 mt-2">
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-2 shadow-sm border border-border/50">
                <DealProgressMeter
                currentNode={completedNodes.size}
                totalNodes={gameNodes.length}
                />
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Bottom status bar */}
        <div className="max-w-md w-full mx-auto pointer-events-auto pb-4 px-2">
          <footer className="px-4 py-3 bg-card/90 backdrop-blur-md rounded-xl shadow-lg border border-border/50">
            {allComplete ? (
              <p className="text-center text-sm font-display font-bold text-primary animate-pulse">
                Deal closed! You finished the Wall Street Walk.
              </p>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                Tap the current node to interact &middot; Node{" "}
                <span className="text-foreground font-medium">{currentNode}</span> of{" "}
                <span className="text-foreground font-medium">{gameNodes.length}</span>
              </p>
            )}
          </footer>
        </div>
      </div>

      {/* Interaction overlay (Modals) */}
      {activeNode && (
        <div className="relative z-50">
            <InteractionCard
            node={activeNode}
            onClose={handleClose}
            onChoice={handleChoice}
            />
        </div>
      )}
    </div>
  )
}
