export type NodeType = "character" | "building" | "event" | "negotiation"

export interface GameNode {
  id: number
  label: string
  type: NodeType
  description: string
  choices: { label: string; outcome: string }[]
  glossaryTerms?: { term: string; definition: string }[]
  companyName?: string // For Gemini API lookup
}

export interface GameScenario {
  id: string
  name: string
  description: string
  nodes: GameNode[]
  negotiationId: string // ID in negotiation-data.ts
}

// ==========================================
// SCENARIO 1: TECH M&A (NovaTech)
// ==========================================
const techNodes: GameNode[] = [
  {
    id: 1,
    label: "The Client",
    type: "character",
    description:
      "Priya Sharma, CEO of NovaTech — a $500M revenue AI-powered SaaS company — reaches out to your team at JPMorgan Chase. After 8 years of building the company, she's considering a sale and wants to understand her options. This is your first live M&A engagement.",
    choices: [
      {
        label: "Review NovaTech's public financials and recent SEC filings",
        outcome:
          "You pull NovaTech's 10-K and discover 40% year-over-year revenue growth with 25% EBITDA margins — a compelling profile that will attract serious acquirers.",
      },
      {
        label: "Ask Priya about her strategic goals for the sale",
        outcome:
          "Priya reveals she wants a buyer who will retain the engineering team and invest in R&D. This shapes your entire buyer outreach strategy and narrows your target list.",
      },
      {
        label: "Research comparable M&A transactions in the SaaS sector",
        outcome:
          "You identify three recent SaaS acquisitions completed at 8–12x revenue multiples, giving you a preliminary valuation range of $4B–$6B for NovaTech.",
      },
    ],
    glossaryTerms: [
      {
        term: "M&A",
        definition: "Mergers & Acquisitions: the process of buying, selling, or combining companies.",
      },
      {
        term: "SaaS",
        definition: "Software as a Service: a business model where software is delivered via subscription over the internet.",
      },
    ],
  },
  {
    id: 2,
    label: "JPMorgan Chase",
    type: "building",
    companyName: "JPMorgan Chase",
    description:
      "Back at JPMorgan headquarters, your Managing Director calls a deal team meeting. Before you can pitch Priya for the engagement, the team needs a pitch book that proves JPMorgan is the right advisor.",
    choices: [
      {
        label: "Draft the Confidential Information Memorandum outline",
        outcome:
          "You structure the CIM to highlight NovaTech's AI moat, recurring revenue model, and international expansion roadmap — the key selling points that will get buyers excited.",
      },
      {
        label: "Build a preliminary financial model with 3-year projections",
        outcome:
          "Using NovaTech's historicals, you project $800M revenue by Year 3 under conservative assumptions. The model strengthens the valuation story and gives Priya confidence in your analysis.",
      },
    ],
    glossaryTerms: [
      {
        term: "pitch book",
        definition: "A presentation deck used by investment banks to win advisory mandates from clients.",
      },
      {
        term: "CIM",
        definition: "Confidential Information Memorandum: a detailed document shared with potential buyers describing the target company.",
      },
    ],
  },
  {
    id: 3,
    label: "The Pitch",
    type: "event",
    description:
      "Your team presents the pitch book to Priya and her board. The room is tense. You need to demonstrate why JPMorgan should advise this deal.",
    choices: [
      {
        label: "Present JPMorgan's track record closing 15 tech M&A deals above market multiples",
        outcome:
          "The board is impressed by your sector expertise. Priya's CFO notes that your recent $3B SaaS acquisition had a very similar profile to NovaTech.",
      },
      {
        label: "Walk through a curated list of 30 strategic and financial buyers",
        outcome:
          "Your targeted buyer list shows deep market knowledge. Priya signs the engagement letter on the spot.",
      },
    ],
    glossaryTerms: [
      {
        term: "engagement letter",
        definition: "A legal contract between a company and its investment bank advisor, defining the scope and fees for the deal.",
      },
    ],
  },
  {
    id: 4,
    label: "The Analyst",
    type: "character",
    description:
      "Maya, a second-year analyst, has been building the NovaTech valuation model. The numbers need to be airtight before you present them to potential buyers.",
    choices: [
      {
        label: "Run a Discounted Cash Flow analysis using WACC",
        outcome:
          "Maya walks you through the DCF: unlevered free cash flows discounted at a 10.5% WACC yield an enterprise value of $5.2B.",
      },
      {
        label: "Analyze comparable public company trading multiples",
        outcome:
          "The median EV/Revenue of 10x suggests NovaTech is worth $5B, with high-growth comps pushing toward $5.5B.",
      },
    ],
    glossaryTerms: [
      {
        term: "DCF",
        definition: "Discounted Cash Flow: a valuation method that estimates value based on projected future cash flows.",
      },
      {
        term: "enterprise value",
        definition: "The total value of a company including equity and debt, minus cash.",
      },
    ],
  },
  {
    id: 5,
    label: "Goldman Sachs",
    type: "building",
    companyName: "Goldman Sachs",
    description:
      "You learn that Goldman Sachs is advising Apex Technologies, a major tech conglomerate interested in acquiring NovaTech. You need to understand the buyer's strategy.",
    choices: [
      {
        label: "Research Apex Technologies' acquisition history",
        outcome:
          "You discover Apex has acquired 8 companies in 3 years. They are aggressive but have struggled with integration.",
      },
      {
        label: "Analyze Apex's balance sheet capacity",
        outcome:
          "Their $20B cash reserve means they can fund an all-cash deal — very attractive to Priya.",
      },
    ],
    glossaryTerms: [
      {
        term: "balance sheet",
        definition: "A financial statement that reports a company's assets, liabilities, and shareholders' equity.",
      },
    ],
  },
  {
    id: 6,
    label: "The Negotiation",
    type: "negotiation",
    description:
      "It's time for the final negotiation. Apex Technologies has submitted a bid, but it's lower than expected. Your mentor Victoria Chen is by your side.",
    choices: [],
    glossaryTerms: [
      {
        term: "negotiation",
        definition: "The process of discussion and compromise to reach an agreement.",
      },
    ],
  },
  {
    id: 7,
    label: "Deal Closed!",
    type: "event",
    description:
      "After intense negotiation, the deal is signed. Priya rings the ceremonial bell at JPMorgan. Your team earns a significant advisory fee.",
    choices: [
      {
        label: "Unveil the deal tombstone",
        outcome:
          "The lucite tombstone reads: 'NovaTech, Inc. — Acquisition by Apex Technologies — $5.55 Billion'. Your first major deal.",
      },
      {
        label: "Debrief with the team",
        outcome:
          "You reflect on every step. Priya sends a thank-you note — you helped her achieve her goals.",
      },
    ],
    glossaryTerms: [
      {
        term: "tombstone",
        definition: "A commemorative object displaying the details of a completed deal.",
      },
    ],
  },
]

