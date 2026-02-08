import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const PROMPT = `Give me 5 different short fun facts (2-3 sentences each) about women who made an impact in the automotive or Formula 1 industry. They could be female engineers, strategists, drivers, mechanics, team principals, designers, or any other role. Include their names and what they did. Keep each one inspiring and concise.

IMPORTANT FORMATTING RULES:
- Wrap every woman's full name in double asterisks the FIRST time you mention her, like **Danica Patrick**.
- Separate each fact with a line containing only "---".
- Do not use any other markdown. Do not number them.
- Pick different women and achievements each time.`;

// Extensive fallback pool — names wrapped in **double asterisks** for highlight rendering
const FALLBACK_FACTS = [
  "**Danica Patrick** remains the most successful woman in American open-wheel racing history. Her 2008 Indy Japan 300 victory made her the first woman to win an IndyCar Series race.",
  "**Berta Benz** completed the first long-distance automobile trip in 1888, driving 66 miles in her husband Karl's Patent-Motorwagen and essentially inventing the road trip.",
  "**Michèle Mouton** became the first woman to win a World Rally Championship event in 1981 and finished runner-up in the overall championship in 1982.",
  "**Charlie Martin** became the first transgender woman to race at the 24 Hours of Nürburgring in 2019, inspiring inclusion in motorsport worldwide.",
  "**Susie Wolff** was the first woman in 22 years to participate in a Formula 1 race weekend when she drove in practice at the 2014 British Grand Prix.",
  "In 2023, an all-female pit crew set a record tire change time of 6.09 seconds, proving speed and precision in the pit lane know no gender.",
  "**Lella Lombardi** is the only woman to score points in a Formula 1 World Championship race, finishing sixth at the 1975 Spanish Grand Prix.",
  "**Janet Guthrie** became the first woman to qualify and compete in both the Indianapolis 500 and the Daytona 500 in 1977, breaking barriers in American motorsport.",
  "**Maria Teresa de Filippis** was the very first woman to enter a Formula 1 Grand Prix, competing in the 1958 Belgian Grand Prix driving a Maserati 250F.",
  "**Jutta Kleinschmidt** became the first woman to win the Dakar Rally in 2001, conquering one of the most grueling endurance races on the planet.",
  "**Hélène Delangle** (Hellé Nice) was one of the fastest Grand Prix drivers of the 1920s and 1930s, once clocking 197 km/h — a women's land speed record at the time.",
  "**Desire Wilson** is the only woman to win a Formula 1 race of any kind, taking victory in the 1980 British Aurora F1 Championship at Brands Hatch.",
  "**Pat Moss** dominated rallying in the 1960s, winning multiple international rallies and becoming the first woman to win a European rally championship event outright.",
  "**Simona de Silvestro** was nicknamed the 'Iron Maiden' after racing with severe burns on her hands during the 2011 Indianapolis 500 qualifying and still making the grid.",
  "**Hannah Schmitz**, Red Bull Racing's Head of Strategy, has been instrumental in winning multiple World Championships with her split-second pit stop and race strategy calls.",
  "**Leena Gade** became the first female race engineer to win the 24 Hours of Le Mans in 2011, leading the Audi Sport Team Joest to victory.",
  "**Bertha Benz** didn't just drive — she also invented brake pads during her 1888 trip when she stopped at a cobbler to have leather nailed to the brake blocks.",
  "**Tatiana Calderón** became the first Latin American woman to compete in Formula 2 in 2019, racing at the highest single-seater level below F1.",
  "**Jamie Chadwick** won the inaugural W Series championship in 2019 and went on to win it three consecutive times, dominating women's single-seater racing.",
  "**Giovanna Amati** was the last woman to attempt to qualify for a Formula 1 Grand Prix, driving for the Brabham team during the 1992 season.",
  "**Alice Ramsey** became the first woman to drive across the United States in 1909, completing the 3,800-mile journey in 59 days with three non-driving passengers.",
  "**Sabine Schmitz**, the 'Queen of the Nürburgring', won the 24 Hours of Nürburgring twice and became one of the most beloved figures in motorsport before her passing in 2021.",
  "**Divina Galica** competed in the 1976, 1977, and 1978 Formula 1 British Grands Prix, and was also a three-time Winter Olympic skier for Great Britain.",
  "**Keiko Ihara** was the first Japanese woman to compete in the 24 Hours of Le Mans, racing in the prestigious endurance event multiple times.",
  "**Christina Nielsen** became the first woman to win a major North American sports-car championship, taking the GTD class title in the 2016 IMSA WeatherTech series.",
];

// ── Cache: stores facts from Gemini so we only call the API once per batch ──
let cachedGeminiFacts: string[] = [];
let fallbackIndex = -1;

export async function GET() {
  // 1. If we have cached Gemini facts, serve one (no API call)
  if (cachedGeminiFacts.length > 0) {
    const fact = cachedGeminiFacts.shift()!;
    return NextResponse.json({ fact, source: "gemini" });
  }

  // 2. Try to fetch a batch of 5 facts from Gemini (one API call → 5 pit stops)
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "your-gemini-api-key-here") {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(PROMPT);
      const text = result.response.text().trim();

      // Split the batch by "---" separator
      const facts = text
        .split(/\n*---\n*/)
        .map((f) => f.trim())
        .filter((f) => f.length > 20);

      if (facts.length > 0) {
        // Serve the first, cache the rest
        const first = facts.shift()!;
        cachedGeminiFacts = facts;
        return NextResponse.json({ fact: first, source: "gemini" });
      }
    } catch (error: any) {
      console.error("Gemini API error:", error?.message?.substring(0, 200) || error);
    }
  }

  // 3. Fallback: serve from the local pool
  return serveFallback();
}

function serveFallback() {
  let index: number;
  do {
    index = Math.floor(Math.random() * FALLBACK_FACTS.length);
  } while (index === fallbackIndex && FALLBACK_FACTS.length > 1);
  fallbackIndex = index;

  return NextResponse.json({ fact: FALLBACK_FACTS[index], source: "fallback" });
}
