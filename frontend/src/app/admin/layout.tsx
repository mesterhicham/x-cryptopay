"use client";
import { Sidebar } from "@/components/Sidebar";
import { Activity, Users, FileText, Server, MessageSquare, Mail, Palette, Search } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { href: '/admin', label: 'Command Center', icon: Activity },
    { href: '/admin/users', label: 'Manage Users', icon: Users },
    { href: '/admin/payments', label: 'Global Ledger', icon: FileText },
    { href: '/admin/branding', label: 'Branding', icon: Palette },
    { href: '/admin/seo', label: 'SEO Settings', icon: Search },
    { href: '/admin/email-settings', label: 'Email Settings', icon: Mail },
    { href: '/admin/email-templates', label: 'Email Templates', icon: FileText },
    { href: '/admin/status', label: 'System Health', icon: Server },
    { href: '/admin/support', label: 'Support Tickets', icon: MessageSquare },
  ];

  return (
    <div className="relative">
      <Sidebar links={links} title="Admin Portal" />
      <div className="lg:pl-64 flex flex-col min-h-[calc(100vh-88px)] relative">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
