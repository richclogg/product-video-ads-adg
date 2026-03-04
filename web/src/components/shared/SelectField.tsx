interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  error?: string;
  allowEmpty?: boolean;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  error,
  allowEmpty = true,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-md border px-3 py-1.5 text-sm ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } focus:outline-none focus:ring-1`}
      >
        {allowEmpty && <option value="">—</option>}
        {options
          .filter((o) => o !== '')
          .map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
