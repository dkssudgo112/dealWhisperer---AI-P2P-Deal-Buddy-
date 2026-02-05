import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Listing, ChatMessage } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  return new GoogleGenAI({ apiKey });
};

// Tool: Visual Search
const searchTool: FunctionDeclaration = {
  name: "search_market",
  description: "Triggers a visual search for items. Use this when user asks to find/buy/search items.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: { type: Type.STRING, description: "Item keywords (e.g. 'iPhone 14')" }
    },
    required: ["query"]
  }
};

// Tool: Start Negotiation
const negotiateTool: FunctionDeclaration = {
  name: "start_negotiation",
  description: "Triggers the autonomous negotiation agents. Use this when the user says 'yes', 'start', 'negotiate', 'go ahead' or approves a plan to negotiate.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      targetIds: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Optional list of listing IDs to negotiate. If omitted, implies all pending listings."
      }
    }
  }
};

export const generateAgentResponse = async (
  userMessage: string, 
  activeListings: Listing[],
  messageHistory: ChatMessage[] = []
): Promise<{ text: string, searchTrigger?: string, negotiationTrigger?: string[] }> => {
  try {
    const ai = getClient();
    
    const recentHistory = messageHistory.slice(-10).map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    // Added ID to context so AI knows what to target
    const listingsContext = activeListings.map(l => 
      `- [ID: ${l.id}] [${l.platform}] ${l.title} ($${l.currentPrice})`
    ).join('\n');

    const prompt = `
      You are "DealWhisperer", an AI agent managing P2P marketplace deals.
      
      Current Listings (Visible to User):
      ${listingsContext || "No active search results."}

      Conversation History:
      ${recentHistory}
      
      User's Latest Input: "${userMessage}"

      Your Rules:
      1. **Search**: If user wants to find items, call 'search_market'.
      2. **Negotiate**: If user says "yes", "start", "negotiate", or confirms your suggestion to start negotiating, **YOU MUST CALL 'start_negotiation'**. 
         - Do not just write text saying you are doing it. You must trigger the tool.
         - If user says "yes" to "Shall I start negotiating?", call the tool.
      3. **General**: Be concise.

      Response Style:
      - If calling a tool, keep the text response short (e.g. "Deploying agents...", "Starting search...").
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ functionDeclarations: [searchTool, negotiateTool] }],
      }
    });

    const functionCalls = response.functionCalls;
    let textResponse = response.text || "";
    let searchTrigger = undefined;
    let negotiationTrigger = undefined;

    if (functionCalls && functionCalls.length > 0) {
      for (const call of functionCalls) {
        if (call.name === 'search_market') {
          searchTrigger = call.args['query'] as string;
          if (!textResponse) textResponse = `Searching for "${searchTrigger}"...`;
        }
        if (call.name === 'start_negotiation') {
          negotiationTrigger = (call.args['targetIds'] as string[]) || [];
          if (!textResponse) textResponse = "Initiating negotiation sequence...";
        }
      }
    }

    return { text: textResponse, searchTrigger, negotiationTrigger };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Connection error. Please try again." };
  }
};

export const generateNegotiationMessage = async (listing: Listing): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      Write a short negotiation message from a buyer to a seller on ${listing.platform}.
      Item: ${listing.title}
      Current Price: $${listing.currentPrice}
      
      Context: 
      - QuickSell: Polite, emoji friendly.
      - LocalMart: Direct, profile-focused.
      - ClassiDeals: Minimalist, straight to point.

      Goal: Ask for a lower price or confirm availability.
      Output ONLY the message text.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Hi, is this still available?";
  } catch (e) {
    return "Hi, is the price negotiable?";
  }
};

export const generateListingImage = async (query: string): Promise<string | undefined> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Generate a photorealistic, slightly imperfect photo of a used ${query} for sale. It should look like a casual photo taken by a seller at home (e.g. on a table, floor, or desk). No text overlays. Aspect ratio 1:1.` }
        ]
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};