"use client"

import { useState, Fragment } from "react"
import { Briefcase, User, Landmark, X } from "lucide-react"
import type { GameNode, NodeType } from "@/lib/game-data"
import { GlossaryTooltip } from "./glossary-tooltip"

interface InteractionCardProps {
  node: GameNode
  onClose: () => void
  onChoice: (outcome: string) => void
}

function NodeTypeIcon({ type }: { type: NodeType }) {
  const iconClass = "w-6 h-6"
  switch (type) {
    case "investor":
      return <User className={iconClass} />
    case "company":
      return <Briefcase className={iconClass} />
    case "building":
      return <Landmark className={iconClass} />
  }
}

function typeLabel(type: NodeType) {
  switch (type) {
    case "investor":
      return "Investor"
    case "company":
      return "Company"
    case "building":
      return "Marketplace"
  }
}

function typeColor(type: NodeType) {
  switch (type) {
    case "investor":
      return "bg-investor text-investor-foreground"
    case "company":
      return "bg-company text-company-foreground"
    case "building":
      return "bg-marketplace text-marketplace-foreground"
  }
}

function highlightGlossary(
  text: string,
  glossaryTerms?: { term: string; definition: string }[]
) {
  if (!glossaryTerms || glossaryTerms.length === 0) return text

  const parts: (string | { term: string; definition: string })[] = []
  let remaining = text

  const sortedTerms = [...glossaryTerms].sort(
    (a, b) => b.term.length - a.term.length
  )

  while (remaining.length > 0) {
    let earliestIndex = remaining.length
    let matchedTerm: (typeof sortedTerms)[0] | null = null

    for (const t of sortedTerms) {
      const idx = remaining.toLowerCase().indexOf(t.term.toLowerCase())
      if (idx !== -1 && idx < earliestIndex) {
        earliestIndex = idx
        matchedTerm = t
      }
    }

    if (matchedTerm) {
      if (earliestIndex > 0) {
        parts.push(remaining.slice(0, earliestIndex))
      }
      parts.push(matchedTerm)
      remaining = remaining.slice(earliestIndex + matchedTerm.term.length)
    } else {
      parts.push(remaining)
      break
    }
  }

  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === "string") {
          return <Fragment key={i}>{part}</Fragment>
        }
        return (
          <GlossaryTooltip key={i} term={part.term} definition={part.definition}>
            {part.term}
          </GlossaryTooltip>
        )
      })}
    </>
  )
}

export function InteractionCard({ node, onClose, onChoice }: InteractionCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [showOutcome, setShowOutcome] = useState(false)

  function handleChoice(label: string, outcome: string) {
    setSelectedChoice(label)
    setShowOutcome(true)
    setTimeout(() => {
      onChoice(outcome)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close interaction"
      />
      <div
        className="relative w-full max-w-sm mx-4 mb-4 sm:mb-0 rounded-2xl bg-card border border-border shadow-2xl shadow-background/60 animate-slide-up overflow-hidden"
        role="dialog"
        aria-label={node.label}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <span
            className={`w-10 h-10 flex items-center justify-center ${
              node.type === "company" ? "rounded-xl" : "rounded-full"
            } ${typeColor(node.type)}`}
          >
            <NodeTypeIcon type={node.type} />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-foreground text-base leading-tight">
              {node.label}
            </h2>
            <span className="text-xs text-muted-foreground font-medium">
              {typeLabel(node.type)}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm leading-relaxed text-foreground/85 mb-4">
            {highlightGlossary(node.description, node.glossaryTerms)}
          </p>

          {showOutcome && selectedChoice ? (
            <div className="animate-slide-up rounded-xl bg-primary/10 border border-primary/20 p-3">
              <span className="block text-xs font-display font-bold text-primary mb-1">
                You chose: {selectedChoice}
              </span>
              <span className="block text-sm text-foreground/80 leading-relaxed">
                {node.choices.find((c) => c.label === selectedChoice)?.outcome}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {node.choices.map((choice) => (
                <button
                  key={choice.label}
                  type="button"
                  onClick={() => handleChoice(choice.label, choice.outcome)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-medium text-foreground hover:bg-secondary/80 hover:border-primary/30 active:scale-[0.98] transition-all duration-200"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Glossary hint */}
        {node.glossaryTerms && node.glossaryTerms.length > 0 && !showOutcome && (
          <div className="px-4 pb-3">
            <p className="text-[10px] text-muted-foreground">
              Tap highlighted words for definitions
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
