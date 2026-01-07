
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { FutureAgent, FutureAgentType, LifeDecision, Message } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const AGENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    agents: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING },
          name: { type: Type.STRING },
          values: { type: Type.ARRAY, items: { type: Type.STRING } },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          regrets: { type: Type.ARRAY, items: { type: Type.STRING } },
          backstory: { type: Type.STRING },
          initialStats: {
            type: Type.OBJECT,
            properties: {
              confidence: { type: Type.NUMBER },
              stability: { type: Type.NUMBER },
              growth: { type: Type.NUMBER },
            },
            required: ['confidence', 'stability', 'growth']
          }
        },
        required: ['id', 'type', 'name', 'values', 'strengths', 'regrets', 'backstory', 'initialStats'],
      },
    },
  },
  required: ['agents'],
};

function cleanJsonResponse(text: string): string {
  return text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
}

export async function generateAgents(decisions: LifeDecision[]): Promise<FutureAgent[]> {
  const decisionText = decisions.map(d => `${d.question}: ${d.choice}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on these decisions:\n${decisionText}\nGenerate 3 future versions (1, 5, 20 years).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: AGENT_SCHEMA,
    },
  });

  const raw = JSON.parse(cleanJsonResponse(response.text));
  return raw.agents.map((a: any) => ({
    ...a,
    stats: a.initialStats
  }));
}

export async function generateAgentImage(agent: FutureAgent): Promise<string> {
  const prompt = `A cinematic, hyper-realistic close-up portrait of a person representing the "${agent.name}" version of themselves, ${agent.type} from now. They are influenced by these traits: ${agent.values.join(', ')}. Atmosphere: ethereal, slightly futuristic, soft lighting. No text.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return "";
}

export async function chatWithAgent(
  activeAgent: FutureAgent,
  allAgents: FutureAgent[],
  messages: Message[],
  userInput: string,
  decisions: LifeDecision[]
) {
  const history = messages.map(m => `${m.sender === 'user' ? 'User' : m.agentId}: ${m.content}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Conversation History:\n${history}\n\nUser: ${userInput}`,
    config: {
      systemInstruction: `You are ${activeAgent.name}, the ${activeAgent.type} version of the user. Background: ${activeAgent.backstory}. Respond in character. Return JSON with "content" and "statsUpdate".`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          statsUpdate: {
            type: Type.OBJECT,
            properties: {
              confidence: { type: Type.NUMBER },
              stability: { type: Type.NUMBER },
              growth: { type: Type.NUMBER },
            }
          }
        },
        required: ['content', 'statsUpdate']
      }
    },
  });

  return JSON.parse(cleanJsonResponse(response.text));
}

export async function generateTTS(text: string, voice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' = 'Kore'): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
}

export async function generateFinalSummary(decisions: LifeDecision[], messages: Message[], agents: FutureAgent[]) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize the journey for a user who made these choices: ${JSON.stringify(decisions)}. They met these future selves: ${JSON.stringify(agents)}. Mention specific divergent paths.`,
  });
  return response.text;
}
