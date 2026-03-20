"use client";
import { motion } from 'framer-motion';
import { BarChart3, Activity, Wallet, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function DashboardOverview() {
  const { data: session } = useSession();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {session?.user?.email?.split('@')[0] || 'Merchant'} 👋</h1>
        <p className="text-slate-400">Here's what's happening with your crypto payments today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Volume", value: "$12,450.00", trend: "+14.5%", icon: BarChart3, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Successful Payments", value: "342", trend: "+2.1%", icon: Activity, color: "text-green-400", bg: "bg-green-400/10" },
          { label: "Active Invoices", value: "18", trend: "-5.0%", icon: Wallet, color: "text-purple-400", bg: "bg-purple-400/10" },
          { label: "Conversion Rate", value: "98.2%", trend: "+0.4%", icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded bg-white/5 ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Revenue Overview</h2>
            <select className="bg-black/50 border border-white/10 text-sm text-slate-300 rounded-lg px-3 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
             <p className="text-slate-500 text-sm flex items-center gap-2"><BarChart3 size={16}/> Chart visualization data goes here</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            <button className="text-purple-400 text-sm hover:text-purple-300">View All</button>
          </div>
          <div className="space-y-4">
             {[1,2,3,4,5].map((i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                     <ArrowUpRight size={16} />
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-white">Payment Received</p>
                     <p className="text-xs text-slate-500">TRC20 • {i}m ago</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-bold text-white">+50.00</p>
                   <p className="text-xs text-slate-500">USDT</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
