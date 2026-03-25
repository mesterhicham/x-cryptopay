"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  Loader2,
  ArrowRight,
  Shield,
  Wallet,
  Zap,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import AuthVisualPanel from "@/components/AuthVisualPanel";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex -mt-24">
      {/* Left Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen">
        <AuthVisualPanel
          headline="Secure Crypto Payments"
          subtitle="Enterprise-grade payment infrastructure for the decentralized economy. Accept USDT, BTC, and more."
          features={[
            { icon: Shield, text: "End-to-end encrypted transactions" },
            { icon: Clock, text: "99.9% uptime guarantee" },
            { icon: CheckCircle2, text: "Instant settlement & auto-forwarding" },
          ]}
          floatingIcons={[
            { icon: Shield, position: "top-16 left-12", size: 26 },
            { icon: Wallet, position: "top-24 right-16", delay: 1.5, size: 24 },
            { icon: Zap, position: "bottom-32 left-20", delay: 0.8, size: 22 },
            { icon: Lock, position: "bottom-20 right-12", delay: 2, size: 20 },
          ]}
          panelColors={{
            from: "#0f1729",
            via: "#1a1f4e",
            to: "#0c1426",
          }}
        />
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 lg:px-16 relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          {/* Header */}
          <div className="mb-9">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-4xl font-bold text-white mb-3 tracking-tight"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-slate-400 text-[15px]"
            >
              Sign in to your dashboard to manage payments & API.
            </motion.p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-6 bg-red-500/8 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-red-400 text-xs font-bold">!</span>
              </div>
              {typeof error === "string" ? error : "An error occurred"}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                  size={18}
                />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="auth-input"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-2.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-[0.15em]">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                  size={18}
                />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="auth-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-2"
            >
              <button id="login-submit" disabled={loading} className="auth-btn">
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-center text-sm text-slate-400 mt-9"
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
