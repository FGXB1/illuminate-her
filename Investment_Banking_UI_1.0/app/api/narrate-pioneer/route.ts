import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const WOMEN_VOICES = [
  "21m00Tcm4TlvDq8ikWAM", // Rachel
  "XrExE9yKIg1WjnnlVkGX", // Emily
  "jsCqWAovK2LkecY7zXl4", // Freya
];

export async function POST(request: Request) {
  try {
    const { name, story, impact } = await request.json();
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

    if (!apiKey) {
      return NextResponse.json({ error: "No API key" }, { status: 200 });
    }

    const text = `${name}. ${story} ${impact ? `Her impact: ${impact}` : ""}`;
    
    // Deterministic voice assignment
    const voiceIndex = Array.from(name).reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0) % WOMEN_VOICES.length;
    const voiceId = WOMEN_VOICES[voiceIndex];

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability: 0.65,
            similarity_boost: 0.8,
          },
        }),
      }
    );

    if (!response.ok) throw new Error("ElevenLabs failed");

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error("Narration error:", error);
    return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
  }
}
