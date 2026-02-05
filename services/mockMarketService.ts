import { Listing, Platform, DealStatus } from '../types';

// Curated list of reliable, high-quality images for the demo
const PRODUCT_IMAGES: Record<string, string> = {
  // Phones
  iphone_black: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=400&h=400',
  iphone_purple: 'https://images.unsplash.com/photo-1556656793-02715d8dd660?auto=format&fit=crop&q=80&w=400&h=400',
  iphone_box: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=400&h=400',
  iphone_gold: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=400&h=400',
  
  // TVs / Monitors
  tv_1: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400&h=400',
  tv_2: 'https://images.unsplash.com/photo-1509281373149-e957c629640d?auto=format&fit=crop&q=80&w=400&h=400',
  tv_3: 'https://images.unsplash.com/photo-1601944177325-f8867652837f?auto=format&fit=crop&q=80&w=400&h=400',
  monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400',
  
  // Laptops
  laptop_1: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400&h=400',
  laptop_2: 'https://images.unsplash.com/photo-1531297424005-06340436a58a?auto=format&fit=crop&q=80&w=400&h=400',
  
  // Audio
  headphone: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400',
  speaker: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=400&h=400',

  // Misc
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400&h=400',
  bike: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=400&h=400',
  
  // Fallbacks
  box_only: 'https://images.unsplash.com/photo-1605170439002-90845e8c0137?auto=format&fit=crop&q=80&w=400&h=400'
};

export const checkHasStockImages = (query: string): boolean => {
  const lower = query.toLowerCase();
  const keys = Object.keys(PRODUCT_IMAGES);
  
  // Check specific categories
  if (lower.includes('tv') || lower.includes('television') || lower.includes('monitor')) return true;
  if (lower.includes('phone') || lower.includes('iphone') || lower.includes('android')) return true;
  if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('computer')) return true;
  if (lower.includes('camera') || lower.includes('lens')) return true;
  if (lower.includes('headphone') || lower.includes('audio') || lower.includes('speaker')) return true;
  if (lower.includes('bike') || lower.includes('bicycle')) return true;

  return false;
};

const getImageForQuery = (query: string, index: number): string => {
  const lower = query.toLowerCase();
  
  if (lower.includes('phone') || lower.includes('iphone') || lower.includes('apple')) {
    const images = [PRODUCT_IMAGES.iphone_black, PRODUCT_IMAGES.iphone_purple, PRODUCT_IMAGES.iphone_gold, PRODUCT_IMAGES.iphone_box];
    return images[index % images.length];
  }
  
  if (lower.includes('tv') || lower.includes('television') || lower.includes('monitor')) {
    const images = [PRODUCT_IMAGES.tv_1, PRODUCT_IMAGES.tv_2, PRODUCT_IMAGES.tv_3, PRODUCT_IMAGES.monitor];
    return images[index % images.length];
  }

  if (lower.includes('laptop') || lower.includes('macbook')) {
    const images = [PRODUCT_IMAGES.laptop_1, PRODUCT_IMAGES.laptop_2];
    return images[index % images.length];
  }

  if (lower.includes('camera')) return PRODUCT_IMAGES.camera;
  if (lower.includes('headphone') || lower.includes('audio')) return PRODUCT_IMAGES.headphone;
  if (lower.includes('bike')) return PRODUCT_IMAGES.bike;

  return `https://placehold.co/400x400/1e293b/FFF?text=${encodeURIComponent(query)}+${index + 1}`;
};

