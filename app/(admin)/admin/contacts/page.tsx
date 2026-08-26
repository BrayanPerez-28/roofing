"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useContacts } from "../../_hooks/useContacts";
import { Modal } from "../../_components/ui/Modal";
import { ConfirmDialog } from "../../_components/ui/ConfirmDialog";
import { Badge } from "../../_components/ui/Badge";
import { Button } from "../../_components/ui/Button";
import { TableSkeleton } from "../../_components/ui/Skeleton";
import { ToastContainer, useToast } from "../../_components/ui/Toast";
import type { Contact, ContactUpdatePayload } from "../../_lib/types";

// ─── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({
  contact,
  isOpen,
  onClose,
  onSave,
}: {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, payload: ContactUpdatePayload) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setEmail(contact.email);
      setPhone(contact.phone || "");
      setInquiryType(contact.inquiry_type || "");
      setMessage(contact.message);
      setErrors({});
    }
  }, [contact]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    if (!message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setIsSaving(true);
    try {
      await onSave(contact!.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        inquiryType: inquiryType.trim() || null,
        message: message.trim(),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = (err?: string) =>
    `w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all ${err ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Contact"
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white/60 block mb-1.5">Full Name</label>
            <input value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
              className={inputClass(errors.name)} placeholder="John Doe" />
            {errors.name && <p className="text-xs text-red-400 mt-1">⚠ {errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-white/60 block mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
              className={inputClass(errors.email)} placeholder="john@example.com" />
            {errors.email && <p className="text-xs text-red-400 mt-1">⚠ {errors.email}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white/60 block mb-1.5">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass()} placeholder="+1 555 000 0000" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/60 block mb-1.5">Inquiry Type</label>
            <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1b] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all">
              <option value="">— Select a service —</option>
              <option value="Composition Shingles">Composition Shingles</option>
              <option value="Concrete Tile">Concrete Tile</option>
              <option value="Flat Roof (PVC/TPO)">Flat Roof (PVC/TPO)</option>
              <option value="Standing Seam Metal">Standing Seam Metal</option>
              <option value="Wood Shingles">Wood Shingles</option>
              <option value="Roof Repairs">Roof Repairs</option>
              <option value="Gutters & Downspouts">Gutters &amp; Downspouts</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-white/60 block mb-1.5">Message</label>
          <textarea value={message} onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: "" })); }}
            rows={4} className={`${inputClass(errors.message)} resize-none`} placeholder="Message…" />
          {errors.message && <p className="text-xs text-red-400 mt-1">⚠ {errors.message}</p>}
        </div>
      </div>
    </Modal>
  );
}

// ─── View Modal ────────────────────────────────────────────────────────────────
function ViewModal({ contact, isOpen, onClose }: { contact: Contact | null; isOpen: boolean; onClose: () => void }) {
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { dateStyle: "long" });
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Details" maxWidth="md">
      {contact && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-white/8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 flex items-center justify-center text-blue-400 text-xl font-bold">
              {contact.name[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white">{contact.name}</p>
              <p className="text-sm text-white/50">{contact.email}</p>
            </div>
            {contact.inquiry_type && (
              <Badge variant="info" className="ml-auto">{contact.inquiry_type}</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="px-3 py-2.5 rounded-lg bg-white/4">
              <p className="text-xs text-white/40">Phone</p>
              <p className="text-sm text-white mt-0.5">{contact.phone || "—"}</p>
            </div>
            <div className="px-3 py-2.5 rounded-lg bg-white/4">
              <p className="text-xs text-white/40">Submitted</p>
              <p className="text-sm text-white mt-0.5">{fmt(contact.created_at)}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-white/40 mb-2">Message</p>
            <div className="px-4 py-3 rounded-xl bg-white/4 border border-white/8">
              <p className="text-sm text-white/80 leading-relaxed admin-prose">{contact.message}</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
function ContactsContent() {
  const { contacts, meta, isLoading, fetch, update, remove } = useContacts();
  const { toasts, toast, dismissToast } = useToast();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [sortKey, setSortKey] = useState<keyof Contact>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(() => {
    fetch({ per_page: perPage, page });
  }, [fetch, perPage, page]);

  useEffect(() => { load(); }, [load]);

  const handleSort = (key: keyof Contact) => {
    setSortDir((d) => (sortKey === key ? (d === "asc" ? "desc" : "asc") : "desc"));
    setSortKey(key);
  };

  const handleUpdate = async (id: number, payload: ContactUpdatePayload) => {
    try {
      await update(id, payload);
      toast.success("Contact updated successfully");
    } catch {
      toast.error("Failed to update contact");
      throw new Error("failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteContact) return;
    setIsDeleting(true);
    try {
      await remove(deleteContact.id);
      toast.success("Contact deleted");
      setDeleteContact(null);
    } catch {
      toast.error("Failed to delete contact");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = contacts
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.inquiry_type || "").toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const av = a[sortKey] as string | null;
      const bv = b[sortKey] as string | null;
      const cmp = (av ?? "") < (bv ?? "") ? -1 : (av ?? "") > (bv ?? "") ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const SortIcon = ({ k }: { k: keyof Contact }) => (
    <span className={`ml-1 text-xs ${sortKey === k ? "text-orange-400" : "text-white/20"}`}>
      {sortKey === k ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="space-y-6 animate-[slideUpFade_0.4s_ease]">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div>
        <h2 className="text-xl font-bold text-white">Contacts</h2>
        <p className="text-sm text-white/40">{meta.total} total inquiries</p>
      </div>

      {/* Search bar */}
      <div className="admin-card p-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject, or message…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/30 transition-all"
          />
        </div>
      </div>

      {/* Table — desktop */}
      <div className="admin-card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                {[
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "inquiry_type", label: "Subject" },
                  { key: "message", label: "Message" },
                  { key: "created_at", label: "Date" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key as keyof Contact)}
                    className="cursor-pointer hover:text-white transition-colors select-none"
                  >
                    {label} <SortIcon k={key as keyof Contact} />
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-0">
                    <TableSkeleton rows={5} cols={7} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="py-16 flex flex-col items-center gap-3">
                      <div className="text-4xl">✉</div>
                      <p className="text-sm text-white/40">No contacts found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">
                          {c.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="text-white/70 text-sm">{c.email}</td>
                    <td className="text-white/50 text-sm">{c.phone || "—"}</td>
                    <td>
                      {c.inquiry_type
                        ? <Badge variant="info">{c.inquiry_type}</Badge>
                        : <span className="text-white/30 text-xs">—</span>}
                    </td>
                    <td>
                      <p className="max-w-xs truncate text-white/60 text-sm">{c.message}</p>
                    </td>
                    <td className="text-white/50 text-xs">{formatDate(c.created_at)}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewContact(c)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          title="View message"
                        >👁</button>
                        <button
                          onClick={() => setEditContact(c)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
                          title="Edit"
                        >✏</button>
                        <button
                          onClick={() => setDeleteContact(c)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >🗑</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards — mobile */}
      <div className="space-y-3 md:hidden">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="admin-card p-4 space-y-3">
                <div className="admin-skeleton h-4 w-32" />
                <div className="admin-skeleton h-3 w-full" />
                <div className="admin-skeleton h-3 w-3/4" />
              </div>
            ))
          : filtered.map((c) => (
              <div key={c.id} className="admin-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white text-sm">{c.name}</p>
                    <p className="text-xs text-white/50">{c.email}</p>
                  </div>
                  {c.inquiry_type && <Badge variant="info">{c.inquiry_type}</Badge>}
                </div>
                <p className="text-sm text-white/60 line-clamp-2">{c.message}</p>
                <div className="flex items-center justify-between pt-1 border-t border-white/8">
                  <span className="text-xs text-white/30">{formatDate(c.created_at)}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setViewContact(c)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-blue-400 hover:bg-blue-500/10">👁</button>
                    <button onClick={() => setEditContact(c)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-orange-400 hover:bg-orange-500/10">✏</button>
                    <button onClick={() => setDeleteContact(c)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10">🗑</button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/40">
            Page {meta.page} of {meta.last_page} · {meta.total} total
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>← Prev</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= meta.last_page}>Next →</Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ViewModal contact={viewContact} isOpen={!!viewContact} onClose={() => setViewContact(null)} />
      <EditModal contact={editContact} isOpen={!!editContact} onClose={() => setEditContact(null)} onSave={handleUpdate} />
      <ConfirmDialog
        isOpen={!!deleteContact}
        onClose={() => setDeleteContact(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Contact?"
        description={`This will permanently delete the inquiry from "${deleteContact?.name}". This cannot be undone.`}
        confirmLabel="Delete Contact"
      />
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense>
      <ContactsContent />
    </Suspense>
  );
}
