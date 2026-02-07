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
    label: "The Intern",
    type: "character",
    description:
      "You meet Alex, a summer intern at JPMorgan Chase. They offer to show you the trading floor.",
    choices: [
      { label: "Follow Alex", outcome: "You gain insight into daily trading operations." },
      { label: "Explore alone", outcome: "You discover the research department." },
      { label: "Ask about IPOs", outcome: "Alex explains how companies go public." },
    ],
    glossaryTerms: [
      { term: "IPO", definition: "Initial Public Offering: when a company first sells shares to the public." },
      { term: "trading floor", definition: "The area of a bank where traders buy and sell securities." },
    ],
  },
  {
    id: 2,
    label: "JPMorgan Chase",
    type: "building",
    companyName: "JPMorgan Chase",
    description:
      "The massive headquarters of the largest bank in the US. A bell rings to signal the market open.",
    choices: [
      { label: "Watch the bell", outcome: "You learn about market opening rituals." },
      { label: "Check the ticker", outcome: "You see live stock prices scrolling by." },
    ],
    glossaryTerms: [
      { term: "NYSE", definition: "New York Stock Exchange: the largest stock exchange in the world." },
      { term: "ticker", definition: "A scrolling display of stock symbols and their current prices." },
    ],
  },
  {
    id: 3,
    label: "Market Crash!",
    type: "event",
    description:
      "Breaking news: the market just dropped 5%. Everyone is scrambling. What do you do?",
    choices: [
      { label: "Stay calm", outcome: "You learn that patience is key in volatile markets." },
      { label: "Buy the dip", outcome: "You discover the concept of value investing." },
      { label: "Sell everything", outcome: "You learn the dangers of panic selling." },
    ],
    glossaryTerms: [
      { term: "market crash", definition: "A sudden, significant decline in stock prices across the market." },
      { term: "buy the dip", definition: "Purchasing assets after a price decline, expecting a rebound." },
    ],
  },
  {
    id: 4,
    label: "The Analyst",
    type: "character",
    description:
      "You meet Maya, a junior analyst pulling an all-nighter on a pitch book for a big deal.",
    choices: [
      { label: "Help with research", outcome: "You learn to analyze company financials." },
      { label: "Ask about the deal", outcome: "Maya explains mergers and acquisitions." },
    ],
    glossaryTerms: [
      { term: "pitch book", definition: "A presentation deck used by banks to win deals from clients." },
      { term: "M&A", definition: "Mergers & Acquisitions: buying, selling, or combining companies." },
    ],
  },
  {
    id: 5,
    label: "Goldman Sachs",
    type: "building",
    companyName: "Goldman Sachs",
    description:
      "You stand before one of Wall Street's most famous firms. A recruiter offers you a tour.",
    choices: [
      { label: "Take the tour", outcome: "You see how a major bank operates day-to-day." },
      { label: "Ask about careers", outcome: "You learn about different banking divisions." },
      { label: "Check the lobby", outcome: "You notice impressive deal tombstones on display." },
    ],
    glossaryTerms: [
      { term: "tombstone", definition: "A small plaque or deal memento commemorating a completed financial transaction." },
    ],
  },
  {
    id: 6,
    label: "Bonus Day!",
    type: "event",
    description:
      "It's year-end bonus season! Bankers are celebrating. You discover how compensation works.",
    choices: [
      { label: "Learn about pay", outcome: "You understand base salary vs. bonus structures." },
      { label: "Ask about hours", outcome: "You learn about the demanding work-life balance." },
    ],
    glossaryTerms: [
      { term: "bonus", definition: "Extra compensation paid based on performance, common in finance." },
    ],
  },
  {
    id: 7,
    label: "The MD",
    type: "character",
    description:
      "A Managing Director invites you to sit in on a client call. This is a rare opportunity.",
    choices: [
      { label: "Join the call", outcome: "You see how senior bankers negotiate with CEOs." },
      { label: "Take notes", outcome: "You learn how deals are structured from the top." },
      { label: "Ask for advice", outcome: "The MD shares their career journey with you." },
    ],
    glossaryTerms: [
      { term: "MD", definition: "Managing Director: the most senior banker who leads deals and client relationships." },
    ],
  },
  {
    id: 8,
    label: "Citigroup Center",
    type: "building",
    companyName: "Citigroup",
    description:
      "The Citigroup building. Interest rate decisions are shaping the economy.",
    choices: [
      { label: "Study rates", outcome: "You learn how interest rates affect markets." },
      { label: "Check the vault", outcome: "You discover where gold reserves are stored." },
    ],
    glossaryTerms: [
      { term: "Fed", definition: "The Federal Reserve: the central bank that controls monetary policy in the US." },
      { term: "interest rate", definition: "The cost of borrowing money, set by central banks." },
    ],
  },
  {
    id: 9,
    label: "IPO Launch!",
    type: "event",
    description:
      "A hot tech company is going public today! The excitement is electric on the trading floor.",
    choices: [
      { label: "Watch the listing", outcome: "You see how IPO pricing works in real time." },
      { label: "Talk to investors", outcome: "You learn about institutional demand for new stocks." },
      { label: "Read the prospectus", outcome: "You discover what S-1 filings contain." },
    ],
    glossaryTerms: [
      { term: "prospectus", definition: "A legal document describing an investment offering to potential buyers." },
      { term: "S-1", definition: "The registration statement a company files with the SEC before going public." },
    ],
  },
  {
    id: 10,
    label: "The Trader",
    type: "character",
    description:
      "Rashid works the equity desk at Morgan Stanley, making split-second decisions. He challenges you to a mock trade.",
    choices: [
      { label: "Accept the trade", outcome: "You learn the basics of buying and selling stocks." },
      { label: "Watch first", outcome: "You observe how professional traders read the market." },
    ],
    glossaryTerms: [
      { term: "equity desk", definition: "The team responsible for buying and selling stocks at a bank." },
    ],
  },
  {
    id: 11,
    label: "Morgan Stanley HQ",
    type: "building",
    companyName: "Morgan Stanley",
    description:
      "You arrive at the Morgan Stanley headquarters. This is the heart of global finance.",
    choices: [
      { label: "Take a photo", outcome: "You capture a moment at the center of the financial world." },
      { label: "Reflect on the journey", outcome: "You think about everything you've learned." },
      { label: "Plan next steps", outcome: "You start mapping your future career in finance." },
    ],
  },
  {
    id: 12,
    label: "Deal Closed!",
    type: "event",
    description:
      "Congratulations! Your team just closed a $2B merger. You helped make it happen!",
    choices: [
      { label: "Celebrate!", outcome: "You've completed the Wall Street Walk. Well done!" },
      { label: "Review the deal", outcome: "You analyze how the merger was structured." },
    ],
    glossaryTerms: [
      { term: "merger", definition: "When two companies combine to form one larger company." },
    ],
  },
]