// Specific Scenario Data for "iPhone 14 Pro"
const SCENARIO_LISTINGS: Listing[] = [
  // ... (keep existing scenario listings unchanged, just truncated for brevity in update if needed, but for XML correctness I should include them or just assume the file is replaced. I will replace full content to be safe)
  // --- QuickSell Items ---
  {
    id: 'qs-001',
    title: 'iPhone 14 Pro 128GB Space Black',
    platform: Platform.QuickSell,
    imageUrl: PRODUCT_IMAGES.iphone_black,
    originalPrice: 700,
    currentPrice: 700,
    condition: 'A',
    sellerName: 'Friendly Frank',
    sellerPersona: 'friendly',
    status: DealStatus.Pending,
    lastMessage: "Listed 2 hours ago",
    lastUpdated: new Date(),
    minPriceLimit: 665,
    negotiationHistory: [],
    location: "San Francisco, CA",
    description: "Excellent condition, always used with case.",
    aiActionState: "Idle"
  },
  {
    id: 'qs-002',
    title: 'iPhone 14 128GB Blue - Unlocked',
    platform: Platform.QuickSell,
    imageUrl: 'https://images.unsplash.com/photo-1512054502232-120bbc5a0d16?auto=format&fit=crop&q=80&w=400&h=400',
    originalPrice: 620,
    currentPrice: 620,
    condition: 'B',
    sellerName: 'Sarah J.',
    sellerPersona: 'friendly',
    status: DealStatus.Pending,
    lastMessage: "Listed 5 hours ago",
    lastUpdated: new Date(),
    minPriceLimit: 550,
    negotiationHistory: [],
    location: "Daly City, CA",
    description: "Minor scratches on bezel, screen perfect.",
    aiActionState: "Idle"
  },
  {
    id: 'qs-003',
    title: 'iPhone 14 Pro Max 256GB Gold',
    platform: Platform.QuickSell,
    imageUrl: PRODUCT_IMAGES.iphone_gold,
    originalPrice: 850,
    currentPrice: 850,
    condition: 'A',
    sellerName: 'TechReseller',
    sellerPersona: 'firm',
    status: DealStatus.Pending,
    lastMessage: "Listed yesterday",
    lastUpdated: new Date(),
    minPriceLimit: 800,
    negotiationHistory: [],
    location: "San Jose, CA",
    description: "Like new, battery 98%.",
    aiActionState: "Idle"
  },
  {
    id: 'qs-004',
    title: 'iPhone 14 Plus Midnight 128GB',
    platform: Platform.QuickSell,
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=400&h=400',
    originalPrice: 600,
    currentPrice: 600,
    condition: 'C',
    sellerName: 'Mikey',
    sellerPersona: 'urgent',
    status: DealStatus.Pending,
    lastMessage: "Listed 30 mins ago",
    lastUpdated: new Date(),
    minPriceLimit: 500,
    negotiationHistory: [],
    location: "Oakland, CA",
    description: "Back glass cracked, works fine.",
    aiActionState: "Idle"
  },
  {
    id: 'qs-005',
    title: 'iPhone 14 Pro Silver 512GB',
    platform: Platform.QuickSell,
    imageUrl: 'https://images.unsplash.com/photo-1512054502232-120bbc5a0d16?auto=format&fit=crop&q=80&w=400&h=400',
    originalPrice: 780,
    currentPrice: 780,
    condition: 'B',
    sellerName: 'Alice W.',
    sellerPersona: 'friendly',
    status: DealStatus.Pending,
    lastMessage: "Listed 3 hours ago",
    lastUpdated: new Date(),
    minPriceLimit: 720,
    negotiationHistory: [],
    location: "San Francisco, CA",
    description: "Good condition, no box.",
    aiActionState: "Idle"
  },

  // --- LocalMart Items ---
  {
    id: 'lm-001',
    title: 'iPhone 14 Pro 256GB - SEALED NEW',
    platform: Platform.LocalMart,
    imageUrl: PRODUCT_IMAGES.iphone_box,
    originalPrice: 720,
    currentPrice: 720,
    condition: 'S',
    sellerName: 'Firm Fiona',
    sellerPersona: 'firm',
    status: DealStatus.Pending,
    lastMessage: "Listed 1 day ago",
    lastUpdated: new Date(),
    minPriceLimit: 700,
    negotiationHistory: [],
    location: "Oakland, CA",
    description: "Brand new in box. Won at raffle.",
    aiActionState: "Idle"
  },
  {
    id: 'lm-002',
    title: 'iPhone 14 Pro Deep Purple 128GB',
    platform: Platform.LocalMart,
    imageUrl: PRODUCT_IMAGES.iphone_purple,
    originalPrice: 750,
    currentPrice: 750,
    condition: 'A',
    sellerName: 'Dave Smith',
    sellerPersona: 'blunt',
    status: DealStatus.Pending,
    lastMessage: "Listed 4 hours ago",
    lastUpdated: new Date(),
    minPriceLimit: 700,
    negotiationHistory: [],
    location: "Hayward, CA",
    description: "Clean IMEI, no scratches.",
    aiActionState: "Idle"
  },
  {
    id: 'lm-003',
    title: 'iPhone 14 128GB Starlight',
    platform: Platform.LocalMart,
    imageUrl: 'https://images.unsplash.com/photo-1512054502232-120bbc5a0d16?auto=format&fit=crop&q=80&w=400&h=400',
    originalPrice: 580,
    currentPrice: 580,
    condition: 'B',
    sellerName: 'Jenny K',
    sellerPersona: 'urgent',
    status: DealStatus.Pending,
    lastMessage: "Listed 2 days ago",
    lastUpdated: new Date(),
    minPriceLimit: 500,
    negotiationHistory: [],
    location: "Berkeley, CA",
    description: "Upgraded to 15, need gone asap.",
    aiActionState: "Idle"
  },
  {
    id: 'lm-004',
    title: 'iPhone 14 Pro Max 1TB',
    platform: Platform.LocalMart,
    imageUrl: PRODUCT_IMAGES.iphone_black,
    originalPrice: 950,
    currentPrice: 950,
    condition: 'A',
    sellerName: 'ProSeller101',
    sellerPersona: 'firm',
    status: DealStatus.Pending,
    lastMessage: "Listed 1 week ago",
    lastUpdated: new Date(),
    minPriceLimit: 900,
    negotiationHistory: [],
    location: "San Francisco, CA",
    description: "Mint condition with AppleCare+.",
    aiActionState: "Idle"
  },

  // --- ClassiDeals Items ---
  {
    id: 'cd-001',
    title: 'iphone 14 pro 128gb unlockd',
    platform: Platform.ClassiDeals,
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=400&h=400',
    originalPrice: 600,
    currentPrice: 600,
    condition: 'C',
    sellerName: 'Blunt Bob',
    sellerPersona: 'blunt',
    status: DealStatus.Pending,
    lastMessage: "posted yesterday",
    lastUpdated: new Date(),
    minPriceLimit: 580,
    negotiationHistory: [],
    location: "Daly City",
    description: "works fine screen cracked abit",
    aiActionState: "Idle"
  },
  {
    id: 'cd-002',
    title: 'IPHONE 14 PRO MAX CHEAP',
    platform: Platform.ClassiDeals,
    imageUrl: 'https://images.unsplash.com/photo-1512054502232-120bbc5a0d16?auto=format&fit=crop&q=80&w=400&h=400',
    originalPrice: 650,
    currentPrice: 650,
    condition: 'C',
    sellerName: 'anon762',
    sellerPersona: 'urgent',
    status: DealStatus.Pending,
    lastMessage: "posted today",
    lastUpdated: new Date(),
    minPriceLimit: 550,
    negotiationHistory: [],
    location: "Mission Dist",
    description: "face id not working otherwise good",
    aiActionState: "Idle"
  },
  {
    id: 'cd-003',
    title: 'iphone 14 plus blue clean',
    platform: Platform.ClassiDeals,
    imageUrl: 'https://images.unsplash.com/photo-1512054502232-120bbc5a0d16?auto=format&fit=crop&q=80&w=400&h=400',
    originalPrice: 550,
    currentPrice: 550,
    condition: 'B',
    sellerName: 'cali_surfer',
    sellerPersona: 'friendly',
    status: DealStatus.Pending,
    lastMessage: "posted 2 days ago",
    lastUpdated: new Date(),
    minPriceLimit: 500,
    negotiationHistory: [],
    location: "Pacifica",
    description: "upgrading phone. cash only.",
    aiActionState: "Idle"
  },
  {
    id: 'cd-004',
    title: 'iPhone 14 - parts only',
    platform: Platform.ClassiDeals,
    imageUrl: PRODUCT_IMAGES.box_only,
    originalPrice: 200,
    currentPrice: 200,
    condition: 'C',
    sellerName: 'repair_guy',
    sellerPersona: 'firm',
    status: DealStatus.Pending,
    lastMessage: "posted 1 week ago",
    lastUpdated: new Date(),
    minPriceLimit: 150,
    negotiationHistory: [],
    location: "SoMa",
    description: "icloud locked. for parts.",
    aiActionState: "Idle"
  }
];

