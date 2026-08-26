"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../../_context/AuthContext";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/reviews":   "Reviews",
  "/admin/contacts":  "Contacts",
  "/admin/settings":  "Settings",
};

interface AdminTopbarProps {
  onMenuToggle: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function AdminTopbar({ onMenuToggle, isDark, onThemeToggle }: AdminTopbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [now, setNow] = useState("");

  const title = pageTitles[pathname] || "Admin";

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setNow(d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }));
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const close = () => setProfileOpen(false);
    if (profileOpen) window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [profileOpen]);

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3.5 border-b border-white/8"
      style={{ background: "rgba(10,12,20,0.9)", backdropFilter: "blur(24px)" }}
    >
      {/* Hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-[#e5e2e1]/60 hover:text-[#e5e2e1] hover:bg-white/8 transition-all"
        aria-label="Toggle sidebar"
      >☰</button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-base font-semibold text-[#e5e2e1] font-['Montserrat',sans-serif]">{title}</h1>
        <p className="text-xs text-[#e5e2e1]/35 hidden sm:block">{now}</p>
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b7c4ff]/40 text-xs">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="w-48 pl-8 pr-3 py-1.5 rounded-xl text-sm text-[#e5e2e1] placeholder:text-[#e5e2e1]/30 focus:outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(183,196,255,0.3)";
            (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 2px rgba(183,196,255,0.1)";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLInputElement).style.boxShadow = "none";
          }}
          aria-label="Search"
        />
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={onThemeToggle}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-[#e5e2e1]/60 hover:text-[#b7c4ff] transition-all border border-white/8 hover:border-[#b7c4ff]/20 hover:bg-[#b7c4ff]/5"
        aria-label="Toggle theme"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? "☀" : "🌙"}
      </button>

      {/* Profile dropdown */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setProfileOpen((p) => !p)}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-white/10 hover:border-[#b7c4ff]/25 transition-all"
          style={{ background: "rgba(255,255,255,0.05)" }}
          onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = "rgba(183,196,255,0.08)"}
          onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"}
          aria-label="User menu"
          aria-expanded={profileOpen}
          id="profile-btn"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1b2b68] text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #b7c4ff 0%, #dde1ff 100%)" }}
          >
            {initials}
          </div>
          <span className="text-sm font-medium text-[#e5e2e1]/80 hidden sm:block max-w-[100px] truncate">
            {user?.name?.split(" ")[0] || "Admin"}
          </span>
          <span className="text-[#e5e2e1]/30 text-xs">▾</span>
        </button>

        {profileOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden animate-[slideUpFade_0.2s_ease]"
            style={{ background: "rgba(10,12,20,0.97)", backdropFilter: "blur(24px)" }}
          >
            <div className="px-4 py-3 border-b border-white/8">
              <p className="text-sm font-semibold text-[#e5e2e1] truncate">{user?.name}</p>
              <p className="text-xs text-[#e5e2e1]/40 truncate">{user?.email}</p>
            </div>
            <div className="py-1">
              {[
                { href: "/admin/settings", label: "Settings",        icon: "⚙" },
                { href: "/admin/settings", label: "Change Password",  icon: "🔑" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-[#e5e2e1]/70 hover:text-[#b7c4ff] hover:bg-[#b7c4ff]/5 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <span>{item.icon}</span> {item.label}
                </a>
              ))}
            </div>
            <div className="border-t border-white/8 py-1">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-colors"
              >
                <span>⬡</span> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
