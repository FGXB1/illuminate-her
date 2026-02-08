import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PIONEERS = [
  { name: "Suzanne Ciani", industry: "Music Production", location: [37.7749, -122.4194] },
  { name: "Ada Lovelace", industry: "Computing", location: [51.5074, -0.1278] },
  { name: "Marie Curie", industry: "Science", location: [48.8566, 2.3522] },
  { name: "Katherine Johnson", industry: "Aerospace", location: [37.0299, -76.3452] },
  { name: "Tu Youyou", industry: "Medicine", location: [39.9042, 116.4074] },
  { name: "Maryam Mirzakhani", industry: "Mathematics", location: [35.6892, 51.389] },
  { name: "Wangari Maathai", industry: "Environmentalism", location: [-1.2921, 36.8219] },
  { name: "Zaha Hadid", industry: "Architecture", location: [33.3152, 44.3661] },
  { name: "Grace Hopper", industry: "Computing", location: [38.9072, -77.0369] },
  { name: "Hedy Lamarr", industry: "Communications", location: [48.2082, 16.3738] },
  { name: "Chien-Shiung Wu", industry: "Nuclear Physics", location: [31.2304, 121.4737] },
  { name: "Valentina Tereshkova", industry: "Space Exploration", location: [55.7558, 37.6173] },
  { name: "Jane Goodall", industry: "Primatology", location: [-4.8814, 29.6521] },
  { name: "Simone Giertz", industry: "Robotics", location: [59.3293, 18.0686] },
  { name: "Danica Patrick", industry: "Automotive", location: [39.7684, -86.1581] },
  { name: "Sallie Krawcheck", industry: "Finance", location: [40.7128, -74.006] },
];

const FALLBACK_STORIES = PIONEERS.map(p => ({
  ...p,
  story: `${p.name} is a pioneer in the ${p.industry} industry, breaking barriers and inspiring future generations.`,
  impact: "Her work paved the way for women worldwide to pursue careers in male-dominated fields.",
  emotion: "inspiring"
}));

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    return NextResponse.json(FALLBACK_STORIES);
  }

  try {
    const prompt = `Generate a short, inspiring story (max 2 sentences) and a brief impact statement (max 1 sentence) for each of the following 16 women pioneers. 
    Return the result as a JSON array of objects with these keys: name, industry, location (the array provided), story, impact, and emotion (one of: inspiring, visionary, determined, triumphant).
    
    Pioneers: ${JSON.stringify(PIONEERS)}
    
    Return ONLY valid JSON.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        }),
      }
    );

    if (!response.ok) throw new Error("Gemini API failed");

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    const stories = JSON.parse(generatedText);

    return NextResponse.json(stories);
  } catch (error) {
    console.error("Story generation error:", error);
    return NextResponse.json(FALLBACK_STORIES);
  }
}
