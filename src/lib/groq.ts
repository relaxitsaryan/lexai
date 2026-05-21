import { createServerFn } from "@tanstack/react-start";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `
You are ApnaNyaya, a professional and empathetic legal aid assistant for Indian citizens.
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
You are ApnaNyaya's Situation Analyzer, an elite AI legal assistant.
Analyze the user's legal situation and return a precise, structured legal analysis in JSON.

Structure:
{
  "languageDetected": "string",
  "legalDomain": "string",
  "keyFacts": ["fact 1", "fact 2"],
  "relevantLaws": [{"law": "name", "explanation": "how it applies"}],
  "suggestedActions": ["action 1", "action 2"],
  "riskLevel": "Low" | "Medium" | "High",
  "riskExplanation": "why",
  "actionRoadmap": [
    {
      "step": number,
      "title": "exact title, e.g., 'Send Legal Notice'",
      "authority": "authority name, e.g., 'District Labour Commissioner'",
      "howTo": "specific method, e.g., 'Online via Samadhan Portal'",
      "timeline": "duration, e.g., 'Day 1-3'",
      "deadline": "statutory limit, e.g., 'Within 3 years of non-payment'",
      "documents": ["doc 1", "doc 2"],
      "actionType": "draft_notice" | "file_complaint" | "consult_lawyer" | "other"
    }
  ]
}
`.trim();

const RIGHTS_ENGINE_PROMPT = `
You are ApnaNyaya's Know Your Rights Engine — a specialized Indian legal rights advisor.
Identify EXACTLY which Indian laws protect the user. Return ONLY JSON.

Structure:
{
  "legalDomain": "string",
  "situationSummary": "string",
  "rightsOverview": "string",
  "laws": [
    {
      "id": number,
      "name": "Full Official Act Name, Year",
      "shortName": "abbreviation",
      "sections": ["Section X"],
      "relevance": "primary | secondary | indirect",
      "protection": "One sentence summary",
      "plainExplanation": "2-3 sentences explaining it simply",
      "keyRights": ["right 1", "right 2"],
      "penalty": "penalty details"
    }
  ],
  "timeLimit": { "exists": boolean, "duration": "string", "warning": "string" },
  "immediateActions": ["action 1", "action 2"],
  "strengthOfCase": "strong | moderate | weak",
  "strengthReason": "why",
  "importantWarning": "critical warning or null"
}
`.trim();

export const analyzeLegalSituation = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const messages = ctx.data as { role: "user" | "assistant"; content: string }[];
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: ANALYZER_SYSTEM_PROMPT }, ...messages],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });
    return response.json();
  });

export const getLegalRights = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const messages = ctx.data as { role: "user" | "assistant"; content: string }[];
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: RIGHTS_ENGINE_PROMPT }, ...messages],
        temperature: 0.4,
        response_format: { type: "json_object" }
      }),
    });
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

export const generateLegalDraft = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const { situation, actionType, stepTitle } = ctx.data as { situation: string; actionType: string; stepTitle: string };
    const prompt = `
      You are ApnaNyaya's Legal Document Engine. 
      Generate a professional, court-standard legal draft for the following:
      Action: ${stepTitle} (${actionType})
      Situation: ${situation}
      
      Requirements:
      - Use professional Indian legal terminology.
      - Include placeholders for [Name], [Address], [Date] in bold [brackets].
      - Ensure the tone is firm yet formal.
      - Return ONLY the draft content in plain text with clear headings.
      - **CRITICAL**: Do NOT use any markdown symbols like #, *, or _ in the output. Use uppercase for headings instead.
    `.trim();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: "You are an expert Indian Legal Draftsman." }, { role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });
    return response.json();
  });
export const getDetailedExplanation = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const { situation, context } = ctx.data as { situation: string; context: string };
    const prompt = `
      You are ApnaNyaya's Senior Legal Strategist. 
      The user wants a DETAILED, deep-dive explanation on "What to do next" for their situation.
      
      Situation: ${situation}
      Context: ${context}
      
      Requirements:
      - Provide a comprehensive breakdown of the legal strategy.
      - Explain WHY certain actions are recommended.
      - Discuss potential challenges and how to overcome them.
      - Mention important evidentiary requirements in detail.
      - Tone: Authoritative, academic yet helpful.
      - Use uppercase for headings. DO NOT use markdown symbols like # or *.
    `.trim();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: "You are an expert Indian Legal Consultant." }, { role: "user", content: prompt }],
        temperature: 0.5,
      }),
    });
    return response.json();
  });
