interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ColorPicker({
  label,
  value,
  onChange,
  error,
}: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded border border-gray-300"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className={`flex-1 rounded-md border px-3 py-1.5 text-sm ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } focus:outline-none focus:ring-1`}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
