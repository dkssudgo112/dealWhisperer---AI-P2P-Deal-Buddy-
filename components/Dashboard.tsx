import React, { useMemo, useEffect, useRef } from 'react';
import { Listing, DealStatus } from '../types';
import { ListingCard } from './ListingCard';
import { Activity, Trophy, RefreshCw, Sparkles } from 'lucide-react';

interface DashboardProps {
  listings: Listing[];
  isScanning: boolean;
  onNegotiate: (id: string) => void;
  onConfirm: (id: string) => void;
  onViewSite: (listing: Listing) => void;
  isAutoNegotiating: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  listings, 
  isScanning, 
  onNegotiate, 
  onConfirm,
  onViewSite,
  isAutoNegotiating
}) => {
  const activeNegotiations = listings.filter(l => 
    l.status === DealStatus.Negotiating || l.status === DealStatus.OfferReceived
  ).length;

  // Calculate Best Listing based on lowest price among active/pending/completed deals
  // We exclude Failed/Stopped unless everything is failed
  const bestListing = useMemo(() => {
    if (listings.length === 0) return null;
    
    const validListings = listings.filter(l => 
      l.status !== DealStatus.Failed && l.status !== DealStatus.Stopped
    );
    
    const pool = validListings.length > 0 ? validListings : listings;
    
    return pool.reduce((prev, curr) => 
      prev.currentPrice < curr.currentPrice ? prev : curr
    , pool[0]);
  }, [listings]);

  // Track the previous best listing ID to trigger scroll only on change
  const prevBestIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Scroll to the best listing if the ID has changed
    if (bestListing && bestListing.id !== prevBestIdRef.current) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`listing-${bestListing.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150); // Slight delay to ensure rendering and smooth transition

      prevBestIdRef.current = bestListing.id;
      return () => clearTimeout(timer);
    }
  }, [bestListing]);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-t border-slate-700">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-1.5 rounded">
             <Activity className="text-emerald-400 animate-pulse" size={16} />
          </div>
          <div>
             <h2 className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-0.5">Live Market Feed</h2>
             <div className="text-[10px] text-slate-500">Real-time prices from QuickSell, LocalMart, ClassiDeals</div>
          </div>
        </div>
        
        <div className="flex gap-6 text-xs font-mono items-center">
          <div className="flex flex-col items-end">
             <span className="text-slate-500 text-[10px]">Active</span>
             <span className="text-white font-bold">{activeNegotiations} deals</span>
          </div>
          
          {/* Best Recommendation Highlight in Header */}
          {bestListing && (
            <div className="hidden md:flex flex-col items-end border-l border-slate-700 pl-6 relative group cursor-pointer"
                 onClick={() => document.getElementById(`listing-${bestListing.id}`)?.scrollIntoView({behavior: 'smooth', block: 'center'})}
            >
               <div className="absolute -left-1 top-1 w-2 h-2 bg-yellow-500 rounded-full animate-ping opacity-75"></div>
               <span className="text-yellow-400 text-[10px] font-bold flex items-center gap-1">
                   <Trophy size={12} /> BEST RECOMMENDATION
               </span>
               <div className="flex items-center gap-2">
                 <span className="text-white max-w-[150px] truncate" title={bestListing.title}>{bestListing.title}</span>
                 <span className="text-green-400 font-bold bg-green-400/10 px-1 rounded">${bestListing.currentPrice.toLocaleString()}</span>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950/50">
        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
            {isScanning ? (
               <div className="flex flex-col items-center">
                 <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <SearchIcon className="absolute inset-0 m-auto text-emerald-500 animate-pulse" size={24}/>
                 </div>
                 <p className="text-lg font-medium text-white animate-pulse">Scanning Marketplaces...</p>
                 <div className="flex gap-3 mt-2 text-xs text-slate-500">
                    <span>QuickSell...</span>
                    <span>LocalMart...</span>
                    <span>ClassiDeals...</span>
                 </div>
               </div>
            ) : (
              <div className="text-center space-y-2">
                <RefreshCw size={48} className="opacity-10 mx-auto" />
                <p className="font-mono text-sm">System Idle. Awaiting search query.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {listings.map(listing => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                onNegotiate={onNegotiate}
                onConfirm={onConfirm}
                onViewSite={onViewSite}
                isAutoNegotiating={isAutoNegotiating}
                isRecommended={bestListing?.id === listing.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SearchIcon = ({ className, size }: {className?: string, size?: number}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)