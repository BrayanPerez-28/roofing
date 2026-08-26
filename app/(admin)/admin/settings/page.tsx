"use client";

import { useState } from "react";
import { useAuth } from "../../_context/AuthContext";
import { authApi } from "../../_lib/api";
import { Button } from "../../_components/ui/Button";
import { ToastContainer, useToast } from "../../_components/ui/Toast";

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const { toasts, toast, dismissToast } = useToast();

  // Password change
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [isSavingPass, setIsSavingPass] = useState(false);

  // UI state
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    if (!currentPass) { setPassError("Current password is required"); return; }
    if (newPass.length < 8) { setPassError("New password must be at least 8 characters"); return; }
    if (newPass !== confirmPass) { setPassError("Passwords do not match"); return; }

    setIsSavingPass(true);
    try {
      // Using the register-style flow — POST to update password via update endpoint
      // Since the API doesn't have a dedicated change-password endpoint, we notify the user
      toast.info("Password change is handled by your admin credentials. Contact the system administrator.");
    } catch {
      toast.error("Failed to change password");
    } finally {
      setIsSavingPass(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error("Logout failed");
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 hover:border-white/20 transition-all placeholder:text-white/25";

  return (
    <div className="space-y-8 animate-[slideUpFade_0.4s_ease] max-w-2xl">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-white/40">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="admin-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-orange-500/15 flex items-center justify-center text-orange-400 text-xs">👤</span>
          Profile Information
        </h3>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/4 border border-white/8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D35400] to-[#FF8C00] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/30">
            {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "A"}
          </div>
          <div>
            <p className="font-semibold text-white">{user?.name || "Administrator"}</p>
            <p className="text-sm text-white/50">{user?.email || ""}</p>
            <p className="text-xs text-white/30 mt-0.5">
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
            </p>
          </div>
          <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Administrator
          </span>
        </div>
      </div>

      {/* Change Password */}
      <div className="admin-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-blue-500/15 flex items-center justify-center text-blue-400 text-xs">🔑</span>
          Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white/60 block mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm" tabIndex={-1}>
                {showCurrent ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-white/60 block mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm" tabIndex={-1}>
                {showNew ? "🙈" : "👁"}
              </button>
            </div>
            <p className="text-xs text-white/30 mt-1">Minimum 8 characters</p>
          </div>
          <div>
            <label className="text-sm font-medium text-white/60 block mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
          {passError && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <span>⚠</span> {passError}
            </div>
          )}
          <Button type="submit" variant="primary" isLoading={isSavingPass} className="w-full sm:w-auto">
            Update Password
          </Button>
        </form>
      </div>

      {/* Appearance */}
      <div className="admin-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-purple-500/15 flex items-center justify-center text-purple-400 text-xs">🎨</span>
          Appearance
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/8">
          <div>
            <p className="text-sm font-medium text-white">Theme</p>
            <p className="text-xs text-white/40 mt-0.5">Controlled by the top bar toggle</p>
          </div>
          <div className="flex gap-2">
            {["Dark", "Light"].map((theme) => (
              <span key={theme}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/50 bg-white/4">
                {theme === "Dark" ? "🌙" : "☀"} {theme}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="admin-card p-6 border-red-500/20">
        <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-red-500/15 flex items-center justify-center text-red-400 text-xs">⚠</span>
          Danger Zone
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <div>
            <p className="text-sm font-medium text-white">Sign Out</p>
            <p className="text-xs text-white/40 mt-0.5">End your current admin session</p>
          </div>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
