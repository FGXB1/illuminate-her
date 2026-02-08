"use client"

import { useState, useCallback, useMemo } from "react"
import { Landmark, RotateCcw, Briefcase } from "lucide-react"
import { gameScenarios, type GameNode, type GameScenario } from "@/lib/game-data"
import { negotiationScenarios } from "@/lib/negotiation-data"
import { DealProgressMeter } from "./deal-progress-meter"
import { Scene } from "./3d/Scene"
import { InteractionCard } from "./interaction-card"
import { NegotiationDialog } from "./negotiation-dialog"
import { EndingPage } from "./ending-page"

// ==========================================
// SCENARIO SELECTOR SCREEN
// ==========================================
function ScenarioSelector({ onSelect }: { onSelect: (scenario: GameScenario) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-6">
          <Landmark className="w-8 h-8 text-black" />
        </div>

        <h1 className="text-5xl font-bold mb-4 text-center font-display tracking-tight text-white">
          Walk Through Wall Street
        </h1>
        <p className="text-slate-400 mb-10 text-center max-w-md text-lg">
          Choose your first deal. Your career as an investment banking analyst starts now.
        </p>

        <div className="grid gap-4 w-full px-4">
          {gameScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-6 text-left hover:border-amber-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20 active:scale-[0.99]"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                    {scenario.name}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {scenario.description}
                  </p>
                </div>
              </div>

              {/* Animated border gradient on hover */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-white/10 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}


// ==========================================
// MAIN GAME SCREEN
// ==========================================

export function GameScreen() {
  const [activeScenario, setActiveScenario] = useState<GameScenario | null>(null)

  const [currentNode, setCurrentNode] = useState(1)
  const [completedNodes, setCompletedNodes] = useState<Set<number>>(new Set())
  const [activeNode, setActiveNode] = useState<GameNode | null>(null)

  // Negotiation state
  const [showNegotiation, setShowNegotiation] = useState(false)
  const [negotiationFailed, setNegotiationFailed] = useState(false)

  // Session state (XP & Rounds)
  const [sessionXP, setSessionXP] = useState(0)
  const [completedRounds, setCompletedRounds] = useState(0)
  const [showEnding, setShowEnding] = useState(false)

  // Get the specific negotiation scenario for the current game scenario
  const currentNegotiationScenario = useMemo(() => {
    if (!activeScenario) return null
    return negotiationScenarios.find(n => n.id === activeScenario.negotiationId) || null
  }, [activeScenario])

  const handleNodeClick = useCallback(
    (nodeId: number) => {
      if (!activeScenario) return

      // Allow clicking already visited nodes or the current one
      if (nodeId > currentNode) return

      const node = activeScenario.nodes.find((n) => n.id === nodeId)
      if (!node) return

      // If this is the negotiation node, open the negotiation dialog
      if (node.type === "negotiation") {
        setNegotiationFailed(false)
        setShowNegotiation(true)
        return
      }

      setActiveNode(node)
    },
    [currentNode, activeScenario]
  )

  const handleChoice = useCallback(
    (_outcome: string) => {
      if (activeNode && activeScenario) {
        setCompletedNodes((prev) => {
          const next = new Set(prev)
          // Only award XP if it's a new completion
          if (!prev.has(activeNode.id)) {
            setSessionXP(curr => curr + 50)
          }
          next.add(activeNode.id)
          return next
        })
        if (activeNode.id === currentNode && currentNode < activeScenario.nodes.length) {
          setCurrentNode((prev) => prev + 1)
        }
        setActiveNode(null)
      }
    },
    [activeNode, currentNode, activeScenario]
  )

  const handleClose = useCallback(() => {
    setActiveNode(null)
  }, [])

  const handleNegotiationComplete = useCallback(
    (passed: boolean) => {
      if (!activeScenario) return

      if (passed) {
        // Mark negotiation node as completed and advance
        setCompletedNodes((prev) => {
          const next = new Set(prev)
          const negotiationNode = activeScenario.nodes.find((n) => n.type === "negotiation")
          if (negotiationNode && !prev.has(negotiationNode.id)) {
            setSessionXP(curr => curr + 100) // Negotiation is worth more
            next.add(negotiationNode.id)
          }
          return next
        })
        const negotiationNode = activeScenario.nodes.find((n) => n.type === "negotiation")
        if (negotiationNode && negotiationNode.id === currentNode && currentNode < activeScenario.nodes.length) {
          setCurrentNode((prev) => prev + 1)
        }
        setShowNegotiation(false)
      } else {
        // Failed
        setNegotiationFailed(true)
        setShowNegotiation(false)
      }
    },
    [currentNode, activeScenario]
  )

  const handleReset = useCallback(() => {
    // Reset everything including session
    setActiveScenario(null)
    setCurrentNode(1)
    setCompletedNodes(new Set())
    setActiveNode(null)
    setShowNegotiation(false)
    setNegotiationFailed(false)
    setShowEnding(false)
    setSessionXP(0)
    setCompletedRounds(0)
  }, [])

  const handleContinue = useCallback(() => {
    // Reset scenario but keep session stats
    setActiveScenario(null)
    setCurrentNode(1)
    setCompletedNodes(new Set())
    setActiveNode(null)
    setShowNegotiation(false)
    setNegotiationFailed(false)
    setShowEnding(false)
  }, [])

  // If showing ending page
  if (showEnding) {
    return (
      <EndingPage
        xp={sessionXP}
        rounds={completedRounds}
        onReset={handleReset}
        onContinue={handleContinue}
      />
    )
  }

  // If no scenario selected, show the selector
  if (!activeScenario) {
    return <ScenarioSelector onSelect={setActiveScenario} />
  }

  const allComplete = completedNodes.size === activeScenario.nodes.length

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene
          currentNode={currentNode}
          completedNodes={completedNodes}
          onNodeClick={handleNodeClick}
          nodes={activeScenario.nodes}
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
                {activeScenario.name}
              </h1>
              <p className="text-[10px] text-muted-foreground leading-tight truncate">
                {activeScenario.description}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary/80"
              aria-label="Reset game"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </header>

          {/* Deal progress */}
          <div className="px-2 mt-2">
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-2 shadow-sm border border-border/50">
              <DealProgressMeter
                currentNode={completedNodes.size}
                totalNodes={activeScenario.nodes.length}
              />
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Bottom status bar */}
        <div className="max-w-md w-full mx-auto pointer-events-auto pb-4 px-2">
          <footer className="px-4 py-3 bg-card/90 backdrop-blur-md rounded-xl shadow-lg border border-border/50">
            {allComplete ? (
              <button
                onClick={() => {
                  setCompletedRounds(prev => prev + 1)
                  setShowEnding(true)
                }}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors animate-pulse"
              >
                Deal Closed! Complete Challenge &rarr;
              </button>
            ) : negotiationFailed ? (
              <p className="text-center text-xs text-red-500 font-display font-bold">
                Negotiation failed — tap The Negotiation node to try again
              </p>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                Tap the current node to interact &middot; Node{" "}
                <span className="text-foreground font-medium">{currentNode}</span> of{" "}
                <span className="text-foreground font-medium">{activeScenario.nodes.length}</span>
              </p>
            )}
          </footer>
        </div>
      </div>

      {/* Interaction overlay (regular nodes) */}
      {activeNode && (
        <div className="relative z-50">
          <InteractionCard
            node={activeNode}
            onClose={handleClose}
            onChoice={handleChoice}
          />
        </div>
      )}

      {/* Negotiation overlay */}
      {showNegotiation && currentNegotiationScenario && (
        <div className="relative z-50">
          <NegotiationDialog
            scenario={currentNegotiationScenario}
            onComplete={handleNegotiationComplete}
          />
        </div>
      )}
    </div>
  )
}
