import { useMemo, useState } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { generateConfig } from '@/lib/jsonGenerator';

export function JsonPreview() {
  const { config } = useConfig();
  const [copied, setCopied] = useState(false);

  const { configs, errors } = useMemo(
    () =>
      generateConfig({
        adGroups: config.adGroups,
        timing: config.timing,
        placements: config.placements,
        offers: config.offers,
        offersToAdGroups: config.offersToAdGroups,
      }),
    [config.adGroups, config.timing, config.placements, config.offers, config.offersToAdGroups]
  );

  const jsonString = useMemo(
    () => JSON.stringify(configs, null, 2),
    [configs]
  );

  const errorEntries = Object.entries(errors);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Errors */}
      {errorEntries.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-red-800">
            Validation Errors
          </h3>
          <ul className="space-y-1 text-sm text-red-700">
            {errorEntries.map(([adGroup, error]) => (
              <li key={adGroup}>
                <span className="font-medium">{adGroup}:</span> {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {configs.length} ad group config{configs.length !== 1 ? 's' : ''} generated
        </p>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            disabled={configs.length === 0}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
          <button
            onClick={download}
            disabled={configs.length === 0}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            Download
          </button>
        </div>
      </div>

      {/* JSON output */}
      <pre className="max-h-[600px] overflow-auto rounded-md bg-gray-900 p-4 text-sm text-green-400">
        <code>{jsonString}</code>
      </pre>
    </div>
  );
}
