"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { Spinner } from "./Spinner";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) {
  const icons = { danger: "🗑", warning: "⚠️" };
  const iconBg = {
    danger: "bg-red-500/15 text-red-400",
    warning: "bg-yellow-500/15 text-yellow-400",
  };

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? () => {} : onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${iconBg[variant]}`}>
          {icons[variant]}
        </div>
        <div>
          <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/50">{description}</p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
