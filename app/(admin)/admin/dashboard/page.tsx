"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../_context/AuthContext";
import { reviewsApi } from "../../_lib/api";
import { contactsApi } from "../../_lib/api";
import { StatCardSkeleton } from "../../_components/ui/Skeleton";
import { ApprovedBadge } from "../../_components/ui/Badge";
import { StarRating } from "../../_components/ui/StarRating";
import type { Review, Contact } from "../../_lib/types";

// ─── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  title, value, icon, iconBg, change, isLoading,
}: {
  title: string; value: number; icon: string; iconBg: string; change?: string; isLoading: boolean;
}) {
  if (isLoading) return <StatCardSkeleton />;
  return (
    <div className="admin-card admin-stat-card p-6 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-200 admin-card-glow cursor-default">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-white/50">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white animate-[countUp_0.6s_ease]">
        <AnimatedNumber value={value} />
      </div>
      {change && <p className="text-xs text-white/35">{change}</p>}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [revMeta, setRevMeta] = useState({ total: 0 });
  const [contMeta, setContMeta] = useState({ total: 0 });
  const [revPending, setRevPending] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      reviewsApi.list({ status: "all", per_page: 5, page: 1 }),
      reviewsApi.list({ status: "pending", per_page: 1, page: 1 }),
      contactsApi.list({ per_page: 5, page: 1 }),
    ])
      .then(([revRes, pendRes, contRes]) => {
        setReviews(revRes.data);
        setRevMeta(revRes.meta);
        setRevPending(pendRes.meta.total);
        setContacts(contRes.data);
        setContMeta(contRes.meta);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-8 animate-[slideUpFade_0.4s_ease]">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          {greeting()}, {user?.name?.split(" ")[0] || "Admin"} 👋
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Here&apos;s what&apos;s happening with Perez Roofing today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reviews"
          value={revMeta.total}
          icon="★"
          iconBg="bg-[#b7c4ff]/15 text-[#b7c4ff]"
          change="All-time submissions"
          isLoading={isLoading}
        />
        <StatCard
          title="Pending Reviews"
          value={revPending}
          icon="⏳"
          iconBg="bg-yellow-500/15 text-yellow-400"
          change="Awaiting moderation"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Contacts"
          value={contMeta.total}
          icon="✉"
          iconBg="bg-[#b7c4ff]/10 text-[#b6c4ff]"
          change="All-time inquiries"
          isLoading={isLoading}
        />
        <StatCard
          title="Active Users"
          value={1}
          icon="👤"
          iconBg="bg-green-500/15 text-green-400"
          change="Administrators"
          isLoading={isLoading}
        />
      </div>

      {/* Two-column tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <div className="admin-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
            <h3 className="text-sm font-semibold text-[#e5e2e1]">Recent Reviews</h3>
            <a href="/admin/reviews" className="text-xs text-[#b7c4ff] hover:text-[#dde1ff] transition-colors">
              View all →
            </a>
          </div>
          <div className="divide-y divide-white/6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex gap-3 items-center">
                    <div className="admin-skeleton h-9 w-9 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="admin-skeleton h-3 w-32" />
                      <div className="admin-skeleton h-2 w-48" />
                    </div>
                  </div>
                ))
              : reviews.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-white/30">No reviews yet</div>
              ) : (
                reviews.slice(0, 5).map((r) => (
                  <div key={r.id} className="px-6 py-4 flex items-start gap-3 hover:bg-white/3 transition-colors">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#1b2b68] text-sm font-bold shrink-0" style={{ background: "linear-gradient(135deg, rgba(183,196,255,0.8), rgba(183,196,255,0.5))" }}>
                      {r.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">{r.name}</span>
                        <ApprovedBadge approved={r.approved} />
                      </div>
                      <StarRating value={r.rating} readonly size="sm" />
                      <p className="text-xs text-white/40 mt-0.5 truncate">{r.comment}</p>
                    </div>
                    <span className="text-xs text-white/30 shrink-0">{formatDate(r.created_at)}</span>
                  </div>
                ))
              )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="admin-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
            <h3 className="text-sm font-semibold text-[#e5e2e1]">Recent Contacts</h3>
            <a href="/admin/contacts" className="text-xs text-[#b7c4ff] hover:text-[#dde1ff] transition-colors">
              View all →
            </a>
          </div>
          <div className="divide-y divide-white/6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex gap-3 items-center">
                    <div className="admin-skeleton h-9 w-9 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="admin-skeleton h-3 w-32" />
                      <div className="admin-skeleton h-2 w-48" />
                    </div>
                  </div>
                ))
              : contacts.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-white/30">No contacts yet</div>
              ) : (
                contacts.slice(0, 5).map((c) => (
                  <div key={c.id} className="px-6 py-4 flex items-start gap-3 hover:bg-white/3 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 flex items-center justify-center text-blue-400 text-sm font-bold shrink-0">
                      {c.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{c.name}</p>
                      <p className="text-xs text-white/40 truncate">{c.email}</p>
                      {c.inquiry_type && (
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-1">
                          {c.inquiry_type}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/30 shrink-0">{formatDate(c.created_at)}</span>
                  </div>
                ))
              )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/reviews?status=pending", label: "Moderate Reviews", icon: "⏳", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20" },
            { href: "/admin/contacts", label: "View Contacts", icon: "✉", color: "text-[#b7c4ff] bg-[#b7c4ff]/8 border-[#b7c4ff]/15 hover:bg-[#b7c4ff]/14" },
            { href: "/admin/settings", label: "Settings", icon: "⚙", color: "text-[#e5e2e1]/60 bg-white/6 border-white/10 hover:bg-white/12" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${action.color}`}
            >
              <span>{action.icon}</span>
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
