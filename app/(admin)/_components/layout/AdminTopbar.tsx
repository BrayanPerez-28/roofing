"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../../_context/AuthContext";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/reviews":   "Reviews",
  "/admin/contacts":  "Contacts",
  "/admin/gallery":   "Gallery",
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
      className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3.5 border-b"
      style={{
        background: "var(--ad-topbar-bg)",
        backdropFilter: "blur(24px)",
        borderColor: "var(--ad-border)",
      }}
    >
      {/* Hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
        style={{ color: "var(--ad-text-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ad-hover-bg)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        aria-label="Toggle sidebar"
      >☰</button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-base font-semibold font-['Montserrat',sans-serif]" style={{ color: "var(--ad-text)" }}>
          {title}
        </h1>
        <p className="text-xs hidden sm:block" style={{ color: "var(--ad-text-faint)" }}>{now}</p>
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--ad-primary)", opacity: 0.5 }}>🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="w-48 pl-8 pr-3 py-1.5 rounded-xl text-sm focus:outline-none transition-all"
          style={{
            background: "var(--ad-input-bg)",
            border: `1px solid var(--ad-input-border)`,
            color: "var(--ad-text)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--ad-primary-border)";
            e.currentTarget.style.boxShadow = "0 0 0 2px var(--ad-primary-muted)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--ad-input-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
          aria-label="Search"
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={onThemeToggle}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all border"
        style={{
          color: "var(--ad-text-muted)",
          borderColor: "var(--ad-border)",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--ad-primary)";
          e.currentTarget.style.background = "var(--ad-primary-muted)";
          e.currentTarget.style.borderColor = "var(--ad-primary-border)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--ad-text-muted)";
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "var(--ad-border)";
        }}
        aria-label="Toggle theme"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? "☀" : "🌙"}
      </button>

      {/* Profile dropdown */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setProfileOpen((p) => !p)}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all"
          style={{
            background: "var(--ad-input-bg)",
            borderColor: "var(--ad-input-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--ad-primary-muted)";
            e.currentTarget.style.borderColor = "var(--ad-primary-border)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--ad-input-bg)";
            e.currentTarget.style.borderColor = "var(--ad-input-border)";
          }}
          aria-label="User menu"
          aria-expanded={profileOpen}
          id="profile-btn"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: "linear-gradient(135deg, var(--ad-primary) 0%, #dde1ff 100%)", color: "var(--ad-primary-dark)" }}
          >
            {initials}
          </div>
          <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate" style={{ color: "var(--ad-text)" }}>
            {user?.name?.split(" ")[0] || "Admin"}
          </span>
          <span className="text-xs" style={{ color: "var(--ad-text-faint)" }}>▾</span>
        </button>

        {profileOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-2xl overflow-hidden animate-[slideUpFade_0.2s_ease]"
            style={{
              background: "var(--ad-dropdown-bg)",
              backdropFilter: "blur(24px)",
              borderColor: "var(--ad-border)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ad-border)" }}>
              <p className="text-sm font-semibold truncate" style={{ color: "var(--ad-text)" }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: "var(--ad-text-faint)" }}>{user?.email}</p>
            </div>
            <div className="py-1">
              {[
                { href: "/admin/settings", label: "Settings",        icon: "⚙" },
                { href: "/admin/settings", label: "Change Password",  icon: "🔑" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                  style={{ color: "var(--ad-text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--ad-primary)";
                    e.currentTarget.style.background = "var(--ad-primary-muted)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ad-text-muted)";
                    e.currentTarget.style.background = "transparent";
                  }}
                  onClick={() => setProfileOpen(false)}
                >
                  <span>{item.icon}</span> {item.label}
                </a>
              ))}
            </div>
            <div className="border-t py-1" style={{ borderColor: "var(--ad-border)" }}>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                style={{ color: "var(--ad-error)", opacity: 0.75 }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.75";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
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
