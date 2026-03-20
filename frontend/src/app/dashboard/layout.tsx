"use client";
import { Sidebar } from "@/components/Sidebar";
import { LayoutDashboard, Wallet, Clock, ArrowUpRight, KeyRound, Settings, MessageSquare } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/payments', label: 'Payments', icon: Wallet },
    { href: '/dashboard/transactions', label: 'Transactions', icon: Clock },
    { href: '/dashboard/payouts', label: 'Payout Vaults', icon: ArrowUpRight },
    { href: '/dashboard/developer', label: 'API & Webhooks', icon: KeyRound },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/support', label: 'Support Chat', icon: MessageSquare },
  ];

  return (
    <div className="relative">
      <Sidebar links={links} title="Merchant Portal" />
      <div className="lg:pl-64 flex flex-col min-h-[calc(100vh-88px)] relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
