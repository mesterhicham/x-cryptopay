"use client";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  text: string;
}

interface FloatingIconConfig {
  icon: LucideIcon;
  position: string; // Tailwind classes for positioning
  delay?: number;
  size?: number;
}

interface AuthVisualPanelProps {
  headline: string;
  subtitle: string;
  features: Feature[];
  floatingIcons: FloatingIconConfig[];
  panelColors?: {
    from: string;
    via: string;
    to: string;
  };
}

export default function AuthVisualPanel({
  headline,
  subtitle,
  features,
  floatingIcons,
  panelColors,
}: AuthVisualPanelProps) {
  const colors = panelColors || {
    from: "#1e1b4b",
    via: "#1e3a5f",
    to: "#0f172a",
  };

  return (
    <div
      className="auth-panel w-full h-full min-h-screen"
      style={{
        "--panel-from": colors.from,
        "--panel-via": colors.via,
        "--panel-to": colors.to,
      } as React.CSSProperties}
    >
      {/* Mesh Grid Overlay */}
      <div className="mesh-grid" />

      {/* Floating Icons */}
      {floatingIcons.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className={`absolute ${item.position} z-10 ${i % 2 === 0 ? "floating-icon" : "floating-icon-delayed"}`}
            style={{ animationDelay: `${(item.delay || 0) * 1000}ms` }}
          >
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-lg">
              <Icon size={item.size || 28} className="text-purple-300/70" />
            </div>
          </div>
        );
      })}

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Glowing Circle */}
          <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-purple-300/20 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
            {headline}
          </h2>
          <p className="text-slate-300/70 text-base leading-relaxed mb-10">
            {subtitle}
          </p>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-3"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.15 }}
                className="flex items-center gap-3 text-left px-5 py-3.5 rounded-xl bg-white/5 border border-white/8 backdrop-blur-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-purple-300" />
                </div>
                <span className="text-slate-200/90 text-sm font-medium">
                  {feature.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
