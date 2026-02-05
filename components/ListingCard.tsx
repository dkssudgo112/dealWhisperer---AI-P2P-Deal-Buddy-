import React, { useEffect, useRef } from 'react';
import { Listing, Platform, DealStatus } from '../types';
import { ArrowDown, CheckCircle, XCircle, Clock, Eye, Loader2, StopCircle, Trophy, Sparkles } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onNegotiate: (id: string) => void;
  onConfirm: (id: string) => void;
  onViewSite: (listing: Listing) => void;
  isAutoNegotiating: boolean;
  isRecommended?: boolean;
}

const getPlatformStyles = (p: Platform) => {
  switch (p) {
    case Platform.QuickSell: 
      return { badge: 'bg-quicksell text-white border-transparent', border: 'border-quicksell/30 hover:border-quicksell' };
    case Platform.LocalMart: 
      return { badge: 'bg-localmart text-white border-transparent', border: 'border-localmart/30 hover:border-localmart' };
    case Platform.ClassiDeals: 
      return { badge: 'bg-classideals text-white border-transparent', border: 'border-classideals/30 hover:border-classideals' };
    default: 
      return { badge: 'bg-gray-600', border: 'border-slate-700' };
  }
};

const getStatusBadge = (s: DealStatus) => {
  switch (s) {
    case DealStatus.Negotiating: return <span className="flex items-center text-blue-400 font-bold"><Loader2 size={14} className="mr-1 animate-spin"/> Active</span>;
    case DealStatus.OfferReceived: return <span className="flex items-center text-green-400 font-bold"><CheckCircle size={14} className="mr-1"/> Offer Ready</span>;
    case DealStatus.DealClosed: return <span className="flex items-center text-emerald-500 font-bold"><CheckCircle size={14} className="mr-1"/> PURCHASED</span>;
    case DealStatus.Failed: return <span className="flex items-center text-red-500"><XCircle size={14} className="mr-1"/> Failed</span>;
    case DealStatus.Stopped: return <span className="flex items-center text-slate-500"><StopCircle size={14} className="mr-1"/> Stopped</span>;
    default: return <span className="text-gray-400">Pending</span>;
  }
};

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onNegotiate, 
  onConfirm, 
  onViewSite, 
  isAutoNegotiating,
  isRecommended = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const discount = listing.originalPrice - listing.currentPrice;
  const isBestPrice = discount > 0;
  const styles = getPlatformStyles(listing.platform);
  const isActive = listing.status === DealStatus.Negotiating;
  const isStopped = listing.status === DealStatus.Stopped || listing.status === DealStatus.Failed;

  // Auto-scroll to this card if it's recommended AND the deal just finished (OfferReceived)
  useEffect(() => {
    if (isRecommended && listing.status === DealStatus.OfferReceived) {
      const timer = setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isRecommended, listing.status]);

  // Styling logic for Best Recommendation
  const borderClass = isRecommended
    ? 'border-yellow-500 ring-2 ring-yellow-500/20 shadow-xl shadow-yellow-900/10 scale-[1.02] z-20'
    : (listing.status === DealStatus.DealClosed 
        ? 'border-emerald-500/50 bg-emerald-900/10' 
        : (isActive 
            ? 'ring-1 ring-blue-500/50 shadow-lg shadow-blue-900/10 bg-slate-800/80 z-10' 
            : styles.border));

  const bgClass = isStopped 
    ? 'opacity-60 bg-slate-900 border-slate-800' 
    : (isRecommended ? 'bg-slate-800' : 'bg-slate-800/50 hover:bg-slate-800');

  return (
    <div 
      id={`listing-${listing.id}`}
      ref={cardRef}
      className={`relative flex flex-col p-4 rounded-xl border transition-all duration-500 group ${borderClass} ${bgClass}`}
    >
      {/* Best Deal Badge - Added whitespace-nowrap and ensured it pops out */}
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-30 flex items-center gap-1 border border-yellow-400/50 animate-in slide-in-from-top-2 whitespace-nowrap">
          <Trophy size={10} className="text-yellow-100" /> 
          TOP RECOMMENDATION
          <Sparkles size={10} className="text-yellow-200 animate-pulse" />
        </div>
      )}
      
      {/* Active Indicator Overlay - Added rounded-t-xl to match card corners since overflow is visible */}
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer opacity-70 rounded-t-xl" style={{backgroundSize: '200% 100%'}}></div>
      )}

      {/* Header */}
      <div className={`flex justify-between items-start mb-3 ${isRecommended ? 'mt-2' : ''}`}>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${styles.badge}`}>
          {listing.platform}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${listing.condition === 'S' || listing.condition === 'A' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'}`}>
          Grade {listing.condition}
        </span>
      </div>

      {/* Content */}
      <div className="flex gap-4">
        <div className="relative shrink-0">
          <img 
            src={listing.imageUrl} 
            alt={listing.title} 
            className={`w-16 h-16 rounded-lg object-cover bg-slate-700 ring-1 ring-white/10 ${isStopped ? 'grayscale' : ''}`} 
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/200x200/1e293b/94a3b8?text=${encodeURIComponent(listing.title.substring(0, 4))}`;
            }}
          />
          {isActive && (
             <span className="absolute -bottom-1 -right-1 flex h-4 w-4 bg-slate-900 rounded-full items-center justify-center">
               <Loader2 size={10} className="text-blue-400 animate-spin" />
             </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium truncate leading-tight mb-1 ${isStopped ? 'text-slate-500 line-through' : (isRecommended ? 'text-yellow-100' : 'text-white')}`}>{listing.title}</h3>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-bold tracking-tight ${isStopped ? 'text-slate-500' : (isRecommended ? 'text-yellow-400' : 'text-white')}`}>
              ${listing.currentPrice.toLocaleString()}
            </span>
            {isBestPrice && !isStopped && (
              <span className="text-xs text-green-400 flex items-center bg-green-400/10 px-1 rounded">
                <ArrowDown size={10} /> ${discount} off
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 line-through">
            ${listing.originalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* AI Action Status Bar */}
      {isActive && (
        <div className="mt-3 mb-1 flex items-center gap-2 text-[10px] text-blue-300 font-mono bg-blue-900/20 px-2 py-1 rounded border border-blue-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          {listing.aiActionState || "Processing..."}
        </div>
      )}

      {/* Live Feed */}
      <div className={`mt-2 p-2.5 rounded-lg border text-xs font-mono h-24 overflow-hidden relative flex flex-col justify-end
        ${isStopped ? 'bg-slate-900 border-slate-800 text-slate-600' : 'bg-slate-900/80 border-slate-700/50'}
      `}>
        {listing.negotiationHistory.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 italic">
             Waiting for Agent...
          </div>
        ) : (
          listing.negotiationHistory.slice(-3).map((msg, idx) => (
            <div key={idx} className={`truncate mb-1 last:mb-0 ${msg.sender === 'AI' ? 'text-primary' : (isStopped ? 'text-slate-500' : 'text-orange-400')}`}>
              <span className="opacity-50 text-[10px] mr-1">[{msg.sender === 'AI' ? 'Me' : 'Seller'}]</span>
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className={`mt-4 flex justify-between items-center pt-3 border-t ${isRecommended ? 'border-yellow-500/20' : 'border-slate-700/50'}`}>
        <div className="text-xs font-medium">
          {getStatusBadge(listing.status)}
        </div>
        
        <div className="flex gap-2">
          <button 
             onClick={() => onViewSite(listing)}
             className="p-1.5 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded transition-colors"
             title="View Live Site"
          >
             <Eye size={14} />
          </button>

          {listing.status !== DealStatus.DealClosed && listing.status !== DealStatus.Stopped && listing.status !== DealStatus.Failed && (
            <>
              {listing.status === DealStatus.OfferReceived ? (
                 <button 
                 onClick={() => onConfirm(listing.id)}
                 className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center shadow-lg shadow-emerald-900/20 animate-pulse">
                 Confirm Deal
               </button>
              ) : (
                <button 
                  onClick={() => onNegotiate(listing.id)}
                  disabled={isActive || isAutoNegotiating}
                  className={`px-3 py-1.5 text-xs font-bold rounded flex items-center transition-colors
                    ${isActive 
                      ? 'bg-slate-700 text-blue-400 cursor-wait border border-blue-500/20' 
                      : (isRecommended 
                          ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg shadow-yellow-900/20' 
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20')}`}
                >
                  {isActive ? <Loader2 size={12} className="animate-spin mr-1"/> : null}
                  {isActive ? 'Haggling...' : 'Auto-Neg'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};