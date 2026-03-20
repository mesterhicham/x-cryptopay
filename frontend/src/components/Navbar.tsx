"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { Wallet, Settings, Activity, User as UserIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBranding } from './BrandingProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const branding = useBranding();

  const links = [
    { href: '/', label: 'Home', icon: Wallet },
    ...(session?.user?.role === 'ADMIN' ? [{ href: '/admin', label: 'Admin', icon: Activity }] : []),
    { href: '/dashboard', label: 'Dashboard', icon: Settings },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          {branding?.logoUrl ? (
            <img src={branding.logoUrl} alt={branding.siteName} className="h-8 w-auto" />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] transition-all">X</div>
          )}
          <span className="text-xl font-bold gradient-text tracking-wide">{branding?.siteName || 'cryptopay'}</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {session ? (
            <>
              {links.map((link) => {
                const isActive = pathname.startsWith(link.href) && link.href !== '/' || pathname === link.href;
                if (link.href === '/' && pathname !== '/') return null; // Only highlight home if on home

                const Icon = link.icon;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${isActive ? 'text-white' : 'text-slate-400'}`}
                  >
                    <Icon size={16} className={isActive ? 'text-purple-400' : ''} />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                )
              })}
              <button onClick={() => signOut()} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors sm:ml-4 sm:pl-4 sm:border-l border-white/10">
                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
               <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
               <Link href="/register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
