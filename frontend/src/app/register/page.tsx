"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, ArrowRight, User, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const companyName = formData.get("companyName") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, companyName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const msg = Array.isArray(errorData.message) ? errorData.message[0] : errorData.message;
        throw new Error(msg || "Registration failed");
      }

      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg glass-card p-8 md:p-10 relative overflow-hidden">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-slate-400 text-sm mb-8">Start accepting automated crypto payments today.</p>

        {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{typeof error === 'string' ? error : 'An error occurred'}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input name="firstName" type="text" required placeholder="John" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input name="lastName" type="text" required placeholder="Doe" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors" />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input name="email" type="email" required placeholder="you@company.com" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors" />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Company / Store Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input name="companyName" type="text" placeholder="My Store (optional)" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors" />
            </div>
          </div>

          {/* Password Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input name="password" type="password" required placeholder="••••••••" minLength={6} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input name="confirmPassword" type="password" required placeholder="••••••••" minLength={6} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-purple-500/50 transition-colors" />
              </div>
            </div>
          </div>

          <button disabled={loading} className="w-full py-4 mt-2 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={18}/></>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          Already have an account? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
