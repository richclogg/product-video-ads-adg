import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
            >
              {confirmLabel}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
