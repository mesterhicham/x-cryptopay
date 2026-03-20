"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { Wallet, Search, Download, ArrowDownLeft, ArrowUpRight, ExternalLink, Clock, CheckCircle2, XCircle, AlertTriangle, Loader2, Copy } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  currency: string;
  network: string;
  status: string;
  from: string;
  to: string;
  invoiceId: string;
  txHash: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  PENDING: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  CONFIRMING: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: Loader2 },
  COMPLETED: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  FORWARDED: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  FAILED: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle },
  REJECTED: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle },
};

function getExplorerUrl(network: string, txHash: string) {
  if (network === 'BSC' || network === 'BEP20') return `https://bscscan.com/tx/${txHash}`;
  if (network === 'TRON' || network === 'TRC20') return `https://tronscan.org/#/transaction/${txHash}`;
  return '#';
}

export default function PaymentsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ totalDeposits: 0, totalWithdrawals: 0, pendingWithdrawals: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'DEPOSIT' | 'WITHDRAWAL'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    const token = (session as any)?.accessToken;
    if (!token) { setLoading(false); return; }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/payments/merchant/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setSummary(data.summary || { totalDeposits: 0, totalWithdrawals: 0, pendingWithdrawals: 0 });
      }
    } catch (err) {
      console.error('Fetch transactions error:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if ((session as any)?.accessToken) fetchTransactions();
  }, [session, fetchTransactions]);

  const copyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const truncate = (str: string, len = 10) => {
    if (!str || str.length <= len) return str || '-';
    return str.slice(0, 6) + '...' + str.slice(-4);
  };

  const filtered = transactions.filter(tx => {
    const matchFilter = filter === 'ALL' || tx.type === filter;
    const matchSearch = !search || 
      tx.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
      tx.txHash?.toLowerCase().includes(search.toLowerCase()) ||
      tx.to.toLowerCase().includes(search.toLowerCase()) ||
      tx.from.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Wallet className="text-purple-400" /> Payments Ledger
            </h1>
            <p className="text-slate-400 text-sm">Track and manage all deposits & withdrawals in real-time.</p>
          </div>
          <button className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
       </header>

       {/* Summary Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#14161b] border border-white/5 rounded-2xl p-5">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ArrowDownLeft size={20} />
                </div>
                <p className="text-slate-400 text-sm font-bold">Total Deposits</p>
             </div>
             <p className="text-2xl font-bold text-white">{summary.totalDeposits}</p>
          </div>
          <div className="bg-[#14161b] border border-white/5 rounded-2xl p-5">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <ArrowUpRight size={20} />
                </div>
                <p className="text-slate-400 text-sm font-bold">Total Withdrawals</p>
             </div>
             <p className="text-2xl font-bold text-white">{summary.totalWithdrawals}</p>
          </div>
          <div className="bg-[#14161b] border border-white/5 rounded-2xl p-5">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                  <AlertTriangle size={20} />
                </div>
                <p className="text-slate-400 text-sm font-bold">Pending Approval</p>
             </div>
             <p className="text-2xl font-bold text-white">{summary.pendingWithdrawals}</p>
          </div>
       </div>

       {/* Search & Filters */}
       <div className="bg-[#14161b] border border-white/5 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Invoice ID, Tx Hash, or Address..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 text-sm transition-colors" 
                />
             </div>
             <div className="flex gap-2">
                {(['ALL', 'DEPOSIT', 'WITHDRAWAL'] as const).map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      filter === f 
                        ? 'bg-purple-500/20 border-purple-500/30 text-purple-300' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {f === 'ALL' ? 'All' : f === 'DEPOSIT' ? '↓ Deposits' : '↑ Withdrawals'}
                  </button>
                ))}
             </div>
          </div>
       </div>

       {/* Transactions Table */}
       <div className="bg-[#14161b] border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20 gap-3 text-slate-400">
              <Loader2 className="animate-spin" size={24} />
              <span className="font-bold">Loading transactions...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <Wallet size={48} className="text-slate-700 mb-4" />
              <p className="text-lg text-slate-400 font-bold">No transactions found</p>
              <p className="text-sm text-slate-600 mt-1">
                {search ? 'Try a different search term.' : 'Deposits and withdrawals will appear here.'}
              </p>
            </div>
          ) : (
            <>
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[100px_1fr_1fr_120px_100px_110px_120px_80px] gap-3 px-5 py-3 bg-white/[0.02] border-b border-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Type</span>
              <span>From</span>
              <span>To</span>
              <span>Amount</span>
              <span>Network</span>
              <span>Invoice ID</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
              {filtered.map((tx) => {
                const sc = statusConfig[tx.status] || statusConfig.PENDING;
                const StatusIcon = sc.icon;
                return (
                  <motion.div 
                    key={tx.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_120px_100px_110px_120px_80px] gap-2 md:gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors items-center text-sm"
                  >
                    {/* Type */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        tx.type === 'DEPOSIT' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        {tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdraw'}
                      </span>
                    </div>

                    {/* From */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-slate-300 font-mono text-xs truncate">{truncate(tx.from, 16)}</span>
                      {tx.from.length > 10 && (
                        <button onClick={() => copyAddress(tx.from)} className="text-slate-600 hover:text-slate-300 flex-shrink-0">
                          {copiedId === tx.from ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>

                    {/* To */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-slate-300 font-mono text-xs truncate">{truncate(tx.to, 16)}</span>
                      {tx.to.length > 10 && (
                        <button onClick={() => copyAddress(tx.to)} className="text-slate-600 hover:text-slate-300 flex-shrink-0">
                          {copiedId === tx.to ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>

                    {/* Amount */}
                    <div>
                      <span className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount} <span className="text-slate-500 text-xs">{tx.currency}</span>
                      </span>
                    </div>

                    {/* Network */}
                    <div>
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded-md text-slate-300 font-bold">{tx.network}</span>
                    </div>

                    {/* Invoice ID */}
                    <div className="font-mono text-xs text-slate-400 font-bold">
                      #{tx.invoiceId}
                    </div>

                    {/* Date */}
                    <div className="text-xs text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      <br />
                      <span className="text-slate-600">{new Date(tx.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Status + TXID */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border ${sc.bg} ${sc.color}`}>
                        <StatusIcon size={12} className={tx.status === 'CONFIRMING' ? 'animate-spin' : ''} />
                        {tx.status}
                      </span>
                      {tx.txHash && (
                        <a href={getExplorerUrl(tx.network, tx.txHash)} target="_blank" rel="noopener noreferrer"
                           className="text-purple-400 hover:text-purple-300 transition-colors" title="View on Explorer">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            </>
          )}
       </div>

       {/* TXID Legend */}
       {filtered.some(tx => tx.txHash) && (
          <p className="text-xs text-slate-600 text-center">
            Click <ExternalLink size={10} className="inline text-purple-400" /> to track any transaction on the blockchain explorer.
          </p>
       )}
    </motion.div>
  );
}
