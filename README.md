# Herizon (illuminate-her)

Herizon is a voice-led, interactive web app that gives girls a first real glimpse into male-dominated industries through short simulations, real women’s stories, and clear next steps.

We are not building a full course. We are building a spark.

---

## Table of contents

- [What it is](#what-it-is)
- [Problem](#problem)
- [Solution](#solution)
- [What you can do in the app](#what-you-can-do-in-the-app)
- [How the experience works](#how-the-experience-works)
- [Tech stack](#tech-stack)
- [Architecture and code structure](#architecture-and-code-structure)
- [Gemini and ElevenLabs](#gemini-and-elevenlabs)
- [Data and analytics](#data-and-analytics)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Development conventions](#development-conventions)
- [Safety and attribution](#safety-and-attribution)
- [Roadmap](#roadmap)

---

## What it is

Herizon is a set of “career exhibits” designed for middle school and high school girls. Each exhibit is a 5 to 7 minute guided experience. Users learn by doing, not by reading a long lesson.

We target three industries for the hackathon:
- Music production
- Automotive (motorsport engineering)
- Finance (investment banking and deal making)

The product is designed to scale to many more fields using the same structure.

---

## Problem

A lot of girls never get a safe first try in certain fields. The “this isn’t for me” feeling shows up early, especially in industries that have been culturally framed as male. That barrier is not only technical, it is social and psychological.

---

## Solution

Herizon reduces the barrier to entry by giving users:
- a low-pressure first attempt through simulation
- supportive guidance through a voice mentor
- real women’s experiences embedded in the flow
- a concrete next-step roadmap after every exhibit

We focus on confidence, clarity, and momentum.

---

## What you can do in the app

Each exhibit includes:
- A short intro and what the job actually looks like
- A hands-on simulation (you create something or make decisions)
- Women spotlights inside the experience (pioneers and everyday professionals)
- A “What you learned” summary
- A next-step roadmap (tools, resources, communities, opportunities)
- A “Letter to Future Me” reflection you can save

---

## How the experience works

We use one consistent learning loop across all exhibits:

1) **Hook**
   - The mentor voice welcomes the user and explains the goal.

2) **Do**
   - The user interacts with the simulation (not slides).

3) **Learn at the moment**
   - Micro-lessons appear only when they matter (contextual learning).

4) **Story reinforcement**
   - Short women spotlight moments are inserted in the flow to reinforce belonging and inspiration.

5) **Finish with action**
   - The roadmap turns curiosity into next steps the user can actually do.

This is how we keep the experience immersive and effective.

---

## Exhibits

### 1) Music Lab
**Goal:** Make a beat that feels confident.

Core features:
- Step sequencer grid (Kick, Snare, Hi Hat, Clap)
- 8 or 16 steps
- Tempo control, Play/Stop
- Effects toggles (Reverb, Echo, optional Distortion)
- Simple challenges that teach structure through action

What the user learns:
- basic rhythm structure
- what drum parts do in a beat
- how simple effects change a sound

---

### 2) Pit Stop Lab (Automotive)
**Goal:** Engineer a race strategy.

Core features:
- Live telemetry dashboard
  - speed
  - control
  - tire wear
  - engine health
  - lap time prediction
- Pit stop choices
  - tires (traction)
  - frame or aero (control vs speed)
  - fuel or engine (performance vs reliability)
- Micro-lessons triggered by thresholds (tire wear high, fuel low, engine health dropping)

What the user learns:
- tradeoffs are the job
- reliability matters as much as speed
- decisions have consequences

---

### 3) Deal Room Lab (Finance)
**Goal:** Build a simple deal and learn negotiation tradeoffs.

Core features:
- Interactive scenario choices (equity vs debt, valuation ranges, risk tradeoffs)
- Glossary tooltips for terms
- Story-based learning, not a textbook

What the user learns:
- risk vs control is a real trade
- finance is communication plus structure
- decision-making is the skill

---

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **State:** Zustand
- **Database:** MongoDB (optional, mock fallback supported)
- **AI:** Google Gemini
- **Voice:** ElevenLabs
- **3D/Visualization:** Cobe, OGL
- **Analytics:** Snowflake + SQL

---

## Architecture and code structure

Typical structure:

- `app/`
  - routes for landing, exhibits, and roadmap
  - `api/` routes for narration, analytics, and badges
- `components/ui/`
  - reusable UI primitives
- `components/`
  - app-specific components (mentor dock, story inserts, exhibit shells)
- `lib/`
  - service clients and utilities (Gemini, ElevenLabs, MongoDB, Snowflake)
- `store/`
  - Zustand stores (user settings, progress, analytics buffer)
- `types/`
  - shared TypeScript types for events, scripts, and content

---

## Gemini and ElevenLabs

We built Herizon around a mentor that adapts in real time.

### Gemini
Gemini is the brain. We send it structured context such as:
- which exhibit the user is in
- what step they are on
- what they just did
- whether they seem stuck (time on step, repeated actions, help requests)

Gemini returns short, beginner-friendly guidance:
- one simple explanation
- the next action to try
- a supportive line to keep the user moving
- a personalized roadmap summary at the end

### ElevenLabs
ElevenLabs is the voice. We convert Gemini’s guidance into spoken narration with the right tone (calm, hype, direct).
We keep lines short for low latency and always provide:
- captions
- mute
- text-only mode

We also use ElevenLabs for short women spotlight moments. We do not imitate or clone anyone’s exact voice. We use original voices to narrate stories and include attribution.

### Event-driven narration
The UI triggers voice only when it matters:
- enter exhibit
- decision points (pit stop, deal choice, effects toggle)
- learning moments (tire wear high, tempo change, risk spike)
- stuck moments (Gemini simplifies the hint, ElevenLabs speaks it)
- finish (Gemini generates roadmap summary, ElevenLabs reads it)

---

## Data and analytics

### MongoDB (product memory)
We store:
- user settings (mentor vibe, captions, voice mode)
- progress and completion
- user choices and outcomes
- saved reflections (“Letter to Future Me”)
- saved artifacts (beat pattern, strategy, deal choices)

### Snowflake + SQL (aggregated learning analytics)
We store aggregated usage patterns to improve the product:
- which exhibits are most chosen
- completion rates
- drop-off points and confusion points
- how often hints are used
- how long steps take

We use SQL queries to find what to improve and then tune:
- mentor timing
- micro-lessons
- Gemini prompts
- roadmap templates

---

## Getting started

### Prerequisites
- Node.js v18+
- npm

### Install dependencies
```bash
npm install