// ==========================================
// SCENARIO 2: RETAIL RESTRUCTURING (FashionForward)
// ==========================================
const retailNodes: GameNode[] = [
  {
    id: 1,
    label: "The Client",
    type: "character",
    description:
      "Sarah Jenkins, CFO of FashionForward — a struggling nationwide apparel retailer — calls you. Sales are down 20%, and they have a $500M debt payment due in 6 months. They need to restructure to avoid bankruptcy.",
    choices: [
      {
        label: "Analyze the debt maturity profile",
        outcome:
          "You see a 'maturity wall' approaching. Most of their debt is held by aggressive hedge funds.",
      },
      {
        label: "Review store performance data",
        outcome:
          "You identify 50 underperforming stores that are bleeding cash. Closing them could save $50M annually.",
      },
      {
        label: "Assess liquidity position",
        outcome:
          "They only have 3 months of cash left at the current burn rate. Time is critical.",
      },
    ],
    glossaryTerms: [
      {
        term: "restructuring",
        definition: "Reorganizing a company's legal, ownership, or operational structure to make it more profitable or better organized.",
      },
      {
        term: "liquidity",
        definition: "The availability of liquid assets (cash) to a market or company.",
      },
    ],
  },
  {
    id: 2,
    label: "Citigroup Center",
    type: "building",
    companyName: "Citigroup",
    description:
      "You meet with the creditor committee at Citigroup. These are the hedge funds holding FashionForward's debt. They are angry and threatening to force a liquidation.",
    choices: [
      {
        label: "Propose a debt-for-equity swap",
        outcome:
          "You suggest creditors trade their debt for ownership stakes. They are skeptical but listening.",
      },
      {
        label: "Request a forbearance agreement",
        outcome:
          "You ask for a temporary halt to debt payments to give the company time to turn around.",
      },
    ],
    glossaryTerms: [
      {
        term: "debt-for-equity swap",
        definition: "A transaction in which the obligations to a creditor are cancelled in exchange for equity in the debtor.",
      },
      {
        term: "forbearance",
        definition: "A temporary postponement of mortgage payments granted by the lender.",
      },
    ],
  },
  {
    id: 3,
    label: "The Plan",
    type: "event",
    description:
      "Back at the office, you draft the restructuring plan. It involves closing stores, cutting costs, and refinancing the remaining debt. You need the Board's approval.",
    choices: [
      {
        label: "Present the 'Good Bank / Bad Bank' strategy",
        outcome:
          "Separate the healthy assets from the toxic ones. The Board approves the aggressive approach.",
      },
      {
        label: "Focus on digital transformation investment",
        outcome:
          "Argue that cutting costs isn't enough; they need to grow online. The Board is hesitant about the upfront cost.",
      },
    ],
    glossaryTerms: [],
  },
  {
    id: 4,
    label: "The Negotiation",
    type: "negotiation",
    description:
      "The lead creditor, 'Vulture Capital', is playing hardball. They want to take control of the company and fire the management team. You need to negotiate a deal that saves the company and protects the employees.",
    choices: [],
    glossaryTerms: [],
  },
  {
    id: 5,
    label: "Survival",
    type: "event",
    description:
      "The deal is struck. FashionForward enters Chapter 11 with a pre-packaged plan. It emerges 3 months later leaner, stronger, and solvent.",
    choices: [
      {
        label: "Announce the successful restructuring",
        outcome:
          "The stock price (of the new entity) jumps 15%. You saved 5,000 jobs.",
      },
      {
        label: "Coordinate with the legal team on filings",
        outcome:
          "The legal process was smooth thanks to your pre-negotiation. A textbook restructuring.",
      },
    ],
    glossaryTerms: [
      {
        term: "Chapter 11",
        definition: "A form of bankruptcy that involves a reorganization of a debtor's business affairs, debts, and assets.",
      },
    ],
  },
]

