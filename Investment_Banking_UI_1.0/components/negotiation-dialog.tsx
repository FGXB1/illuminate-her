"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, User, Shield, AlertTriangle, CheckCircle, XCircle, ChevronRight } from "lucide-react"
import type { NegotiationScenario, NegotiationLine, NegotiationChoice } from "@/lib/negotiation-data"
import { GUIDE_NAME, GUIDE_TITLE } from "@/lib/negotiation-data"

interface NegotiationDialogProps {
  scenario: NegotiationScenario
  onComplete: (passed: boolean) => void
}

// Speech bubble component
function SpeechBubble({ line, animate = true }: { line: NegotiationLine; animate?: boolean }) {
  const isClient = line.speaker === "client"
  const isGuide = line.speaker === "guide"
  const isNarrator = line.speaker === "narrator"

  if (isNarrator) {
    return (
      <div className={`mx-auto max-w-[90%] mb-3 ${animate ? "animate-slide-up" : ""}`}>
        <div className="bg-secondary/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-border/50 text-center">
          <p className="text-xs text-muted-foreground italic leading-relaxed">{line.text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isClient ? "justify-start" : "justify-end"} mb-3 ${animate ? "animate-slide-up" : ""}`}>
      {/* Avatar for client (left side) */}
      {isClient && (
        <div className="shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
            <User className="w-4 h-4 text-orange-500" />
          </div>
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[80%] relative ${isClient ? "" : "order-first mr-2"}`}>
        {/* Speaker label */}
        <p className={`text-[10px] font-display font-bold mb-1 ${isClient ? "text-orange-500" : "text-emerald-500"}`}>
          {isClient ? "Client" : GUIDE_NAME}
        </p>

        <div
          className={`rounded-3xl px-4 py-3 shadow-sm relative transition-transform duration-300 hover:-translate-y-0.5
            ${isClient
              ? "bg-orange-500/10 border border-orange-500/20 rounded-tl-sm"
              : "bg-emerald-500/10 border border-emerald-500/20 rounded-tr-sm"
            }`}
        >
          <p className="text-sm leading-relaxed text-foreground/90">{line.text}</p>
        </div>

        {/* Speech bubble tail */}
        <div
          className={`absolute top-6 w-0 h-0
            ${isClient
              ? "-left-2 border-t-[6px] border-t-transparent border-r-[8px] border-r-orange-500/20 border-b-[6px] border-b-transparent"
              : "-right-2 border-t-[6px] border-t-transparent border-l-[8px] border-l-emerald-500/20 border-b-[6px] border-b-transparent"
            }`}
        />
      </div>

      {/* Avatar for guide (right side) */}
      {isGuide && (
        <div className="shrink-0">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      )}
    </div>
  )
}

