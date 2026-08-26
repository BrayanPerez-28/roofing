"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";
import { Button } from "../_components/ui/Button";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState("");
  const [shake, setShake]       = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/admin/dashboard");
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      triggerShake();
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await login({ email, password }, remember);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials. Please try again.");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  if (authLoading) return null;

  return (
    <div className="admin-dark admin-login-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

      {/* Ambient glow blobs — same lavender as site primary */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#b7c4ff]/8 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#4b5b99]/6 blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-[#b7c4ff]/5 blur-3xl animate-[float_12s_ease-in-out_infinite_1s]" />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(10,12,20,0.88)] backdrop-blur-2xl shadow-2xl shadow-black/60 animate-[slideUpFade_0.4s_ease]"
        style={shake ? { animation: "shake 0.5s ease" } : {}}
      >
        {/* Top accent bar — primary gradient matching site's btn-primary */}
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-gradient-to-r from-[#b7c4ff]/0 via-[#b7c4ff] to-[#b7c4ff]/0" />

        <div className="px-8 py-10">
          {/* Logo & heading */}
          <div className="flex flex-col items-center mb-8">
            {/* Logo pill — matches Header logo style */}
            <div
              className="px-4 py-2 rounded-xl mb-5 animate-[float_3s_ease-in-out_infinite]"
              style={{ background: "rgba(255,255,255,0.74)", backdropFilter: "blur(8px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Perez Roofing Logo"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  // Fallback if logo not found
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <h1 className="text-xl font-bold text-[#e5e2e1] font-['Montserrat',sans-serif]">
              Welcome back
            </h1>
            <p className="text-sm text-[#e5e2e1]/40 mt-1">
              Sign in to Perez Roofing Admin
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-[slideUpFade_0.3s_ease]">
              <span className="shrink-0 w-5 h-5 rounded-md bg-red-500/20 flex items-center justify-center text-xs font-bold">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#e5e2e1]/60 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b7c4ff]/40 text-sm">✉</span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@perezroofing.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#e5e2e1] placeholder:text-[#e5e2e1]/25 text-sm focus:outline-none focus:ring-2 focus:ring-[#b7c4ff]/40 focus:border-[#b7c4ff]/30 hover:border-white/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#e5e2e1]/60 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b7c4ff]/40 text-sm">🔑</span>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-[#e5e2e1] placeholder:text-[#e5e2e1]/25 text-sm focus:outline-none focus:ring-2 focus:ring-[#b7c4ff]/40 focus:border-[#b7c4ff]/30 hover:border-white/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#e5e2e1]/30 hover:text-[#b7c4ff] transition-colors text-sm"
                  aria-label={showPass ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="checkbox"
                aria-checked={remember}
                onClick={() => setRemember((r) => !r)}
                id="remember-me"
                className={[
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 text-[#1b2b68] text-xs shrink-0",
                  remember
                    ? "bg-gradient-to-br from-[#b7c4ff] to-[#dde1ff] border-[#b7c4ff]"
                    : "bg-white/5 border-white/20 hover:border-[#b7c4ff]/50",
                ].join(" ")}
              >
                {remember && "✓"}
              </button>
              <label htmlFor="remember-me" className="text-sm text-[#e5e2e1]/50 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit — uses the site's exact btn-primary gradient */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #b7c4ff 0%, #dde1ff 100%)",
                color: "#1b2b68",
                boxShadow: "0 0 15px rgba(183,196,255,0.3)",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(183,196,255,0.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 15px rgba(183,196,255,0.3)";
              }}
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 rounded-full border-2 border-[#1b2b68] border-t-transparent animate-spin" />
              ) : null}
              {isLoading ? "Signing in…" : "Sign in to Dashboard"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-white/6 rounded-b-2xl bg-white/2">
          <p className="text-center text-xs text-[#e5e2e1]/25">
            Perez Premium Roofing © {new Date().getFullYear()} — Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}
