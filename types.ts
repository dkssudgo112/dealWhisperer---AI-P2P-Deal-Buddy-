export enum Platform {
  QuickSell = 'QuickSell',
  LocalMart = 'LocalMart',
  ClassiDeals = 'ClassiDeals'
}

export enum DealStatus {
  Searching = 'Searching',
  Pending = 'Pending',
  Negotiating = 'Negotiating',
  OfferReceived = 'Offer Received',
  DealClosed = 'Deal Closed',
  Failed = 'Failed',
  Scheduled = 'Scheduled',
  Stopped = 'Stopped' // New status for auto-cancelled deals
}

export interface Listing {
  id: string;
  title: string;
  platform: Platform;
  imageUrl: string;
  originalPrice: number;
  currentPrice: number; // The negotiated price
  condition: 'S' | 'A' | 'B' | 'C';
  sellerName: string;
  sellerPersona: 'friendly' | 'blunt' | 'firm' | 'urgent'; 
  status: DealStatus;
  lastMessage: string;
  lastUpdated: Date;
  minPriceLimit: number; 
  negotiationHistory: { sender: 'AI' | 'Seller'; text: string; timestamp: Date }[];
  description?: string;
  location?: string;
  
  // New field for granular UI feedback
  aiActionState?: string; // e.g. "Connecting...", "Typing offer...", "Waiting for reply"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

export interface UserSchedule {
  date: string;
  time: string;
  location: string;
}