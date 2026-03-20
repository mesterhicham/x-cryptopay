"use client";
import { motion } from 'framer-motion';
import { Activity, DollarSign, Wallet, RefreshCw, ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: "Total Swept Fees", value: "1,492.50", currency: "USDT", icon: DollarSign, color: "text-green-400" },
    { title: "Gas Station (BSC)", value: "4.15", currency: "BNB", icon: Wallet, color: "text-yellow-400" },
    { title: "Gas Station (TRON)", value: "15,300", currency: "TRX", icon: RefreshCw, color: "text-red-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-12 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Command Center</h1>
          <p className="text-slate-400">Monitor liquidity, platform fees, and network conditions.</p>
        </div>
        <div className="flex gap-4">
          <span className="px-4 py-2 border border-green-500/30 bg-green-500/10 rounded-full text-sm text-green-400 flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Scanners Operational
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 flex flex-col relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-white/5 transition-transform duration-500 group-hover:scale-110">
              <s.icon size={140} />
            </div>
            <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${s.color} mb-4`}>
              <s.icon size={20} />
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1 z-10">{s.title}</h3>
            <p className="text-3xl font-bold text-white tracking-tight z-10">{s.value} <span className="text-base text-slate-500 font-normal">{s.currency}</span></p>
          </motion.div>
        ))}
      </div>

      <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Live Transactions</h2>
          <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">View All <ChevronRight size={16}/></button>
        </div>
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 relative">
                <th className="p-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Hash</th>
                <th className="p-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Merchant</th>
                <th className="p-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Amount</th>
                <th className="p-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Network</th>
                <th className="p-4 font-medium text-slate-400 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-sm text-blue-400">#TRX-8291...</td>
                <td className="p-4 text-sm text-slate-300">Project Alpha</td>
                <td className="p-4 text-sm font-semibold text-white">500.00 USDT</td>
                <td className="p-4"><span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">TRC20</span></td>
                <td className="p-4"><span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 font-medium">Forwarded</span></td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-sm text-blue-400">#BSC-1102...</td>
                <td className="p-4 text-sm text-slate-300">Store Beta</td>
                <td className="p-4 text-sm font-semibold text-white">1,250.00 USDT</td>
                <td className="p-4"><span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20">BEP20</span></td>
                <td className="p-4"><span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 font-medium animate-pulse">Confirming</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.section>
    </motion.div>
  );
}
