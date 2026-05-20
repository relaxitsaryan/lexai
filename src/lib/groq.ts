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

const ANALYZER_SYSTEM_PROMPT = `
You are LexAI's Situation Analyzer, an elite AI legal assistant specializing in Indian Law.
Your goal is to carefully analyze the user's legal situation (submitted in English, Hindi, or Hinglish) and return a precise, structured legal analysis.

You MUST respond strictly with a valid JSON object. Do not include any text, markdown codeblocks (like \`\`\`json), or explanations outside of the JSON block.

Structure your JSON response exactly like this:
{
  "languageDetected": "English" | "Hindi" | "Hinglish",
  "legalDomain": "e.g., Labor Law / Rent & Tenancy / Cyber Crime / Consumer Protection",
  "keyFacts": [
    "Identify critical fact 1",
    "Identify critical fact 2",
    "Identify critical fact 3"
  ],
  "relevantLaws": [
    {
      "law": "Name of Act (e.g., Section 73 of the Indian Contract Act, 1872)",
      "explanation": "Specific explanation of how it applies to their situation."
    }
  ],
  "suggestedActions": [
    "First step to take (e.g., Send a formal demand letter/legal notice)",
    "Second step to take (e.g., File a complaint on the National Consumer Helpline or cybercrime portal)",
    "Third step to take (e.g., Gather all documentary evidence)"
  ],
  "riskLevel": "Low" | "Medium" | "High",
  "riskExplanation": "Short explanation of the potential legal/financial risks involved."
}

If the user's message is not related to a legal situation or legal aid, return:
{
  "error": "I am a dedicated legal aid assistant. Please describe a situation with potential legal implications."
}
`.trim();

export const analyzeLegalSituation = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const messages = ctx.data as { role: "user" | "assistant"; content: string }[];
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: ANALYZER_SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as any;
      throw new Error(errorData.error?.message || "Failed to analyze situation");
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

