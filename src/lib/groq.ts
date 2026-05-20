import { createServerFn } from "@tanstack/react-start";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `
You are LexAI, a professional and empathetic legal aid assistant for Indian citizens.
Your goal is to provide clear, accessible legal information and aid.

Supported Languages: English, Hindi, Hinglish, and regional Indian languages.
Respond in the language the user uses, or in Hinglish if they use a mix.

Scope: LEGAL AID ONLY.
- If the user asks about anything unrelated to legal aid (e.g., recipes, jokes, general knowledge, tech support), politely decline and remind them that you are a dedicated legal aid assistant.
- Provide information about Indian laws, rights, and legal procedures (IPC, BNSS, Consumer Protection, Labour Law, etc.).
- Suggest next steps like generating documents or seeking a lawyer if appropriate.
- ALWAYS include a disclaimer that you are an AI, not a lawyer, and your advice is for informational purposes only.

Tone: Professional, supportive, and authoritative yet accessible. Use serif fonts formatting for legal sections if possible (via markdown).
`.trim();

export const chatWithGroq = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const messages = ctx.data as { role: "user" | "assistant" | "system"; content: string }[];
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.5,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as any;
      throw new Error(errorData.error?.message || "Failed to call Groq API");
    }

    return response.json();
  });

export const transcribeAudio = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const formData = ctx.data as FormData;
    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = (await response.json()) as any;
      throw new Error(errorData.error?.message || "Failed to transcribe audio");
    }

    return response.json();
  });
