"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User, Lock, Bell, Globe, Wallet, ShieldCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const TABS = [
  { id: 'profile', label: 'Profile Information', icon: User },
  { id: 'payout', label: 'Payout Settings', icon: Wallet },
  { id: 'security', label: 'Security Password', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'regional', label: 'Regional Settings', icon: Globe },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('payout');

  // Payout Wallet State
  const [walletAddress, setWalletAddress] = useState('TXwJzWezY...Z1X4hTbRyq8uGvVz1');
  const [isUnlockingWallet, setIsUnlockingWallet] = useState(false);
  const [isWalletUnlocked, setIsWalletUnlocked] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleUnlockWallet = (e: React.MouseEvent) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      setIsWalletUnlocked(true);
      setIsUnlockingWallet(false);
      setVerificationCode('');
    }
  };

  const handleSaveWallet = () => {
    setIsWalletUnlocked(false);
    // In production, this would fire an API call to save the new setting
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3"><Settings className="text-slate-400" /> Account Settings</h1>
        <p className="text-slate-400">Manage your profile, withdrawal destinations, and security preferences.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation / Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          {TABS.map((tab) => {
             const isActive = activeTab === tab.id;
             return (
               <button 
                 key={tab.id} 
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold text-left ${isActive ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
               >
                 <tab.icon size={18} className={isActive ? 'text-purple-400' : ''} />
                 {tab.label}
               </button>
             );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
           <AnimatePresence mode="wait">
             
             {/* Profile Section */}
             {activeTab === 'profile' && (
               <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="glass-card p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                  
                  <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Profile Information</h2>
                  
                  <form className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                          <input type="text" placeholder="Admin" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
                          <input type="text" placeholder="User" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors" />
                        </div>
                     </div>
                     
                     <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Company Name (Optional)</label>
                        <input type="text" placeholder="x-cryptopay Merchant" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors" />
                     </div>

                     <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Account Email</label>
                        <input type="email" value={session?.user?.email || "admin@x-cryptopay.com"} readOnly className="w-full bg-black/30 border border-white/5 rounded-xl py-3 px-4 text-slate-500 outline-none cursor-not-allowed" />
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">To change your primary email address, please contact platform support.</p>
                     </div>

                     <div className="flex justify-end pt-4 border-t border-white/5">
                        <button type="button" className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">Save Profile Changes</button>
                     </div>
                  </form>

                  {/* Danger Zone */}
                  <div className="mt-12 p-6 md:p-8 border-t border-red-500/20 bg-red-500/5 -mx-8 -mb-8">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h2>
                    <p className="text-slate-400 text-sm mb-6">Irreversible and destructive actions related to your merchant account.</p>
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 rounded-xl border border-red-500/20 bg-black/40 shadow-inner">
                        <div>
                          <p className="text-white font-semibold">Delete Account & API Keys</p>
                          <p className="text-slate-400 text-sm mt-1 max-w-sm">Once you delete your account, your data cannot be recovered. Ongoing payments will be abandoned.</p>
                        </div>
                        <button className="px-5 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-bold rounded-xl transition-colors whitespace-nowrap">Delete Account</button>
                    </div>
                  </div>
               </motion.div>
             )}

             {/* Payout Settings Section */}
             {activeTab === 'payout' && (
               <motion.div key="payout" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="glass-card p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                  
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                     Destination Wallet
                  </h2>
                  <p className="text-sm text-slate-400 mb-8">This is your final external wallet. Our auto-sweep engine automatically forwards all customer payments directly here in real-time.</p>

                  <div className="bg-black/50 p-6 rounded-2xl border border-white/5 mb-8">
                     <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Your External Wallet Address</label>
                     
                     <div className="flex flex-col md:flex-row gap-4">
                        <input 
                          type="text" 
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          readOnly={!isWalletUnlocked}
                          placeholder="e.g. 0x... or T..."
                          className={`w-full ${isWalletUnlocked ? 'bg-white/5 border-purple-500/50 text-white shadow-inner' : 'bg-transparent border-white/10 text-slate-500 cursor-not-allowed'} border rounded-xl py-3 px-4 outline-none font-mono text-sm transition-colors`} 
                        />
                        {!isWalletUnlocked && (
                           <button onClick={() => setIsUnlockingWallet(true)} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors whitespace-nowrap">
                             Change Address
                           </button>
                        )}
                        {isWalletUnlocked && (
                           <button onClick={handleSaveWallet} className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(22,163,74,0.4)] transition-colors whitespace-nowrap">
                             Save New Address
                           </button>
                        )}
                     </div>
                     
                     <AnimatePresence>
                        {isUnlockingWallet && !isWalletUnlocked && (
                           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 pt-6 border-t border-white/5 overflow-hidden">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
                                 <ShieldCheck className="text-yellow-500 shrink-0" size={28} />
                                 <div className="flex-1">
                                    <p className="text-white font-semibold">Security Verification Required</p>
                                    <p className="text-xs text-slate-400 mt-1 max-w-sm">To authorize this sensitive change, please enter the 6-digit code sent to your registered Email or Authy App.</p>
                                 </div>
                                 <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                                    <input 
                                       type="text" 
                                       maxLength={6}
                                       placeholder="• • • • • •" 
                                       value={verificationCode}
                                       onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                       className="bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white outline-none font-mono text-center tracking-widest w-full sm:w-32 focus:border-yellow-500/50 transition-colors"
                                    />
                                    <button onClick={handleUnlockWallet} disabled={verificationCode.length !== 6} className="px-5 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-yellow-500 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                                       Verify
                                    </button>
                                 </div>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
                  
                  <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl flex gap-4">
                     <div className="p-2 rounded bg-red-500/10 h-fit">
                       <Lock className="text-red-400" size={18} />
                     </div>
                     <div>
                        <p className="text-white font-semibold text-sm">Security Freeze Notice</p>
                        <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">For the protection of your funds, successfully changing your primary sweep destination wallet will trigger an automatic <strong className="text-slate-300">24-hour security hold</strong> on all outgoing automated sweep operations. Your incoming payments will continue to process normally.</p>
                     </div>
                  </div>
               </motion.div>
             )}

             {/* Security Section */}
             {activeTab === 'security' && (
               <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="glass-card p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                  <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Security & Passwords</h2>
                  
                  <form className="space-y-6">
                     <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-blue-500/50 transition-colors" />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-blue-500/50 transition-colors" />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-blue-500/50 transition-colors" />
                     </div>
                     <div className="flex justify-end pt-4 border-t border-white/5">
                        <button type="button" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">Update Password</button>
                     </div>
                  </form>

                  <div className="mt-10 pt-8 border-t border-white/5">
                     <h3 className="text-lg font-bold text-white mb-4">Two-Factor Authentication (2FA)</h3>
                     <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl">
                        <div>
                           <p className="text-white font-semibold">Authenticator App</p>
                           <p className="text-xs text-slate-400 mt-1">Protect your account with Google Authenticator or Authy.</p>
                        </div>
                        <button className="px-5 py-2 border border-blue-500/50 text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-500/10 transition-colors">Enable 2FA</button>
                     </div>
                  </div>
               </motion.div>
             )}

             {/* Notifications Section */}
             {activeTab === 'notifications' && (
               <motion.div key="notif" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="glass-card p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Notification Preferences</h2>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-white font-semibold flex items-center gap-2">Successful Payments <span className="w-2 h-2 rounded-full bg-green-500"></span></p>
                           <p className="text-xs text-slate-400 mt-1">Receive an email when a deposit is confirmed on the blockchain.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                     </div>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div>
                           <p className="text-white font-semibold">Auto-Sweep Alerts</p>
                           <p className="text-xs text-slate-400 mt-1">Get notified when platform successfully forwards funds to your external wallet.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div>
                           <p className="text-white font-semibold flex items-center gap-2">Failed Webhooks <span className="w-2 h-2 rounded-full bg-red-500"></span></p>
                           <p className="text-xs text-slate-400 mt-1">Alert me if my backend server stops responding to HTTP notifications.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                     </div>
                  </div>
               </motion.div>
             )}

             {/* Regional Section */}
             {activeTab === 'regional' && (
               <motion.div key="regional" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="glass-card p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Regional & Locale</h2>
                  <form className="space-y-6">
                     <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Display Language</label>
                        <select className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors appearance-none">
                           <option>English (US)</option>
                           <option>Arabic (عربي)</option>
                           <option>French (Français)</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Timezone</label>
                        <select className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors appearance-none">
                           <option>(GMT+00:00) UTC Standard Time</option>
                           <option>(GMT+01:00) Central European Time</option>
                           <option>(GMT+03:00) Arabia Standard Time</option>
                           <option>(GMT-05:00) Eastern Time</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-2">All transaction dates will be displayed relative to your chosen timezone.</p>
                     </div>
                     <div className="flex justify-end pt-4 border-t border-white/5">
                        <button type="button" className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors">Save Preferences</button>
                     </div>
                  </form>
               </motion.div>
             )}

           </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
