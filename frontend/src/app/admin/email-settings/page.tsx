"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Mail, Save, TestTube, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle, Server, Lock, Send } from 'lucide-react';

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
}

export default function EmailSettingsPage() {
  const { data: session } = useSession();
  const [config, setConfig] = useState<SmtpConfig>({
    host: '', port: 587, secure: false, user: '', pass: '', fromName: 'x-cryptopay', fromEmail: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      if (!session?.user?.accessToken) return;
      try {
        const res = await fetch('http://localhost:3000/api/email/settings', {
          headers: { 'Authorization': `Bearer ${session.user.accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (err) {
        console.error('Failed to load email settings', err);
      }
    };
    loadConfig();
  }, [session]);

  const handleSave = async () => {
    if (!session?.user?.accessToken) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('http://localhost:3000/api/email/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      setStatus({ type: 'success', message: 'SMTP settings saved successfully!' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to save settings to server' });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testEmail) { setStatus({ type: 'error', message: 'Enter a test email address' }); return; }
    if (!session?.user?.accessToken) return;
    setTesting(true);
    setStatus(null);
    try {
      const res = await fetch('http://localhost:3000/api/email/test-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify({
          to: testEmail,
          type: 'welcome',
          variables: { firstName: 'Admin', email: testEmail, apiKey: 'TEST-KEY-123' }
        }),
      });
      if (!res.ok) throw new Error();
      setStatus({ type: 'success', message: `Test email sent to ${testEmail}` });
    } catch {
      setStatus({ type: 'error', message: 'Failed to send test email' });
    } finally {
      setTesting(false);
    }
  };

  const InputField = ({ label, icon: Icon, value, onChange, type = 'text', placeholder = '' }: any) => (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors text-sm"
        />
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Mail className="text-purple-400" /> Email Settings
        </h1>
        <p className="text-slate-400 text-sm">Configure SMTP server for transactional emails, notifications, and alerts.</p>
      </header>

      {/* Status Message */}
      {status && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-bold ${
            status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          {status.message}
        </motion.div>
      )}

      {/* SMTP Server Configuration */}
      <div className="bg-[#14161b] border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Server size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">SMTP Server</h2>
            <p className="text-xs text-slate-500">Connection details for your email server</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="SMTP Host" icon={Server} value={config.host} placeholder="smtp.gmail.com"
            onChange={(e: any) => setConfig({ ...config, host: e.target.value })} />
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SMTP Port</label>
            <div className="relative">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="number" value={config.port}
                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) || 587 })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-white/5">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={config.secure} onChange={(e) => setConfig({ ...config, secure: e.target.checked })}
              className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-purple-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
          <div>
            <p className="text-sm font-bold text-slate-300">Use SSL/TLS</p>
            <p className="text-xs text-slate-500">Enable for port 465, disable for port 587 with STARTTLS</p>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-[#14161b] border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Authentication</h2>
            <p className="text-xs text-slate-500">Login credentials for the SMTP server</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Username / Email" icon={Mail} value={config.user} placeholder="noreply@yourdomain.com"
            onChange={(e: any) => setConfig({ ...config, user: e.target.value })} />
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password / App Key</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type={showPassword ? 'text' : 'password'} value={config.pass}
                onChange={(e) => setConfig({ ...config, pass: e.target.value })} placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-slate-200 outline-none focus:border-purple-500/50 transition-colors text-sm"
              />
              <button onClick={() => setShowPassword(!showPassword)} type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sender Identity */}
      <div className="bg-[#14161b] border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Send size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Sender Identity</h2>
            <p className="text-xs text-slate-500">How your emails appear to recipients</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="From Name" icon={Send} value={config.fromName} placeholder="x-cryptopay"
            onChange={(e: any) => setConfig({ ...config, fromName: e.target.value })} />
          <InputField label="From Email" icon={Mail} value={config.fromEmail} placeholder="noreply@x-cryptopay.com"
            onChange={(e: any) => setConfig({ ...config, fromEmail: e.target.value })} />
        </div>
      </div>

      {/* Test Email */}
      <div className="bg-[#14161b] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
            <TestTube size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Send Test Email</h2>
            <p className="text-xs text-slate-500">Verify your SMTP configuration is working</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors text-sm"
            />
          </div>
          <button onClick={handleTest} disabled={testing}
            className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-300 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
            {testing ? <Loader2 className="animate-spin" size={16} /> : <TestTube size={16} />}
            Send Test
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center gap-2">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save Settings
        </button>
      </div>
    </motion.div>
  );
}
