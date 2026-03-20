"use client";
import { motion } from 'framer-motion';
import { FileText, Search, Download, Filter, ArrowDownRight, ArrowUpRight, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminPaymentsPage() {
  const { data: session }: any = useSession();
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepSuccess, setSweepSuccess] = useState(false);

  const mockGlobalPayments = [
    { id: "g_tx_1", merchant: "admin@x-cryptopay.com", type: "receive", amount: "+500.00", currency: "USDT", network: "TRC20", status: "completed", date: "2026-03-20 10:42 AM", hash: "Txyz...789a", fee: "5.00" },
    { id: "g_tx_2", merchant: "gaming_platform@app.io", type: "receive", amount: "+150.50", currency: "USDT", network: "BEP20", status: "completed", date: "2026-03-20 09:15 AM", hash: "0xabc...1234", fee: "1.50" },
    { id: "g_tx_3", merchant: "gaming_platform@app.io", type: "sweep", amount: "-149.00", currency: "USDT", network: "BEP20", status: "completed", date: "2026-03-20 09:16 AM", hash: "0xdef...5678", fee: "0.00" },
    { id: "g_tx_4", merchant: "merchant_a@example.com", type: "receive", amount: "+1200.00", currency: "USDT", network: "TRC20", status: "pending", date: "2026-03-20 08:30 AM", hash: "Tqwe...rtyu", fee: "12.00" },
    { id: "g_tx_5", merchant: "test_store@shop.com", type: "receive", amount: "+50.00", currency: "USDT", network: "BEP20", status: "failed", date: "2026-03-19 11:20 PM", hash: "0x123...abcd", fee: "0.50" },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'pending': return <Loader2 size={16} className="text-yellow-500 animate-spin" />;
      case 'failed': return <XCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'failed': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const handleSweep = async () => {
    setIsSweeping(true);
    try {
      if (session?.accessToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/sweep-fees`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
      }
      setTimeout(() => {
        setIsSweeping(false);
        setSweepSuccess(true);
        setTimeout(() => setSweepSuccess(false), 3000);
      }, 1500);
    } catch (e) {
      console.error("Sweep failed", e);
      setIsSweeping(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto pb-20">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><FileText className="text-red-400" /> Global Ledger</h1>
          <p className="text-slate-400">Monitor all system-wide payments, fee collections, and sweep operations.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleSweep}
            disabled={isSweeping || sweepSuccess}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${sweepSuccess ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50'}`}
          >
            {isSweeping ? <Loader2 size={16} className="animate-spin" /> : (sweepSuccess ? <CheckCircle2 size={16} /> : <ArrowUpRight size={16} />)}
            {isSweeping ? 'Initiating Sweep...' : (sweepSuccess ? 'Sweep Initiated !' : 'Sweep Platform Fees')}
          </button>
          
          <button className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      <div className="glass-card p-6 min-h-[500px] flex flex-col border border-red-500/10 relative overflow-hidden mt-6">
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] pointer-events-none"></div>

         <div className="flex flex-col sm:flex-row gap-4 mb-6 relative z-10">
            <div className="flex-1 relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
               <input type="text" placeholder="Search across all merchants, hashes, or networks..." className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-red-500/50 transition-colors shadow-inner" />
            </div>
            <button className="px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
              <Filter size={18} /> Advanced Filters
            </button>
         </div>

         <div className="flex-1 overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500 font-semibold">
                  <th className="pb-4 pl-4 font-medium">Tx Details</th>
                  <th className="pb-4 font-medium">Merchant</th>
                  <th className="pb-4 font-medium">Vol / Fee</th>
                  <th className="pb-4 font-medium">Network</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 pr-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockGlobalPayments.map((tx, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    key={tx.id} 
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'receive' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {tx.type === 'receive' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{tx.type === 'receive' ? 'Deposit' : 'Sweep'}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5" title={tx.hash}>{tx.hash}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-white/10">
                           {tx.merchant[0].toUpperCase()}
                         </div>
                         <p className="text-sm text-slate-300">{tx.merchant}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className={`text-sm font-bold ${tx.type === 'receive' ? 'text-green-400' : 'text-slate-300'}`}>{tx.amount} <span className="font-normal text-xs text-slate-500">{tx.currency}</span></p>
                      <p className="text-xs text-slate-400 mt-0.5">Fee: <span className="text-red-300 font-medium">-{tx.fee}</span></p>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-white/5 rounded text-xs font-semibold text-slate-300 border border-white/5">
                        {tx.network}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-sm text-slate-300">{tx.date.split(' ')[0]}</p>
                      <p className="text-xs text-slate-500">{tx.date.split(' ').slice(1).join(' ')}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <div className={`flex items-center justify-end`}>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(tx.status)}`}>
                          {getStatusIcon(tx.status)}
                          <span className="capitalize">{tx.status}</span>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </motion.div>
  );
}
