import { useMemo, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { useConfig } from '@/context/ConfigContext';
import { generateConfig } from '@/lib/jsonGenerator';
import { functions } from '@/lib/firebase';
import { ConfigField, ConfigGroup } from '@/lib/types';

export function UploadPanel() {
  const { config } = useConfig();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [resultPath, setResultPath] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  const storageBucket =
    config.baseConfig[ConfigGroup.googleCloud]?.[ConfigField.storageBucket] ?? '';
  const hasErrors = Object.keys(errors).length > 0;
  const canUpload = configs.length > 0 && !hasErrors && storageBucket;

  const upload = async () => {
    setStatus('uploading');
    setErrorMsg('');
    try {
      const uploadFn = httpsCallable<
        { config: unknown; storageBucket: string },
        { gcsPath: string }
      >(functions, 'uploadConfigToGcs');

      const result = await uploadFn({
        config: configs,
        storageBucket,
      });
      setResultPath(result.data.gcsPath);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
      setStatus('error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Bucket info */}
      <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
        <div className="text-sm">
          <span className="font-medium text-gray-700">Storage Bucket: </span>
          <span className="text-gray-600">
            {storageBucket || (
              <span className="italic text-red-500">
                Not set — configure in Base Config
              </span>
            )}
          </span>
        </div>
        <div className="mt-1 text-sm">
          <span className="font-medium text-gray-700">Configs ready: </span>
          <span className="text-gray-600">{configs.length}</span>
        </div>
      </div>

      {/* Validation errors */}
      {hasErrors && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Fix validation errors in JSON Preview before uploading.
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={upload}
        disabled={!canUpload || status === 'uploading'}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'uploading' ? 'Uploading...' : 'Upload to GCS'}
      </button>

      {/* Result */}
      {status === 'success' && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Uploaded to: <code className="font-mono text-xs">{resultPath}</code>
        </div>
      )}
      {status === 'error' && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
