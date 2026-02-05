import React, { useEffect, useRef } from 'react';
import { Listing, Platform } from '../types';
import { X, Search, Menu, MessageCircle, MapPin, User, ChevronLeft } from 'lucide-react';

interface SiteViewerProps {
  listing: Listing;
  onClose: () => void;
}

export const SiteViewer: React.FC<SiteViewerProps> = ({ listing, onClose }) => {
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [listing.negotiationHistory]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://placehold.co/600x600/1e293b/94a3b8?text=${encodeURIComponent(listing.title)}`;
  };

  // Render different UI based on platform
  const renderContent = () => {
    switch (listing.platform) {
      case Platform.QuickSell:
        return (
          <div className="bg-gray-100 text-gray-800 h-full font-sans overflow-y-auto">
            {/* QuickSell App-like Header */}
            <div className="bg-[#00BFA5] text-white p-3 flex justify-between items-center sticky top-0 z-10 shadow-sm">
              <ChevronLeft />
              <span className="font-bold">QuickSell</span>
              <Search size={20} />
            </div>
            
            <div className="p-4 bg-white mb-2 shadow-sm">
              <img 
                src={listing.imageUrl} 
                className="w-full h-64 object-cover rounded-lg mb-3" 
                onError={handleImageError}
              />
              <h1 className="text-xl font-bold">{listing.title}</h1>
              <div className="text-2xl font-bold text-[#00BFA5] mt-1">${listing.currentPrice}</div>
              <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                <MapPin size={14} /> {listing.location || 'Nearby'}
              </div>
            </div>

            <div className="bg-white p-4 shadow-sm mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                   <User size={20} className="text-gray-500"/>
                </div>
                <div>
                  <div className="font-bold">{listing.sellerName}</div>
                  <div className="text-xs text-yellow-500">★★★★★ (142)</div>
                </div>
              </div>
            </div>

            {/* Chat Overlay for QuickSell */}
            <div className="bg-white mt-2 p-4 h-[300px] flex flex-col">
              <div className="font-bold border-b pb-2 mb-2 text-sm text-gray-400">MESSAGE HISTORY</div>
              <div className="flex-1 overflow-y-auto space-y-3" ref={chatScrollRef}>
                 {listing.negotiationHistory.map((msg, i) => (
                   <div key={i} className={`flex ${msg.sender === 'AI' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.sender === 'AI' ? 'bg-[#00BFA5] text-white' : 'bg-gray-200'}`}>
                       {msg.text}
                     </div>
                   </div>
                 ))}
                 {listing.negotiationHistory.length === 0 && <div className="text-center text-gray-400 text-sm mt-10">Start a conversation...</div>}
              </div>
            </div>
          </div>
        );

      case Platform.LocalMart:
        return (
          <div className="bg-[#F0F2F5] text-[#050505] h-full font-sans overflow-y-auto">
            {/* Facebook Marketplace Header */}
            <div className="bg-white p-3 border-b flex justify-between items-center sticky top-0 z-10">
              <div className="text-[#1877F2] font-bold text-xl">facebook</div>
              <div className="flex gap-4">
                <Search size={20} />
                <Menu size={20} />
              </div>
            </div>

            <div className="max-w-2xl mx-auto p-4">
              <div className="bg-white rounded-lg shadow p-4 flex gap-4">
                 <div className="w-1/3">
                    <img 
                      src={listing.imageUrl} 
                      className="w-full rounded aspect-square object-cover" 
                      onError={handleImageError}
                    />
                 </div>
                 <div className="flex-1">
                    <h1 className="text-xl font-bold">{listing.title}</h1>
                    <div className="text-lg font-medium mt-1">${listing.currentPrice}</div>
                    <div className="text-sm text-gray-500 mt-2">Listed in {listing.location}</div>
                    
                    <div className="mt-4 flex items-center gap-2">
                       <button className="flex-1 bg-[#E7F3FF] text-[#1877F2] font-bold py-2 rounded">Message</button>
                       <button className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">...</button>
                    </div>
                 </div>
              </div>

              {/* Chat Pop-up Style */}
              <div className="fixed bottom-0 right-4 w-80 bg-white rounded-t-lg shadow-xl border border-gray-300 flex flex-col h-96">
                <div className="bg-[#1877F2] text-white p-2 rounded-t-lg flex justify-between items-center">
                  <span className="font-bold text-sm">{listing.sellerName}</span>
                  <X size={14} className="cursor-pointer" />
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white" ref={chatScrollRef}>
                  {listing.negotiationHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'AI' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-1.5 rounded-2xl text-sm ${msg.sender === 'AI' ? 'bg-[#1877F2] text-white' : 'bg-[#E4E6EB] text-black'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t">
                  <div className="text-xs text-gray-400">DealWhisperer Agent is typing...</div>
                </div>
              </div>
            </div>
          </div>
        );

      case Platform.ClassiDeals:
        return (
          <div className="bg-white text-black h-full font-serif overflow-y-auto">
             <div className="p-2 border-b bg-gray-100 flex gap-4 text-blue-800 text-sm sticky top-0 z-10">
               <span className="font-bold">CL</span>
               <span>sf bay area</span>
               <span>for sale</span>
               <span>electronics</span>
             </div>

             <div className="p-6 max-w-3xl mx-auto">
               <h1 className="text-2xl font-medium text-blue-900 mb-2">{listing.title} - ${listing.currentPrice} ({listing.location})</h1>
               <div className="flex gap-4 mb-6">
                 <img 
                   src={listing.imageUrl} 
                   className="w-64 h-48 object-cover border" 
                   onError={handleImageError}
                 />
                 <div className="text-sm leading-relaxed">
                   <p className="mb-4">{listing.description}</p>
                   <ul className="list-disc pl-5">
                     <li>condition: {listing.condition === 'C' ? 'fair' : 'good'}</li>
                     <li>cryptocurrency ok</li>
                     <li>delivery available</li>
                   </ul>
                 </div>
               </div>

               <div className="border-t pt-4">
                 <div className="font-bold mb-2 font-sans bg-yellow-100 p-1 inline-block">email reply: {listing.sellerName}@sale.cl.org</div>
                 
                 {/* Simulated Email Thread */}
                 <div className="mt-6 border p-4 bg-gray-50 font-mono text-sm h-64 overflow-y-auto" ref={chatScrollRef}>
                    {listing.negotiationHistory.map((msg, i) => (
                      <div key={i} className="mb-3 border-b pb-2 last:border-0">
                        <div className="font-bold text-gray-600 mb-1">{msg.sender === 'AI' ? 'You' : 'Seller'} wrote:</div>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                    ))}
                 </div>
               </div>
             </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-full max-h-[800px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-1">
          <X size={20} />
        </button>
        {renderContent()}
        
        {/* Overlay Badge */}
        <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded text-xs font-mono border border-green-500 shadow-lg flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           AI Agent Active on {listing.platform}
        </div>
      </div>
    </div>
  );
};