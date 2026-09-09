"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../_context/AuthContext";

interface NavItem { href: string; label: string; icon: string; }

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/admin/reviews",   label: "Reviews",   icon: "★" },
  { href: "/admin/gallery",   label: "Gallery",   icon: "🖼" },
  { href: "/admin/contacts",  label: "Contacts",  icon: "✉" },
  { href: "/admin/settings",  label: "Settings",  icon: "⚙" },
];

export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside
        className={[
          "fixed top-0 left-0 z-50 h-full w-64 flex flex-col",
          "border-r transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{
          background: "var(--ad-sidebar-bg)",
          backdropFilter: "blur(24px)",
          borderColor: "var(--ad-border)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: "var(--ad-border)" }}
        >
          <div
            className="px-2 py-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.74)", backdropFilter: "blur(8px)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Perez Roofing"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) parent.textContent = "P";
              }}
            />
          </div>
          <div>
            <p className="text-sm font-bold leading-none font-['Montserrat',sans-serif]" style={{ color: "var(--ad-text)" }}>
              Perez Roofing
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--ad-text-faint)" }}>Admin Panel</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ color: "var(--ad-text-faint)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--ad-text)";
              e.currentTarget.style.background = "var(--ad-hover-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--ad-text-faint)";
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="Close sidebar"
          >✕</button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {navItems.map(({ href, label, icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group border"
                style={active ? {
                  background: "var(--ad-primary-muted)",
                  borderColor: "var(--ad-primary-border)",
                  color: "var(--ad-primary)",
                } : {
                  borderColor: "transparent",
                  color: "var(--ad-text-muted)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "var(--ad-hover-bg)";
                    e.currentTarget.style.color = "var(--ad-text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--ad-text-muted)";
                  }
                }}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all"
                  style={active ? {
                    background: "var(--ad-primary-muted)",
                    color: "var(--ad-primary)",
                    boxShadow: "0 0 10px var(--ad-primary-border)",
                  } : {
                    background: "var(--ad-hover-bg)",
                    color: "var(--ad-text-muted)",
                  }}
                >
                  {icon}
                </span>
                {label}
                {active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--ad-primary)", boxShadow: "0 0 6px var(--ad-primary)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: "var(--ad-border)" }}>
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
            style={{ background: "var(--ad-primary-muted)", borderColor: "var(--ad-primary-border)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, var(--ad-primary) 0%, #dde1ff 100%)", color: "var(--ad-primary-dark)" }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--ad-text)" }}>{user?.name || "Admin"}</p>
              <p className="text-[11px] truncate" style={{ color: "var(--ad-text-faint)" }}>{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border border-transparent"
            style={{ color: "var(--ad-error)", opacity: 0.75 }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,38,38,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.75";
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
            }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{ background: "rgba(220,38,38,0.08)", color: "var(--ad-error)" }}
            >⬡</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
