"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Shield, Ban, Edit, KeyRound, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const initialUsers = [
  { id: "usr_1", email: "admin@x-cryptopay.com", role: "ADMIN", status: "active", joined: "2026-03-20" },
  { id: "usr_2", email: "merchant_a@example.com", role: "USER", status: "active", joined: "2026-03-19" },
  { id: "usr_3", email: "test_store@shop.com", role: "USER", status: "suspended", joined: "2026-03-18" },
  { id: "usr_4", email: "gaming_platform@app.io", role: "USER", status: "active", joined: "2026-03-15" },
  { id: "usr_5", email: "scammer_123@fake.com", role: "USER", status: "banned", joined: "2026-03-10" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'warn' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warn' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const cycleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        let newStatus = 'active';
        if (u.status === 'active') newStatus = 'suspended';
        else if (u.status === 'suspended') newStatus = 'banned';
        
        showToast(`User ${u.email} status changed to ${newStatus.toUpperCase()}`, newStatus === 'active' ? 'success' : newStatus === 'suspended' ? 'warn' : 'error');
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const regenerateKeys = (email: string) => {
    showToast(`New API Keys generated and sent to ${email}`, 'success');
  };

  const editUser = (email: string) => {
    showToast(`Edit panel opened for ${email} (Interactive Mode)`, 'success');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]';
      case 'suspended': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.1)]';
      case 'banned': return 'text-red-400 bg-red-400/10 border-red-400/20 shadow-[0_0_10px_rgba(248,113,113,0.1)]';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto pb-20 relative">
      
      {/* Toast Notification System */}
      <AnimatePresence>
         {toast && (
            <motion.div 
               initial={{ opacity: 0, y: 50, scale: 0.9 }} 
               animate={{ opacity: 1, y: 0, scale: 1 }} 
               exit={{ opacity: 0, scale: 0.9 }} 
               className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full flex items-center gap-3 font-semibold shadow-2xl z-50 border backdrop-blur-md
                  ${toast.type === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 
                    toast.type === 'warn' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' : 
                    'bg-red-500/20 text-red-300 border-red-500/50'}`
               }
            >
               {toast.type === 'success' && <CheckCircle2 size={18} />}
               {toast.type === 'warn' && <AlertTriangle size={18} />}
               {toast.type === 'error' && <AlertCircle size={18} />}
               {toast.message}
            </motion.div>
         )}
      </AnimatePresence>

      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><Users className="text-red-400" /> User Management</h1>
          <p className="text-slate-400">Manage all registered merchants, monitor roles, and enforce platform blocklists.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            Export Analytics
          </button>
          <button className="px-4 py-2.5 bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Shield size={16} /> Provision Admin
          </button>
        </div>
      </header>

      <div className="glass-card p-6 min-h-[500px] flex flex-col border border-red-500/10 relative overflow-hidden mt-6">
         {/* Subtle background glow for Admin section */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] pointer-events-none"></div>

         <div className="flex gap-4 mb-6 relative z-10">
            <div className="flex-1 relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
               <input type="text" placeholder="Search by email, ID, or role..." className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-red-500/50 transition-colors shadow-inner" />
            </div>
         </div>

         <div className="flex-1 overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500 font-semibold">
                  <th className="pb-4 pl-4 font-medium">User Profile</th>
                  <th className="pb-4 font-medium">System Role</th>
                  <th className="pb-4 font-medium">Account Status</th>
                  <th className="pb-4 font-medium">Joined Date</th>
                  <th className="pb-4 pr-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    key={user.id} 
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg border border-white/10 shadow-inner">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{user.email}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1.5 rounded text-xs font-bold border tracking-wide ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-slate-500/10 text-slate-300 border-slate-500/20'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border capitalize flex items-center w-max transition-colors ${getStatusColor(user.status)}`}>
                        <div className={`w-2 h-2 rounded-full mr-1.5 ${user.status === 'active' ? 'bg-green-400' : user.status === 'suspended' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-sm text-slate-300">{user.joined}</p>
                    </td>
                    <td className="py-4 pr-4 flex justify-end gap-2">
                       <button onClick={() => regenerateKeys(user.email)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Regenerate API Keys & Config">
                         <KeyRound size={16} />
                       </button>
                       <button onClick={() => editUser(user.email)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit User Profile">
                         <Edit size={16} />
                       </button>
                       {user.role !== 'ADMIN' && (
                         <button onClick={() => cycleStatus(user.id)} className={`p-2 rounded-lg transition-colors ${user.status === 'banned' ? 'text-red-400 bg-red-500/20 border border-red-500/50 hover:bg-red-500/30' : user.status === 'suspended' ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/50' : 'text-red-500/70 hover:text-red-400 hover:bg-red-500/10'}`} title="Change Status (Active -> Suspend -> Ban)">
                           <Ban size={16} />
                         </button>
                       )}
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
