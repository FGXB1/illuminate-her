export type NodeType = "character" | "building" | "event"

export interface GameNode {
  id: number
  label: string
  type: NodeType
  description: string
  choices: { label: string; outcome: string }[]
  glossaryTerms?: { term: string; definition: string }[]
  companyName?: string // For Gemini API lookup
}

export const gameNodes: GameNode[] = [
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
        definition:
          "Mergers & Acquisitions: the process of buying, selling, or combining companies.",
      },
      {
        term: "SaaS",
        definition:
          "Software as a Service: a business model where software is delivered via subscription over the internet.",
      },
      {
        term: "SEC filings",
        definition:
          "Documents companies must submit to the Securities and Exchange Commission, including financial statements and disclosures.",
      },
    ],
  },
  {
    id: 2,
    label: "JPMorgan Chase",
    type: "building",
    companyName: "JPMorgan Chase",
    description:
      "Back at JPMorgan headquarters, your Managing Director calls a deal team meeting. Before you can pitch Priya for the engagement, the team needs a pitch book that proves JPMorgan is the right advisor. Three other banks are competing for this mandate.",
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
        definition:
          "A presentation deck used by investment banks to win advisory mandates from clients.",
      },
      {
        term: "CIM",
        definition:
          "Confidential Information Memorandum: a detailed document shared with potential buyers describing the target company.",
      },
      {
        term: "mandate",
        definition:
          "A formal agreement authorizing an investment bank to act as advisor on a deal.",
      },
    ],
  },
  {
    id: 3,
    label: "The Pitch",
    type: "event",
    description:
      "Your team presents the pitch book to Priya and her board of directors. The room is tense — Goldman Sachs pitched yesterday, and Morgan Stanley is presenting tomorrow. You need to demonstrate why JPMorgan should advise this deal.",
    choices: [
      {
        label: "Present JPMorgan's track record closing 15 tech M&A deals above market multiples",
        outcome:
          "The board is impressed by your sector expertise. Priya's CFO notes that your recent $3B SaaS acquisition had a very similar profile to NovaTech — a strong reference point.",
      },
      {
        label: "Walk through a curated list of 30 strategic and financial buyers",
        outcome:
          "Your targeted buyer list shows deep market knowledge — you've mapped each buyer's strategic rationale and ability to pay. Priya signs the engagement letter on the spot.",
      },
      {
        label: "Propose a dual-track process: private sale alongside a potential IPO",
        outcome:
          "The dual-track strategy gives Priya maximum optionality. If private buyers undervalue NovaTech, the IPO path creates a credible alternative. The board appreciates the leverage this creates.",
      },
    ],
    glossaryTerms: [
      {
        term: "engagement letter",
        definition:
          "A legal contract between a company and its investment bank advisor, defining the scope and fees for the deal.",
      },
      {
        term: "dual-track",
        definition:
          "Running a private sale process and IPO preparation simultaneously to maximize the seller's outcome.",
      },
      {
        term: "IPO",
        definition:
          "Initial Public Offering: when a private company first sells shares to the public on a stock exchange.",
      },
    ],
  },
  {
    id: 4,
    label: "The Analyst",
    type: "character",
    description:
      "Maya, a second-year analyst on your team, has been building the NovaTech valuation model all week. The numbers need to be airtight before you present them to potential buyers. She walks you through three different valuation approaches to triangulate a fair price.",
    choices: [
      {
        label: "Run a Discounted Cash Flow analysis using WACC",
        outcome:
          "Maya walks you through the DCF: unlevered free cash flows discounted at a 10.5% WACC yield an enterprise value of $5.2B. You stress-test the terminal growth rate from 2% to 4% — the range holds between $4.8B and $5.6B.",
      },
      {
        label: "Analyze comparable public company trading multiples",
        outcome:
          "You pull EV/Revenue and EV/EBITDA multiples for 12 public SaaS peers. The median EV/Revenue of 10x suggests NovaTech is worth $5B, with high-growth comps pushing toward $5.5B.",
      },
      {
        label: "Review precedent transaction premiums in recent tech acquisitions",
        outcome:
          "Recent acquisitions paid 25–40% control premiums over trading prices. Applied to NovaTech's metrics, precedent transactions support a valuation above $5B — consistent with your DCF.",
      },
    ],
    glossaryTerms: [
      {
        term: "DCF",
        definition:
          "Discounted Cash Flow: a valuation method that estimates value based on projected future cash flows, discounted to present value.",
      },
      {
        term: "WACC",
        definition:
          "Weighted Average Cost of Capital: the blended rate a company pays to finance its operations, used as the discount rate in DCF analysis.",
      },
      {
        term: "enterprise value",
        definition:
          "The total value of a company including equity and debt, minus cash — represents the price to acquire the entire business.",
      },
    ],
  },
  {
    id: 5,
    label: "Goldman Sachs",
    type: "building",
    companyName: "Goldman Sachs",
    description:
      "You learn that Goldman Sachs is advising Apex Technologies, a major tech conglomerate interested in acquiring NovaTech. Understanding the buyer's advisor and their strategy is critical. You visit Goldman's lobby — their deal tombstones line the walls.",
    choices: [
      {
        label: "Research Apex Technologies' acquisition history and integration track record",
        outcome:
          "You discover Apex has acquired 8 companies in 3 years but struggled with talent retention post-acquisition. This is a leverage point — Priya cares deeply about her team's future.",
      },
      {
        label: "Analyze Apex's balance sheet capacity and financing options",
        outcome:
          "Their $20B cash reserve and investment-grade credit rating mean they can fund an all-cash deal — very attractive to Priya's shareholders who want certainty of value.",
      },
      {
        label: "Prepare a competitive dynamics memo for your MD",
        outcome:
          "Your memo outlines how to use Apex's eagerness against them by highlighting competitive tension from two other interested buyers. Goldman will have to advise Apex to bid aggressively.",
      },
    ],
    glossaryTerms: [
      {
        term: "tombstone",
        definition:
          "A commemorative plaque or lucite block displaying the details of a completed financial transaction, displayed in bank offices.",
      },
      {
        term: "investment-grade",
        definition:
          "A credit rating (BBB- or higher) indicating low risk of default, allowing a company to borrow at lower interest rates.",
      },
    ],
  },
  {
    id: 6,
    label: "Due Diligence",
    type: "event",
    description:
      "Priya's legal team sets up the virtual data room. Five potential buyers have signed NDAs and are requesting access to NovaTech's confidential documents — financials, customer contracts, IP filings, and employee data. You need to manage information flow carefully.",
    choices: [
      {
        label: "Organize the data room with tiered access levels for each buyer",
        outcome:
          "You create three access tiers: preliminary (market data and overview), Phase 1 (detailed financials and metrics), and Phase 2 (contracts, IP, and employment agreements). This controls the flow of sensitive information and lets you gauge buyer seriousness.",
      },
      {
        label: "Flag and address NovaTech's customer concentration risk before buyers find it",
        outcome:
          "You discover 30% of revenue comes from just two enterprise clients. Working with Priya, you prepare a mitigation narrative: a growing pipeline of 15 new contracts and a diversification strategy already underway. Buyers appreciate the transparency.",
      },
    ],
    glossaryTerms: [
      {
        term: "due diligence",
        definition:
          "The investigation and analysis process buyers conduct to verify a target company's financials, operations, and risks before completing an acquisition.",
      },
      {
        term: "NDA",
        definition:
          "Non-Disclosure Agreement: a legal contract preventing buyers from sharing confidential information about the target company.",
      },
      {
        term: "data room",
        definition:
          "A secure virtual repository where confidential company documents are shared with potential buyers during an M&A process.",
      },
    ],
  },
  {
    id: 7,
    label: "The MD",
    type: "character",
    description:
      "Your Managing Director — a 20-year M&A veteran — calls you into her office. Three buyers have submitted initial indications of interest ranging from $4.5B to $5.8B. It's time to set the strategy for the final round. Every decision here directly impacts what Priya's shareholders receive.",
    choices: [
      {
        label: "Recommend inviting all three buyers to the final round to maximize competitive tension",
        outcome:
          "The MD agrees — competitive tension is your strongest negotiating tool. You send process letters with a 3-week deadline for final binding bids, signaling urgency and seriousness.",
      },
      {
        label: "Suggest narrowing to the top two bidders to run a tighter process",
        outcome:
          "A focused process reduces management burden on Priya's team. The two remaining buyers, knowing competition is real but limited, sharpen their offers and accelerate diligence.",
      },
      {
        label: "Propose setting a $5B reserve price based on your valuation floor",
        outcome:
          "Setting a reserve ensures Priya won't accept a below-value deal. The MD approves — you communicate the expectation to bidders through carefully worded process letters.",
      },
    ],
    glossaryTerms: [
      {
        term: "indications of interest",
        definition:
          "Non-binding preliminary offers from potential buyers, stating the price range and key terms they'd consider for the acquisition.",
      },
      {
        term: "process letter",
        definition:
          "A formal letter sent to bidders outlining the timeline, bid requirements, and rules for the final round of an M&A auction.",
      },
    ],
  },
  {
    id: 8,
    label: "Citigroup Center",
    type: "building",
    companyName: "Citigroup",
    description:
      "You host management presentations at Citigroup's conference center. Priya presents NovaTech's 5-year vision to the two finalist buyers. Each buyer's team — bankers, lawyers, and operating partners — asks probing questions about growth, margins, and competitive positioning.",
    choices: [
      {
        label: "Coach Priya on anticipated buyer questions about churn and net retention",
        outcome:
          "Priya confidently presents the data: 95% gross retention and 120% net dollar retention. She explains the land-and-expand model with real customer case studies. Both buyers' teams are visibly impressed.",
      },
      {
        label: "Prepare a 50-question Q&A document covering every potential buyer concern",
        outcome:
          "Your thorough preparation pays off — Priya handles every question smoothly, from technology architecture to regulatory compliance. Post-meeting feedback from both buyers is overwhelmingly positive.",
      },
    ],
    glossaryTerms: [
      {
        term: "management presentation",
        definition:
          "A formal meeting where the target company's leadership presents the business directly to potential buyers, typically a critical step in the M&A process.",
      },
      {
        term: "net dollar retention",
        definition:
          "A SaaS metric measuring revenue kept from existing customers including upsells — above 100% means customers spend more over time.",
      },
    ],
  },
  {
    id: 9,
    label: "The Bidding War",
    type: "event",
    description:
      "Both finalist buyers submit binding offers. Apex Technologies offers $5.4B in all cash. Meridian Partners offers $5.7B in a cash-and-stock mix with a 90-day lockup on the stock. Each offer has different regulatory risk, closing timelines, and conditions. Priya needs your recommendation.",
    choices: [
      {
        label: "Build a bid comparison matrix weighing price, certainty, and closing risk",
        outcome:
          "Your matrix reveals that Apex's all-cash offer has fewer closing risks — no stock price volatility, no lockup period, and near-certain regulatory approval. The lower headline number may actually deliver more value.",
      },
      {
        label: "Analyze the stock component risk in Meridian's blended offer",
        outcome:
          "Meridian's stock has traded in a 20% range over the past 6 months. With a 90-day lockup, you calculate the stock could be worth 10–15% less by the time Priya's shareholders can sell, narrowing the real gap to under $100M.",
      },
      {
        label: "Use Meridian's higher bid as leverage to negotiate Apex's price up",
        outcome:
          "You counter Apex at $5.6B, citing competitive pressure. After 48 hours of back-and-forth negotiation, Apex agrees to $5.55B all-cash with an accelerated 45-day closing timeline. Priya is thrilled.",
      },
    ],
    glossaryTerms: [
      {
        term: "binding offer",
        definition:
          "A formal bid that legally commits the buyer to the stated price and terms, subject only to specified closing conditions.",
      },
      {
        term: "lockup",
        definition:
          "A period after a deal closes during which shareholders cannot sell their stock, exposing them to price fluctuation risk.",
      },
    ],
  },
  {
    id: 10,
    label: "The Trader",
    type: "character",
    description:
      "Rashid on JPMorgan's leveraged finance desk is structuring the debt package for Apex's acquisition. Apex needs to raise $3B in new debt to fund part of the $5.55B purchase price. Market conditions and credit spreads will determine whether the financing holds together.",
    choices: [
      {
        label: "Review Apex's debt capacity and post-acquisition leverage ratios",
        outcome:
          "Rashid shows you the numbers: Apex's current 1.5x Net Debt/EBITDA leaves substantial headroom. Even with $3B in new debt, they stay at 3.2x — comfortably within investment-grade territory. The banks will underwrite this.",
      },
      {
        label: "Analyze current credit market conditions for the debt financing",
        outcome:
          "Credit spreads are tight at 350 basis points and the high-yield market is strong. Rashid confirms that three banks are competing to underwrite the debt package — the financing commitment letter is rock-solid. No financing risk.",
      },
    ],
    glossaryTerms: [
      {
        term: "leveraged finance",
        definition:
          "The division of a bank that arranges debt (loans and bonds) used to fund acquisitions and other large transactions.",
      },
      {
        term: "credit spreads",
        definition:
          "The difference in yield between corporate bonds and risk-free government bonds — wider spreads mean higher borrowing costs.",
      },
      {
        term: "basis points",
        definition:
          "A unit of measure equal to 1/100th of a percentage point. 350 basis points = 3.50%.",
      },
    ],
  },
  {
    id: 11,
    label: "Morgan Stanley HQ",
    type: "building",
    companyName: "Morgan Stanley",
    description:
      "The definitive purchase agreement is being negotiated in Morgan Stanley's conference rooms. Lawyers from both sides have been marking up the 200-page document for a week. Three critical terms remain unresolved: the MAC clause, indemnification caps, and employee retention provisions.",
    choices: [
      {
        label: "Negotiate the Material Adverse Change clause to protect Priya",
        outcome:
          "You push to narrow the MAC clause, carving out general market downturns, industry-wide changes, and pandemic impacts. Apex can't walk away unless something specific to NovaTech goes wrong. This is a major win for the sell-side.",
      },
      {
        label: "Structure rep and warranty insurance to limit Priya's indemnification exposure",
        outcome:
          "R&W insurance shifts post-closing indemnification risk to a third-party insurer. Priya's personal exposure drops from $500M to a $50M deductible — she can walk away clean after the deal closes.",
      },
      {
        label: "Ensure employee retention packages match Priya's commitment to her team",
        outcome:
          "You negotiate 2-year retention packages for NovaTech's top 50 engineers with guaranteed bonuses and accelerated equity vesting. Priya is satisfied her team is protected — this was her most important condition from Day 1.",
      },
    ],
    glossaryTerms: [
      {
        term: "MAC clause",
        definition:
          "Material Adverse Change: a contract provision allowing a buyer to walk away if something significantly harms the target company before the deal closes.",
      },
      {
        term: "indemnification",
        definition:
          "A contractual obligation to compensate the other party for losses arising from breaches of representations made in the purchase agreement.",
      },
      {
        term: "definitive agreement",
        definition:
          "The final, binding legal contract that sets all the terms of the acquisition — once signed, both parties are committed to close.",
      },
    ],
  },
  {
    id: 12,
    label: "Deal Closed!",
    type: "event",
    description:
      "After four months of intense work, both parties sign the definitive agreement. Priya rings the ceremonial bell at JPMorgan as $5.55 billion is wired to NovaTech's shareholders. Your team earns a $27.75M advisory fee. Priya shakes your hand — her team is protected, her shareholders are rewarded, and NovaTech's technology will reach millions more users under Apex.",
    choices: [
      {
        label: "Unveil the deal tombstone for your team's collection",
        outcome:
          "The lucite tombstone reads: 'NovaTech, Inc. — Acquisition by Apex Technologies — $5.55 Billion. Financial Advisor: JPMorgan Chase.' Your first major deal, memorialized forever on your desk.",
      },
      {
        label: "Debrief with the team on what you learned from this deal",
        outcome:
          "You reflect on every step: winning the mandate, building the model, managing the data room, negotiating the final terms. Each decision shaped the outcome. Priya sends a thank-you note — you helped her achieve everything she wanted. You've completed your first Wall Street deal.",
      },
    ],
    glossaryTerms: [
      {
        term: "advisory fee",
        definition:
          "The compensation an investment bank earns for advising on a deal, typically calculated as a percentage of the transaction value (usually 0.5–1% on large deals).",
      },
      {
        term: "tombstone",
        definition:
          "A commemorative lucite block displaying the details of a completed deal — a badge of honor on every banker's desk.",
      },
    ],
  },
]
