"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { 
  Search, 
  Save, 
  Globe, 
  Share2, 
  Info, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Link as LinkIcon,
  Tag,
  AlignLeft
} from 'lucide-react';
import { API_URL } from '@/lib/api';

interface SEO {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogUrl: string;
  ogDescription: string;
  ogImage: string;
}

export default function SEOPage() {
  const { data: session } = useSession();
  const [seo, setSeo] = useState<SEO>({
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogUrl: '',
    ogDescription: '',
    ogImage: '',
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const res = await fetch(`${API_URL}/api/seo`);
        if (res.ok) {
          const data = await res.json();
          if (data) setSeo(data);
        }
      } catch (err) {
        console.error('Failed to load SEO', err);
      }
    };
    loadSEO();
  }, []);

  const handleSave = async () => {
    if (!session?.user?.accessToken) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/seo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify(seo),
      });
      if (!res.ok) throw new Error();
      setStatus({ type: 'success', message: 'SEO settings updated successfully!' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to save SEO settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Search className="text-blue-400" /> SEO & Meta Tags
        </h1>
        <p className="text-slate-400 text-sm">Optimize your platform for search engines and social media sharing.</p>
      </header>

      {status && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-bold ${
            status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          {status.message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Basic SEO */}
        <section className="bg-[#14161b] border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">General SEO</h2>
              <p className="text-xs text-slate-500">Core search engine optimization settings.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Tag size={12} /> Site Title
              </label>
              <input 
                type="text" 
                value={seo.title}
                onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                placeholder="e.g. x-cryptopay | Premium Gateway"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-blue-500/50 transition-colors text-sm font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlignLeft size={12} /> Meta Description
              </label>
              <textarea 
                rows={3}
                value={seo.description}
                onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                placeholder="Describe your site for search results..."
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-blue-500/50 transition-colors text-sm font-medium resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Tag size={12} /> Keywords (Comma separated)
              </label>
              <input 
                type="text" 
                value={seo.keywords}
                onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                placeholder="e.g. crypto, payments, btc, eth"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-blue-500/50 transition-colors text-sm font-medium"
              />
            </div>
          </div>
        </section>

        {/* Social Sharing (Open Graph) */}
        <section className="bg-[#14161b] border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Share2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Social Sharing (Open Graph)</h2>
              <p className="text-xs text-slate-500">How your site appears when shared on Telegram, WhatsApp, Twitter, etc.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                OG Title
              </label>
              <input 
                type="text" 
                value={seo.ogTitle}
                onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-pink-500/50 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <LinkIcon size={12} /> OG Canonical URL
              </label>
              <input 
                type="text" 
                value={seo.ogUrl}
                onChange={(e) => setSeo({ ...seo, ogUrl: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-pink-500/50 transition-colors text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">OG Description</label>
              <textarea 
                rows={2}
                value={seo.ogDescription}
                onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-pink-500/50 transition-colors text-sm resize-none"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save SEO Settings
        </button>
      </div>
    </motion.div>
  );
}