export const generateMockListings = (query: string, customImage?: string): Listing[] => {
  const lowerQ = query.toLowerCase();
  
  // Return the perfect scenario if user asks for iphone 14
  if (lowerQ.includes('iphone') && lowerQ.includes('14')) {
    return JSON.parse(JSON.stringify(SCENARIO_LISTINGS));
  }

  // Fallback random generation
  const platforms = [Platform.QuickSell, Platform.LocalMart, Platform.ClassiDeals];
  const count = 12 + Math.floor(Math.random() * 4);
  const listings: Listing[] = [];

  for (let i = 0; i < count; i++) {
    const platform = platforms[i % 3];
    const price = 100 + Math.floor(Math.random() * 800);
    const conditions: ('S'|'A'|'B'|'C')[] = ['S', 'A', 'B', 'C', 'B', 'A'];
    
    // Priority: Custom AI Image -> Stock Image -> Placeholder
    let image = customImage || getImageForQuery(query, i);

    listings.push({
      id: `random-${i}`,
      title: `${query} Item #${i+1}`,
      platform: platform,
      imageUrl: image,
      originalPrice: price,
      currentPrice: price,
      condition: conditions[i % conditions.length],
      sellerName: `User${i}`,
      sellerPersona: ['friendly', 'firm', 'urgent', 'blunt'][i % 4] as any,
      status: DealStatus.Pending,
      lastMessage: "Available",
      lastUpdated: new Date(),
      minPriceLimit: price * 0.85,
      negotiationHistory: [],
      location: "San Francisco Area",
      description: "Standard used condition. Message for details.",
      aiActionState: "Idle"
    });
  }
  return listings;
};

