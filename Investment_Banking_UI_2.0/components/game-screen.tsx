"use client"

import { useState, useCallback } from "react"
import { Landmark, RotateCcw } from "lucide-react"
import { gameNodes, type GameNode } from "@/lib/game-data"
import { DealProgressMeter } from "./deal-progress-meter"
import { GameBoard } from "./game-board"
import { InteractionCard } from "./interaction-card"

export function GameScreen() {
  const [currentNode, setCurrentNode] = useState(1)
  const [completedNodes, setCompletedNodes] = useState<Set<number>>(new Set())
  const [activeNode, setActiveNode] = useState<GameNode | null>(null)

  const handleNodeClick = useCallback(
    (nodeId: number) => {
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
    <div className="flex flex-col h-dvh max-w-md mx-auto bg-background">
      {/* Top bar */}
      <header className="shrink-0 flex items-center gap-3 px-4 pt-4 pb-2 border-b border-border/50">
        <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
          <Landmark className="w-5 h-5 text-primary-foreground" />
        </span>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-foreground text-sm leading-tight">
            Walk Through Wall Street
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-investor" />
              <span className="text-[8px] text-muted-foreground">Investors</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-sm bg-company" />
              <span className="text-[8px] text-muted-foreground">Companies</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-marketplace" />
              <span className="text-[8px] text-muted-foreground">Markets</span>
            </span>
          </div>
        </div>
        {completedNodes.size > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Reset game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </header>

      {/* Deal progress */}
      <div className="shrink-0">
        <DealProgressMeter
          currentNode={completedNodes.size}
          totalNodes={gameNodes.length}
        />
      </div>

      {/* Board */}
      <GameBoard
        currentNode={currentNode}
        completedNodes={completedNodes}
        onNodeClick={handleNodeClick}
      />

      {/* Bottom status bar */}
      <footer className="shrink-0 px-4 py-3 border-t border-border bg-card/50 backdrop-blur-sm">
        {allComplete ? (
          <p className="text-center text-sm font-display font-bold text-primary">
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

      {/* Interaction overlay */}
      {activeNode && (
        <InteractionCard
          node={activeNode}
          onClose={handleClose}
          onChoice={handleChoice}
        />
      )}
    </div>
  )
}
