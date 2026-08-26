"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Persist theme preference
  useEffect(() => {
    const stored = localStorage.getItem("admin_theme");
    setIsDark(stored !== "light");
  }, []);

  useEffect(() => {
    localStorage.setItem("admin_theme", isDark ? "dark" : "light");
    // Apply theme class to the admin root
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("admin-dark");
      root.classList.remove("admin-light");
    } else {
      root.classList.add("admin-light");
      root.classList.remove("admin-dark");
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen flex ${isDark ? "admin-dark" : "admin-light"}`}>
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar
          onMenuToggle={() => setSidebarOpen((o) => !o)}
          isDark={isDark}
          onThemeToggle={() => setIsDark((d) => !d)}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
