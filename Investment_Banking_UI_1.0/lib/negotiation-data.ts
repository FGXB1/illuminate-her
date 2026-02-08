export interface NegotiationLine {
  speaker: "client" | "guide" | "narrator"
  text: string
}

export interface NegotiationChoice {
  label: string
  isCorrect: boolean
  /** Feedback the guide gives after this choice */
  guideFeedback: string
}

export interface NegotiationStep {
  /** Dialogue lines shown before the player chooses */
  dialogue: NegotiationLine[]
  /** Player response options */
  choices: NegotiationChoice[]
}

export interface NegotiationScenario {
  id: string
  title: string
  /** Brief setup shown at the start */
  introduction: NegotiationLine[]
  steps: NegotiationStep[]
  /** Shown if the user passes (got all correct) */
  successOutro: NegotiationLine[]
  /** Shown if the user fails (got any wrong) */
  failureOutro: NegotiationLine[]
}

// ========================================
// Guide character definition
// ========================================
export const GUIDE_NAME = "Victoria Chen"
export const GUIDE_TITLE = "Senior VP, M&A Advisory"
export const GUIDE_BIO = "20-year Wall Street veteran who has closed over $50B in deals. She is your mentor for this simulation."

// ========================================
// 3 NEGOTIATION SCENARIOS
// ========================================

