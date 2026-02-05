<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DealWhisperer - AI P2P Deal Buddy

> **Your AI agent that hunts, negotiates, and closes the best deals across multiple marketplaces—so you don't have to.**

An intelligent P2P marketplace negotiation assistant powered by Gemini 2.0.

View your app in AI Studio: https://ai.studio/apps/drive/1Uct7BrFtxfDinyAr1ThvP8zuBeJnD5V9

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Gemini Integration

**DealWhisperer** demonstrates how Gemini 2.0 can power an intelligent P2P marketplace negotiation assistant.

**1. Function Calling (Tool Use)**
The application utilizes Gemini's native function calling feature through the `@google/genai` SDK. Two custom tools are defined: `search_market` for triggering product searches and `start_negotiation` for deploying autonomous negotiation agents. When users interact conversationally (e.g., "Find me an iPhone 14" or "Yes, start negotiating"), Gemini intelligently determines which tool to invoke based on context and intent. In a production environment, these function calls would trigger browser automation (e.g., Puppeteer/Playwright) to access real P2P marketplaces and conduct actual negotiations—currently simulated with mock data for demonstration purposes.

**2. Conversational AI with Context Awareness**
The `gemini-2.0-flash` model processes user inputs with full conversation history and current listing data as context. This enables coherent multi-turn dialogues, understanding of implicit confirmations, and generation of platform-appropriate negotiation messages tailored to each marketplace's communication style.

**3. Future Enhancement: Web-Based Image Retrieval**
The current prototype uses stock images and placeholders. In a full implementation, the system would leverage Gemini's multimodal capabilities combined with web scraping to fetch and analyze actual product images from marketplace listings, enabling visual verification and condition assessment.

These Gemini features transform a simple chat interface into an autonomous deal-hunting agent.
