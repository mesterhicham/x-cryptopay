"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { 
  Palette, 
  Upload, 
  Save, 
  Globe, 
  Image as ImageIcon, 
  Info, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface Branding {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  pwaLogoUrl: string;
}

import { API_URL } from '@/lib/api';

export default function BrandingPage() {
  const { data: session } = useSession();
  const [branding, setBranding] = useState<Branding>({
    siteName: 'x-cryptopay',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#8b5cf6',
    pwaLogoUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const res = await fetch(`${API_URL}/api/branding`);
        if (res.ok) {
          const data = await res.json();
          if (data) setBranding(data);
        }
      } catch (err) {
        console.error('Failed to load branding', err);
      }
    };
    loadBranding();
  }, []);

  const handleSave = async () => {
    if (!session?.user?.accessToken) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/branding`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify(branding),
      });
      if (!res.ok) throw new Error();
      setStatus({ type: 'success', message: 'Branding settings updated successfully!' });
      // Refresh the page to apply colors globally (in a real app, use a Context provider)
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setStatus({ type: 'error', message: 'Failed to save branding settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof Branding) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.accessToken) return;

    setUploading(field);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/branding/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: formData,
      });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setBranding({ ...branding, [field]: `http://localhost:3000${url}` });
      setStatus({ type: 'success', message: `${field} uploaded successfully!` });
    } catch {
      setStatus({ type: 'error', message: `Failed to upload ${field}` });
    } finally {
      setUploading(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Palette className="text-purple-400" /> Platform Branding
        </h1>
        <p className="text-slate-400 text-sm">Customize your platform's visual identity, logos, and colors.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-[#14161b] border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">General Info</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Site Name</label>
              <input 
                type="text" 
                value={branding.siteName}
                onChange={(e) => setBranding({ ...branding, siteName: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Color</label>
              <div className="flex gap-3">
                <input 
                  type="color" 
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="w-12 h-12 bg-black/40 border border-white/10 rounded-xl cursor-pointer p-1"
                />
                <input 
                  type="text" 
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logos */}
        <div className="bg-[#14161b] border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ImageIcon size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Visual Assets</h2>
          </div>

          <div className="space-y-6">
            <UploadField 
              label="Main Logo" 
              value={branding.logoUrl} 
              onUpload={(e: any) => handleFileUpload(e, 'logoUrl')} 
              uploading={uploading === 'logoUrl'} 
            />
            <UploadField 
              label="Favicon" 
              value={branding.faviconUrl} 
              onUpload={(e: any) => handleFileUpload(e, 'faviconUrl')} 
              uploading={uploading === 'faviconUrl'} 
            />
            <UploadField 
              label="PWA Logo" 
              value={branding.pwaLogoUrl} 
              onUpload={(e: any) => handleFileUpload(e, 'pwaLogoUrl')} 
              uploading={uploading === 'pwaLogoUrl'} 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save Branding
        </button>
      </div>
    </motion.div>
  );
}

function UploadField({ label, value, onUpload, uploading }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
        {value && <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={10} /> Active</span>}
      </div>
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-black/40 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center relative group">
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-contain p-1" />
          ) : (
            <ImageIcon size={20} className="text-slate-600" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <RefreshCw className="animate-spin text-white" size={16} />
            </div>
          )}
        </div>
        <div className="flex-1 relative">
          <input 
            type="file" 
            onChange={onUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            accept="image/*,.ico"
          />
          <div className="w-full h-full bg-black/40 border border-white/10 border-dashed rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:border-purple-500/50 transition-all text-xs font-medium">
            <Upload size={14} /> Click to Upload
          </div>
        </div>
      </div>
    </div>
  );
}
