"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Repeat, Layers, Cpu, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How does the Auto-Forwarding work?", a: "Our proprietary Gas Station automatically funds your deterministic deposit addresses with native network gas (TRX/BNB) the moment a USDT payment hits the blockchain. It then instantly sweeps the funds to your cold wallet." },
    { q: "Which blockchains are supported?", a: "We currently support TRON (TRC20) and BNB Smart Chain (BEP20). Both offer lightning-fast confirmations and extremely low transaction fees compared to Ethereum." },
    { q: "Are my funds safe?", a: "Yes. x-cryptopay operates on a non-custodial sweeping architecture. Funds never sit in hot wallets; they are swept essentially in the same block they become confirmed." },
    { q: "How do Webhooks work?", a: "Whenever a payment state changes to COMPLETED, our backend fires an HMAC-SHA256 authenticated POST request to your specified Webhook URL, allowing you to instantly fulfill customer orders." }
  ];

  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-32 w-full text-center overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="px-4 py-20 w-full max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <motion.div initial="hidden" animate="show" variants={fadeIn} className="mb-8">
          <span className="px-5 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-bold tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span> x-cryptopay 2.0 is Live
          </span>
        </motion.div>
        
        <motion.h1 initial="hidden" animate="show" variants={fadeIn} className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white leading-tight">
          The Ultimate Crypto <br />
          <span className="gradient-text">Payment Gateway</span>
        </motion.h1>
        
        <motion.p initial="hidden" animate="show" variants={fadeIn} className="text-slate-400 max-w-3xl text-lg md:text-2xl mb-14 font-medium leading-relaxed">
          Accept USDT natively on your platform. We handle the blockchain scanning, gas funding, and cold-wallet sweeping—so you can focus on building your business.
        </motion.p>
        
        <motion.div initial="hidden" animate="show" variants={fadeIn} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-4">
          <Link href="/register" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3 group translate-y-0 hover:-translate-y-1">
            Start Processing Now <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 rounded-2xl glass-card text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
            Developer API
          </Link>
        </motion.div>
      </section>

      {/* Network Belt */}
      <section className="w-full border-y border-white/5 bg-white/5 py-10 my-10 overflow-hidden flex justify-center">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-3 text-lg md:text-2xl font-black tracking-widest"><Layers size={32} className="text-red-500"/> TRON NETWORK</div>
           <div className="flex items-center gap-3 text-lg md:text-2xl font-black tracking-widest"><Globe size={32} className="text-yellow-500"/> BINANCE SMART CHAIN</div>
           <div className="flex items-center gap-3 text-lg md:text-2xl font-black tracking-widest"><Cpu size={32} className="text-green-500"/> TETHER USDT</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 w-full max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for <span className="text-blue-400">Scale</span> & <span className="text-purple-400">Security</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to accept crypto payments without the infrastructural headaches.</p>
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { title: "Non-Custodial Sweeping", desc: "Funds barely touch hot wallets. Automatic sweeping ensures your capital is quickly secured in your final destination.", icon: Repeat, color: "text-blue-400", bg: "bg-blue-400/10" },
            { title: "Smart Gas Station", desc: "No more maintaining TRX or BNB in deposit accounts. The central station autonomously delegates precise gas required.", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
            { title: "Military-Grade Security", desc: "Mnemonic-based HD wallets paired with HMAC-SHA256 authenticated webhooks guarantee bulletproof infrastructure.", icon: ShieldCheck, color: "text-purple-400", bg: "bg-purple-400/10" }
          ].map((feature, i) => (
             <motion.div key={i} variants={fadeIn} className="glass-card p-10 group hover:-translate-y-3 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
               <div className={`absolute -right-10 -top-10 w-40 h-40 ${feature.bg} rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
               <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 shadow-inner border border-white/5`}>
                 <feature.icon size={28} className={feature.color} />
               </div>
               <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
               <p className="text-slate-400 leading-relaxed text-base">{feature.desc}</p>
             </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-24 w-full max-w-3xl mx-auto text-left">
        <h2 className="text-4xl font-bold text-center text-white mb-16">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-6 text-left flex justify-between items-center text-lg font-semibold text-slate-200 hover:text-white transition-colors">
                {faq.q}
                <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-purple-400' : 'text-slate-500'}`} />
              </button>
              <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out border-t border-white/5 ${openFaq === i ? 'max-h-[300px] opacity-100 py-6' : 'max-h-0 opacity-0 border-transparent py-0'}`}>
                <p className="text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-12 mt-20 text-slate-500 text-sm">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0 font-bold text-slate-300">
               <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs">X</div>
               x-cryptopay
            </div>
            <p>© 2026 x-cryptopay. All rights reserved. Production Build.</p>
         </div>
      </footer>
    </div>
  );
}
