import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import { Send, Bot, User, Mic } from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base">DealWhisperer AI</h1>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online • Monitoring 3 Platforms
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
              ${msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600/20 text-indigo-400'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                }`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-700">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700 bg-slate-900/50 backdrop-blur">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
             <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Find me an iPhone 14 under 700k..."
              className="w-full bg-slate-800 border-none rounded-xl py-3 pl-4 pr-12 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none shadow-inner"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <Mic size={18} />
            </button>
          </div>
          <button 
            type="submit"
            disabled={!input.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-900/20"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};