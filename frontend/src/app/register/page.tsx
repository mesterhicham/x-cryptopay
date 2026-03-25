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
  User,
  Building2,
  Rocket,
  Globe,
  TrendingUp,
  Eye,
  EyeOff,
  Code2,
  CreditCard,
  BadgeDollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";
import AuthVisualPanel from "@/components/AuthVisualPanel";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          companyName,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const msg = Array.isArray(errorData.message)
          ? errorData.message[0]
          : errorData.message;
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
    <div className="min-h-screen flex -mt-24">
      {/* Left Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen">
        <AuthVisualPanel
          headline="Start Accepting Crypto"
          subtitle="Set up your merchant account in under 2 minutes. No blockchain experience required."
          features={[
            { icon: Code2, text: "1. Create your merchant account" },
            { icon: CreditCard, text: "2. Integrate our simple API" },
            { icon: BadgeDollarSign, text: "3. Start receiving payments" },
          ]}
          floatingIcons={[
            { icon: Rocket, position: "top-16 right-16", size: 26 },
            { icon: Globe, position: "top-28 left-14", delay: 1.2, size: 24 },
            {
              icon: TrendingUp,
              position: "bottom-28 right-20",
              delay: 0.6,
              size: 22,
            },
            {
              icon: BadgeDollarSign,
              position: "bottom-16 left-16",
              delay: 2,
              size: 20,
            },
          ]}
          panelColors={{
            from: "#1a0f2e",
            via: "#1e1b4b",
            to: "#0f1729",
          }}
        />
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 lg:px-16 py-12 relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-lg relative z-10"
        >
          {/* Header */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-4xl font-bold text-white mb-3 tracking-tight"
            >
              Create Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-slate-400 text-[15px]"
            >
              Start accepting automated crypto payments today.
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2.5">
                  First Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                    size={18}
                  />
                  <input
                    id="register-firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="John"
                    className="auth-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2.5">
                  Last Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                    size={18}
                  />
                  <input
                    id="register-lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Doe"
                    className="auth-input"
                  />
                </div>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
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
                  id="register-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="auth-input"
                />
              </div>
            </motion.div>

            {/* Company Name */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2.5">
                Company / Store Name
              </label>
              <div className="relative group">
                <Building2
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                  size={18}
                />
                <input
                  id="register-companyName"
                  name="companyName"
                  type="text"
                  placeholder="My Store (optional)"
                  className="auth-input"
                />
              </div>
            </motion.div>

            {/* Password Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2.5">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                    size={18}
                  />
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="auth-input pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2.5">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                    size={18}
                  />
                  <input
                    id="register-confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="auth-input pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-2"
            >
              <button
                id="register-submit"
                disabled={loading}
                className="auth-btn"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
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
            className="text-center text-sm text-slate-400 mt-8"
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
