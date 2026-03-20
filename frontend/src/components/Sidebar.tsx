import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar({ links, title }: { links: { href: string; label: string; icon: LucideIcon }[], title: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-black/50 backdrop-blur-2xl z-40 hidden lg:flex flex-col pt-[88px] px-4 pb-6 shadow-2xl">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-4 mb-4">{title}</div>
      <div className="space-y-1 flex-1">
        {links.map(link => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard' && link.href !== '/admin');
          const Icon = link.icon;
          return (
             <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-white shadow-inner border border-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
               <Icon size={18} className={isActive ? 'text-purple-400' : ''} />
               <span className="font-medium text-sm">{link.label}</span>
             </Link>
          );
        })}
      </div>
    </aside>
  );
}
