"use client";
import { motion } from 'framer-motion';
import { MessageSquare, Send, Search, MoreVertical, Paperclip, CheckCircle2, Circle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const mockTickets = [
  { id: 't1', merchant: 'admin@x-cryptopay.com', lastMessage: 'Thank you for reaching out! We have received your...', time: '10:08 AM', unread: 0, active: true, color: 'bg-blue-500' },
  { id: 't2', merchant: 'merchant_a@example.com', lastMessage: 'I need help updating my webhook URL.', time: 'Yesterday', unread: 2, active: false, color: 'bg-emerald-500' },
  { id: 't3', merchant: 'gaming_platform@app.io', lastMessage: 'The API integration is working flawlessly.', time: 'Monday', unread: 0, active: false, color: 'bg-purple-500' },
  { id: 't4', merchant: 'test_store@shop.com', lastMessage: 'Why was my account suspended?', time: 'Mar 15', unread: 1, active: false, color: 'bg-orange-500' },
];

export default function AdminSupportPage() {
  const [activeTicket, setActiveTicket] = useState(mockTickets[0].id);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'admin', text: 'Hello! I am your dedicated account manager from x-cryptopay. How can I assist you with your integration today?', time: '10:00 AM' },
    { id: 2, sender: 'user', text: 'Hi! I successfully completed the API integration, but I have a question regarding the auto-sweep fees.', time: '10:05 AM' },
    { id: 3, sender: 'admin', text: 'Absolutely. The platform currently retains a 1% fee on each incoming transaction via the deposit wallets, and the remaining 99% is instantly swept to your external wallet.', time: '10:08 AM' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'admin',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessage('');
  };

  const getActiveTicketData = () => mockTickets.find(t => t.id === activeTicket);

  // We use negative margins to negate the layout padding and take the absolute full screen available.
  return (
    <div className="h-[calc(100vh-88px)] -mx-6 md:-mx-10 -mt-6 md:-mt-10 flex bg-[#0B0C10] overflow-hidden">

       {/* Sidebar - Ticket List (Width reduced from 320px to 280px to give more room for chat) */}
       <div className="w-[280px] border-r border-white/5 bg-[#14161b] flex flex-col z-10 flex-shrink-0">
          
          {/* Replaced standalone Header with an integrated Navbar Header for the Sidebar */}
          <div className="h-[72px] px-5 border-b border-white/5 flex items-center gap-3 bg-[#14161b]">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
               <MessageSquare className="text-white" size={16} />
             </div>
             <h1 className="text-lg font-bold text-white tracking-tight">Support Desk</h1>
          </div>

          <div className="p-4 border-b border-white/5">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-400 transition-colors" size={14} />
                <input type="text" placeholder="Search merchants..." className="w-full bg-black/40 border border-white/10 rounded-full py-2 pl-9 pr-4 text-slate-200 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-[13px] shadow-inner" />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-none space-y-0.5 p-2">
             {mockTickets.map(ticket => (
               <button 
                key={ticket.id} 
                onClick={() => setActiveTicket(ticket.id)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group
                  ${activeTicket === ticket.id ? 'bg-white/10 shadow-lg border border-white/5 relative' : 'hover:bg-white/5 border border-transparent'}`}
               >
                  {activeTicket === ticket.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-red-500 rounded-r-md"></div>}
                  
                  <div className="relative flex-shrink-0">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[15px] border border-white/10 text-white shadow-inner ${ticket.color}`}>
                        {ticket.merchant[0].toUpperCase()}
                     </div>
                     {ticket.active && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#14161b] rounded-full"></span>}
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden pt-0.5">
                     <div className="flex justify-between items-center mb-0.5">
                        <p className={`text-[13px] font-bold tracking-wide truncate pr-2 ${activeTicket === ticket.id ? 'text-white' : 'text-slate-300 group-hover:text-white transition-colors'}`}>
                          {ticket.merchant.split('@')[0]}
                        </p>
                        <span className={`text-[10px] whitespace-nowrap ${ticket.unread > 0 || activeTicket === ticket.id ? 'text-slate-300 font-bold' : 'text-slate-500 font-semibold'}`}>{ticket.time}</span>
                     </div>
                     <p className={`text-[11px] truncate ${ticket.unread > 0 ? 'text-slate-300 font-medium' : 'text-slate-500 leading-snug'}`}>{ticket.lastMessage}</p>
                  </div>
                  {ticket.unread > 0 && (
                     <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 shadow-md mt-1">
                        {ticket.unread}
                     </div>
                  )}
               </button>
             ))}
          </div>
       </div>

       {/* Chat Area - Expanded to take all remaining space */}
       <div className="flex-1 flex flex-col z-10 bg-[#0B0C10] relative">
          
          {/* Subtle background glow for the chat area */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>

          {/* Chat Navbar Header */}
          <div className="h-[72px] px-6 border-b border-white/5 flex justify-between items-center bg-[#14161b]/80 backdrop-blur-md z-10">
             <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[15px] border border-white/10 shadow-md ${getActiveTicketData()?.color}`}>
                   {getActiveTicketData()?.merchant[0].toUpperCase()}
                </div>
                <div>
                   <h3 className="text-[15px] font-bold text-white tracking-wide">{getActiveTicketData()?.merchant}</h3>
                   <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 pt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${getActiveTicketData()?.active ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></span>
                      {getActiveTicketData()?.active ? 'Online' : 'Offline'}
                   </p>
                </div>
             </div>
             <div className="flex items-center gap-3">
               <button className="px-4 py-2 bg-[#1e2128] hover:bg-slate-700 border border-white/5 text-slate-200 hover:text-white rounded-lg text-[13px] font-bold transition-all shadow-sm flex items-center gap-2">
                 <CheckCircle2 size={15} className="text-emerald-400" /> Resolve
               </button>
               <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"><MoreVertical size={18} /></button>
             </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent z-10">
             <div className="text-center pb-2">
                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">Today</span>
             </div>

             {messages.map((msg, idx) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                     <div className={`flex items-end gap-2.5 max-w-[85%] lg:max-w-[65%] ${isAdmin ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold shadow-md
                           ${isAdmin ? 'bg-red-500 text-white' : `${getActiveTicketData()?.color} text-white`}`}>
                           {isAdmin ? 'AD' : getActiveTicketData()?.merchant[0].toUpperCase()}
                        </div>

                        <div className={`px-4 py-3 relative shadow-lg ${isAdmin ? 'bg-gradient-to-br from-red-600 to-orange-600 border border-red-500/50 text-white rounded-[18px] rounded-br-sm' : 'bg-[#1e2128] text-slate-200 border border-white/5 rounded-[18px] rounded-bl-sm'}`}>
                           <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                           <div className={`flex items-center gap-1.5 justify-end mt-1.5 ${isAdmin ? 'text-red-200' : 'text-slate-500'}`}>
                              <span className="text-[10px] font-bold tracking-wider">{msg.time}</span>
                              {isAdmin && <CheckCircle2 size={12} />}
                           </div>
                        </div>
                     </div>
                  </motion.div>
                );
             })}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#14161b]/90 border-t border-white/5 backdrop-blur-xl z-20">
             <form onSubmit={handleSend} className="flex gap-3 items-end max-w-5xl mx-auto w-full">
                <button type="button" className="p-3 text-slate-400 hover:text-white bg-[#1e2128] border border-white/5 hover:bg-slate-700 rounded-full transition-colors flex-shrink-0 shadow-sm">
                   <Paperclip size={18} />
                </button>
                <div className="flex-1 bg-black/40 border border-white/10 rounded-3xl flex items-center px-2 py-1 focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/20 transition-all shadow-inner">
                   <textarea 
                     rows={1}
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     placeholder="Message merchant..." 
                     className="w-full bg-transparent px-3 py-2 text-slate-200 outline-none text-[14px] resize-none scrollbar-none max-h-32 placeholder-slate-500"
                     onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleSend(e);
                        }
                     }}
                   />
                </div>
                <button 
                  type="submit" 
                  disabled={!message.trim()}
                  className="w-12 h-12 flex-shrink-0 bg-red-600 hover:bg-red-500 disabled:bg-[#1e2128] disabled:border disabled:border-white/5 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all shadow-xl disabled:shadow-none"
                >
                   <Send size={18} className={message.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
                </button>
             </form>
          </div>
       </div>
    </div>
  );
}