// ==========================================
// SCENARIO 3: ENERGY IPO (GreenPower)
// ==========================================
const energyNodes: GameNode[] = [
  {
    id: 1,
    label: "The Client",
    type: "character",
    description:
      "Elena Rodriguez, founder of GreenPower — a fast-growing solar battery manufacturer — wants to take her company public. The market for renewable energy is hot, but investors are wary of unproven technology.",
    choices: [
      {
        label: "Assess the company's growth story",
        outcome:
          "Revenue has tripled in 2 years. The growth curve is exponential, perfect for an IPO.",
      },
      {
        label: "Review the technology IP",
        outcome:
          "They hold 15 key patents. This provides a strong 'moat' against competitors.",
      },
    ],
    glossaryTerms: [
      {
        term: "IPO",
        definition: "Initial Public Offering: stock market launch of a private company.",
      },
      {
        term: "moat",
        definition: "A business's ability to maintain competitive advantages over its competitors.",
      },
    ],
  },
  {
    id: 2,
    label: "Morgan Stanley HQ",
    type: "building",
    companyName: "Morgan Stanley",
    description:
      "You are co-leading the syndicate with Morgan Stanley. You need to align on the valuation range before the roadshow.",
    choices: [
      {
        label: "Argue for a premium valuation based on ESG demand",
        outcome:
          "ESG funds are desperate for assets. You convince the syndicate to aim for the high end of the range.",
      },
      {
        label: "Suggest a conservative price to ensure a 'pop'",
        outcome:
          "Pricing lower ensures the stock rises on Day 1, generating positive buzz.",
      },
    ],
    glossaryTerms: [
      {
        term: "syndicate",
        definition: "A group of investment banks working together to underwrite a new security issue.",
      },
      {
        term: "ESG",
        definition: "Environmental, Social, and Governance criteria used by socially conscious investors.",
      },
    ],
  },
  {
    id: 3,
    label: "The Roadshow",
    type: "event",
    description:
      "You travel to 5 cities in 5 days, pitching GreenPower to institutional investors. The order book is building, but some big mutual funds are holding back.",
    choices: [
      {
        label: "Focus the pitch on the 10-year energy transition",
        outcome:
          "Investors buy into the long-term vision. The book is now 2x oversubscribed.",
      },
      {
        label: "Highlight the immediate profitability metrics",
        outcome:
          "Value investors get interested. You diversify the investor base.",
      },
    ],
    glossaryTerms: [
      {
        term: "roadshow",
        definition: "A series of presentations to potential investors to generate excitement for an IPO.",
      },
      {
        term: "oversubscribed",
        definition: "When demand for shares exceeds the number of shares available.",
      },
    ],
  },
  {
    id: 4,
    label: "The Negotiation",
    type: "negotiation",
    description:
      "It's the night before the IPO. The order book is full. You need to set the final price with Elena and the syndicate. The bankers want to price low to guarantee a jump; Elena wants to maximize cash raised.",
    choices: [],
    glossaryTerms: [],
  },
  {
    id: 5,
    label: "Opening Bell",
    type: "event",
    description:
      "GreenPower lists on the NYSE. Elena rings the bell. You watch the ticker start trading.",
    choices: [
      {
        label: "Monitor the stabilization agent",
        outcome:
          "The stock opens up 20%. A massive success. Elena is a billionaire on paper.",
      },
      {
        label: "Celebrate with the team",
        outcome:
          "You helped launch the next green energy giant. The fee pool is substantial.",
      },
    ],
    glossaryTerms: [
      {
        term: "ticker",
        definition: "A symbol used to uniquely identify publicly traded shares of a particular stock.",
      },
    ],
  },
]

export const gameScenarios: GameScenario[] = [
  {
    id: "tech-ma",
    name: "Tech M&A Deal",
    description: "Advise a hot AI startup on its sale to a tech giant.",
    nodes: techNodes,
    negotiationId: "apex-price",
  },
  {
    id: "retail-restructuring",
    name: "Retail Restructuring",
    description: "Save a failing fashion retailer from bankruptcy.",
    nodes: retailNodes,
    negotiationId: "retail-creditor",
  },
  {
    id: "energy-ipo",
    name: "Clean Energy IPO",
    description: "Take a solar battery company public.",
    nodes: energyNodes,
    negotiationId: "energy-ipo-price",
  },
]

// Default export for backward compatibility if needed, though we should switch to using scenarios
export const gameNodes = techNodes
