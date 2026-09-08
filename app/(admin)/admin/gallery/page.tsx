"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useGallery } from "../../_hooks/useGallery";
import { Modal } from "../../_components/ui/Modal";
import { ConfirmDialog } from "../../_components/ui/ConfirmDialog";
import { Button } from "../../_components/ui/Button";
import { ToastContainer, useToast } from "../../_components/ui/Toast";
import { galleryApi } from "../../_lib/api";
import type { Service, ServiceMedia } from "../../_lib/types";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const ACCEPTED = "image/jpeg,image/png,image/webp,video/mp4";

function isVideo(m: ServiceMedia) {
  return m.media_type === "video";
}

// ─── Skeleton grid ─────────────────────────────────────────────────────────────
function MediaGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-xl admin-skeleton" />
      ))}
    </div>
  );
}

// ─── Media Card ────────────────────────────────────────────────────────────────
function MediaCard({
  item,
  onDelete,
}: {
  item: ServiceMedia;
  onDelete: (item: ServiceMedia) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const url = galleryApi.mediaUrl(item.file_path);

  return (
    <div
      className="relative group aspect-square rounded-xl overflow-hidden border border-white/8 bg-white/4 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isVideo(item) ? (
        <video
          src={url}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          autoPlay={hovered}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="Gallery media"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      )}

      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-all duration-200 flex items-start justify-between p-2 ${
          hovered ? "bg-black/50" : "bg-transparent"
        }`}
      >
        {isVideo(item) && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white/80 border border-white/10">
            VIDEO
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item); }}
          className={`ml-auto w-7 h-7 rounded-lg flex items-center justify-center bg-red-500/80 hover:bg-red-500 text-white transition-all duration-150 ${
            hovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

// ─── Drop Zone / Uploader ──────────────────────────────────────────────────────
function DropZone({
  onFiles,
  isUploading,
  progress,
}: {
  onFiles: (files: File[]) => void;
  isUploading: boolean;
  progress: number;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp", "video/mp4"].includes(f.type)
      );
      if (files.length) onFiles(files);
    },
    [onFiles]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isUploading && inputRef.current?.click()}
      className={[
        "relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none",
        isDragging
          ? "border-[#b7c4ff]/60 bg-[#b7c4ff]/8 scale-[1.01]"
          : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5",
        isUploading ? "pointer-events-none" : "",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />

      {isUploading ? (
        <>
          <div className="text-3xl animate-bounce">⬆</div>
          <p className="text-sm font-medium text-[#b7c4ff]">Uploading…</p>
          <div className="w-full max-w-xs h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#b7c4ff] to-[#dde1ff] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-white/40">{progress}%</p>
        </>
      ) : (
        <>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "rgba(183,196,255,0.1)", border: "1px solid rgba(183,196,255,0.2)" }}
          >
            📁
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white/80">
              {isDragging ? "Drop files here" : "Drag & drop or click to select"}
            </p>
            <p className="text-xs text-white/40 mt-1">JPG, PNG, WEBP, MP4 · max 10 MB each</p>
          </div>
          <span
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#b7c4ff] border border-[#b7c4ff]/25 hover:bg-[#b7c4ff]/10 transition-all"
            style={{ background: "rgba(183,196,255,0.06)" }}
          >
            Browse files
          </span>
        </>
      )}
    </div>
  );
}

// ─── Service Tab Bar ───────────────────────────────────────────────────────────
function ServiceTabs({
  services,
  activeId,
  onChange,
  isLoading,
}: {
  services: Service[];
  activeId: number | null;
  onChange: (id: number) => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="admin-skeleton h-9 w-28 rounded-xl shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {services.map((svc) => {
        const active = svc.id === activeId;
        return (
          <button
            key={svc.id}
            onClick={() => onChange(svc.id)}
            className={[
              "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border whitespace-nowrap",
              active
                ? "border-[#b7c4ff]/30 text-[#b7c4ff]"
                : "border-transparent text-white/50 hover:text-white hover:bg-white/6",
            ].join(" ")}
            style={active ? { background: "linear-gradient(135deg, rgba(183,196,255,0.15) 0%, rgba(11,30,91,0.4) 100%)" } : {}}
          >
            {svc.name}
          </button>
        );
      })}
    </div>
  );
}

