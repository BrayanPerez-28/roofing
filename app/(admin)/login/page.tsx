"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";
import { authApi } from "../_lib/api";

export default function LoginPage() {
  const { login, verify2fa, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Step state: "credentials" | "2fa"
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");

  // Step 1: Credentials
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  // Step 2: 2FA OTP Code
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendSeconds, setResendSeconds] = useState(60);
  const [isResending, setIsResending]     = useState(false);

  // Common UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");
  const [info, setInfo]           = useState("");
  const [shake, setShake]         = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  // Resend cooldown timer for 2FA
  useEffect(() => {
    if (step !== "2fa" || resendSeconds <= 0) return;
    const interval = setInterval(() => {
      setResendSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendSeconds]);

  // Auto-focus first OTP input upon entering 2FA step
  useEffect(() => {
    if (step === "2fa") {
      const timer = setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  // ─── Step 1: Submit Credentials ───────────────────────────────────────────
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError("");
    setInfo("");

    try {
      const res = await login({ email, password }, remember);

      // Backend requires 2FA verification
      if (res.status === "pending_2fa" || res.requires_2fa) {
        setStep("2fa");
        setInfo(res.message || "Código de verificación enviado a tu correo.");
        setResendSeconds(60);
        setOtp(["", "", "", "", "", ""]);
      }
      // If backend logged in directly (e.g. 2FA disabled in future)
      // AuthContext handles redirect to /admin/dashboard
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Credenciales inválidas. Por favor intenta de nuevo."
      );
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 2: Verify 2FA OTP Code ─────────────────────────────────────────
  const handleVerify2fa = async (codeToSubmit?: string) => {
    const fullCode = codeToSubmit || otp.join("");
    if (fullCode.length !== 6) {
      setError("Por favor ingresa los 6 dígitos del código de verificación.");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await verify2fa({ email, code: fullCode }, remember);
      // Redirection is handled inside AuthContext upon successful verification
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "El código de verificación es inválido o ha expirado."
      );
      triggerShake();
      // Reset OTP and refocus first input
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Input handlers
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // If a digit was entered, advance to next input
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits are filled
    if (digit && newOtp.every((d) => d !== "")) {
      handleVerify2fa(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);

    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();

    if (pasted.length === 6) {
      handleVerify2fa(pasted);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    if (resendSeconds > 0 || isResending) return;
    setIsResending(true);
    setError("");
    try {
      const res = await authApi.login({ email, password });
      setInfo(res.message || "Nuevo código enviado a tu correo.");
      setResendSeconds(60);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo reenviar el código. Intenta de nuevo."
      );
      triggerShake();
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setError("");
    setInfo("");
    setOtp(["", "", "", "", "", ""]);
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
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(10,12,20,0.88)] backdrop-blur-2xl shadow-2xl shadow-black/60 transition-all duration-300"
        style={shake ? { animation: "shake 0.5s ease" } : { animation: "slideUpFade 0.4s ease" }}
      >
        {/* Top accent bar — primary gradient matching site's btn-primary */}
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-gradient-to-r from-[#b7c4ff]/0 via-[#b7c4ff] to-[#b7c4ff]/0" />

        <div className="px-8 py-10">

          {/* ═══════════════════════════════════════════════════════════════════════
              STEP 1: CREDENTIALS (EMAIL & PASSWORD)
             ═══════════════════════════════════════════════════════════════════════ */}
          {step === "credentials" && (
            <div className="animate-[slideUpFade_0.3s_ease]">
              {/* Logo & heading */}
              <div className="flex flex-col items-center mb-8">
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
                  <span className="flex-1">{error}</span>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} noValidate className="space-y-4">
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
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 text-[#1b2b68] text-xs shrink-0 cursor-pointer",
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

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
          )}

          {/* ═══════════════════════════════════════════════════════════════════════
              STEP 2: TWO-STEP VERIFICATION (2FA CODE)
             ═══════════════════════════════════════════════════════════════════════ */}
          {step === "2fa" && (
            <div className="animate-[slideUpFade_0.3s_ease]">
              {/* Security Shield Icon Header */}
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="relative mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#b7c4ff]/25 to-[#4b5b99]/30 border border-[#b7c4ff]/35 flex items-center justify-center shadow-lg shadow-[#b7c4ff]/15">
                    <span className="text-3xl">🛡️</span>
                  </div>
                  <div className="absolute -inset-2 rounded-2xl bg-[#b7c4ff]/20 blur-xl -z-10 animate-pulse" />
                </div>
                <h1 className="text-xl font-bold text-[#e5e2e1] font-['Montserrat',sans-serif]">
                  Verificación en dos pasos
                </h1>
                <p className="text-xs text-[#e5e2e1]/55 mt-1.5 max-w-xs leading-relaxed">
                  Ingresa el código de 6 dígitos que enviamos a tu correo:
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-lg bg-[#b7c4ff]/10 border border-[#b7c4ff]/20 text-[#b7c4ff] text-xs font-medium">
                  <span>✉</span>
                  <span className="truncate max-w-[240px]">{email}</span>
                </div>
              </div>

              {/* Info banner */}
              {info && !error && (
                <div className="mb-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#b7c4ff]/10 border border-[#b7c4ff]/20 text-[#b7c4ff] text-xs animate-[slideUpFade_0.2s_ease]">
                  <span className="shrink-0 text-sm">ℹ️</span>
                  <span className="flex-1">{info}</span>
                </div>
              )}

              {/* Error alert */}
              {error && (
                <div className="mb-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-[slideUpFade_0.2s_ease]">
                  <span className="shrink-0 w-4 h-4 rounded-md bg-red-500/20 flex items-center justify-center text-xs font-bold">!</span>
                  <span className="flex-1">{error}</span>
                </div>
              )}

              {/* 6-Digit OTP Input Boxes */}
              <div className="my-6">
                <div
                  className="flex items-center justify-between gap-1.5 sm:gap-2.5"
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      disabled={isLoading}
                      className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl bg-white/5 border border-white/15 text-[#e5e2e1] focus:outline-none focus:border-[#b7c4ff] focus:ring-2 focus:ring-[#b7c4ff]/40 hover:border-white/25 transition-all selection:bg-[#b7c4ff] selection:text-[#1b2b68] disabled:opacity-50"
                      aria-label={`Dígito ${idx + 1} del código`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 px-1 text-[11px] text-[#e5e2e1]/40">
                  <span>⏱ Válido por 10 minutos</span>
                  <span className="text-[#b7c4ff]/60">Pega tu código aquí (Ctrl+V)</span>
                </div>
              </div>

              {/* Verify & Enter Button */}
              <button
                type="button"
                onClick={() => handleVerify2fa()}
                disabled={isLoading || otp.some((d) => d === "")}
                className="w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #b7c4ff 0%, #dde1ff 100%)",
                  color: "#1b2b68",
                  boxShadow: "0 0 15px rgba(183,196,255,0.3)",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && otp.every((d) => d !== "")) {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(183,196,255,0.6)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 15px rgba(183,196,255,0.3)";
                }}
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-[#1b2b68] border-t-transparent animate-spin" />
                ) : null}
                {isLoading ? "Verificando…" : "Verificar y Entrar al Panel"}
              </button>

              {/* Resend Code & Back buttons */}
              <div className="mt-5 space-y-3 pt-4 border-t border-white/6 text-center">
                <div className="text-xs text-[#e5e2e1]/50">
                  {resendSeconds > 0 ? (
                    <span className="flex items-center justify-center gap-1.5 text-[#e5e2e1]/40">
                      <span>¿No recibiste el código?</span>
                      <span className="text-[#b7c4ff]/70 font-mono">
                        Reenviar en {resendSeconds}s
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isResending}
                      className="text-[#b7c4ff] hover:text-[#dde1ff] font-semibold transition-colors underline underline-offset-2 cursor-pointer disabled:opacity-50"
                    >
                      {isResending ? "Enviando código…" : "¿No recibiste el código? Reenviar código"}
                    </button>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleBackToCredentials}
                    className="text-xs text-[#e5e2e1]/40 hover:text-[#e5e2e1] transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>←</span>
                    <span>Usar otro correo o contraseña</span>
                  </button>
                </div>
              </div>
            </div>
          )}

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
