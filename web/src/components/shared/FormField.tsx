import { type InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormField({ label, error, ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className={`rounded-md border px-3 py-1.5 text-sm ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } focus:outline-none focus:ring-1`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
