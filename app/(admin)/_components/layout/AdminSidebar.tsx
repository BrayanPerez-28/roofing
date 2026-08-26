"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../_context/AuthContext";

interface NavItem { href: string; label: string; icon: string; }

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/admin/reviews",   label: "Reviews",   icon: "★" },
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
          "border-r border-white/8",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ background: "rgba(10,12,20,0.95)", backdropFilter: "blur(24px)" }}
      >
        {/* Logo — same style as site header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
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
            <p className="text-sm font-bold text-[#e5e2e1] leading-none font-['Montserrat',sans-serif]">
              Perez Roofing
            </p>
            <p className="text-[11px] text-[#e5e2e1]/40 mt-0.5">Admin Panel</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden w-7 h-7 rounded-lg flex items-center justify-center text-[#e5e2e1]/40 hover:text-[#e5e2e1] hover:bg-white/8 transition-all"
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
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group border",
                  active
                    ? "border-[#b7c4ff]/20 text-[#b7c4ff]"
                    : "border-transparent text-[#e5e2e1]/50 hover:text-[#e5e2e1] hover:bg-white/5",
                ].join(" ")}
                style={active ? {
                  background: "linear-gradient(135deg, rgba(183,196,255,0.12) 0%, rgba(11,30,91,0.4) 100%)",
                } : {}}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={[
                    "w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all",
                    active
                      ? "text-[#b7c4ff]"
                      : "text-[#e5e2e1]/40 group-hover:text-[#e5e2e1]/70",
                  ].join(" ")}
                  style={active ? {
                    background: "rgba(183,196,255,0.15)",
                    boxShadow: "0 0 10px rgba(183,196,255,0.2)",
                  } : { background: "rgba(255,255,255,0.05)" }}
                >
                  {icon}
                </span>
                {label}
                {active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "#b7c4ff", boxShadow: "0 0 6px rgba(183,196,255,0.8)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/8 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(183,196,255,0.05)", border: "1px solid rgba(183,196,255,0.1)" }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1b2b68] text-xs font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, #b7c4ff 0%, #dde1ff 100%)" }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#e5e2e1] truncate">{user?.name || "Admin"}</p>
              <p className="text-[11px] text-[#e5e2e1]/40 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150 border border-transparent hover:border-red-500/20"
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/8 text-red-400 text-base">⬡</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