// --- ENHANCED SELLER LOGIC ---
export const simulateSellerResponse = (
  listing: Listing, 
  offerPrice: number, 
  turns: number = 0 // Number of messages already in history
): { newPrice: number; message: string; status: DealStatus } => {
  
  const gap = offerPrice - listing.minPriceLimit;

  // Default response if initial inquiry (no price offer usually)
  if (turns <= 2 && offerPrice === listing.currentPrice) {
    if (listing.sellerPersona === 'blunt') return { newPrice: listing.currentPrice, message: "yes available.", status: DealStatus.Negotiating };
    if (listing.sellerPersona === 'urgent') return { newPrice: listing.currentPrice, message: "Yes! Can you buy today?", status: DealStatus.Negotiating };
    return { newPrice: listing.currentPrice, message: "Yes, it is still available. Are you interested?", status: DealStatus.Negotiating };
  }

  // REJECTION LOGIC: If offer is too low
  if (offerPrice < listing.minPriceLimit * 0.9) {
     if (listing.sellerPersona === 'friendly') {
       return { newPrice: listing.currentPrice, message: "Oh, that's a bit too low for me sorry. Can you do better?", status: DealStatus.Negotiating };
     } else if (listing.sellerPersona === 'blunt') {
       return { newPrice: listing.currentPrice, message: "lol no.", status: DealStatus.Negotiating };
     } else {
       return { newPrice: listing.currentPrice, message: "Price is firm. No lowballers.", status: DealStatus.Negotiating };
     }
  }

  // TUG OF WAR LOGIC based on turns
  if (turns < 5 && gap >= 0) {
      if (Math.random() > 0.5) {
        const counter = Math.floor((listing.currentPrice + offerPrice) / 2);
        if (listing.sellerPersona === 'firm') {
          return { newPrice: listing.currentPrice, message: `I have other offers. I can't go lower than ${listing.currentPrice} yet.`, status: DealStatus.Negotiating };
        }
        return { 
          newPrice: counter, 
          message: `Hmm, could you meet me at $${counter}?`, 
          status: DealStatus.Negotiating 
        };
      }
  }

  // ACCEPTANCE LOGIC
  if (gap >= 0) {
    if (listing.sellerPersona === 'firm' && turns < 4) {
      return { newPrice: listing.currentPrice, message: "I'll think about it. Message me again in an hour.", status: DealStatus.Negotiating };
    }

    return {
      newPrice: offerPrice,
      message: getAcceptanceMessage(listing.sellerPersona),
      status: DealStatus.OfferReceived
    };
  }

  // COUNTER OFFER LOGIC
  const counter = Math.max(listing.minPriceLimit, Math.floor((listing.currentPrice + offerPrice) / 2));
  return {
    newPrice: counter,
    message: `Lowest I can go is $${counter}.`,
    status: DealStatus.Negotiating
  };
};

const getAcceptanceMessage = (persona: string) => {
  switch(persona) {
    case 'friendly': return "That works for me! When can you pick it up? 😊";
    case 'urgent': return "Deal! Can you come right now??";
    case 'blunt': return "ok. come get it.";
    case 'firm': return "Fine. I'll accept that price.";
    default: return "Deal.";
  }
}