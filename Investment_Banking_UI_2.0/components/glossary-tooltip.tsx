"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"

interface GlossaryTooltipProps {
  term: string
  definition: string
  children: ReactNode
}

export function GlossaryTooltip({ term, definition, children }: GlossaryTooltipProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <span ref={ref} className="relative inline">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-primary font-semibold underline decoration-dotted underline-offset-2 cursor-pointer hover:text-primary/80 transition-colors"
        aria-label={`Definition of ${term}`}
      >
        {children}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-secondary border border-border p-3 shadow-lg shadow-background/40 animate-bounce-in z-50"
        >
          <span className="block text-xs font-display font-bold text-primary mb-1">
            {term}
          </span>
          <span className="block text-xs leading-relaxed text-foreground/80">
            {definition}
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-secondary" />
        </span>
      )}
    </span>
  )
}
