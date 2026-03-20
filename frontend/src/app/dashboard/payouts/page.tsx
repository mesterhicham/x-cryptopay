"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { Wallet, CheckCircle2, XCircle, Clock, Send, ExternalLink, Unplug, Plug, AlertTriangle, Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface PayoutReq {
  id: string;
  amount: number;
  currency: string;
  network: string;
  toAddress: string;
  status: string;
  txHash?: string;
  createdAt: string;
}

const USDT_CONTRACTS: Record<string, string> = {
  BSC: '0x55d398326f99059fF775485246999027B3197955',
};

const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

const walletProviders = [
  { id: 'metamask', name: 'MetaMask', bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', icon: '🦊' },
  { id: 'tokenpocket', name: 'TokenPocket', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: '💼' },
  { id: 'trustwallet', name: 'Trust Wallet', bg: 'bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-400', icon: '🛡️' },
  { id: 'okx', name: 'OKX Wallet', bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-300', icon: '⭕' },
];

export default function PayoutVaultsPage() {
  const { data: session } = useSession();
  
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectedWith, setConnectedWith] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const [pendingPayouts, setPendingPayouts] = useState<PayoutReq[]>([]);
  const [completedPayouts, setCompletedPayouts] = useState<PayoutReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const connectedProvider = walletProviders.find(w => w.id === connectedWith);

  // ---- Connect Wallet ----
  const connectWallet = async (providerId: string) => {
    const eth = (window as any).ethereum;
    if (!eth) {
      showToast(`Please install ${walletProviders.find(w => w.id === providerId)?.name || 'a wallet'} browser extension first.`, 'error');
      return;
    }
    setConnecting(true);
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      setConnectedWith(providerId);
      setShowWalletModal(false);
      await fetchBalance(accounts[0]);
    } catch (err: any) {
      showToast('Wallet connection was rejected', 'error');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletBalance(null);
    setConnectedWith(null);
  };

  const fetchBalance = async (address: string) => {
    try {
      const eth = (window as any).ethereum;
      if (eth) {
        const { ethers } = await import('ethers');
        const provider = new ethers.BrowserProvider(eth);
        const contract = new ethers.Contract(USDT_CONTRACTS.BSC, ERC20_ABI, provider);
        const bal = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        setWalletBalance(ethers.formatUnits(bal, decimals));
      }
    } catch (e) {
      setWalletBalance('--');
    }
  };

  // ---- Fetch Payout Queue ----
  const fetchPayouts = useCallback(async () => {
    const token = (session as any)?.accessToken;
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch(`${API_URL}/api/payouts/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingPayouts(data.pendingPayouts || []);
        setCompletedPayouts(data.completedPayouts || []);
      }
    } catch (err) {
      console.error('Fetch payouts error:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if ((session as any)?.accessToken) fetchPayouts();
  }, [session, fetchPayouts]);

  // ---- Approve & Sign via Wallet ----
  const handleApprove = async (payout: PayoutReq) => {
    if (!walletAddress) {
      showToast('Please connect your wallet first', 'error');
      return;
    }
    setProcessingId(payout.id);
    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(USDT_CONTRACTS.BSC, ERC20_ABI, signer);
      const decimals = await contract.decimals();
      const amountWei = ethers.parseUnits(payout.amount.toString(), decimals);

      const tx = await contract.transfer(payout.toAddress, amountWei);
      showToast('Transaction sent! Waiting for confirmation...', 'success');
      const receipt = await tx.wait();

      await fetch(`${API_URL}/api/payouts/${payout.id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${(session as any)?.accessToken}` },
        body: JSON.stringify({ txHash: receipt.hash })
      });

      showToast(`Payout of ${payout.amount} USDT confirmed!`, 'success');
      fetchPayouts();
      if (walletAddress) fetchBalance(walletAddress);
    } catch (err: any) {
      showToast(err.reason || err.message || 'Transaction failed', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // ---- Reject ----
  const handleReject = async (payoutId: string) => {
    try {
      await fetch(`${API_URL}/api/payouts/${payoutId}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${(session as any)?.accessToken}` }
      });
      showToast('Payout request rejected', 'success');
      fetchPayouts();
    } catch (err) {
      showToast('Failed to reject', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

       {/* Toast */}
       <AnimatePresence>
          {toast && (
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                {toast.message}
             </motion.div>
          )}
       </AnimatePresence>

       {/* Wallet Selection Modal */}
       <AnimatePresence>
          {showWalletModal && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowWalletModal(false)}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                   className="bg-[#14161b] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
                   onClick={(e) => e.stopPropagation()}>
                   <h3 className="text-xl font-bold text-white mb-2">Connect Wallet</h3>
                   <p className="text-slate-400 text-sm mb-6">Choose your preferred wallet to approve payouts.</p>
                   
                   <div className="space-y-3">
                      {walletProviders.map((wp) => (
                         <button 
                           key={wp.id}
                           onClick={() => connectWallet(wp.id)}
                           disabled={connecting}
                           className={`w-full flex items-center gap-4 p-4 rounded-2xl border ${wp.border} ${wp.bg} hover:bg-white/10 transition-all group disabled:opacity-50`}
                         >
                            <span className="text-3xl w-12 h-12 flex items-center justify-center bg-black/30 rounded-xl">{wp.icon}</span>
                            <div className="flex-1 text-left">
                               <p className={`font-bold ${wp.text} group-hover:text-white transition-colors`}>{wp.name}</p>
                               <p className="text-xs text-slate-500">EVM Compatible</p>
                            </div>
                            {connecting ? <Loader2 size={18} className="text-slate-400 animate-spin" /> : <ExternalLink size={16} className="text-slate-500" />}
                         </button>
                      ))}
                   </div>
                   
                   <button onClick={() => setShowWalletModal(false)} className="w-full mt-4 py-3 text-slate-400 hover:text-white text-sm font-bold transition-colors">
                      Cancel
                   </button>
                </motion.div>
             </motion.div>
          )}
       </AnimatePresence>

       <header>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Automated Payout Vaults</h1>
          <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
            Connect your external wallet and approve payout requests from your platform's investors. 
            Every withdrawal requires your explicit wallet signature — you remain in full control.
          </p>
       </header>

       {/* Wallet Connection Card */}
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#14161b] border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
             <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border text-2xl ${walletAddress && connectedProvider ? `${connectedProvider.bg} ${connectedProvider.border}` : 'bg-slate-800 border-white/10 text-slate-400'}`}>
                   {walletAddress && connectedProvider ? connectedProvider.icon : <Wallet size={28} />}
                </div>
                <div>
                   {walletAddress ? (
                     <>
                       <p className="text-white font-bold text-lg flex items-center gap-2">
                         {connectedProvider?.name || 'Wallet'} Connected
                         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                       </p>
                       <p className="text-sm text-slate-400 font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                       {walletBalance && <p className="text-xs text-blue-400 font-bold mt-0.5">{parseFloat(walletBalance).toFixed(2)} USDT available</p>}
                     </>
                   ) : (
                     <>
                       <p className="text-white font-bold text-lg">No Wallet Connected</p>
                       <p className="text-sm text-slate-500">Connect a wallet to approve payouts</p>
                     </>
                   )}
                </div>
             </div>
             
             {walletAddress ? (
                <button onClick={disconnectWallet} className="px-5 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                   <Unplug size={16} /> Disconnect
                </button>
             ) : (
                <button onClick={() => setShowWalletModal(true)} className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                   <Plug size={16} /> Connect Wallet
                </button>
             )}
          </div>
       </motion.div>

       {/* Pending Payouts Queue */}
       <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <Clock size={20} className="text-yellow-500" />
             Pending Approval 
             {pendingPayouts.length > 0 && <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">{pendingPayouts.length}</span>}
          </h2>

          {pendingPayouts.length === 0 ? (
             <div className="bg-[#14161b] border border-white/5 rounded-2xl p-12 text-center">
                <Clock size={40} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold">No pending payout requests</p>
                <p className="text-slate-600 text-sm mt-1">When your platform sends a payout request via API, it will appear here.</p>
             </div>
          ) : (
             <div className="space-y-3">
                {pendingPayouts.map((payout) => (
                   <motion.div 
                     key={payout.id}
                     initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                     className="bg-[#14161b] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/10 transition-colors"
                   >
                     <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 flex-shrink-0">
                           <Send size={18} />
                        </div>
                        <div className="min-w-0">
                           <p className="text-white font-bold">{payout.amount} <span className="text-slate-400">{payout.currency}</span> <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-md text-slate-300 ml-1">{payout.network}</span></p>
                           <p className="text-xs text-slate-400 font-mono truncate mt-0.5">→ {payout.toAddress}</p>
                        </div>
                     </div>
                     <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleReject(payout.id)} className="px-4 py-2.5 bg-slate-800 hover:bg-red-500/20 border border-white/5 hover:border-red-500/20 text-slate-300 hover:text-red-400 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                           <XCircle size={15} /> Reject
                        </button>
                        <button 
                           onClick={() => handleApprove(payout)} 
                           disabled={!walletAddress || processingId === payout.id}
                           className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:shadow-none flex items-center gap-2"
                        >
                           {processingId === payout.id ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                           {processingId === payout.id ? 'Signing...' : 'Approve & Sign'}
                        </button>
                     </div>
                   </motion.div>
                ))}
             </div>
          )}
       </div>

       {/* Completed Payouts */}
       {completedPayouts.length > 0 && (
          <div>
             <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-500" /> Completed Payouts
             </h2>
             <div className="space-y-2">
                {completedPayouts.map((payout) => (
                  <div key={payout.id} className="bg-[#14161b] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                           <CheckCircle2 size={16} />
                        </div>
                        <div>
                           <p className="text-white font-bold text-sm">{payout.amount} {payout.currency} <span className="text-xs text-slate-500">{payout.network}</span></p>
                           <p className="text-xs text-slate-500 font-mono truncate max-w-[200px]">→ {payout.toAddress}</p>
                        </div>
                     </div>
                     {payout.txHash && (
                        <a href={`https://bscscan.com/tx/${payout.txHash}`} target="_blank" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold">
                           View <ExternalLink size={12} />
                        </a>
                     )}
                  </div>
                ))}
             </div>
          </div>
       )}

       {/* Warning */}
       {!walletAddress && pendingPayouts.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 flex items-start gap-4">
             <AlertTriangle size={24} className="text-yellow-500 flex-shrink-0 mt-0.5" />
             <div>
                <p className="text-yellow-400 font-bold">Action Required</p>
                <p className="text-yellow-200/70 text-sm">You have {pendingPayouts.length} pending payout(s) waiting for approval. Connect your wallet to sign the transactions.</p>
             </div>
          </div>
       )}
    </div>
  );
}
