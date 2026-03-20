"use client";
import { motion } from 'framer-motion';
import { Server, Database, Globe, Cpu, Activity, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AdminStatusPage() {
  const services = [
    { name: "MySQL Database", status: "operational", latency: "14ms", uptime: "99.99%", icon: Database, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "BSC Node RPC", status: "operational", latency: "125ms", uptime: "100.00%", icon: Globe, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { name: "TRON Node RPC", status: "degraded", latency: "840ms", uptime: "97.50%", icon: Server, color: "text-red-400", bg: "bg-red-400/10" },
    { name: "Webhook Dispatcher", status: "operational", latency: "45ms", uptime: "99.95%", icon: Activity, color: "text-green-400", bg: "bg-green-400/10" },
    { name: "JWT Auth Service", status: "operational", latency: "5ms", uptime: "100.00%", icon: ShieldCheck, color: "text-purple-400", bg: "bg-purple-400/10" },
    { name: "Background Scanner", status: "operational", latency: "---", uptime: "99.90%", icon: Cpu, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto pb-20">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><Server className="text-red-400" /> System Health</h1>
          <p className="text-slate-400">Real-time status of all microservices, nodes, and APIs operating within the platform.</p>
        </div>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          <RefreshCw size={16} /> Refresh Status
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 relative">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        {services.map((service, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className={`glass-card p-6 border ${service.status === 'degraded' ? 'border-yellow-500/30' : 'border-white/5'} hover:-translate-y-1 transition-transform cursor-default`}
           >
             <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.bg} ${service.color} border border-white/5 shadow-inner`}>
                  <service.icon size={24} />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${service.status === 'operational' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]'}`}>
                  {service.status === 'operational' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  <span className="capitalize">{service.status}</span>
                </div>
             </div>
             
             <h3 className="text-lg font-bold text-white mb-4">{service.name}</h3>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                   <p className="text-xs text-slate-500 mb-1">Latency</p>
                   <p className="text-sm font-semibold text-slate-300">{service.latency}</p>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                   <p className="text-xs text-slate-500 mb-1">Uptime (30d)</p>
                   <p className="text-sm font-semibold text-slate-300">{service.uptime}</p>
                </div>
             </div>
           </motion.div>
        ))}
      </div>

      <div className="glass-card p-6 border border-white/5 md:p-8">
         <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Cpu className="text-slate-400" /> Active Scanners Lifecycle</h2>
         
         <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
               <div>
                 <p className="text-white font-semibold">Binance Smart Chain (BEP20) Scanner</p>
                 <p className="text-xs text-slate-500 mt-1">Polling interval: 10s • Last block processed: 37192842</p>
               </div>
               <div className="flex items-center gap-2">
                 <span className="px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)] flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
                   Running
                 </span>
               </div>
            </div>
            
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
               <div>
                 <p className="text-white font-semibold">TRON Network (TRC20) Scanner</p>
                 <p className="text-xs text-slate-500 mt-1">Polling interval: 10s • Last block processed: 59384910</p>
               </div>
               <div className="flex items-center gap-2">
                 <span className="px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)] flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
                   Running
                 </span>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
