"use client";
import { motion } from 'framer-motion';
import { Clock, Search, Download, Filter, ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function TransactionsPage() {
  const mockTransactions = [
    { id: "tx_1", type: "receive", amount: "+500.00", currency: "USDT", network: "TRC20", status: "completed", date: "2026-03-20 10:42 AM", hash: "Txyz...789a" },
    { id: "tx_2", type: "receive", amount: "+150.50", currency: "USDT", network: "BEP20", status: "completed", date: "2026-03-20 09:15 AM", hash: "0xabc...1234" },
    { id: "tx_3", type: "sweep", amount: "-149.00", currency: "USDT", network: "BEP20", status: "completed", date: "2026-03-20 09:16 AM", hash: "0xdef...5678" },
    { id: "tx_4", type: "receive", amount: "+1200.00", currency: "USDT", network: "TRC20", status: "pending", date: "2026-03-20 08:30 AM", hash: "Tqwe...rtyu" },
    { id: "tx_5", type: "receive", amount: "+50.00", currency: "USDT", network: "BEP20", status: "failed", date: "2026-03-19 11:20 PM", hash: "0x123...abcd" },
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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><Clock className="text-blue-400" /> Transaction History</h1>
          <p className="text-slate-400">View all incoming payments and outgoing sweeps in real-time.</p>
        </div>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors flex items-center gap-2">
          <Download size={16} /> Export CSV
        </button>
      </header>

      <div className="glass-card p-6 min-h-[500px] flex flex-col">
         <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
               <input type="text" placeholder="Search by Tx Hash, Network, or Date..." className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <button className="px-4 py-2 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
              <Filter size={18} /> All Networks
            </button>
         </div>

         <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500 font-semibold">
                  <th className="pb-4 pl-4 font-medium">Transaction info</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Network</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockTransactions.map((tx, i) => (
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
                          <p className="text-sm font-semibold text-white">{tx.type === 'receive' ? 'Payment Received' : 'Auto-Sweep'}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{tx.hash}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className={`text-sm font-bold ${tx.type === 'receive' ? 'text-green-400' : 'text-slate-300'}`}>{tx.amount}</p>
                      <p className="text-xs text-slate-500">{tx.currency}</p>
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
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(tx.status)}`}>
                        {getStatusIcon(tx.status)}
                        <span className="capitalize">{tx.status}</span>
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
