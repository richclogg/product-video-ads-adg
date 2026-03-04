interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberField({
  label,
  value,
  onChange,
  error,
  min,
  max,
  step,
}: NumberFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
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
