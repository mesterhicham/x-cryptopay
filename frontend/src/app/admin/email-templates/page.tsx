"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { FileText, Save, Eye, Plus, Pencil, Trash2, Loader2, CheckCircle2, Code, Mail, X } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'payment_confirmation' | 'payment_failed' | 'payout_approved' | 'payout_rejected' | 'welcome' | 'custom';
  htmlBody: string;
  isActive: boolean;
  lastEdited: string;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  welcome: { label: 'Welcome', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  payment_confirmation: { label: 'Payment OK', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  payment_failed: { label: 'Payment Fail', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  payout_approved: { label: 'Payout OK', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  payout_rejected: { label: 'Payout Fail', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  custom: { label: 'Custom', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const { data: session } = useSession();
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [previewing, setPreviewing] = useState<EmailTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchTemplates = async () => {
    if (!session?.user?.accessToken) return;
    try {
      const res = await fetch(`${API_URL}/api/email/templates`, {
        headers: { 'Authorization': `Bearer ${session.user.accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error('Failed to fetch templates', err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [session]);

  const handleSave = async () => {
    if (!editing || !session?.user?.accessToken) return;
    setSaving(true);
    try {
      const isNew = !templates.find(t => t.id === editing.id);
      const url = isNew ? `${API_URL}/api/email/templates` : `${API_URL}/api/email/templates/${editing.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify(editing),
      });

      if (!res.ok) throw new Error();
      
      await fetchTemplates();
      setSaving(false);
      setEditing(null);
      setStatus({ type: 'success', message: `Template saved successfully!` });
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setSaving(false);
      setStatus({ type: 'error', message: 'Failed to save template' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!session?.user?.accessToken || !confirm('Are you sure you want to delete this template?')) return;
    try {
      const res = await fetch(`${API_URL}/api/email/templates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.user.accessToken}` }
      });
      if (!res.ok) throw new Error();
      await fetchTemplates();
      setStatus({ type: 'success', message: 'Template deleted' });
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus({ type: 'error', message: 'Failed to delete template' });
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    if (!session?.user?.accessToken) return;
    try {
      await fetch(`${API_URL}/api/email/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      await fetchTemplates();
    } catch (err) {
      console.error('Failed to toggle template', err);
    }
  };

  const handleNew = () => {
    setEditing({
      id: Date.now().toString(),
      name: '',
      subject: '',
      type: 'custom',
      htmlBody: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#e2e8f0;padding:40px;border-radius:16px">
  <h1 style="color:#a855f7;text-align:center">Your Title</h1>
  <div style="background:#14161b;padding:24px;border-radius:12px;border:1px solid rgba(255,255,255,0.05)">
    <p>Your content here...</p>
  </div>
</div>`,
      isActive: true,
      lastEdited: new Date().toISOString(),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="text-purple-400" /> Email Templates
          </h1>
          <p className="text-slate-400 text-sm">Design and manage email templates for automated notifications.</p>
        </div>
        <button onClick={handleNew}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
          <Plus size={16} /> New Template
        </button>
      </header>

      {/* Status */}
      {status && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-bold ${
            status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
          <CheckCircle2 size={18} /> {status.message}
        </motion.div>
      )}

      {/* Variables Reference */}
      <div className="bg-[#14161b] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Code size={16} className="text-purple-400" />
          <p className="text-sm font-bold text-slate-300">Available Variables</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['{{firstName}}', '{{lastName}}', '{{email}}', '{{merchantName}}', '{{apiKey}}', '{{invoiceId}}', '{{amount}}', '{{currency}}', '{{network}}', '{{txHash}}', '{{toAddress}}', '{{status}}'].map(v => (
            <span key={v} className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs font-mono text-purple-300">{v}</span>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(template => {
          const typeInfo = typeLabels[template.type] || typeLabels.custom;
          return (
            <motion.div key={template.id} layout
              className="bg-[#14161b] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white">{template.name}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{template.subject}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={template.isActive} onChange={() => handleToggle(template.id, template.isActive)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>

              <p className="text-[11px] text-slate-600 mb-4">
                Last edited: {new Date((template as any).updatedAt || template.lastEdited).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>

              <div className="flex gap-2">
                <button onClick={() => setPreviewing(template)}
                  className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all flex items-center justify-center gap-1.5">
                  <Eye size={13} /> Preview
                </button>
                <button onClick={() => setEditing({ ...template })}
                  className="flex-1 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl text-xs font-bold text-purple-300 transition-all flex items-center justify-center gap-1.5">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(template.id)}
                  className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 transition-all flex items-center justify-center">
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewing(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-[#0d0f14] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">{previewing.name}</h3>
                  <p className="text-xs text-slate-500">Subject: {previewing.subject}</p>
                </div>
                <button onClick={() => setPreviewing(null)} className="text-slate-400 hover:text-white p-1"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-auto max-h-[60vh]">
                <div dangerouslySetInnerHTML={{ __html: previewing.htmlBody }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-[#0d0f14] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Pencil size={18} className="text-purple-400" />
                  {editing.id && templates.find(t => t.id === editing.id) ? 'Edit Template' : 'New Template'}
                </h3>
                <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-white p-1"><X size={20} /></button>
              </div>

              <div className="p-6 space-y-4 overflow-auto max-h-[70vh]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Template Name</label>
                    <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-slate-200 outline-none focus:border-purple-500/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Type</label>
                    <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value as any })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-slate-200 outline-none focus:border-purple-500/50 text-sm">
                      <option value="welcome">Welcome</option>
                      <option value="payment_confirmation">Payment Confirmation</option>
                      <option value="payment_failed">Payment Failed</option>
                      <option value="payout_approved">Payout Approved</option>
                      <option value="payout_rejected">Payout Rejected</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject Line</label>
                  <input value={editing.subject} onChange={e => setEditing({ ...editing, subject: e.target.value })}
                    placeholder="Payment Received - Invoice #{{invoiceId}}"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-slate-200 outline-none focus:border-purple-500/50 text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">HTML Body</label>
                  <textarea value={editing.htmlBody} onChange={e => setEditing({ ...editing, htmlBody: e.target.value })}
                    rows={14}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-purple-500/50 text-sm font-mono leading-relaxed resize-y" />
                </div>
              </div>

              <div className="flex justify-end gap-3 p-4 border-t border-white/5">
                <button onClick={() => setEditing(null)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-slate-300 transition-all">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving || !editing.name || !editing.subject}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  Save Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
