"use client";
import { motion } from 'framer-motion';
import { KeyRound, Webhook, BarChart3, Copy, CheckCircle2 } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function MerchantDashboard() {
  const { data: session }: any = useSession();
  const [copied, setCopied] = useState(false);
  const [keys, setKeys] = useState<{ apiKey: string, apiSecret: string } | null>(null);

  useEffect(() => {
    if (session?.accessToken) {
      fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      })
      .then(res => res.json())
      .then(data => setKeys({ apiKey: data.apiKey, apiSecret: data.apiSecret }))
      .catch(console.error);
    }
  }, [session]);

  const handleCopy = () => {
    if (keys?.apiSecret) {
      navigator.clipboard.writeText(keys.apiSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-12 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Merchant Integration</h1>
        <p className="text-slate-400">Configure your webhooks and copy your strictly confidential API keys.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-7 space-y-6">
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 blur-[80px] pointer-events-none"></div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2 rounded bg-purple-500/20 text-purple-400"><KeyRound size={20} /></div>
              API Credentials
            </h2>
            
            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold text-white tracking-wide mb-2 flex items-center gap-1.5">
                  Public Key <span className="bg-white/10 text-slate-300 px-2 py-0.5 rounded font-mono border border-white/5 tracking-normal">apiKey</span>
                </label>
                <div className="flex flex-col sm:flex-row items-center bg-black/50 border border-white/10 rounded-xl p-1 shadow-inner gap-2">
                  <input type="text" value={keys?.apiKey || "Loading..."} readOnly className="bg-transparent text-slate-300 w-full px-4 py-2 outline-none font-mono text-sm" />
                </div>
                <p className="text-xs text-slate-400 mt-2">Use this public key to identify your store in client-side integrations if needed.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-white tracking-wide mb-2 flex items-center gap-1.5">
                  Secret Key <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono border border-purple-500/30 tracking-normal">x-api-key</span>
                </label>
                <div className="flex flex-col sm:flex-row items-center bg-black/50 border border-white/10 rounded-xl p-1 shadow-inner gap-2">
                  <input type="password" value={keys?.apiSecret || "Loading..."} readOnly className="bg-transparent text-slate-300 w-full px-4 py-2 outline-none font-mono text-sm" />
                  <button onClick={handleCopy} className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">Pass this exact value in the <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-purple-300">x-api-key</code> HTTP header to authenticate server-side requests.</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Webhook size={14} className="text-blue-400"/> Webhook Endpoint
                </label>
                <input type="text" defaultValue="https://api.your-store.com/crypto/callback" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-slate-300 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm font-mono" />
                <p className="text-xs text-slate-500 mt-2">We will send HMAC-SHA256 signed POST requests here when a payment completes.</p>
              </div>

              <button className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                Save Webhook Configuration
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-5">
           <div className="glass-card p-6 h-full relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] pointer-events-none"></div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white relative z-10">
              <div className="p-2 rounded bg-blue-500/20 text-blue-400"><BarChart3 size={20} /></div>
              Integration Health
            </h2>

            <div className="space-y-4 relative z-10">
              <div className="bg-black/30 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-slate-400 text-sm mb-1">Today's Handled Webhooks</p>
                <p className="text-3xl font-bold text-white">420 <span className="text-sm font-normal text-slate-500">requests</span></p>
              </div>
              <div className="bg-black/30 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-slate-400 text-sm mb-1">Active Deposit Addresses</p>
                <p className="text-3xl font-bold text-white">124</p>
              </div>
              <div className="bg-black/30 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-slate-400 text-sm mb-1">Webhook Delivery Rate</p>
                <p className="text-3xl font-bold text-green-400">99.98%</p>
              </div>
            </div>
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
