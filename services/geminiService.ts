import { GoogleGenAI } from "@google/genai";
import { Listing } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  return new GoogleGenAI({ apiKey });
};

export const generateAgentResponse = async (
  userMessage: string, 
  activeListings: Listing[]
): Promise<string> => {
  try {
    const ai = getClient();
    
    const listingsContext = activeListings.map(l => 
      `- [${l.platform}] ${l.title} (${l.condition}-Grade): $${l.currentPrice} (Status: ${l.status})`
    ).join('\n');

    const prompt = `
      You are "DealWhisperer", an AI agent managing P2P marketplace deals.
      Platforms: QuickSell (OfferUp style), LocalMart (Facebook style), ClassiDeals (Craigslist style).
      
      User Input: "${userMessage}"
      
      Current Market View:
      ${listingsContext || "No active search results."}

      Your Role:
      1. Search multiple sites.
      2. Analyze condition (S/A/B/C).
      3. Negotiate autonomously.
      4. Schedule pickups.

      Response Style:
      - Concise, action-oriented.
      - If user asks to search, say you are deploying agents to all 3 platforms.
      - If user asks to negotiate, confirm you are starting the sequence.
      - If user confirms a deal, ask for schedule.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Processing request...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the neural network. Please try again.";
  }
};

export const generateNegotiationMessage = async (listing: Listing): Promise<string> => {
  // Use Gemini to generate the AI's message TO the seller
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
}