export const negotiationScenarios: NegotiationScenario[] = [
  // ---- SCENARIO 1: Price Negotiation with Apex Technologies (TECH M&A) ----
  {
    id: "apex-price",
    title: "The Apex Price Negotiation",
    introduction: [
      { speaker: "narrator", text: "Final negotiation meeting. Apex Technologies' CFO, Daniel Park, is across the table. He wants to close at a lower price. Your job: defend NovaTech's $5.5B valuation and close the deal." },
      { speaker: "guide", text: "Remember, Daniel will try to anchor low. Don't concede on price without getting something in return. Stay confident and use data to back every point." },
    ],
    steps: [
      {
        dialogue: [
          { speaker: "client", text: "Look, $5.5 billion is a stretch for us. Our board is comfortable at $4.8 billion. NovaTech is a great company, but the SaaS market is cooling and we see risks in your customer concentration." },
        ],
        choices: [
          {
            label: "I understand your concern. Let's meet in the middle at $5.15 billion.",
            isCorrect: false,
            guideFeedback: "Never split the difference this early. You just dropped $350M without getting anything in return. In negotiation, the first person to concede on price loses leverage. You should have countered his concerns with data first.",
          },
          {
            label: "Our DCF analysis, comparable multiples, and precedent transactions all support $5.5B. NovaTech's 40% revenue growth and 120% net retention are well above market. What specific risk justifies a $700M discount?",
            isCorrect: true,
            guideFeedback: "Excellent. You challenged his position with data and put the burden of proof back on him. Making the buyer justify their discount is a powerful technique.",
          },
          {
            label: "That's way too low. We have other buyers willing to pay more. Take it or leave it.",
            isCorrect: false,
            guideFeedback: "Being aggressive without substance is a fast way to blow up a deal. Even if you have other buyers, threatening to walk away this early in the conversation signals desperation, not strength. Let the data do the talking.",
          },
        ],
      },
      {
        dialogue: [
          { speaker: "client", text: "Fair point on the growth numbers. But 30% of revenue from two clients is a real concern. If either churns post-acquisition, we're looking at a significant revenue hit." },
        ],
        choices: [
          {
            label: "You're right, that is a risk. Maybe we should lower the price to account for it.",
            isCorrect: false,
            guideFeedback: "Never validate a buyer's concern by immediately offering a price reduction. You had a prepared mitigation narrative — a pipeline of 15 new contracts and a diversification strategy. You should have used it.",
          },
          {
            label: "We've already addressed this. NovaTech has 15 new enterprise contracts in the pipeline, and their diversification strategy is projected to reduce top-client concentration to 18% within 18 months. We can build this into a performance milestone.",
            isCorrect: true,
            guideFeedback: "Strong answer. You acknowledged the concern, provided concrete data to mitigate it, and offered a creative structure (performance milestone) that protects both sides. This builds trust while protecting value.",
          },
          {
            label: "Every SaaS company has customer concentration. That's just how the industry works.",
            isCorrect: false,
            guideFeedback: "Dismissing a legitimate concern makes the buyer feel unheard and erodes trust. Even if concentration is common in SaaS, you need to show why NovaTech's specific situation is manageable, not wave it off.",
          },
        ],
      },
      {
        dialogue: [
          { speaker: "client", text: "Alright, the pipeline data is helpful. But we still can't go above $5.2 billion. That's our final offer." },
        ],
        choices: [
          {
            label: "We appreciate your position. At $5.2B, we'd need the deal to be all-cash with no closing conditions beyond regulatory approval, and an accelerated 30-day close. Certainty of value and speed have real economic worth.",
            isCorrect: true,
            guideFeedback: "Brilliant negotiation. Instead of just fighting on price, you traded price concession for deal certainty — all-cash, clean close, fast timeline. Priya's shareholders get guaranteed value. You turned a price gap into a win-win structure.",
          },
          {
            label: "Fine, $5.2 billion works. Let's close this.",
            isCorrect: false,
            guideFeedback: "You just left hundreds of millions on the table. Even when accepting a lower price, you should negotiate for better terms — cash vs. stock, closing speed, fewer conditions, retention packages. Price is only one dimension of a deal.",
          },
          {
            label: "No deal. Meridian offered $5.7 billion and we're going with them.",
            isCorrect: false,
            guideFeedback: "Walking away from a serious buyer without counter-offering is poor form. Meridian's $5.7B includes risky stock with a lockup period — the real value might be lower than Apex's cash offer. A good banker explores all angles before walking.",
          },
        ],
      },
    ],
    successOutro: [
      { speaker: "narrator", text: "Daniel nods. 'All-cash, 30-day close, regulatory only. We can do that.' The deal closes at $5.2B all-cash — the certainty premium makes this equivalent to roughly $5.5B in a mixed deal." },
      { speaker: "guide", text: "Outstanding work. You held your ground with data, addressed concerns without giving up value, and creatively structured a deal that works for both sides. That's how deals get done on Wall Street." },
    ],
    failureOutro: [
      { speaker: "narrator", text: "The negotiation falls apart. Daniel leaves the table unconvinced, and Priya is disappointed with how the deal was handled." },
      { speaker: "guide", text: "This didn't go well. In M&A negotiation, every word matters. You need to back your position with data, never concede without getting something in return, and keep the relationship professional. Let's try another scenario." },
    ],
  },

  // ---- SCENARIO 2: Distressed Creditor Negotiation (RETAIL RESTRUCTURING) ----
  {
    id: "retail-creditor",
    title: "The Vulture Capital Showdown",
    introduction: [
      { speaker: "narrator", text: "You are meeting with 'The Wolf', a distressed debt investor who owns 40% of FashionForward's debt. He wants to force a liquidation to strip the assets. You need to convince him to agree to a debt-for-equity swap instead." },
      { speaker: "guide", text: "Distressed investors care about one thing: recovery value. Don't appeal to his emotions or the employees' jobs. Show him that he makes more money keeping the company alive than killing it." },
    ],
    steps: [
      {
        dialogue: [
          { speaker: "client", text: "Why should I accept equity in a dying retailer? I'd rather force a liquidation today and get 40 cents on the dollar. Cash is king." },
        ],
        choices: [
          {
            label: "But think of the 5,000 employees! If we liquidate, they lose everything.",
            isCorrect: false,
            guideFeedback: "This is a moral argument, not a financial one. Distressed investors often don't care about stakeholders. You need to show him the numbers.",
          },
          {
            label: "Our analysis shows liquidation value is actually 15 cents on the dollar after legal fees. But if you swap for equity, our conservative turnaround plan projects the equity value at 80 cents in 2 years. You'd be throwing away value by liquidating.",
            isCorrect: true,
            guideFeedback: "Perfect. You hit him with the cold hard math. Showing that liquidation yields less than he thinks is the only way to stop him.",
          },
          {
            label: "We can offer you a better interest rate if you extend the loan.",
            isCorrect: false,
            guideFeedback: "The company has no cash flow to pay interest. Extending the loan just delays the inevitable. A debt-for-equity swap is the only viable path.",
          },
        ],
      },
      {
        dialogue: [
          { speaker: "client", text: "Fine, the liquidation numbers are ugly. But I don't trust current management. They drove this bus off the cliff. I want them gone." },
        ],
        choices: [
          {
            label: "We agree. As part of the restructuring, we will bring in a Chief Restructuring Officer and replace the CEO. You will have 2 board seats to oversee the process.",
            isCorrect: true,
            guideFeedback: "Good move. You gave him control and accountability without giving up the whole company. This addresses his trust issue.",
          },
          {
            label: "Actually, Sarah is doing her best. She just needs more time.",
            isCorrect: false,
            guideFeedback: "Defending failing management to an angry creditor is a losing battle. You need to show that things will change.",
          },
        ],
      },
    ],
    successOutro: [
      { speaker: "narrator", text: "The Wolf grunts and signs the term sheet. 'Don't make me regret this.' FashionForward lives to fight another day." },
      { speaker: "guide", text: "You saved the company by speaking the creditor's language: value recovery. Great job." },
    ],
    failureOutro: [
      { speaker: "narrator", text: "The Wolf walks out. 'See you in bankruptcy court.' The company is forced into liquidation." },
      { speaker: "guide", text: "You failed to convince him that the company was worth more alive than dead. Always focus on the counterparty's incentives." },
    ],
  },

  // ---- SCENARIO 3: IPO Pricing (ENERGY IPO) ----
  {
    id: "energy-ipo-price",
    title: "The GreenPower IPO Pricing",
    introduction: [
      { speaker: "narrator", text: "It's 10 PM before IPO day. The order book is 5x oversubscribed. The bankers want to price at $18 to ensure a 'pop'. Elena wants $22 to maximize cash. You need to find the sweet spot." },
      { speaker: "guide", text: "IPO pricing is an art. Too high, and the stock crashes (broken deal). Too low, and you leave money on the table. You need to balance the founder's greed with the investors' need for a win." },
    ],
    steps: [
      {
        dialogue: [
          { speaker: "client", text: "I built this company from nothing! Why should I give these hedge funds a discount? Price it at $24! The demand is there!", "speaker": "client" }, // "client" here represents the founder Elena
        ],
        choices: [
          {
            label: "Elena, the demand at $24 is 'fluff' — hedge funds who will flip the stock immediately. Real long-term holders are at $20. If we price at $24, the stock could crash next week.",
            isCorrect: true,
            guideFeedback: "Correct. You explained the quality of the order book, not just the quantity. Long-term investors are key to a stable stock price.",
          },
          {
            label: "You're right! Let's go for $25! Let's get every penny!",
            isCorrect: false,
            guideFeedback: "This is reckless. Overpricing an IPO is the surest way to anger investors and ruin the company's reputation in the public markets.",
          },
        ],
      },
      {
        dialogue: [
          { speaker: "client", text: "Okay, but $18 is insulting. I won't do it." },
        ],
        choices: [
          {
            label: "Let's compromise at $21. It's above the range, maximizing your cash, but leaves just enough room for a 10-15% pop, which generates positive press and makes everyone happy.",
            isCorrect: true,
            guideFeedback: "The 'pop' is important psychology. $21 is the perfect middle ground.",
          },
          {
            label: "Fine, we cancel the IPO.",
            isCorrect: false,
            guideFeedback: "Canceling the night before is a disaster. You have to find a solution.",
          },
        ],
      },
    ],
    successOutro: [
      { speaker: "narrator", text: "GreenPower prices at $21. The next morning, it opens at $24. Everyone wins." },
      { speaker: "guide", text: "Perfect execution. You balanced the founder's needs with market reality." },
    ],
    failureOutro: [
      { speaker: "narrator", text: "You price at $24. The stock opens flat and then drops to $18 by lunch. Investors are furious." },
      { speaker: "guide", text: "Greed killed the deal. You should have left some money on the table to ensure a successful debut." },
    ],
  },
]