// Guide feedback bubble with right/wrong indicator
function GuideFeedbackBubble({ feedback, isCorrect }: { feedback: string; isCorrect: boolean }) {
  return (
    <div className="flex justify-end mb-3 animate-slide-up">
      <div className="max-w-[85%] mr-2">
        <div className={`flex items-center gap-1.5 mb-1 ${isCorrect ? "text-emerald-500" : "text-red-500"}`}>
          {isCorrect ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <XCircle className="w-3.5 h-3.5" />
          )}
          <p className="text-[10px] font-display font-bold">
            {isCorrect ? `${GUIDE_NAME} — Correct!` : `${GUIDE_NAME} — Wrong Answer`}
          </p>
        </div>
        <div className={`rounded-3xl rounded-tr-sm px-4 py-3 shadow-sm border transition-transform duration-300 hover:-translate-y-0.5
          ${isCorrect
            ? "bg-emerald-500/10 border-emerald-500/20"
            : "bg-red-500/10 border-red-500/20"
          }`}
        >
          <p className="text-sm leading-relaxed text-foreground/90">{feedback}</p>
        </div>
      </div>
      <div className="shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border
          ${isCorrect ? "bg-emerald-500/20 border-emerald-500/30" : "bg-red-500/20 border-red-500/30"}`}>
          <Shield className={`w-4 h-4 ${isCorrect ? "text-emerald-500" : "text-red-500"}`} />
        </div>
      </div>
    </div>
  )
}

// Player choice buttons
function ChoiceButtons({
  choices,
  onChoose,
  disabled,
}: {
  choices: NegotiationChoice[]
  onChoose: (choice: NegotiationChoice) => void
  disabled: boolean
}) {
  return (
    <div className="space-y-2 mb-3 animate-slide-up">
      <div className="flex items-center gap-1.5 mb-2">
        <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
        <p className="text-[10px] font-display font-bold text-blue-500">Your Response</p>
      </div>
      {choices.map((choice, i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          onClick={() => onChoose(choice)}
          className="w-full text-left px-4 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20
            text-sm text-foreground/90 hover:bg-blue-500/20 hover:border-blue-500/30
            active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-500">
              {String.fromCharCode(65 + i)}
            </span>
            <span>{choice.label}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

export function NegotiationDialog({ scenario, onComplete }: NegotiationDialogProps) {
  const [phase, setPhase] = useState<"intro" | "steps" | "outro">("intro")
  const [currentStep, setCurrentStep] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastChoice, setLastChoice] = useState<NegotiationChoice | null>(null)
  const [waitingForNext, setWaitingForNext] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [phase, currentStep, showFeedback, waitingForNext])

  const handleStartNegotiation = () => {
    setPhase("steps")
  }

  const handleChoose = (choice: NegotiationChoice) => {
    setLastChoice(choice)
    setShowFeedback(true)
    if (!choice.isCorrect) {
      setWrongCount((prev) => prev + 1)
    }
    setWaitingForNext(true)
  }

  const handleNext = () => {
    setShowFeedback(false)
    setLastChoice(null)
    setWaitingForNext(false)

    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // All steps done
      setPhase("outro")
    }
  }

  const passed = wrongCount === 0

  const handleFinish = () => {
    onComplete(passed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

      {/* Dialog container */}
      <div className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-2xl bg-card border border-border shadow-2xl animate-slide-up overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="shrink-0 px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <MessageCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-foreground text-sm leading-tight">
                {scenario.title}
              </h2>
              <p className="text-[10px] text-muted-foreground">
                Final Negotiation — {scenario.steps.length} rounds
              </p>
            </div>

            {/* Score indicator */}
            <div className="flex items-center gap-1.5">
              {phase === "steps" && (
                <span className="text-[10px] font-display font-bold text-muted-foreground">
                  Round {currentStep + 1}/{scenario.steps.length}
                </span>
              )}
              {wrongCount > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-500">
                  <AlertTriangle className="w-3 h-3" />
                  {wrongCount}
                </span>
              )}
            </div>
          </div>

          {/* Guide info bar */}
          <div className="mt-2 flex items-center gap-2 px-2 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
              <span className="font-bold">{GUIDE_NAME}</span> — {GUIDE_TITLE} — Your mentor
            </p>
          </div>
        </div>

        {/* Scrollable conversation area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1">

          {/* INTRO PHASE */}
          {phase === "intro" && (
            <>
              {scenario.introduction.map((line, i) => (
                <SpeechBubble key={i} line={line} />
              ))}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartNegotiation}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm
                    hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Begin Negotiation
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* STEPS PHASE */}
          {phase === "steps" && (
            <>
              {/* Current step dialogue */}
              {scenario.steps[currentStep].dialogue.map((line, i) => (
                <SpeechBubble key={`step-${currentStep}-line-${i}`} line={line} />
              ))}

              {/* Show choices or feedback */}
              {!showFeedback ? (
                <ChoiceButtons
                  choices={scenario.steps[currentStep].choices}
                  onChoose={handleChoose}
                  disabled={false}
                />
              ) : (
                <>
                  {/* Show what user chose */}
                  {lastChoice && (
                    <div className="flex justify-end mb-3 animate-slide-up">
                      <div className="max-w-[80%]">
                        <p className="text-[10px] font-display font-bold text-blue-500 mb-1 text-right">You</p>
                        <div className={`rounded-3xl rounded-tr-sm px-4 py-3 shadow-sm border transition-transform duration-300 hover:-translate-y-0.5
                          ${lastChoice.isCorrect
                            ? "bg-blue-500/10 border-blue-500/20"
                            : "bg-red-500/10 border-red-500/20 line-through decoration-red-500/30"
                          }`}
                        >
                          <p className="text-sm leading-relaxed text-foreground/90">{lastChoice.label}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Guide feedback */}
                  {lastChoice && (
                    <GuideFeedbackBubble
                      feedback={lastChoice.guideFeedback}
                      isCorrect={lastChoice.isCorrect}
                    />
                  )}

                  {/* Next button */}
                  {waitingForNext && (
                    <div className="pt-2 animate-slide-up">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm
                          hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        {currentStep < scenario.steps.length - 1 ? "Next Round" : "See Results"}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* OUTRO PHASE */}
          {phase === "outro" && (
            <>
              {/* Result banner */}
              <div className={`mx-auto max-w-[90%] mb-4 animate-slide-up`}>
                <div className={`rounded-xl px-4 py-4 border text-center
                  ${passed
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  {passed ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <h3 className="font-display font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                        Deal Closed Successfully!
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        You answered all {scenario.steps.length} rounds correctly
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <h3 className="font-display font-bold text-red-500 text-lg">
                        Negotiation Failed
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {wrongCount} wrong answer{wrongCount > 1 ? "s" : ""} out of {scenario.steps.length} rounds
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Outro dialogue */}
              {(passed ? scenario.successOutro : scenario.failureOutro).map((line, i) => (
                <SpeechBubble key={`outro-${i}`} line={line} />
              ))}

              <div className="pt-2 animate-slide-up">
                <button
                  type="button"
                  onClick={handleFinish}
                  className={`w-full py-3 rounded-xl font-display font-bold text-sm
                    active:scale-[0.98] transition-all flex items-center justify-center gap-2
                    ${passed
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                >
                  {passed ? "Continue — Deal Closed!" : "Try Again"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
