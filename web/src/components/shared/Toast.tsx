import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = 'info',
  onDismiss,
  duration = 4000,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-gray-800',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-md px-4 py-2.5 text-sm text-white shadow-lg transition-opacity duration-300 ${
        colors[type]
      } ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {message}
    </div>
  );
}