// ─── Service Modal (Create / Edit) ────────────────────────────────────────────
function ServiceModal({
  service,
  isOpen,
  onClose,
  onSave,
}: {
  service: Service | null; // null = create mode
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; slug: string }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setName(service?.name ?? "");
      setSlug(service?.slug ?? "");
      setErrors({});
    }
  }, [isOpen, service]);

  // Auto-generate slug from name in create mode
  const handleNameChange = (v: string) => {
    setName(v);
    if (!service) {
      setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!slug.trim()) e.slug = "Slug is required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setIsSaving(true);
    try {
      await onSave({ name: name.trim(), slug: slug.trim() });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = (err?: string) =>
    `w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b7c4ff]/30 transition-all placeholder:text-white/25 ${
      err ? "border-red-500/50" : "border-white/10 hover:border-white/20"
    }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? `Edit Service — ${service.name}` : "New Service"}
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
            {service ? "Save Changes" : "Create Service"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-white/60 block mb-1.5">Service Name</label>
          <input
            value={name}
            onChange={(e) => { handleNameChange(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
            className={inputClass(errors.name)}
            placeholder="e.g. Metal Roofing"
          />
          {errors.name && <p className="text-xs text-red-400 mt-1">⚠ {errors.name}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-white/60 block mb-1.5">Slug (URL)</label>
          <input
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setErrors((p) => ({ ...p, slug: "" })); }}
            className={inputClass(errors.slug)}
            placeholder="e.g. metal-roofing"
          />
          {errors.slug && <p className="text-xs text-red-400 mt-1">⚠ {errors.slug}</p>}
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Gallery Page Content ─────────────────────────────────────────────────
function GalleryContent() {
  const {
    services,
    media,
    isLoadingServices,
    isLoadingMedia,
    isUploading,
    uploadProgress,
    fetchServices,
    fetchMedia,
    uploadMedia,
    deleteMedia,
    createService,
    updateService,
    deleteService,
  } = useGallery();

  const { toasts, toast, dismissToast } = useToast();

  const [activeServiceId, setActiveServiceId] = useState<number | null>(null);
  const [deleteMediaTarget, setDeleteMediaTarget] = useState<ServiceMedia | null>(null);
  const [isDeletingMedia, setIsDeletingMedia] = useState(false);
  const [serviceModal, setServiceModal] = useState<{ open: boolean; service: Service | null }>({ open: false, service: null });
  const [deleteServiceTarget, setDeleteServiceTarget] = useState<Service | null>(null);
  const [isDeletingService, setIsDeletingService] = useState(false);

  // Load services on mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // When services load, default to the first one
  useEffect(() => {
    if (services.length && activeServiceId === null) {
      setActiveServiceId(services[0].id);
    }
  }, [services, activeServiceId]);

  // Fetch media when active service changes
  useEffect(() => {
    if (activeServiceId === null) return;
    const svc = services.find((s) => s.id === activeServiceId);
    if (svc) fetchMedia(svc.slug);
  }, [activeServiceId, services, fetchMedia]);

  const activeService = services.find((s) => s.id === activeServiceId) ?? null;

  // ── Upload ─────────────────────────────────────────────────────────────────────
  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!activeServiceId) return;
      try {
        const count = files.length;
        await uploadMedia(activeServiceId, files);
        toast.success(`${count} file${count > 1 ? "s" : ""} uploaded successfully`);
      } catch {
        toast.error("Upload failed. Check file size (max 10 MB) and format.");
      }
    },
    [activeServiceId, uploadMedia, toast]
  );

  // ── Delete media ───────────────────────────────────────────────────────────────
  const handleDeleteMedia = async () => {
    if (!deleteMediaTarget) return;
    setIsDeletingMedia(true);
    try {
      await deleteMedia(deleteMediaTarget.id);
      toast.success("File deleted");
      setDeleteMediaTarget(null);
    } catch {
      toast.error("Failed to delete file");
    } finally {
      setIsDeletingMedia(false);
    }
  };

  // ── Service save (create or update) ───────────────────────────────────────────
  const handleServiceSave = async (data: { name: string; slug: string }) => {
    try {
      if (serviceModal.service) {
        await updateService(serviceModal.service.id, data);
        toast.success("Service updated");
      } else {
        const newSvc = await createService(data);
        setActiveServiceId(newSvc.id);
        toast.success("Service created");
      }
    } catch {
      toast.error("Operation failed");
      throw new Error("failed");
    }
  };

  // ── Delete service ─────────────────────────────────────────────────────────────
  const handleDeleteService = async () => {
    if (!deleteServiceTarget) return;
    setIsDeletingService(true);
    try {
      await deleteService(deleteServiceTarget.id);
      toast.success("Service deleted");
      setDeleteServiceTarget(null);
      setActiveServiceId(null);
    } catch {
      toast.error("Failed to delete service");
    } finally {
      setIsDeletingService(false);
    }
  };

  return (
    <div className="space-y-6 animate-[slideUpFade_0.4s_ease]">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* ── Header ──────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Gallery</h2>
          <p className="text-sm text-white/40">
            {services.length} service{services.length !== 1 ? "s" : ""} · {media.length} files in this section
          </p>
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          {activeService && (
            <>
              <button
                onClick={() => setServiceModal({ open: true, service: activeService })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:bg-white/8 transition-all"
                title="Edit service"
              >
                ✏ Edit
              </button>
              <button
                onClick={() => setDeleteServiceTarget(activeService)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 border border-transparent hover:border-red-500/20 hover:bg-red-500/8 transition-all"
                title="Delete service"
              >
                🗑 Delete
              </button>
            </>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setServiceModal({ open: true, service: null })}
          >
            + New Service
          </Button>
        </div>
      </div>

      {/* ── Service Tabs ────────────────────────────────────────────────────────── */}
      <div className="admin-card p-4">
        {services.length === 0 && !isLoadingServices ? (
          <div className="py-4 text-center text-sm text-white/30">
            No services yet. Create one to get started.
          </div>
        ) : (
          <ServiceTabs
            services={services}
            activeId={activeServiceId}
            onChange={setActiveServiceId}
            isLoading={isLoadingServices}
          />
        )}
      </div>

      {/* ── Uploader (only when a service is selected) ─────────────────────────── */}
      {activeService && (
        <div className="admin-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-md flex items-center justify-center text-[#b7c4ff] text-xs"
              style={{ background: "rgba(183,196,255,0.12)" }}
            >
              ⬆
            </span>
            Upload to <span className="text-[#b7c4ff]">{activeService.name}</span>
          </h3>
          <DropZone
            onFiles={handleFiles}
            isUploading={isUploading}
            progress={uploadProgress}
          />
        </div>
      )}

      {/* ── Media Grid ──────────────────────────────────────────────────────────── */}
      {activeService && (
        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center text-[#b7c4ff] text-xs"
                style={{ background: "rgba(183,196,255,0.12)" }}
              >
                🖼
              </span>
              {activeService.name} — Media
            </h3>
            <span className="text-xs text-white/40">
              {media.length} file{media.length !== 1 ? "s" : ""}
            </span>
          </div>

          {isLoadingMedia ? (
            <MediaGridSkeleton />
          ) : media.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="text-4xl opacity-40">🖼</div>
              <p className="text-sm text-white/40">No media yet. Upload some files above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {media.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onDelete={setDeleteMediaTarget}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Empty state (no service selected) ──────────────────────────────────── */}
      {!activeService && !isLoadingServices && services.length > 0 && (
        <div className="admin-card py-16 flex flex-col items-center gap-3">
          <div className="text-4xl">🖼</div>
          <p className="text-sm text-white/40">Select a service tab to view its gallery.</p>
        </div>
      )}

      {/* ── Modals ──────────────────────────────────────────────────────────────── */}
      <ServiceModal
        service={serviceModal.service}
        isOpen={serviceModal.open}
        onClose={() => setServiceModal({ open: false, service: null })}
        onSave={handleServiceSave}
      />

      <ConfirmDialog
        isOpen={!!deleteMediaTarget}
        onClose={() => setDeleteMediaTarget(null)}
        onConfirm={handleDeleteMedia}
        isLoading={isDeletingMedia}
        title="Delete File?"
        description="This will permanently remove the file from the server. This cannot be undone."
        confirmLabel="Delete File"
      />

      <ConfirmDialog
        isOpen={!!deleteServiceTarget}
        onClose={() => setDeleteServiceTarget(null)}
        onConfirm={handleDeleteService}
        isLoading={isDeletingService}
        title={`Delete "${deleteServiceTarget?.name}"?`}
        description="This will delete the service and all its associated media from the server. This cannot be undone."
        confirmLabel="Delete Service"
      />
    </div>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  return (
    <Suspense>
      <GalleryContent />
    </Suspense>
  );
}
