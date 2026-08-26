"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";
import { AdminShell } from "../_components/layout/AdminShell";
import { Spinner } from "../_components/ui/Spinner";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Temporary bypass: if NEXT_PUBLIC_ADMIN_BYPASS=true in env, skip auth checks
  if (process.env.NEXT_PUBLIC_ADMIN_BYPASS === "true") {
    return <AdminShell>{children}</AdminShell>;
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="admin-dark min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Logo pill — same as Header */}
          <div
            className="px-3 py-2 rounded-xl animate-[float_2s_ease-in-out_infinite]"
            style={{ background: "rgba(255,255,255,0.74)", backdropFilter: "blur(8px)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Perez Roofing" className="h-8 w-auto object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          </div>
          <Spinner size="md" className="text-[#b7c4ff]" />
          <p className="text-sm text-[#e5e2e1]/40">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router redirect in progress
  }

  return <AdminShell>{children}</AdminShell>;
}
