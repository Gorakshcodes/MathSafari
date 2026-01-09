import { GoogleGenAI, Type } from "@google/genai";
import { StoryPage } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function getSafariHint(n1: number, n2: number, op: string, language: string = 'en'): Promise<string> {
  const prompt = `You are a friendly Lion Safari Guide. A 7-year-old child is solving: ${n1} ${op} ${n2}. 
  Give a tiny, very simple hint in 1 or 2 short sentences in the language with code "${language}". 
  Use simple visualization like "Imagine ${n1} monkeys and then ${n2} more come to play".
  Break it down into one small first step. Do NOT give the answer.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    return response.text || "Let's count them together!";
  } catch (error) {
    console.error("Gemini API Error", error);
    return "Think of it like adding pieces of fruit to your snack bowl!";
  }
}

export async function getSafariStory(currentScore: number, language: string = 'en'): Promise<StoryPage[]> {
  const difficultyLevel = Math.floor(currentScore / 100);
  
  let complexityInstruction = "";
  let levelTitle = "";

  if (difficultyLevel === 0) {
      levelTitle = "Explorer";
      complexityInstruction = "Math Constraints: Sums and differences strictly under 20. No carrying/borrowing. Very simple 1-step logic.";
  } else if (difficultyLevel === 1) {
      levelTitle = "Adventurer";
      complexityInstruction = "Math Constraints: Numbers up to 50. Simple carrying/borrowing allowed. 1-step logic.";
  } else if (difficultyLevel === 2) {
      levelTitle = "Ranger";
      complexityInstruction = "Math Constraints: Numbers up to 100. 2-step logic is allowed (e.g., add then subtract). Compare quantities (more/less).";
  } else if (difficultyLevel === 3) {
      levelTitle = "Guide";
      complexityInstruction = "Math Constraints: Numbers up to 100. Introduce Repeated Addition (e.g., 5 groups of 4) as simple multiplication concepts. Mixed operations.";
  } else if (difficultyLevel === 4) {
      levelTitle = "Guardian";
      complexityInstruction = "Math Constraints: Numbers up to 500. Addition/Subtraction with hundreds. Simple Multiplication (tables 2, 5, 10).";
  } else {
      levelTitle = "Legend";
      complexityInstruction = "Math Constraints: Numbers up to 1000. Mixed operations including simple Division (sharing equally) and Multiplication. Logic puzzles.";
  }

  const prompt = `Generate a 3-part interactive math story for a 7-year-old child in the language with code "${language}".
  
  CURRENT PLAYER LEVEL: ${levelTitle} (Score: ${currentScore})
  ${complexityInstruction}
  
  CRITICAL CULTURAL CONTEXT:
  1. Names: Use local names common to speakers of "${language}" (e.g., if Tamil, use Anbu/Iniya. If Hindi, use Ravi/Anjali).
  2. Setting: The geography should match regions where "${language}" is spoken (e.g., temples of Tamil Nadu, rivers of Maharashtra, markets of Karnataka).
  3. Items/Culture: Use local fruits (Mangoes, Jackfruit, Guavas), flowers (Jasmine, Marigold), or snacks (Samosas, Idlis, Vadas) in the story.
  4. Lingo: Use the natural style and rhythm of "${language}".
  
  STORY STRUCTURE:
  - Part 1: Introduction to the scenario and first math problem.
  - Part 2: Plot progression and second math problem (slightly harder).
  - Part 3: Climax/Conclusion and final math problem.
  
  Output JSON format as specified in schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "A story paragraph set in the local culture/geography." },
                    question: { type: Type.STRING, description: "A simple math question based on the story part." },
                    answer: { type: Type.INTEGER, description: "The numeric answer." },
                    explanation: { type: Type.STRING, description: "A very simple sentence explaining the answer for a child." }
                },
                required: ["text", "question", "answer", "explanation"]
            }
        }
      }
    });
    
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error (Story)", error);
    return [
      { text: "Ravi has 5 apples.", question: "How many now?", answer: 5, explanation: "5 + 0 = 5" },
      { text: "He finds 2 more.", question: "How many total?", answer: 7, explanation: "5 + 2 = 7" },
      { text: "He shares 3.", question: "How many left?", answer: 4, explanation: "7 - 3 = 4" }
    ];
  }
}