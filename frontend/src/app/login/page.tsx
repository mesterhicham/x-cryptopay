"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        throw new Error("Invalid email or password");
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card p-8 md:p-10 relative overflow-hidden">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-slate-400 text-sm mb-8">Sign in to your dashboard to manage your API.</p>

        {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{typeof error === 'string' ? error : 'An error occurred'}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input name="email" type="email" required placeholder="admin@x-cryptopay.com" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
               <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
               <Link href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input name="password" type="password" required placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 outline-none focus:border-blue-500/50 transition-colors" />
            </div>
          </div>

          <button disabled={loading} className="w-full py-4 mt-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18}/></>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          Don't have an account? <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
