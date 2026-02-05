import React, { useState, useEffect, useRef } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { SiteViewer } from './components/SiteViewer';
import { ChatMessage, Listing, DealStatus } from './types';
import { generateMockListings, simulateSellerResponse } from './services/mockMarketService';
import { generateAgentResponse } from './services/geminiService';
import { CheckCircle2, Calendar, Loader2 } from 'lucide-react';

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
  
  const scanIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = async (text: string) => {
    addMessage('user', text);
    setIsTyping(true);

    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('find') || lowerText.includes('search') || lowerText.includes('iphone')) {
      startProgressiveSearch(text);
      return;
    }

    if (lowerText.includes('negotiate all') || lowerText.includes('start all') || lowerText.includes('yes')) {
      const pendingIds = listings.filter(l => l.status === DealStatus.Pending).map(l => l.id);
      
      if (pendingIds.length > 0) {
        setListings(prev => prev.map(l => {
          if (pendingIds.includes(l.id)) {
            return {
              ...l,
              status: DealStatus.Negotiating,
              aiActionState: "Initializing Agent...",
            };
          }
          return l;
        }));

        setNegotiationQueue(new Set(pendingIds));
        setIsAutoNegotiating(true);
        addMessage('assistant', `Deploying negotiation bots to ${pendingIds.length} sellers. Watch the dashboard updates.`);
        setIsTyping(false);
        return;
      }
    }

    const aiResponse = await generateAgentResponse(text, listings);
    setIsTyping(false);
    addMessage('assistant', aiResponse);
  };

  const startProgressiveSearch = async (query: string) => {
    setIsScanning(true);
    setListings([]);
    addMessage('assistant', `Acknowledged. Scouring marketplaces for "${query}"...`);

    const allResults = generateMockListings(query);
    let currentIndex = 0;

    const addNextListing = () => {
      if (currentIndex >= allResults.length) {
        setIsScanning(false);
        setIsTyping(false);
        generateAgentResponse(query, allResults).then(res => addMessage('assistant', res));
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

  useEffect(() => {
    if (negotiationQueue.size === 0) {
      setIsAutoNegotiating(false);
      return;
    }

    const interval = setInterval(async () => {
      setListings(prevListings => {
        const newListings = [...prevListings];
        const activeIds = Array.from(negotiationQueue);
        
        const targetId = activeIds[Math.floor(Math.random() * activeIds.length)];
        const index = newListings.findIndex(l => l.id === targetId);
        
        if (index === -1) return prevListings;

        const listing = newListings[index];

        if ([DealStatus.DealClosed, DealStatus.Failed, DealStatus.OfferReceived, DealStatus.Stopped].includes(listing.status)) {
          const newQueue = new Set(negotiationQueue);
          newQueue.delete(listing.id);
          setNegotiationQueue(newQueue);
          return prevListings;
        }

        if (listing.negotiationHistory.length === 0) {
           newListings[index] = {
             ...listing,
             status: DealStatus.Negotiating,
             aiActionState: "Sending inquiry...",
             negotiationHistory: [{ sender: 'AI', text: "Hi, is this still available?", timestamp: new Date() }]
           };
           return newListings;
        }

        const lastMsg = listing.negotiationHistory[listing.negotiationHistory.length - 1];

        if (lastMsg.sender === 'Seller' && listing.aiActionState !== "Typing reply...") {
           newListings[index] = { ...listing, aiActionState: "Typing reply..." };
           return newListings;
        }

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

           newListings[index] = {
             ...listing,
             aiActionState: "Waiting for seller...",
             negotiationHistory: [...listing.negotiationHistory, { 
               sender: 'AI', 
               text: nextText, 
               timestamp: new Date() 
             }]
           };
           return newListings;
        }

        if (lastMsg.sender === 'AI') {
           if (Math.random() > 0.3) {
             newListings[index] = { ...listing, aiActionState: "Seller is reading..." };
             return newListings;
           }

           const aiOfferMatch = lastMsg.text.match(/\$(\d+)/);
           const aiOffer = aiOfferMatch ? parseInt(aiOfferMatch[1]) : listing.currentPrice;

           const response = simulateSellerResponse(listing, aiOffer, listing.negotiationHistory.length);
           
           newListings[index] = {
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
           return newListings;
        }

        return newListings;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [negotiationQueue]);


  const handleNegotiateSingle = (id: string) => {
    setListings(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status: DealStatus.Negotiating,
          aiActionState: "Connecting...",
        };
      }
      return l;
    }));
    setNegotiationQueue(prev => new Set(prev).add(id));
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
    await new Promise(resolve => setTimeout(resolve, 2000));

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

  return (
    <div className="flex flex-col h-screen text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="h-1/2 min-h-[400px] relative z-20 shadow-2xl">
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isTyping={isTyping} 
        />
      </div>

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