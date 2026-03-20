"use client";
import { motion } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, Paperclip, Headset, Image as ImageIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function MerchantSupportPage() {
  const { data: session } = useSession();
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
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessage('');
    
    // Simulate auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'admin',
        text: 'Thank you for reaching out! We have received your message and our team will get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  // We use negative margins to negate the layout padding and take the absolute full screen available.
  return (
    <div className="h-[calc(100vh-88px)] -mx-6 md:-mx-10 -mt-6 md:-mt-10 flex bg-[#0B0C10] overflow-hidden justify-center relative">
       
       {/* Background ambient lighting */}
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none"></div>

       {/* Chat Area - Single column for merchant focused directly on chat, but bounded to max-w-4xl for readability */}
       <div className="flex-1 w-full flex flex-col z-10 bg-[#0B0C10]/50 backdrop-blur-3xl border-x border-white/5 shadow-2xl relative max-w-5xl">

          {/* Chat Navbar Header */}
          <div className="h-[72px] px-6 md:px-8 border-b border-white/5 flex justify-between items-center bg-[#14161b]/90 backdrop-blur-md z-10">
             <div className="flex items-center gap-3.5">
                <div className="relative">
                   <div className="w-11 h-11 bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 shadow-inner rounded-full flex items-center justify-center text-slate-200">
                      <Headset size={20} className="opacity-90" />
                   </div>
                   <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#14161b] rounded-full"></span>
                </div>
                <div>
                   <h3 className="text-[16px] text-white font-bold tracking-wide">Platform Admin Team</h3>
                   <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pt-0.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> We usually reply instantly
                   </p>
                </div>
             </div>
             <div>
                <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-bold tracking-wide flex items-center gap-2">
                   <MessageSquare size={13} /> Dedicated Support
                </div>
             </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
             <div className="text-center pb-2">
                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">Today</span>
             </div>

             {messages.map((msg) => (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                   <div className={`flex items-end gap-2.5 max-w-[85%] lg:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold shadow-md border border-white/10 
                         ${msg.sender === 'admin' ? 'bg-slate-800 text-slate-300' : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'}`}>
                         {msg.sender === 'admin' ? <Headset size={14} /> : 'ME'}
                      </div>

                      <div className={`px-5 py-3.5 shadow-lg relative ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-600 to-cyan-600 border border-blue-500/50 text-white rounded-[20px] rounded-br-sm' : 'bg-[#1e2128] text-slate-200 border border-white/5 rounded-[20px] rounded-bl-sm'}`}>
                         <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                         
                         <div className={`flex items-center justify-end gap-1.5 mt-2 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                            <span className="text-[10px] font-bold tracking-wider">{msg.time}</span>
                            {msg.sender === 'user' && <CheckCircle2 size={12} />}
                         </div>
                      </div>
                   </div>
                </motion.div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 md:p-6 bg-[#14161b]/90 border-t border-white/5 backdrop-blur-xl z-20">
             <form onSubmit={handleSend} className="flex gap-3 items-end w-full">
                <button type="button" className="p-3 text-slate-400 hover:text-white bg-[#1e2128] border border-white/5 hover:bg-slate-700 rounded-full transition-colors flex-shrink-0 shadow-sm">
                   <ImageIcon size={18} />
                </button>
                <div className="flex-1 bg-[#1e2128] border border-white/5 rounded-[28px] flex items-center px-2 py-1.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-inner">
                   <textarea 
                     rows={1}
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     placeholder="Type your message to support..." 
                     className="w-full bg-transparent px-4 py-2.5 text-slate-200 outline-none text-[15px] resize-none scrollbar-none max-h-32 placeholder-slate-500"
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
                  className="w-14 h-14 flex-shrink-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-[#1e2128] disabled:to-[#1e2128] disabled:border disabled:border-white/5 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all shadow-xl disabled:shadow-none"
                >
                   <Send size={20} className={message.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
                </button>
             </form>
          </div>
       </div>
    </div>
  );
}
