import React, { useState, useEffect, useRef } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { SiteViewer } from './components/SiteViewer';
import { ChatMessage, Listing, DealStatus } from './types';
import { generateMockListings, simulateSellerResponse, checkHasStockImages } from './services/mockMarketService';
import { generateAgentResponse, generateListingImage } from './services/geminiService';
import { CheckCircle2, Calendar, Loader2, GripHorizontal } from 'lucide-react';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: "DealWhisperer Online.\n\nConnected to: QuickSell, LocalMart, ClassiDeals.\n\nReady to hunt for deals. What are you looking for today?",
    timestamp: new Date(),
  },
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isAutoNegotiating, setIsAutoNegotiating] = useState(false);
  const [negotiationQueue, setNegotiationQueue] = useState<Set<string>>(new Set());
  const [showScheduleModal, setShowScheduleModal] = useState<Listing | null>(null);
  const [viewingSiteListing, setViewingSiteListing] = useState<Listing | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  
  // Split View State
  const [splitRatio, setSplitRatio] = useState(50); // Percentage height of top panel
  const isDragging = useRef(false);

  const scanIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // Reusable function to start bulk or specific negotiations
  const startBatchNegotiation = (specificIds: string[] = []) => {
    // If no specific IDs provided, negotiate all Pending items
    const targetIds = specificIds.length > 0 
      ? specificIds 
      : listings.filter(l => l.status === DealStatus.Pending).map(l => l.id);
    
    if (targetIds.length === 0) return;

    setListings(prev => prev.map(l => {
      if (targetIds.includes(l.id)) {
        return {
          ...l,
          status: DealStatus.Negotiating,
          aiActionState: "Initializing Agent...",
        };
      }
      return l;
    }));

    setNegotiationQueue(prev => {
       const next = new Set(prev);
       targetIds.forEach(id => next.add(id));
       return next;
    });
    
    setIsAutoNegotiating(true);
  };

  const handleSendMessage = async (text: string) => {
    // 1. Add User Message
    const userMsg = addMessage('user', text);
    setIsTyping(true);

    const lowerText = text.toLowerCase();
    
    // --- Manual Override Triggers ---
    if (lowerText.includes('negotiate all') || lowerText.includes('start all')) {
      startBatchNegotiation();
      addMessage('assistant', `Deploying negotiation bots to sellers. Watch the dashboard updates.`);
      setIsTyping(false);
      return;
    }

    // --- AI Processing ---
    const currentHistory = [...messages, userMsg];
    
    const { text: aiText, searchTrigger, negotiationTrigger } = await generateAgentResponse(text, listings, currentHistory);
    
    setIsTyping(false);
    
    if (aiText) {
      addMessage('assistant', aiText);
    }

    // Handle Tool Calls
    if (searchTrigger) {
      startProgressiveSearch(searchTrigger);
    }

    if (negotiationTrigger) {
      // If AI returned specific IDs, use them. If it returned empty array (typical for "start"), target all pending.
      startBatchNegotiation(negotiationTrigger);
    }
  };

  const startProgressiveSearch = async (query: string) => {
    setIsScanning(true);
    setListings([]);
    
    // AI IMAGE GENERATION LOGIC
    let aiGeneratedImage = undefined;
    
    const hasStock = checkHasStockImages(query);
    if (!hasStock) {
      addMessage('assistant', "I'm generating visual previews for this unique item. Please wait a moment...");
      aiGeneratedImage = await generateListingImage(query);
    }

    // Start filling the grid
    const allResults = generateMockListings(query, aiGeneratedImage);
    let currentIndex = 0;

    const addNextListing = () => {
      if (currentIndex >= allResults.length) {
        setIsScanning(false);
        addMessage('assistant', `Found ${allResults.length} listings for "${query}". Shall I start negotiating?`);
        return;
      }

      const nextItem = allResults[currentIndex];
      setListings(prev => [...prev, nextItem]);
      currentIndex++;

      const delay = Math.floor(Math.random() * 800) + 400;
      scanIntervalRef.current = setTimeout(addNextListing, delay);
    };

    addNextListing();
  };

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearTimeout(scanIntervalRef.current);
    };
  }, []);

  // --- NEGOTIATION LOOP ---
  // Faster, parallel processing for demo purposes
  useEffect(() => {
    if (negotiationQueue.size === 0) {
      setIsAutoNegotiating(false);
      return;
    }

    const interval = setInterval(() => {
      setListings(prevListings => {
        return prevListings.map(listing => {
           // Skip if not in queue
           if (!negotiationQueue.has(listing.id)) return listing;

           // Skip if finished (cleanup will be handled by separate effect)
           if ([DealStatus.DealClosed, DealStatus.Failed, DealStatus.OfferReceived, DealStatus.Stopped].includes(listing.status)) {
             return listing;
           }

           // Random skip to create slight natural staggering (30% chance to wait)
           // But much faster than before
           if (Math.random() > 0.7) return listing;

           // -- STATE MACHINE --

           // 1. Initial State: Send Inquiry
           if (listing.negotiationHistory.length === 0) {
              return {
                ...listing,
                status: DealStatus.Negotiating,
                aiActionState: "Sending inquiry...",
                negotiationHistory: [{ sender: 'AI', text: "Hi, is this still available?", timestamp: new Date() }]
              };
           }

           const lastMsg = listing.negotiationHistory[listing.negotiationHistory.length - 1];

           // 2. Seller replied -> AI needs to prepare reply
           if (lastMsg.sender === 'Seller' && listing.aiActionState !== "Typing reply...") {
              return { ...listing, aiActionState: "Typing reply..." };
           }

           // 3. AI is Ready to Reply -> Send Offer
           if (lastMsg.sender === 'Seller' && listing.aiActionState === "Typing reply...") {
              const turns = listing.negotiationHistory.length;
              let nextText = "";
              
              if (turns <= 3) {
                const offer = Math.floor(listing.currentPrice * 0.85);
                nextText = `I'm interested. Would you take $${offer}?`;
              } else {
                const previousOfferMatch = listing.negotiationHistory.filter(m => m.sender === 'AI' && m.text.includes('$')).pop()?.text.match(/\$(\d+)/);
                const previousOffer = previousOfferMatch ? parseInt(previousOfferMatch[1]) : listing.currentPrice * 0.8;
                const newOffer = Math.floor((previousOffer + listing.currentPrice) / 2);
                nextText = `How about $${newOffer}? That's my best offer.`;
              }

              return {
                ...listing,
                aiActionState: "Waiting for seller...",
                negotiationHistory: [...listing.negotiationHistory, { 
                  sender: 'AI', 
                  text: nextText, 
                  timestamp: new Date() 
                }]
              };
           }

           // 4. AI replied -> Seller needs to respond
           if (lastMsg.sender === 'AI') {
              // 15% chance to "read" (wait 1 tick)
              if (Math.random() < 0.15) {
                return { ...listing, aiActionState: "Seller is reading..." };
              }

              const aiOfferMatch = lastMsg.text.match(/\$(\d+)/);
              const aiOffer = aiOfferMatch ? parseInt(aiOfferMatch[1]) : listing.currentPrice;

              const response = simulateSellerResponse(listing, aiOffer, listing.negotiationHistory.length);
              
              return {
                ...listing,
                currentPrice: response.newPrice,
                status: response.status,
                aiActionState: response.status === DealStatus.OfferReceived ? "Deal Possible!" : "Analyzing counter-offer...",
                negotiationHistory: [...listing.negotiationHistory, { 
                  sender: 'Seller', 
                  text: response.message, 
                  timestamp: new Date() 
                }]
              };
           }

           return listing;
        });
      });
    }, 800); // 0.8s tick for faster demo

    return () => clearInterval(interval);
  }, [negotiationQueue]);

  // Cleanup finished negotiations from the queue to stop their processing
  useEffect(() => {
    if (negotiationQueue.size === 0) return;

    // We check if any queued items are now finished
    const finishedIds = listings
      .filter(l => negotiationQueue.has(l.id))
      .filter(l => [DealStatus.DealClosed, DealStatus.Failed, DealStatus.OfferReceived, DealStatus.Stopped].includes(l.status))
      .map(l => l.id);

    if (finishedIds.length > 0) {
      setNegotiationQueue(prev => {
        const next = new Set(prev);
        finishedIds.forEach(id => next.delete(id));
        return next;
      });
    }
  }, [listings, negotiationQueue]);


  const handleNegotiateSingle = (id: string) => {
    startBatchNegotiation([id]);
  };

  const handleConfirmDeal = (id: string) => {
    const listing = listings.find(l => l.id === id);
    if (listing) {
      setShowScheduleModal(listing);
    }
  };

  const finalizeDeal = async (dateStr: string) => {
    if (!showScheduleModal) return;

    setIsScheduling(true);

    // Simulate Google Calendar API Sync
    await new Promise(resolve => setTimeout(resolve, 1500)); // Slightly faster sync simulation

    setListings(prev => prev.map(l => {
      if (l.id === showScheduleModal.id) {
        return {
          ...l,
          status: DealStatus.DealClosed,
          aiActionState: "Scheduling complete",
          negotiationHistory: [...l.negotiationHistory, {
            sender: 'AI',
            text: `DEAL CONFIRMED for ${dateStr}. Google Calendar event created.`,
            timestamp: new Date()
          }]
        };
      }
      
      if (l.status === DealStatus.Negotiating || l.status === DealStatus.OfferReceived || l.status === DealStatus.Pending) {
         return {
           ...l,
           status: DealStatus.Stopped,
           aiActionState: "Terminated",
           negotiationHistory: [...l.negotiationHistory, {
             sender: 'AI',
             text: "(Auto) Ending negotiation: I found another item. Thanks.",
             timestamp: new Date()
           }]
         };
      }

      return l;
    }));

    setNegotiationQueue(new Set());
    
    addMessage('assistant', `Deal secured! Meeting scheduled for ${dateStr}.\n\n✅ **Google Calendar Event Created**\nTitle: Pickup - ${showScheduleModal.title}\nLocation: ${showScheduleModal.location}\n\nI have automatically terminated the other negotiations to prevent double-booking.`);
    
    setIsScheduling(false);
    setShowScheduleModal(null);
  };

  // --- Resizer Logic ---
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      
      const clientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const windowHeight = window.innerHeight;
      const newRatio = (clientY / windowHeight) * 100;
      
      // Clamp between 20% and 80% to prevent full collapse
      const clampedRatio = Math.min(80, Math.max(20, newRatio));
      setSplitRatio(clampedRatio);
    };

    const handleUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
  };

  return (
    <div className="flex flex-col h-[100dvh] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* Resizable Chat Interface */}
      <div 
        style={{ height: `${splitRatio}%` }} 
        className="shrink-0 relative z-20 shadow-2xl overflow-hidden min-h-[20%]"
      >
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isTyping={isTyping} 
        />
      </div>

      {/* Drag Handle */}
      <div 
        className="h-6 -mt-3 -mb-3 relative z-30 cursor-row-resize flex items-center justify-center group touch-none"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="w-full h-full absolute inset-0 bg-transparent group-hover:bg-indigo-500/10 transition-colors"></div>
        <div className="w-16 h-1 bg-slate-600 rounded-full group-hover:bg-indigo-400 group-active:bg-indigo-500 transition-colors shadow-sm flex items-center justify-center">
            <GripHorizontal size={12} className="text-slate-900/50" />
        </div>
      </div>

      {/* Resizable Dashboard (Takes remaining space) */}
      <div className="flex-1 min-h-0 bg-slate-900 relative z-10">
        <Dashboard 
          listings={listings} 
          isScanning={isScanning}
          onNegotiate={handleNegotiateSingle}
          onConfirm={handleConfirmDeal}
          onViewSite={setViewingSiteListing}
          isAutoNegotiating={isAutoNegotiating}
        />
      </div>

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-md w-full shadow-2xl transform scale-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <CheckCircle2 className="text-emerald-400" size={24}/> 
              Confirm Purchase
            </h3>
            
            <div className="bg-slate-900/50 p-4 rounded-xl mb-6 border border-slate-700/50">
               <div className="text-sm text-slate-400 mb-1">Item</div>
               <div className="font-semibold text-white mb-2">{showScheduleModal.title}</div>
               <div className="flex justify-between items-end border-t border-slate-700 pt-2">
                 <span className="text-sm text-slate-400">Final Price</span>
                 <span className="text-2xl font-bold text-emerald-400">${showScheduleModal.currentPrice}</span>
               </div>
            </div>
            
            <p className="mb-3 text-sm font-medium text-slate-300 flex items-center gap-2">
              <Calendar size={14} /> Select Pickup Time to Sync:
            </p>
            <div className="space-y-2 mb-6">
              <button 
                onClick={() => finalizeDeal("Tomorrow 2:00 PM")} 
                disabled={isScheduling}
                className="w-full p-4 bg-slate-700 hover:bg-slate-600 disabled:opacity-70 disabled:cursor-wait rounded-xl text-left transition-colors flex justify-between items-center group relative overflow-hidden"
              >
                {isScheduling ? (
                   <span className="flex items-center justify-center w-full gap-2 text-emerald-400 font-bold">
                     <Loader2 className="animate-spin" size={18} /> Syncing to Google Calendar...
                   </span>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <span>Tomorrow, 2:00 PM</span>
                      <span className="text-slate-400 text-xs group-hover:text-white">Suggested (Traffic: Low)</span>
                    </div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity"/>
                  </>
                )}
              </button>

              <button 
                onClick={() => finalizeDeal("Tomorrow 6:00 PM")} 
                disabled={isScheduling}
                className="w-full p-4 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-left transition-colors flex justify-between items-center group"
              >
                <div className="flex flex-col">
                  <span>Tomorrow, 6:00 PM</span>
                  <span className="text-slate-400 text-xs">After work</span>
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => !isScheduling && setShowScheduleModal(null)}
              className="w-full py-2 text-sm text-slate-500 hover:text-slate-300 disabled:text-slate-600"
              disabled={isScheduling}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {viewingSiteListing && (
        <SiteViewer 
          listing={viewingSiteListing} 
          onClose={() => setViewingSiteListing(null)} 
        />
      )}
    </div>
  );
};

export default App;